import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { DateTime } from "luxon";
import botApi from "../../api/bot/botApi";
import gulagApi from "../../api/gulag/gulagApi";
import loungeApi from "../../api/loungeApi";
import { unGulagUser } from "../../domain/loungeFunctions";
import Gulag from "../../models/gulag/Gulag";
import SlashCommand from "../../models/SlashCommand";
import getGuildConfigUseCase from "../../useCases/bot/getGuildConfigUseCase";
import getActiveGulagsUseCase from "../../useCases/gulag/getActiveGulagsUseCase";
import mineGulagUseCase from "../../useCases/gulag/mineGulagUseCase";
import getUserStatsUseCase from "../../useCases/user/getUserStatsUseCase";

const ATK_MULTIPLIER = 0.01
const LUC_MULTIPLIER = 0.01

class Cooldown {
    userId: string
    timestamp: number

    constructor(
        userId: string,
        timestamp: number
    ) {
        this.userId = userId
        this.timestamp = timestamp
    }
}

const cooldownList : Cooldown[] = []

const MINE_COOLDOWN = 1800

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('mine')
        .setDescription('Toil away in the gulag and reduce your time by a set amount')
        .addStringOption(option =>
            option.setName('power')
                .setDescription('How risky of a swing to you want to make?')
                .setRequired(true)
                .addChoice('Normal (no risk)', 'normal')
                .addChoice('Aggressive (moderate risk)', 'aggressive')
                .addChoice('Radical (high risk)', 'radical')
        ),
    async (interaction: CommandInteraction) => {
        var member = interaction.member as GuildMember

        var activeGulags = await getActiveGulagsUseCase(gulagApi)
        var gulagStatus = activeGulags.find((gulag: Gulag) => {return gulag.victimId == member.id})

        if (gulagStatus == undefined) {
            interaction.reply({content: `You are not currently in the gulag!`, ephemeral: true})
            return
        }

        var cooldownStatus = cooldownList.find((cooldown: Cooldown) => {return cooldown.userId == member.id})
        var now = DateTime.now().toSeconds()
        if (cooldownStatus !== undefined) {
            if (now - cooldownStatus.timestamp < MINE_COOLDOWN) {
                interaction.reply({content: `You must wait another ${Math.round(MINE_COOLDOWN - (now - cooldownStatus.timestamp))}s before mining again`, ephemeral: true})
                return
            } else {
                cooldownStatus.timestamp = now
            }
        } else {
            cooldownList.push(new Cooldown(member.id, now))
        }

        var mineOption = interaction.options.getString('power', true)
        var mineResult = 0

        var userData = await getUserStatsUseCase(member.id, loungeApi)

        switch(mineOption) {
            case 'normal': mineResult = 5 + (userData.atk * ATK_MULTIPLIER); break
            case 'aggressive': mineResult = Math.max(Math.round(Math.random() * 20) - 10 + (userData.atk * ATK_MULTIPLIER * 2), 0); break
            case 'radical': mineResult = Math.max(Math.round(Math.random() * 40) - 25 + (userData.atk * ATK_MULTIPLIER * 4), 0); break
        }

        if (mineResult <= 0) {
            interaction.reply({content: `You failed to mine anything properly.`})
        } else {
            mineGulagUseCase(member.id, mineResult, gulagApi)
            if (gulagStatus.points - mineResult <= 0) {
                interaction.reply({content: `YOU HAVE FREED YOURSELF FROM THE GULAG!`})
                unGulagUser(await getGuildConfigUseCase(interaction.guildId, botApi), member, gulagApi)
            } else {
                interaction.reply({content: `Your hard work has reduced your sentence by ${mineResult} points. It is now ${gulagStatus.points - mineResult}.`})
            }
        }
    }
)

export default command