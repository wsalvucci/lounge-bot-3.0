import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import gulagApi from "../../api/gulag/gulagApi";
import loungeApi from "../../api/loungeApi";
import Gulag from "../../models/gulag/Gulag";
import SlashCommand from "../../models/SlashCommand";
import UserStats from "../../models/UserStats";
import getActiveGulagsUseCase from "../../useCases/gulag/getActiveGulagsUseCase";
import getUserStatsUseCase from "../../useCases/user/getUserStatsUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('checkgulag')
        .setDescription('Displays a list of active gulag members')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Get the status of a paticular user only')
        ),
    async (interaction: CommandInteraction) => {
        var activeGulags = await getActiveGulagsUseCase(gulagApi)
        var userFilter = interaction.options.get('user')

        if (userFilter !== null) {
            activeGulags = activeGulags.filter((gulag: Gulag) => {return gulag.victimId == userFilter?.user?.id})
        }

        const gulagEmbed = new MessageEmbed()
            .setTitle(`The gulag of ${interaction.guild?.name}`)

        for (var i =0; i < activeGulags.length; i++) {
            var gulag = activeGulags[i]
            var gulagUser = await getUserStatsUseCase(gulag.victimId, loungeApi)
            var gulagAttacker = await getUserStatsUseCase(gulag.attackerId, loungeApi)
            gulagEmbed.addField(
                gulagUser.nickname !== null ? gulagUser.nickname : gulagUser.username,
                `Gulaged by: ${gulagAttacker.nickname !== null ? gulagAttacker.nickname : gulagAttacker.username}`,
                true
            )
            gulagEmbed.addField(
                `Gulaged since: <t:${gulag.timestamp}>`,
                `Remaining points: ${gulag.points}`,
                true
            )
        }

        interaction.reply({embeds: [gulagEmbed]})
    }
)

export default command