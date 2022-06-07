import { Collection, GuildMember, TextChannel } from 'discord.js'
import schedule from 'node-schedule'
import loungeApi from '../api/loungeApi'
import client from '../bot'
import getUserFullDataUseCase from '../useCases/user/getUserFullDataUseCase'
import Canvas, { createDefaultBackground, createText } from '../domain/loungeCanvas'
import getGuildConfigUseCase from '../useCases/bot/getGuildConfigUseCase'
import botApi from '../api/bot/botApi'
import GuildConfig from '../models/bot/Guild'
import checkIfUserExistsUseCase from '../useCases/user/checkIfUserExistsUseCase'
import incrementUserStatUseCase from '../useCases/user/incrementUserStatUseCase'
import { StatType } from '../domain/loungeFunctions'
import setUserPropertyUseCase from '../useCases/user/setUserPropertyUseCase'
import addUserRecordUseCase from '../useCases/user/addUserRecordUseCase'
import { DateTime } from 'luxon'
import addServerRecordUseCase from '../useCases/user/addServerRecordUseCase'
import getCurrentBotPersonalityUseCase from '../useCases/bot/getCurrentBotPersonalityUseCase'
import getPersonalityFavorUseCase from '../useCases/bot/getPersonalityFavorUseCase'
import BotPersonality from '../models/bot/BotPersonality'
import getUserStatsUseCase from '../useCases/user/getUserStatsUseCase'
import resetGuildXpUseCase from '../useCases/bot/resetGuildXpUseCase'
import getHouseDetailsUseCase from '../useCases/house/getHouseDetails'
import House from '../models/house/House'

const DAILY_COIN_AWARD = 1000
const WEEKLY_COIN_AWARD = 10000
const MONTHLY_COIN_AWARD = 50000

class Result {
    userId: string
    name: string
    messagesSent: number
    voiceScore: number
    house: number

    constructor(
        userId: string,
        name: string,
        messagesSent: number,
        voiceScore: number,
        house: number
    ) {
        this.userId = userId
        this.name = name
        this.messagesSent = messagesSent
        this.voiceScore = voiceScore
        this.house = house
    }
}

class HouseResult {
    house: House
    messagesSentAvg: number
    voiceScoreAvg: number

    constructor(
        house: House,
        messagesSentAvg: number,
        voiceScoreAvg: number
    ) {
        this.house = house
        this.messagesSentAvg = messagesSentAvg
        this.voiceScoreAvg = voiceScoreAvg
    }
}

const USER_DATA_START = 150
const USER_DATA_HEIGHT = 50

async function resultCanvas(rankings: Result[], houseRankings: HouseResult[], title: string, maxValue: number, rankingType: string, maxReward: number, botConfig: BotPersonality, xpModifier: number) : Promise<Buffer> {
    const canvas = Canvas.createCanvas(1000, Math.max(75 + (USER_DATA_HEIGHT * (rankings.length + 1)), 350))
    const ctx = canvas.getContext('2d')

    createDefaultBackground(canvas, ctx)
    createText(ctx, '#ffffff', '48px Boldsand', title, 500, 75, 'center')
    if (xpModifier > 0) {
        createText(ctx, '#FFD700', '24px Boldsand', `${Math.round(xpModifier * 100)}% Bonus!`, 500, 100, 'center')
    }

    houseRankings.sort((a, b) => {
        if (rankingType == 'message') {
            return b.messagesSentAvg - a.messagesSentAvg
        } else {
            return b.voiceScoreAvg - a.voiceScoreAvg
        }
    }).forEach((data, index) => {
        if (rankingType == 'message') {
            createText(ctx, `#${data.house.primaryColor}`, '36px Boldsand', `${data.house.name} - ${Math.floor(data.messagesSentAvg).withCommas()}`, 600, 150 + (USER_DATA_HEIGHT * index), 'left')
        } else {
            createText(ctx, `#${data.house.primaryColor}`, '36px Boldsand', `${data.house.name} - ${Math.floor(data.voiceScoreAvg).withCommas()}`, 600, 150 + (USER_DATA_HEIGHT * index), 'left')
        }
    })

    for (var i = 0; i < rankings.length; i++) {
        var result = rankings[i]
        var index = i
        var userStats = await getUserFullDataUseCase(result.userId, loungeApi)
        var houseData : House | null = null
        if (userStats.attributes.house != null) {
            houseData = await getHouseDetailsUseCase(userStats.attributes.house, loungeApi)
        }

        var textColor = `#${houseData != null ? houseData.primaryColor : 'C0C0C0'}`
        var yValue = USER_DATA_START + (USER_DATA_HEIGHT * (index))
        createText(ctx, textColor, '36px Boldsand', `${result.name}`, 50, yValue, 'left', 300)
        if (rankingType == 'message') {
            createText(ctx, textColor, '36px Boldsand', `${result.messagesSent.withCommas()}`, 400, yValue)
        } else {
            createText(ctx, textColor, '36px Boldsand', `${result.voiceScore.withCommas()}`, 400, yValue)
        }
    }

    return canvas.toBuffer()
}

