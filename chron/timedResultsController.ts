import { Collection, GuildMember, TextChannel } from 'discord.js'
import schedule from 'node-schedule'
import loungeApi from '../api/loungeApi'
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
import Color from 'color'
import addHousePointEventUseCase from '../useCases/house/addHousePointEventUseCase'
import client from '../bot'

const DAILY_POINT_AWARD = 25

class Result {
    userId: string
    name: string
    messagesSent: number
    voiceScore: number
    points: number
    guildMember: GuildMember
    house: House

    constructor(
        userId: string,
        name: string,
        messagesSent: number,
        voiceScore: number,
        points: number,
        guildMember: GuildMember,
        house: House
    ) {
        this.userId = userId
        this.name = name
        this.messagesSent = messagesSent
        this.voiceScore = voiceScore
        this.points = points
        this.guildMember = guildMember
        this.house = house
    }
}

class HouseResult {
    house: House
    totalMessagesSent: number = 0
    totalVoiceScore: number = 0
    totalMembers: number = 0
    points: number = 0
    members: Result[] = []

    constructor(
        house: House,
        totalMessagesSent: number,
        totalVoiceScore: number,
        totalMembers: number,
        points: number,
        members: Result[]
    ) {
        this.house = house
        this.totalMessagesSent = totalMessagesSent
        this.totalVoiceScore = totalVoiceScore
        this.totalMembers = totalMembers
        this.points = points
        this.members = members
    }

    messagesSentAvg() : number {
        var score = this.totalMessagesSent / this.totalMembers
        return isNaN(score) ? 0 : score
    }

    voiceScoreAvg() : number {
        var score = this.totalVoiceScore / this.totalMembers
        return isNaN(score) ? 0 : score
    }
}

const USER_DATA_START = 100
const USER_DATA_HEIGHT = 100

