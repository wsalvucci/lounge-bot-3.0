import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { DateTime } from "luxon";
import loungeApi from "../../api/loungeApi";
import stocksApi from "../../api/stocks/stocksApi";
import SlashCommand from "../../models/SlashCommand";
import buyStockUseCase from "../../useCases/stocks/buyStockUseCase";
import getQuoteUseCase from "../../useCases/stocks/getQuoteUseCase";
import checkIfUserExistsUseCase from "../../useCases/user/checkIfUserExistsUseCase";
import getUserStatsUseCase from "../../useCases/user/getUserStatsUseCase";
import incrementUserStatUseCase from "../../useCases/user/incrementUserStatUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Buys the given quantity of stocks at the last market price')
        .addStringOption(option =>
            option.setName('symbol')
                .setDescription('The symbol of the stock you want to buy (TSLA, AAPL, etc)')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('quantity')
                .setDescription('The number of stocks you want to buy')
                .setRequired(true)
        ),
    async (interaction: CommandInteraction) => {
        var member = interaction.member as GuildMember
        var symbol = interaction.options.getString('symbol', true)
        var quantity = interaction.options.getInteger('quantity', true)

        var memberExists = await checkIfUserExistsUseCase(member.id, loungeApi)
        if (!memberExists) {
            interaction.reply({content: 'You need an account to buy stocks', ephemeral: true})
            return
        }
        
        if (quantity < 1) {
            interaction.reply({content: 'You need to provide a quantity greater than 0', ephemeral: true})
            return
        }

        var quoteData = await getQuoteUseCase([symbol.toLowerCase()], stocksApi)
        if (quoteData[0] == undefined) {
            interaction.reply({content: 'Data not found for the given symbol', ephemeral: true})
            return
        }

        var userData = await getUserStatsUseCase(member.id, loungeApi)
        var totalPrice = quoteData[0].lastSalePrice * quantity
        if (totalPrice > userData.coins) {
            interaction.reply({content: `Your order of ${quantity} shares of ${symbol} costs ${totalPrice.withCommas()}, but you only have ${userData.coins.withCommas()}`, ephemeral: true})
            return
        }

        await buyStockUseCase(member.id, symbol.toLowerCase(), quantity, quoteData[0].lastSalePrice, DateTime.now().toSeconds(), stocksApi)
        await incrementUserStatUseCase(member.id, 'coins', -totalPrice, loungeApi)

        interaction.reply({content: `Your order of ${quantity} shares of $${symbol.toUpperCase()} for ${totalPrice.withCommas()} has been completed`, ephemeral: true})
    }
)

export default command