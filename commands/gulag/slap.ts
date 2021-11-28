import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { DateTime } from "luxon";
import botApi from "../../api/bot/botApi";
import gulagApi from "../../api/gulag/gulagApi";
import loungeApi from "../../api/loungeApi";
import client from "../../bot";
import { gulagUser, SlapResponseType, StatType } from "../../domain/loungeFunctions";
import SlashCommand from "../../models/SlashCommand";
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
        .setName('slap')
        .setDescription('The infamous slap command. Hit a user for a 1% chance of gulaging them.')
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
                interaction.reply({content: `You must wait another ${Math.round(SLAP_COOLDOWN - (now - cooldownStatus.timestamp))}s before slapping again`, ephemeral: true})
                return
            } else {
                cooldownStatus.timestamp = now
            }
        } else {
            cooldownList.push(new Cooldown(member.id, now))
        }

        var roll = Math.random()
        var responseType = 5

        if (roll < 0.01) responseType = 1
        else if (roll < 0.05) responseType = 2
        else if (roll < 0.15) responseType = 3
        else if (roll < 0.25) responseType = 4
        else if (roll < 0.75) responseType = 5
        else if (roll < 0.85) responseType = 6
        else if (roll < 0.95) responseType = 7
        else if (roll < 0.99) responseType = 8
        else responseType = 9

        var botConfig = await getCurrentBotPersonalityUseCase(botApi)
        var responseLines = await getBotSlapResponseLinesUseCase(botConfig.id, responseType, botApi)

        var memberData = await getUserStatsUseCase(member.id, loungeApi)
        var victimData = await getUserStatsUseCase(victim.id, loungeApi)

        interaction.reply({content: `You rolled a ${Math.round(roll * 10000) / 100}%`, ephemeral: true})
        var response = responseLines[Math.floor(Math.random() * responseLines.length)].responseText
            .replace("[a]", memberData.nickname !== null ? memberData.nickname : memberData.username)
            .replace("[au]", memberData.nickname !== null ? memberData.nickname.toUpperCase() : memberData.username.toUpperCase())
            .replace("[v]", victimData.nickname !== null ? victimData.nickname : victimData.username)
            .replace("[vu]", victimData.nickname !== null ? victimData.nickname.toUpperCase() : victimData.username.toUpperCase())

        interaction.channel?.send(response)

        incrementUserStatUseCase(member.id, 'xp', 20, loungeApi)
        incrementUserStatUseCase(victim.id, 'xp', 20, loungeApi)

        var guildConfig = await getGuildConfigUseCase(interaction.guildId, botApi)
        var victimUser = client.guilds.cache.get((guildConfig).id)?.members.cache.get(victim.id)
        if (victimUser == undefined) {
            console.error("Somehow got a non existent victim as a slap target")
            return
        }
        if (responseType > 4) {
            incrementUserStatUseCase(member.id, StatType.UsersSlapped, 1, loungeApi)
            incrementUserStatUseCase(victim.id, StatType.BeenSlapped, 1, loungeApi)
        } else {
            incrementUserStatUseCase(victim.id, StatType.UsersSlapped, 1, loungeApi)
            incrementUserStatUseCase(member.id, StatType.BeenSlapped, 1, loungeApi)
        }
        if (responseType == 1) {
            incrementUserStatUseCase(member.id, StatType.TimesGulaged, 1, loungeApi)
            incrementUserStatUseCase(victim.id, StatType.UsersGulaged, 1, loungeApi)
            gulagUser(guildConfig, member, victimUser, DateTime.now().toSeconds(), 50, gulagApi)
        } else if (responseType == 9) {
            incrementUserStatUseCase(victim.id, StatType.TimesGulaged, 1, loungeApi)
            incrementUserStatUseCase(member.id, StatType.UsersGulaged, 1, loungeApi)
            gulagUser(guildConfig, victimUser, member, DateTime.now().toSeconds(), 50, gulagApi)
        }
    }
)

export default command