async function resultCanvas(rankings: Result[], houseRankings: HouseResult[], xpModifier: number) : Promise<Buffer> {
    const canvas = Canvas.createCanvas(1000, 500)
    const ctx = canvas.getContext('2d')

    createDefaultBackground(canvas, ctx)
    createText(ctx, '#ffffff', '48px Boldsand', 'Daily Results', 50, 60, 'left')
    if (xpModifier > 0) {
        createText(ctx, '#FFD700', '36px Boldsand', `${Math.round(xpModifier * 100)}% Bonus!`, 500, 60, 'center')
    }

    createText(ctx, '#ffffff', '36px Boldsand', 'House Points', 800, 60, 'center')
    houseRankings.sort((a, b) => 
        b.points - a.points
    ).forEach((data, index) => {
        var grd = ctx.createLinearGradient(650, USER_DATA_START + (USER_DATA_HEIGHT * index) - 36, 950, USER_DATA_START + (USER_DATA_HEIGHT * (index + 1) - 36))
        var color = Color(`#${data.house.primaryColor}`)
        grd.addColorStop(0, color.hex() )
        grd.addColorStop(0.5, color.lighten(0.25).hex())
        grd.addColorStop(1, color.hex() )
        ctx.fillStyle = grd
        ctx.fillRect(650, USER_DATA_START + (USER_DATA_HEIGHT * index) - 36, 300, USER_DATA_HEIGHT)
        createText(ctx, `#000000`, '36px Boldsand', `${data.house.name}`, 800, USER_DATA_START + (USER_DATA_HEIGHT * index), 'center')
        createText(ctx, `#000000`, `36px Boldsand`, `${data.points.withCommas()}`, 800, USER_DATA_START + (USER_DATA_HEIGHT * index) + 45, 'center')
    })

    var messageLeader = [...rankings].sort((a, b) => b.messagesSent - a.messagesSent)[0]
    var voiceLeader = [...rankings].sort((a, b) => b.voiceScore - a.voiceScore)[0]

    if (messageLeader !== undefined && messageLeader.messagesSent > 0) {
        var userData = await getUserFullDataUseCase(messageLeader.userId, loungeApi)
        var userHouseData = await getHouseDetailsUseCase(userData.attributes.house, loungeApi)
        createText(ctx, `#ffffff`, '36px Boldsand', `#1 Messages Sent`, 50, 125)
        createText(ctx, `#${userData.attributes.color}`, '50px Boldsand', `${userData.attributes.nickname != null ? userData.attributes.nickname : userData.attributes.name}`, 175, 200, 'left', 400)
        createText(ctx, `#${userData.attributes.color}`, '36px Boldsand', `Messages - ${userData.stats.dailyStats.messagesSent}`, 175, 250, 'left', 400)

        const avatar = await Canvas.loadImage(messageLeader.guildMember.displayAvatarURL({format: 'png'}))
        ctx.save()
        var x = 100
        var y = 200
        var radius = 50
        var grd = ctx.createLinearGradient(x-radius, y-radius, x+radius, y+radius)
        var color = Color(`#${userHouseData.primaryColor}`)
        grd.addColorStop(0, color.hex())
        grd.addColorStop(0.5, color.lighten(0.5).hex())
        grd.addColorStop(1, color.hex())
        ctx.strokeStyle = grd
        ctx.lineWidth = 10
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.stroke()
        ctx.clip()
        ctx.drawImage(avatar, x - radius, y - radius, radius * 2, radius * 2)
        ctx.restore()
    } else {
        createText(ctx, '#ffffff', '36px Boldsand', 'No Messages Sent Today', 350, 200, 'center')
    }
    if (voiceLeader !== undefined && voiceLeader.voiceScore > 0) {
        var userData = await getUserFullDataUseCase(voiceLeader.userId, loungeApi)
        var userHouseData = await getHouseDetailsUseCase(userData.attributes.house, loungeApi)
        createText(ctx, `#ffffff`, '36px Boldsand', `#1 Voice Score`, 50, 325)
        createText(ctx, `#${userData.attributes.color}`, '50px Boldsand', `${userData.attributes.nickname != null ? userData.attributes.nickname : userData.attributes.name}`, 175, 400, 'left', 400)
        createText(ctx, `#${userData.attributes.color}`, '36px Boldsand', `Voice Score - ${userData.stats.dailyStats.secondsVoice}`, 175, 450, 'left', 400)

        const avatar = await Canvas.loadImage(voiceLeader.guildMember.displayAvatarURL({format: 'png'}))
        ctx.save()
        var x = 100
        var y = 400
        var radius = 50
        ctx.strokeStyle = (`#${userData.attributes.color}`)
        ctx.lineWidth = 10
        ctx.strokeStyle = `#${userHouseData.primaryColor}`
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.stroke()
        ctx.clip()
        ctx.drawImage(avatar, x - radius, y - radius, radius * 2, radius * 2)
        ctx.restore()
    } else {
        createText(ctx, '#ffffff', '36px Boldsand', 'No Voice Score Today', 350, 400, 'center')
    }

    return canvas.toBuffer()
}

