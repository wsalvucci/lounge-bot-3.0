import { Channel, Guild, GuildMember, TextChannel } from 'discord.js'
import schedule from 'node-schedule'
import botApi from '../api/bot/botApi'
import { updateBotPersonality } from '../api/bot/botRequests'
import client from '../bot'
import getBotPersonalitiesUseCase from '../useCases/bot/getBotPersonalitiesUseCase'
import getBotPersonalityIntroLinesUseCase from '../useCases/bot/getBotPersonalityIntroLinesUseCase'
import getGuildConfigUseCase from '../useCases/bot/getGuildConfigUseCase'

function updatePersonality(guildId: string) {
    schedule.scheduleJob('1 3 * * *', async function() {
        var personalities = await getBotPersonalitiesUseCase(botApi)
        var newPersonality = personalities[Math.floor(Math.random() * personalities.length)]
        updateBotPersonality(newPersonality.id)
        var guilds = await client.guilds.fetch(guildId).then((guild: Guild) => {
            if (client.user !== null) {
                guild.members.fetch(client.user.id).then((member: GuildMember) => {
                    member.setNickname(newPersonality.name)
                })
            }
        })

        var introLines = await getBotPersonalityIntroLinesUseCase(newPersonality.id, botApi)
        var selectedLine = introLines[Math.floor(Math.random() * introLines.length)]

        var guildConfig = await getGuildConfigUseCase(guildId, botApi)

        var channel = await client.channels.fetch(guildConfig.announcementsChannel)

        if (channel == null) {
            console.log('Invalid announcement channel given for intro lines')
            return
        } else {
            if (channel instanceof TextChannel) {
                channel.send(selectedLine)
            } else {
                console.log('Invalid channel type given for announcements channel. Not a TextChannel')
            }
        }
        
        
        console.log(newPersonality)
    })
}

export default function(guildId: string) {
    updatePersonality(guildId)
}