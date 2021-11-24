import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import SlashCommand from "../../models/SlashCommand";
import quote from './quote'

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
        ),
    async (interaction: CommandInteraction) => {
        switch(interaction.options.getSubcommand(true)) {
            case 'quote': quote.method(interaction); break
        }
    }
)

export default command