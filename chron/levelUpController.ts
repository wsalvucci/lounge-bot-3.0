import { TextChannel } from 'discord.js'
import schedule from 'node-schedule'
import botApi from '../api/bot/botApi'
import loungeApi from '../api/loungeApi'
import client from '../bot'
import LoungeUser from '../models/LoungeUser'
import getGuildConfigUseCase from '../useCases/bot/getGuildConfigUseCase'
import getAllUsersUseCase from '../useCases/user/getAllUsersUseCase'
import incrementUserStatUseCase from '../useCases/user/incrementUserStatUseCase'
import setUserPropertyUseCase from '../useCases/user/setUserPropertyUseCase'

function levelUpUsers(guildId: string) {
    schedule.scheduleJob(`0 * * * * *`, async function() {
        var allUserData = await getAllUsersUseCase(loungeApi)

        allUserData.forEach(async (user: LoungeUser) => {
            var actualLevel = Math.floor(Math.pow(user.stats.xp / 0.6, 0.284))
            var currentLevel = user.stats.level.level

            if (actualLevel > currentLevel) {
                var guildConfig = await getGuildConfigUseCase(guildId, botApi)

                var channel = await client.channels.fetch(guildConfig.levelChannel) as TextChannel

                if (channel !== null) {
                    channel.send(`<@${user.attributes.discordId}> is now Level ${actualLevel}!!`)
                    setUserPropertyUseCase(user.attributes.discordId, 'currentLevel', actualLevel, loungeApi)
                    incrementUserStatUseCase(user.attributes.discordId, 'specPoints', 5, loungeApi)
                }
            }
        });
    })
}

export default function(guildId: string) {
    levelUpUsers(guildId)
}