import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import SlashCommand from "../../models/SlashCommand";
import checkIfUserExistsUseCase from "../../useCases/user/checkIfUserExistsUseCase";
import Repository from "../../api/loungeApi"
import getUserStatsUseCase from "../../useCases/user/getUserStatsUseCase";
import incrementUserStatUseCase from "../../useCases/user/incrementUserStatUseCase";
import SqlResponse from "../../responseModels/SqlResponse";

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('spec')
        .setDescription('Adds your spec points to the provided stat')
        .addStringOption(option =>
            option.setName('stat')
                .setDescription('The stat you want to add your spec points to')
                .setRequired(true)
                .addChoices([
                    ['Attack', 'atk'],
                    ['Defense', 'def'],
                    ['Magic Attack', 'matk'],
                    ['Magic Defense', 'mdef'],
                    ['Agility', 'agi'],
                    ['Health', 'hp'],
                    ['Charisma', 'char']
                ])
        )
        .addIntegerOption(option =>
            option.setName('points')
                .setDescription('The amount of spec points you want to invest into the stat')
                .setRequired(true)
        ),
        async (interaction: CommandInteraction) => {
            var member = interaction.member
            if (member == null) return

            var memberExists = await checkIfUserExistsUseCase(member.user.id, Repository)
            if (!memberExists) {
                interaction.reply({content: 'You need an account to adjust your stats', ephemeral: true})
                return
            }

            var stat = interaction.options.getString('stat')
            var points = interaction.options.getInteger('points')
            if (points == null || stat == null) return
            var userStats = await getUserStatsUseCase(member.user.id, Repository)

            if (userStats.specPoints < points) {
                interaction.reply({content: `You don't have that many spec points available. You wanted to spend ${points} but only have ${userStats.specPoints}.`, ephemeral: true})
                return
            }

            incrementUserStatUseCase(member.user.id, stat, points, Repository).then((response: SqlResponse) => {
                interaction.reply({content: `Your spec points have been assigned.`, ephemeral: true})
            }).catch((error: any) => {
                interaction.reply({content: `There was an error. It has been logged.`, ephemeral: true})
            })
            incrementUserStatUseCase(member.user.id, 'specPoints', -points, Repository)

        }
)

export default command