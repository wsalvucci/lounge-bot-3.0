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

async function resultCanvas(rankings: Result[], title: string, maxValue: number, rankingType: string, intervalType: string) : Promise<Buffer> {
    const canvas = Canvas.createCanvas(1000, 75 + (USER_DATA_HEIGHT * (rankings.length + 1)))
    const ctx = canvas.getContext('2d')

    createDefaultBackground(canvas, ctx)
    createText(ctx, '#ffffff', '48px Boldsand', title, 500, 75, 'center')

    rankings.forEach((result: Result, index: number) => {
        var textColor = '#ffffff'
        if (index == 0) {textColor = '#FFA700'}
        if (index == 1) {textColor = '#D0D0D0'}
        if (index == 2) {textColor = '#DA771A'}

        createText(ctx, textColor, '36px Boldsand', `${result.name}`, 50, USER_DATA_HEIGHT * (index + 2))
        if (rankingType == 'message') {
            if (intervalType == 'daily') {
                createText(ctx, textColor, '36px Boldsand', `${Math.round(result.messagesSent / maxValue * DAILY_COIN_AWARD).withCommas()}`, 600, USER_DATA_HEIGHT * (index + 2))
            } else if (intervalType == 'weekly') {
                createText(ctx, textColor, '36px Boldsand', `${Math.round(result.messagesSent / maxValue * WEEKLY_COIN_AWARD).withCommas()}`, 600, USER_DATA_HEIGHT * (index + 2))
            } else {
                createText(ctx, textColor, '36px Boldsand', `${Math.round(result.messagesSent / maxValue * MONTHLY_COIN_AWARD).withCommas()}`, 600, USER_DATA_HEIGHT * (index + 2))
            }
            createText(ctx, textColor, '36px Boldsand', `${result.messagesSent.withCommas()}`, 400, USER_DATA_HEIGHT * (index + 2))
        } else {
            if (intervalType == 'daily') {
                createText(ctx, textColor, '36px Boldsand', `${Math.round(result.voiceScore / maxValue * DAILY_COIN_AWARD).withCommas()}`, 600, USER_DATA_HEIGHT * (index + 2))
            } else if (intervalType == 'weekly') {
                createText(ctx, textColor, '36px Boldsand', `${Math.round(result.voiceScore / maxValue * WEEKLY_COIN_AWARD).withCommas()}`, 600, USER_DATA_HEIGHT * (index + 2))
            } else {
                createText(ctx, textColor, '36px Boldsand', `${Math.round(result.voiceScore / maxValue * MONTHLY_COIN_AWARD).withCommas()}`, 600, USER_DATA_HEIGHT * (index + 2))
            }
            createText(ctx, textColor, '36px Boldsand', `${result.voiceScore.withCommas()}`, 400, USER_DATA_HEIGHT * (index + 2))
        }
    });

    return canvas.toBuffer()
}

async function runDailies(guildId: string, intervalType: string) {
    var guildData = client.guilds.cache.get(guildId)
    if (guildData === undefined) return
    var guildConfig = await getGuildConfigUseCase(guildId, botApi)
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
        intervalType
        )
        .then((attachment: Buffer) => {
            (client.channels.cache.get(guildConfig.competitionChannel) as TextChannel).send({files: [{attachment: attachment}]})
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
        intervalType
        )
        .then((attachment: Buffer) => {
            (client.channels.cache.get(guildConfig.competitionChannel) as TextChannel).send({files: [{attachment: attachment}]})
        })
    
    if (intervalType == 'daily') {
        awards.forEach((result: Result) => {
            incrementUserStatUseCase(result.userId, StatType.Coins, Math.round(result.messagesSent / messageMax * DAILY_COIN_AWARD), loungeApi)
            incrementUserStatUseCase(result.userId, StatType.Coins, Math.round(result.voiceScore / voiceMax * DAILY_COIN_AWARD), loungeApi)
            setUserPropertyUseCase(result.userId, StatType.DailyMessages, 0, loungeApi)
            setUserPropertyUseCase(result.userId, StatType.DailyVoice, 0, loungeApi)
        });
    } else if (intervalType == 'weekly') {
        awards.forEach((result: Result) => {
            incrementUserStatUseCase(result.userId, StatType.Coins, Math.round(result.messagesSent / messageMax * WEEKLY_COIN_AWARD), loungeApi)
            incrementUserStatUseCase(result.userId, StatType.Coins, Math.round(result.voiceScore / voiceMax * WEEKLY_COIN_AWARD), loungeApi)
            setUserPropertyUseCase(result.userId, StatType.WeeklyMessages, 0, loungeApi)
            setUserPropertyUseCase(result.userId, StatType.WeeklyVoice, 0, loungeApi)
        });
    } else {
        awards.forEach((result: Result) => {
            incrementUserStatUseCase(result.userId, StatType.Coins, Math.round(result.messagesSent / messageMax * MONTHLY_COIN_AWARD), loungeApi)
            incrementUserStatUseCase(result.userId, StatType.Coins, Math.round(result.voiceScore / voiceMax * MONTHLY_COIN_AWARD), loungeApi)
            setUserPropertyUseCase(result.userId, StatType.MonthlyMessages, 0, loungeApi)
            setUserPropertyUseCase(result.userId, StatType.MonthlyVoice, 0, loungeApi)
        });
    }
}

function checkTimedResults(guildId: string) {
    schedule.scheduleJob(`* 0 * * *`, async function() {
        runDailies(guildId, 'daily')
    })
    schedule.scheduleJob(`* 0 * * 0`, async function() {
        runDailies(guildId, 'weekly')
    })
    schedule.scheduleJob(`* 0 1 * *`, async function() {
        runDailies(guildId, 'monthly')
    })
}

export default function(guildId: string) {
    checkTimedResults(guildId)
}