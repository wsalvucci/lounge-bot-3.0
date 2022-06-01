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

const DAILY_COIN_AWARD = 1000
const WEEKLY_COIN_AWARD = 10000
const MONTHLY_COIN_AWARD = 50000

class Result {
    userId: string
    name: string
    messagesSent: number
    voiceScore: number

    constructor(
        userId: string,
        name: string,
        messagesSent: number,
        voiceScore: number
    ) {
        this.userId = userId
        this.name = name
        this.messagesSent = messagesSent
        this.voiceScore = voiceScore
    }
}

const USER_DATA_HEIGHT = 75

async function resultCanvas(rankings: Result[], title: string, maxValue: number, rankingType: string, maxReward: number, botConfig: BotPersonality, xpModifier: number) : Promise<Buffer> {
    const canvas = Canvas.createCanvas(1000, 75 + (USER_DATA_HEIGHT * (rankings.length + 1)))
    const ctx = canvas.getContext('2d')

    createDefaultBackground(canvas, ctx)
    createText(ctx, '#ffffff', '48px Boldsand', title, 500, 75, 'center')
    if (xpModifier > 0) {
        createText(ctx, '#FFD700', '24px Boldsand', `${Math.round(xpModifier * 100)}% Bonus!`, 500, 100, 'center')
    }

    for (var i = 0; i < rankings.length; i++) {
        var result = rankings[i]
        var index = i

        var textColor = '#ffffff'
        if (index == 0) {textColor = '#FFA700'}
        if (index == 1) {textColor = '#D0D0D0'}
        if (index == 2) {textColor = '#DA771A'}

        var botFavor = await getPersonalityFavorUseCase(botConfig.id, result.userId, botApi)
        var userStats = await getUserStatsUseCase(result.userId, loungeApi)
        var bonusPercentage = (botFavor.favor / 100) + (userStats.cha * 0.0025) + +xpModifier
        bonusPercentage = Math.round(bonusPercentage * 10000) / 10000
        var bonusPercentageString = ""
        if (bonusPercentage !== 0) {
            bonusPercentageString = "(" + (bonusPercentage <= 0 ? "" : "+") + (Math.round(bonusPercentage * 10000) / 100) + "%)"
        }
        createText(ctx, textColor, '36px Boldsand', `${result.name}`, 50, USER_DATA_HEIGHT * (index + 2), 'left', 300)
        if (rankingType == 'message') {
            var reward = Math.round(result.messagesSent / maxValue * maxReward)
            createText(ctx, textColor, '36px Boldsand', `${Math.round(reward + (reward * bonusPercentage)).withCommas()} ${bonusPercentageString}`, 600, USER_DATA_HEIGHT * (index + 2))
            createText(ctx, textColor, '36px Boldsand', `${result.messagesSent.withCommas()}`, 400, USER_DATA_HEIGHT * (index + 2))
        } else {
            var reward = Math.round(result.voiceScore / maxValue * maxReward)
            createText(ctx, textColor, '36px Boldsand', `${Math.round(reward + (reward * bonusPercentage)).withCommas()} ${bonusPercentageString}`, 600, USER_DATA_HEIGHT * (index + 2))
            createText(ctx, textColor, '36px Boldsand', `${result.voiceScore.withCommas()}`, 400, USER_DATA_HEIGHT * (index + 2))
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
            awards.push(new Result(user.id, user.nickname !== null ? user.nickname : user.displayName, userData.stats.dailyStats.messagesSent, userData.stats.dailyStats.secondsVoice))
        } else if (intervalType == 'weekly') {
            awards.push(new Result(user.id, user.nickname !== null ? user.nickname : user.displayName, userData.stats.weeklyStats.messagesSent, userData.stats.weeklyStats.secondsVoice))
        } else {
            awards.push(new Result(user.id, user.nickname !== null ? user.nickname : user.displayName, userData.stats.monthlyStats.messagesSent, userData.stats.monthlyStats.secondsVoice))
        }
    }

    var messageMax = 0
    var voiceMax = 0
    awards.forEach((result: Result) => {
        messageMax = Math.max(messageMax, result.messagesSent)
        voiceMax = Math.max(voiceMax, result.voiceScore)
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

    var xpBonus = guildConfig.xpModifier

    if (guildConfig.birthdayActive == 1) {
        xpBonus = xpBonus + 1
    }

    if (intervalType !== 'daily') {
        //Don't apply buffs to non dailies
        xpBonus = 0
    }

    maxReward = maxReward + (maxReward * guildConfig.xpModifier)

    var competitionChannel = await client.channels.fetch(guildConfig.competitionChannel) as TextChannel

    resultCanvas(
        awards
        .filter((result: Result) => {
            return result.messagesSent !== 0
        })
        .sort((a: Result, b: Result) => {
            return b.messagesSent - a.messagesSent
        }),
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
        .filter((result: Result) => {
            return result.voiceScore !== 0
        })
        .sort((a: Result, b: Result) => {
            return b.voiceScore - a.voiceScore
        }),
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
            var botFavor = await getPersonalityFavorUseCase(botConfig.id, result.userId, botApi)
            var userStats = await getUserStatsUseCase(result.userId, loungeApi)
            var favorMultiplier = +(botFavor.favor / 100) + +1 + +(userStats.cha * 0.0025) + +xpBonus
            allServerMessages = allServerMessages + result.messagesSent
            allServerVoice = allServerVoice + result.voiceScore
            addUserRecordUseCase(result.userId, timestamp, result.messagesSent, result.voiceScore, loungeApi)
            if (messageMax !== 0) {
                incrementUserStatUseCase(result.userId, StatType.Coins, Math.round(result.messagesSent / messageMax * maxReward) * favorMultiplier, loungeApi)
            }
            if (voiceMax !== 0) {
                incrementUserStatUseCase(result.userId, StatType.Coins, Math.round(result.voiceScore / voiceMax * maxReward) * favorMultiplier, loungeApi)
            }
            setUserPropertyUseCase(result.userId, StatType.DailyMessages, 0, loungeApi)
            setUserPropertyUseCase(result.userId, StatType.DailyVoice, 0, loungeApi)
        });
        await addServerRecordUseCase(timestamp, allServerMessages, allServerVoice, loungeApi)
    } else if (intervalType == 'weekly') {
        awards.forEach(async (result: Result) => {
            var botFavor = await getPersonalityFavorUseCase(botConfig.id, result.userId, botApi)
            var userStats = await getUserStatsUseCase(result.userId, loungeApi)
            var favorMultiplier = +(botFavor.favor / 100) + +1 + +(userStats.cha * 0.0025) + +xpBonus
            if (messageMax !== 0) {
                incrementUserStatUseCase(result.userId, StatType.Coins, Math.round(result.messagesSent / messageMax * maxReward) * favorMultiplier, loungeApi)
            }
            if (voiceMax !== 0) {
                incrementUserStatUseCase(result.userId, StatType.Coins, Math.round(result.voiceScore / voiceMax * maxReward) * favorMultiplier, loungeApi)
            }
            setUserPropertyUseCase(result.userId, StatType.WeeklyMessages, 0, loungeApi)
            setUserPropertyUseCase(result.userId, StatType.WeeklyVoice, 0, loungeApi)
        });
    } else {
        awards.forEach(async (result: Result) => {
            var botFavor = await getPersonalityFavorUseCase(botConfig.id, result.userId, botApi)
            var userStats = await getUserStatsUseCase(result.userId, loungeApi)
            var favorMultiplier = +(botFavor.favor / 100) + +1 + +(userStats.cha * 0.0025) + +xpBonus
            if (messageMax !== 0) {
                incrementUserStatUseCase(result.userId, StatType.Coins, Math.round(result.messagesSent / messageMax * maxReward) * favorMultiplier, loungeApi)
            }
            if (voiceMax !== 0) {
                incrementUserStatUseCase(result.userId, StatType.Coins, Math.round(result.voiceScore / voiceMax * maxReward) * favorMultiplier, loungeApi)
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