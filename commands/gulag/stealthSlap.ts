import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { DateTime } from "luxon";
import botApi from "../../api/bot/botApi";
import gulagApi from "../../api/gulag/gulagApi";
import loungeApi from "../../api/loungeApi";
import client from "../../bot";
import { gulagUser, SlapResponseType, StatType } from "../../domain/loungeFunctions";
import SlashCommand from "../../models/SlashCommand";
import adjustPersonalityFavorUseCase from "../../useCases/bot/adjustPersonalityFavorUseCase";
import getBotSlapResponseLinesUseCase from "../../useCases/bot/getBotSlapResponseLinesUseCase";
import getCurrentBotPersonalityUseCase from "../../useCases/bot/getCurrentBotPersonalityUseCase";
import getGuildConfigUseCase from "../../useCases/bot/getGuildConfigUseCase";
import checkIfUserExistsUseCase from "../../useCases/user/checkIfUserExistsUseCase";
import getUserStatsUseCase from "../../useCases/user/getUserStatsUseCase";
import incrementUserStatUseCase from "../../useCases/user/incrementUserStatUseCase";

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

const SLAP_COOLDOWN = 30

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('stealthslap')
        .setDescription('Slap without being seen. You have a chance of being discovered though!')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user you want to slap')
                .setRequired(true)
        ),
    async (interaction: CommandInteraction) => {
        var member = interaction.member as GuildMember
        var victim = interaction.options.getUser('target', true)

        var memberExists = await checkIfUserExistsUseCase(member.id, loungeApi)
        if (!memberExists) {
            interaction.reply({content: 'You need an account to slap someone', ephemeral: true})
            return
        }
        var victimExists = await checkIfUserExistsUseCase(victim.id, loungeApi)
        if (!victimExists) {
            interaction.reply({content: 'You can\'t slap someone that doesn\'t have an account', ephemeral: true})
            return
        }

        var cooldownStatus = cooldownList.find((cooldown: Cooldown) => {return cooldown.userId == member.id})
        var now = DateTime.now().toSeconds()
        if (cooldownStatus !== undefined) {
            if (now - cooldownStatus.timestamp < SLAP_COOLDOWN) {
                interaction.reply({content: `You must wait another ${Math.round(SLAP_COOLDOWN - (now - cooldownStatus.timestamp))}s before stealth slapping again`, ephemeral: true})
                return
            } else {
                cooldownStatus.timestamp = now
            }
        } else {
            cooldownList.push(new Cooldown(member.id, now))
        }

        var attackerStats = await getUserStatsUseCase(member.id, loungeApi)
        var victimStats = await getUserStatsUseCase(victim.id, loungeApi)

        var agiProp : number = attackerStats.agi/victimStats.agi

        var roll = Math.random()
        var responseType = 14

        if (roll < 0.01/agiProp) responseType = 11 // Discovered + Counter Gulaged
        else if (roll < 0.05/agiProp) responseType = 12 // Discovered
        else if (roll < 0.25/agiProp) responseType = 13 // Noticed
        else if (roll < 0.99/agiProp) responseType = 14 // Got Away
        else responseType = 15 // Got away + Gulaged

        var botConfig = await getCurrentBotPersonalityUseCase(botApi)
        var responseLines = await getBotSlapResponseLinesUseCase(botConfig.id, responseType, botApi)

        var memberData = await getUserStatsUseCase(member.id, loungeApi)
        var victimData = await getUserStatsUseCase(victim.id, loungeApi)

        var response = responseLines[Math.floor(Math.random() * responseLines.length)].responseText
            .replace("[a]", memberData.nickname !== null ? memberData.nickname : memberData.username)
            .replace("[au]", memberData.nickname !== null ? memberData.nickname.toUpperCase() : memberData.username.toUpperCase())
            .replace("[v]", victimData.nickname !== null ? victimData.nickname : victimData.username)
            .replace("[vu]", victimData.nickname !== null ? victimData.nickname.toUpperCase() : victimData.username.toUpperCase())

        switch (responseType) {
            case 11: {
                interaction.reply({content: `You rolled a ${Math.round(roll * 10000) / 100}%`, ephemeral: true})
                interaction.channel?.send(response)
            } break;
            case 12: {
                interaction.reply({content: `You rolled a ${Math.round(roll * 10000) / 100}%`, ephemeral: true})
                interaction.channel?.send(response)
            } break;
            case 13 : {
                interaction.reply({content: `You rolled a ${Math.round(roll * 10000) / 100}%`, ephemeral: true})
                interaction.channel?.send(response)
            } break;
            case 14 : {
                interaction.reply({content: `You rolled a ${Math.round(roll * 10000) / 100}%\n${response}`, ephemeral: true})
            } break;
            case 15 : {
                interaction.reply({content: `You rolled a ${Math.round(roll * 10000) / 100}%`, ephemeral: true})
                interaction.channel?.send(response)
            } break;
        }

        adjustPersonalityFavorUseCase(botConfig.id, member.id, botConfig.slapFavor * 0.1, botApi)

        incrementUserStatUseCase(member.id, 'xp', 20, loungeApi)
        incrementUserStatUseCase(victim.id, 'xp', 20, loungeApi)

        if (interaction.guildId == null) {
            console.error('Slap from the nether????')
            return
        }
        var guildConfig = await getGuildConfigUseCase(interaction.guildId, botApi)
        var victimUser = client.guilds.cache.get((guildConfig).id)?.members.cache.get(victim.id)
        if (victimUser == undefined) {
            console.error("Somehow got a non existent victim as a slap target")
            return
        }
        if (responseType > 11) {
            incrementUserStatUseCase(member.id, StatType.UsersSlapped, 1, loungeApi)
            incrementUserStatUseCase(victim.id, StatType.BeenSlapped, 1, loungeApi)
        } else {
            incrementUserStatUseCase(victim.id, StatType.UsersSlapped, 1, loungeApi)
            incrementUserStatUseCase(member.id, StatType.BeenSlapped, 1, loungeApi)
        }
        if (responseType == 11) {
            incrementUserStatUseCase(member.id, StatType.TimesGulaged, 1, loungeApi)
            incrementUserStatUseCase(victim.id, StatType.UsersGulaged, 1, loungeApi)
            adjustPersonalityFavorUseCase(botConfig.id, victim.id, botConfig.gulagFavor, botApi)
            adjustPersonalityFavorUseCase(botConfig.id, member.id, -botConfig.gulagFavor, botApi)
            gulagUser(guildConfig, member, victimUser, DateTime.now().toSeconds(), 50, gulagApi)
        } else if (responseType == 15) {
            incrementUserStatUseCase(victim.id, StatType.TimesGulaged, 1, loungeApi)
            incrementUserStatUseCase(member.id, StatType.UsersGulaged, 1, loungeApi)
            adjustPersonalityFavorUseCase(botConfig.id, member.id, botConfig.gulagFavor, botApi)
            adjustPersonalityFavorUseCase(botConfig.id, victim.id, -botConfig.gulagFavor, botApi)
            gulagUser(guildConfig, victimUser, member, DateTime.now().toSeconds(), 50, gulagApi)
        }
    }
)

export default command