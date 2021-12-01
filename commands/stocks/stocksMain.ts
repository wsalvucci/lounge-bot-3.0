import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import SlashCommand from "../../models/SlashCommand";
import quote from './quote'
import buy from './buy'
import portfolio from './portfolio'
import sell from './sell'

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('stocks')
        .setDescription('Contains commands related to stocks')
        .addSubcommand(subcommand =>
            subcommand.setName('quote')
            .setDescription('Gets the quote of a given ticker (ex. TSLA). Do not use the $ prefix')
            .addStringOption(option =>
                option.setName('ticker')
                    .setDescription('The ticker of the stock you want to get a quote of')
                    .setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('buy')
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
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('portfolio')
                .setDescription('Shows all of your owned stocks and their performance')
                .addBooleanOption(option =>
                    option.setName('public')
                        .setDescription('Do you want your portfolio to be sent privately or publicly?')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('sell')
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
                )
        ),
    async (interaction: CommandInteraction) => {
        switch(interaction.options.getSubcommand(true)) {
            case 'quote': quote.method(interaction); break
            case 'buy': buy.method(interaction); break
            case 'portfolio': portfolio.method(interaction); break
            case 'sell': sell.method(interaction); break
        }
    }
)

export default command