async function runDailies(guildId: string) {
    var guildData = client.guilds.cache.get(guildId)
    if (guildData === undefined) return
    var guildConfig = await getGuildConfigUseCase(guildId, botApi)

    var xpBonus = parseFloat(guildConfig.xpModifier)
    if (guildConfig.birthdayActive == 1) {
        xpBonus = xpBonus + 1
    }

    var adjustedReward = DAILY_POINT_AWARD + (DAILY_POINT_AWARD * xpBonus)

    var memberList : Collection<string, GuildMember> = await guildData.members.fetch()
    var individualAwards : Result[] = []
    var houseAwards : HouseResult[] = [
        new HouseResult(
            await getHouseDetailsUseCase(1, loungeApi),
            0,
            0,
            0,
            0,
            []
        ),
        new HouseResult(
            await getHouseDetailsUseCase(2, loungeApi),
            0,
            0,
            0,
            0,
            []
        ),
        new HouseResult(
            await getHouseDetailsUseCase(3, loungeApi),
            0,
            0,
            0,
            0,
            []
        ),
        new HouseResult(
            await getHouseDetailsUseCase(4, loungeApi),
            0,
            0,
            0,
            0,
            []
        ),
    ]
    for(var i = 0; i < memberList.size; i++) {
        var user = memberList.at(i)
        if(user == undefined) continue
        if(!(await checkIfUserExistsUseCase(user.id, loungeApi))) continue
        var userData = await getUserFullDataUseCase(user.id, loungeApi)
        var houseAwardData = houseAwards.find((houseResult: HouseResult) => houseResult.house.id == userData.attributes.house)
        if (houseAwardData == undefined) continue
        houseAwardData.totalMembers += 1
        houseAwardData.totalMessagesSent += userData.stats.dailyStats.messagesSent
        houseAwardData.totalVoiceScore += userData.stats.dailyStats.secondsVoice
        var resultData = new Result(user.id, user.displayName, userData.stats.dailyStats.messagesSent, userData.stats.dailyStats.secondsVoice, 0, user, houseAwardData.house)
        houseAwardData.members.push(resultData)
        individualAwards.push(resultData)
    }

    var messageAvgTotal = 0
    var voiceAvgTotal = 0
    houseAwards.forEach((houseResult: HouseResult) => {
        messageAvgTotal += houseResult.messagesSentAvg()
        voiceAvgTotal += houseResult.voiceScoreAvg()
    })

    // Calculate Points Region
    for (var i = 0; i < houseAwards.length; i++) {
        var house = houseAwards[i]
        var houseMessageWeight = house.messagesSentAvg() / messageAvgTotal
        var houseVoiceWeight = house.voiceScoreAvg() / voiceAvgTotal
        var houseMessagePoints = houseMessageWeight * adjustedReward
        var houseVoicePoints = houseVoiceWeight * adjustedReward
        houseMessagePoints = isNaN(houseMessagePoints) ? 0 : houseMessagePoints
        houseVoicePoints = isNaN(houseVoicePoints) ? 0 : houseVoicePoints
        house.points = Math.floor(houseMessagePoints + houseVoicePoints) // No half points
        house.members.forEach((result: Result) => {
            var messageWeight = result.messagesSent / house.totalMessagesSent
            var voiceWeight = result.voiceScore / house.totalVoiceScore
            var messagePoints = Math.floor(messageWeight *  houseMessagePoints)
            var voicePoints = Math.floor(voiceWeight * houseVoicePoints)
            messagePoints = isNaN(messagePoints) ? 0 : messagePoints
            voicePoints = isNaN(voicePoints) ? 0 : voicePoints
            result.points = messagePoints + voicePoints
        })
    }

    console.log(houseAwards)

    var competitionChannel = await client.channels.fetch(guildConfig.competitionChannel) as TextChannel
    resultCanvas(
        individualAwards
        .sort((a: Result, b: Result) => {
            return b.messagesSent - a.messagesSent
        }),
        houseAwards,
        xpBonus
        )
        .then((attachment: Buffer) => {
            competitionChannel.send({files: [{attachment: attachment}]})
        })

    var timestamp = DateTime.now().toSeconds()
    
    var allServerMessages = 0
    var allServerVoice = 0
    houseAwards.forEach((houseResult: HouseResult) => {
        houseResult.members.forEach((result: Result) => {allServerMessages = allServerMessages + result.messagesSent
            allServerVoice = allServerVoice + result.voiceScore
            addUserRecordUseCase(result.userId, timestamp, result.messagesSent, result.voiceScore, loungeApi)
            setUserPropertyUseCase(result.userId, StatType.DailyMessages, 0, loungeApi)
            setUserPropertyUseCase(result.userId, StatType.DailyVoice, 0, loungeApi)
            // "null" headmasterId for when the bot adds points
            addHousePointEventUseCase(result.userId, "null", result.points, 'Daily Results', result.house.id, DateTime.now().toSeconds(), loungeApi)
        })
    })
    individualAwards.forEach(async (result: Result) => {
        
    });
    await addServerRecordUseCase(timestamp, allServerMessages, allServerVoice, loungeApi)

    resetGuildXpUseCase(guildId, botApi)
}

function checkTimedResults(guildId: string) {
    //schedule.scheduleJob(`0 3 * * *`, async function() {
    schedule.scheduleJob(`*/10 * * * * *`, async function() {
        runDailies(guildId)
    })
}

export default function(guildId: string) {
    checkTimedResults(guildId)
}