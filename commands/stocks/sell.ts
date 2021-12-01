import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import loungeApi from "../../api/loungeApi";
import stocksApi from "../../api/stocks/stocksApi";
import SlashCommand from "../../models/SlashCommand";
import UserStock from "../../models/stocks/UserStock";
import getQuoteUseCase from "../../useCases/stocks/getQuoteUseCase";
import getStocksUseCase from "../../useCases/stocks/getStocksUseCase";
import sellStockUseCase from "../../useCases/stocks/sellStockUseCase";
import checkIfUserExistsUseCase from "../../useCases/user/checkIfUserExistsUseCase";
import incrementUserStatUseCase from "../../useCases/user/incrementUserStatUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('sell')
        .setDescription('Sells the given quantity of stocks at the last market price')
        .addStringOption(option =>
            option.setName('symbol')
                .setDescription('The symbol of the stock you want to sell (TSLA, AAPL, etc)')
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
            interaction.reply({content: 'You need an account to sell stocks', ephemeral: true})
            return
        }
        
        if (quantity < 1) {
            interaction.reply({content: 'You need to provide a quantity greater than 0', ephemeral: true})
            return
        }

        var userStocks = await getStocksUseCase(member.id, stocksApi)

        var targetedStock = userStocks.find((stock: UserStock) => {return stock.stockSymbol.toUpperCase() == symbol.toUpperCase()})

        if (targetedStock == undefined) {
            interaction.reply({content: 'You do not own that stock', ephemeral: true})
            return
        }

        if (targetedStock.quantity < quantity) {
            interaction.reply({content: 'You do not own that many shares of that stock', ephemeral: true})
            return
        }

        var stockData = await getQuoteUseCase([symbol.toLowerCase()], stocksApi)

        await sellStockUseCase(member.id, symbol.toLowerCase(), quantity, stocksApi)
        await incrementUserStatUseCase(member.id, 'coins', stockData[0].lastSalePrice * quantity, loungeApi)

        interaction.reply({content: `You have sold ${quantity} shares of $${symbol.toUpperCase()} at $${stockData[0].lastSalePrice} each for a total of $${stockData[0].lastSalePrice * quantity}`})

    }
)

export default command