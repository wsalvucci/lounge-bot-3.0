import { quote, SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import loungeApi from "../../api/loungeApi";
import stocksApi from "../../api/stocks/stocksApi";
import SlashCommand from "../../models/SlashCommand";
import Quote from "../../models/stocks/Quote";
import UserStock from "../../models/stocks/UserStock";
import getQuoteUseCase from "../../useCases/stocks/getQuoteUseCase";
import getStocksUseCase from "../../useCases/stocks/getStocksUseCase";
import checkIfUserExistsUseCase from "../../useCases/user/checkIfUserExistsUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('portfolio')
        .setDescription('Shows all of your owned stocks and their performance')
        .addBooleanOption(option =>
            option.setName('public')
                .setDescription('Do you want your portfolio to be sent privately or publicly?')
                .setRequired(true)
        ),
    async (interaction: CommandInteraction) => {
        var member = interaction.member as GuildMember
        var showOthers = interaction.options.getBoolean('public', true)

        var memberExists = await checkIfUserExistsUseCase(member.id, loungeApi)
        if (!memberExists) {
            interaction.reply({content: 'You need an account to check your portfolio', ephemeral: true})
            return
        }

        var userStocks = await getStocksUseCase(member.id, stocksApi)

        if (userStocks.length == 0) {
            interaction.reply({content: 'You do not have any stocks', ephemeral: true})
            return
        }

        var messageEmbed = new MessageEmbed()
            .setTitle(`${member.displayName}'s Portfolio`)

        var tickerList : string[] = []

        userStocks.forEach((stock: UserStock) => {
            tickerList.push(stock.stockSymbol)
        });

        var allStockData = await getQuoteUseCase(tickerList, stocksApi)

        userStocks.forEach((stock: UserStock) => {
            var relevantData = allStockData.find((quote: Quote) => {return quote.symbol.toLowerCase() == stock.stockSymbol.toLowerCase()})
            if (relevantData == undefined) return
            var percentReturn = ((relevantData.lastSalePrice / stock.costPerShare) - 1) * 100
            percentReturn = Math.round(percentReturn * 100) / 100
            messageEmbed.addField(`$${stock.stockSymbol.toUpperCase()} - ${stock.quantity} Shares`, `$${relevantData.lastSalePrice} per share : ${percentReturn}%`)
        })

        interaction.reply({embeds: [messageEmbed], ephemeral: !showOthers})
    }
)

export default command