import { TextChannel } from "discord.js";
import { DateTime } from "luxon";
import schedule from "node-schedule";
import botApi from "../api/bot/botApi";
import loungeApi from "../api/loungeApi";
import client from "../bot";
import LoungeUser from "../models/LoungeUser";
import getGuildConfigUseCase from "../useCases/bot/getGuildConfigUseCase";
import setBirthdayActiveUseCase from "../useCases/bot/setBirthdayActiveUseCase";
import getAllUsersUseCase from "../useCases/user/getAllUsersUseCase";

function checkBirthday(guildId: string) {
    schedule.scheduleJob('0 14 * * *', async function() {
        var allUsers = await getAllUsersUseCase(loungeApi)
    
        allUsers.forEach(async (user: LoungeUser) => {
            if (user.attributes.birthday == -1) return
            var birthtime = DateTime.fromSeconds(user.attributes.birthday)
            var birthmonth = birthtime.month
            var birthday = birthtime.day

            var currentTime = DateTime.now()
            var currentMonth = currentTime.month
            var currentDay = currentTime.day

            var isBirthday = false

            if (birthmonth == currentMonth && birthday == currentDay) {
                isBirthday = true
                var guildConfig = await getGuildConfigUseCase(guildId, botApi)

                var announcementChannel = await client.channels.fetch(guildConfig.announcementsChannel)

                if (announcementChannel !== null) {
                    if (announcementChannel instanceof TextChannel) {
                        announcementChannel.send(`@everyone Happy Birthday <@${user.attributes.discordId}>!!`)
                    }
                }
            }

            if (isBirthday) {
                setBirthdayActiveUseCase(guildId, 1, botApi)
            } else {
                setBirthdayActiveUseCase(guildId, 0, botApi)
            }
        });
    })
}

export default function(guildId: string) {
    checkBirthday(guildId)
}