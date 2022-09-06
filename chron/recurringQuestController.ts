import botApi from 'api/bot/botApi'
import loungeApi from 'api/loungeApi'
import { DateTime } from 'luxon'
import BotConfig from 'models/bot/BotConfig'
import LoungeUser from 'models/LoungeUser'
import schedule, { scheduleJob } from 'node-schedule'
import getBotConfigUseCase from 'useCases/bot/getBotConfigUseCase'
import addHousePointEventUseCase from 'useCases/house/addHousePointEventUseCase'
import getHouseDetailsUseCase from 'useCases/house/getHouseDetails'
import getAllUsersUseCase from 'useCases/user/getAllUsersUseCase'
import setUserPropertyUseCase from 'useCases/user/setUserPropertyUseCase'

enum RecurringQuestType {
    DailyMessage = 'dailyMessageAchieved',
    WeeklyMessage = 'weeklyMessageAchieved',
    DailyVoice = 'dailyVoiceAchieved',
    WeeklyVoice = 'weeklyVoiceAchieved',
    DailySlap = 'dailySlapAchieved',
    WeeklySlap = 'weeklySlapAchieved',
    DailyKudo = 'dailyKudoAchieved',
    WeeklyKudo = 'weeklyKudoAchieved'
}

function getRecurringReward(quest: RecurringQuestType) : number {
    switch(quest) {
        case RecurringQuestType.DailyMessage: return 5
        case RecurringQuestType.DailyVoice: return 5
        case RecurringQuestType.DailySlap: return 5
        case RecurringQuestType.DailyKudo: return 10
        case RecurringQuestType.WeeklyMessage: return 25
        case RecurringQuestType.WeeklyVoice: return 25
        case RecurringQuestType.WeeklySlap: return 25
        case RecurringQuestType.WeeklyKudo: return 50
        default: return 0
    }
}

async function completeRecurringQuest(discordId: string, houseId: number, quest: RecurringQuestType) {
    setUserPropertyUseCase(discordId, quest, 1, loungeApi)
    var userHouseDetails = await getHouseDetailsUseCase(houseId, loungeApi)
    addHousePointEventUseCase(discordId, "null", getRecurringReward(quest), `Recurring Quest: ${quest}`, houseId, DateTime.now().toSeconds(), loungeApi)
}

function checkRecurringQuests() {
    schedule.scheduleJob(`0 * * * * *`, async function() {
        var botConfig : BotConfig = await getBotConfigUseCase(botApi)
        var allUserData : LoungeUser[] = await getAllUsersUseCase(loungeApi)

        allUserData.forEach((user: LoungeUser) => {
            var discordId = user.attributes.discordId
            var houseId = user.attributes.house
            if (houseId == null) return
            if (user.recurringQuests.dailyMessage == 0 && user.stats.dailyStats.messagesSent > botConfig.dailyMessageReq) {
                console.log(`${user.attributes.name} has completed their daily message goal.`)
                completeRecurringQuest(discordId, houseId, RecurringQuestType.DailyMessage)
            }
            if (user.recurringQuests.dailyVoice == 0 && user.stats.dailyStats.secondsVoice > botConfig.dailyVoiceReq) {
                console.log(`${user.attributes.name} has completed their daily voice goal.`)
                completeRecurringQuest(discordId, houseId, RecurringQuestType.DailyVoice)
            }
            if (user.recurringQuests.weeklyMessage == 0 && user.stats.weeklyStats.messagesSent > botConfig.weeklyMessageReq) {
                console.log(`${user.attributes.name} has completed their weekly message goal.`)
                completeRecurringQuest(discordId, houseId, RecurringQuestType.WeeklyMessage)
            }
            if (user.recurringQuests.weeklyVoice == 0 && user.stats.weeklyStats.secondsVoice > botConfig.weeklyVoiceReq) {
                console.log(`${user.attributes.name} has completed their weekly voice goal.`)
                completeRecurringQuest(discordId, houseId, RecurringQuestType.WeeklyVoice)
            }
        })
    })
}

export default function(guildId: string) {
    checkRecurringQuests()
}