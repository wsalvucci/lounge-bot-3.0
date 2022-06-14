import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import SlashCommand from "../../models/SlashCommand";
import addPointEvent from './addPointEvent'
import myPoints from './myPoints'
import housePoints from './housePoints'

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('house')
        .setDescription('Contains commands related to house features')
        .addSubcommand(subcommand => 
            subcommand.setName('addpoints')
                .setDescription('Housemaster Only: Add or subtract points from a member (must provide a reason)')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to add/subtract points from')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('points')
                        .setDescription('How many points to add (negative number to subtract)')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('The reason for adding/subtracting points')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('housepoints')
                .setDescription('See the status of the house\'s points')),
    async (interaction: CommandInteraction) => {
        switch(interaction.options.getSubcommand(true)) {
            case 'addpoints': addPointEvent.method(interaction); break
            case 'housepoints': housePoints.method(interaction); break
        }
    }
)

export default command