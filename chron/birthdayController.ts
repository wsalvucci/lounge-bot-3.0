import { TextChannel } from 'discord.js'
import { DateTime } from 'luxon'
import ordinal from 'ordinal'
import schedule from 'node-schedule'
import botApi from '../api/bot/botApi'
import loungeApi from '../api/loungeApi'
import client from '../bot'
import LoungeUser from '../models/LoungeUser'
import getGuildConfigUseCase from '../useCases/bot/getGuildConfigUseCase'
import getAllUsersUseCase from '../useCases/user/getAllUsersUseCase'
import setBirthdayActiveUseCase from '../useCases/bot/setBirthdayActiveUseCase'

function checkBirthday(guildId: string) {
    schedule.scheduleJob(`0 12 * * *`, async function() {    
        var allUsers = await getAllUsersUseCase(loungeApi)
        allUsers.forEach(async (user: LoungeUser) => {
            if (user.attributes.birthday == -1) return
            var birthdayObject = DateTime.fromSeconds(user.attributes.birthday)
            var nowObject = DateTime.now()
            if (birthdayObject.day == nowObject.day && birthdayObject.month == nowObject.month) {
                var age = nowObject.year - birthdayObject.year
                var guildConfig = await getGuildConfigUseCase(guildId, botApi)
                if (guildConfig.announcementsChannel != null) {
                    var channel = await client.channels.fetch(guildConfig.announcementsChannel) as TextChannel
                    channel.send(`@everyone **Happy ${ordinal(age)} Birthday <@${user.attributes.discordId}>!!** House points are doubled for the day!`)
                }
                setBirthdayActiveUseCase(guildId, 1, botApi)
            }
        })
    })
}

export default function(guildId: string) {
    checkBirthday(guildId)
}