async function runDailies(guildId: string, intervalType: string) {
    var guildData = client.guilds.cache.get(guildId)
    if (guildData === undefined) return
    var guildConfig = await getGuildConfigUseCase(guildId, botApi)

    var botConfig = await getCurrentBotPersonalityUseCase(botApi)

    var memberList : Collection<string, GuildMember> = await guildData.members.fetch()
    var awards : Result[] = []
    for(var i = 0; i < memberList.size; i++) {
        var user = memberList.at(i)
        if(user == undefined) continue
        if(!(await checkIfUserExistsUseCase(user.id, loungeApi))) continue
        var userData = await getUserFullDataUseCase(user.id, loungeApi)
        if (intervalType == 'daily') {
            awards.push(new Result(user.id, user.nickname !== null ? user.nickname : user.displayName, userData.stats.dailyStats.messagesSent, userData.stats.dailyStats.secondsVoice, userData.attributes.house))
        } else if (intervalType == 'weekly') {
            awards.push(new Result(user.id, user.nickname !== null ? user.nickname : user.displayName, userData.stats.weeklyStats.messagesSent, userData.stats.weeklyStats.secondsVoice, userData.attributes.house))
        } else {
            awards.push(new Result(user.id, user.nickname !== null ? user.nickname : user.displayName, userData.stats.monthlyStats.messagesSent, userData.stats.monthlyStats.secondsVoice, userData.attributes.house))
        }
    }

    var messageMax = 0
    var voiceMax = 0
    awards.forEach((result: Result) => {
        messageMax = Math.max(messageMax, result.messagesSent)
        voiceMax = Math.max(voiceMax, result.voiceScore)
    })

    var houseAwards : HouseResult[] = []
    var houseDataList : House[] = [
        await getHouseDetailsUseCase(1, loungeApi),
        await getHouseDetailsUseCase(2, loungeApi),
        await getHouseDetailsUseCase(3, loungeApi),
        await getHouseDetailsUseCase(4, loungeApi)
    ]
    houseDataList.forEach((house: House) => {
        var totalMessages = 0
        var totalVoice = 0
        var totalMembers = 0
        awards.forEach((result: Result) => {
            if (result.house == house.id) {
                totalMembers += 1
                totalMessages += result.messagesSent
                totalVoice += result.voiceScore
            }
        })
        var avgMessages = totalMessages / totalMembers
        var avgVoice = totalVoice / totalMembers
        if (isNaN(avgMessages)) avgMessages = 0
        if (isNaN(avgVoice)) avgVoice = 0
        houseAwards.push(new HouseResult(house, avgMessages, avgVoice))
    })

    var messageTitle = ""
    var voiceTitle = ""

    if (intervalType == 'daily') {
        messageTitle = 'Daily Message Results'
        voiceTitle = 'Daily Voice Results'
    } else if (intervalType == 'weekly') {
        messageTitle = 'Weekly Message Results'
        voiceTitle = 'Weekly Voice Results'
    } else {
        messageTitle = 'Monthly Message Results'
        voiceTitle = 'Monthly Voice Results'
    }

    var maxReward = 0
    
    if (intervalType == 'daily') {
        maxReward = DAILY_COIN_AWARD
    } else if (intervalType == 'weekly') {
        maxReward = WEEKLY_COIN_AWARD
    } else {
        maxReward = MONTHLY_COIN_AWARD
    }

    var xpBonus = parseFloat(guildConfig.xpModifier)
    if (guildConfig.birthdayActive == 1) {
        xpBonus = xpBonus + 1
    }

    if (intervalType !== 'daily') {
        //Don't apply buffs to non dailies
        xpBonus = 0
    }

    maxReward = maxReward + (maxReward * parseFloat(guildConfig.xpModifier))

    var competitionChannel = await client.channels.fetch(guildConfig.competitionChannel) as TextChannel
    resultCanvas(
        awards
        .sort((a: Result, b: Result) => {
            return b.messagesSent - a.messagesSent
        }),
        houseAwards,
        messageTitle,
        messageMax,
        'message',
        maxReward,
        botConfig,
        xpBonus
        )
        .then((attachment: Buffer) => {
            competitionChannel.send({files: [{attachment: attachment}]})
        })

    resultCanvas(
        awards
        .sort((a: Result, b: Result) => {
            return b.voiceScore - a.voiceScore
        }),
        houseAwards,
        voiceTitle,
        voiceMax,
        'voice',
        maxReward,
        botConfig,
        xpBonus
        )
        .then((attachment: Buffer) => {
            competitionChannel.send({files: [{attachment: attachment}]})
        })

    var timestamp = DateTime.now().toSeconds()
    
    if (intervalType == 'daily') {
        var allServerMessages = 0
        var allServerVoice = 0
        awards.forEach(async (result: Result) => {
            allServerMessages = allServerMessages + result.messagesSent
            allServerVoice = allServerVoice + result.voiceScore
            addUserRecordUseCase(result.userId, timestamp, result.messagesSent, result.voiceScore, loungeApi)
            if (messageMax !== 0) {
                incrementUserStatUseCase(result.userId, StatType.Coins, Math.round(result.messagesSent / messageMax * maxReward), loungeApi)
            }
            if (voiceMax !== 0) {
                incrementUserStatUseCase(result.userId, StatType.Coins, Math.round(result.voiceScore / voiceMax * maxReward), loungeApi)
            }
            setUserPropertyUseCase(result.userId, StatType.DailyMessages, 0, loungeApi)
            setUserPropertyUseCase(result.userId, StatType.DailyVoice, 0, loungeApi)
        });
        await addServerRecordUseCase(timestamp, allServerMessages, allServerVoice, loungeApi)
    } else if (intervalType == 'weekly') {
        awards.forEach(async (result: Result) => {
            if (messageMax !== 0) {
                incrementUserStatUseCase(result.userId, StatType.Coins, Math.round(result.messagesSent / messageMax * maxReward) , loungeApi)
            }
            if (voiceMax !== 0) {
                incrementUserStatUseCase(result.userId, StatType.Coins, Math.round(result.voiceScore / voiceMax * maxReward), loungeApi)
            }
            setUserPropertyUseCase(result.userId, StatType.WeeklyMessages, 0, loungeApi)
            setUserPropertyUseCase(result.userId, StatType.WeeklyVoice, 0, loungeApi)
        });
    } else {
        awards.forEach(async (result: Result) => {
            if (messageMax !== 0) {
                incrementUserStatUseCase(result.userId, StatType.Coins, Math.round(result.messagesSent / messageMax * maxReward), loungeApi)
            }
            if (voiceMax !== 0) {
                incrementUserStatUseCase(result.userId, StatType.Coins, Math.round(result.voiceScore / voiceMax * maxReward), loungeApi)
            }
            setUserPropertyUseCase(result.userId, StatType.MonthlyMessages, 0, loungeApi)
            setUserPropertyUseCase(result.userId, StatType.MonthlyVoice, 0, loungeApi)
        });
    }

    resetGuildXpUseCase(guildId, botApi)
}

function checkTimedResults(guildId: string) {
    schedule.scheduleJob(`0 3 * * *`, async function() {
        runDailies(guildId, 'daily')
    })
    schedule.scheduleJob(`0 3 * * 0`, async function() {
        runDailies(guildId, 'weekly')
    })
    schedule.scheduleJob(`0 3 1 * *`, async function() {
        runDailies(guildId, 'monthly')
    })
}

export default function(guildId: string) {
    checkTimedResults(guildId)
}