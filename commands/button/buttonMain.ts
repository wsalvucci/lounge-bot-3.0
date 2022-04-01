import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import SlashCommand from "../../models/SlashCommand";
import pushButton from './pushButton'
import breakButton from './breakButton'
import repairButton from './repairButton'
import leaderboard from './leaderboard'

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('button')
        .setDescription('The Button Game')
        .addSubcommand(subcommand =>
            subcommand.setName('pushbutton')
            .setDescription('Pushes someone\'s button')
            .addUserOption(option =>
                option.setName('target')
                    .setDescription('The button you want to push')
                    .setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('breakbutton')
            .setDescription('Breaks someone\'s button')
            .addUserOption(option =>
                option.setName('target')
                    .setDescription('The button you want to push')
                    .setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('repairbutton')
            .setDescription('Repairs someone\'s button')
            .addUserOption(option =>
                option.setName('target')
                    .setDescription('The button you want to repair')
                    .setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('leaderboard')
            .setDescription('Checks the leaderboard')
        ),
    async (interaction: CommandInteraction) => {
        switch(interaction.options.getSubcommand(true)) {
            case 'pushbutton': pushButton.method(interaction); break
            case 'breakbutton': breakButton.method(interaction); break
            case 'repairbutton': repairButton.method(interaction); break
            case 'leaderboard': leaderboard.method(interaction); break
        }
    }
)

export default command