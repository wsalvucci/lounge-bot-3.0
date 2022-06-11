import SlashCommand from "../../models/SlashCommand"
import { CommandInteraction, CommandInteractionOption, MessageAttachment, MessageEmbed, User } from 'discord.js'
import Repository from "../../api/loungeApi"
import ErrorMessage from "../../models/ErrorMessage"
import Canvas from "../../domain/loungeCanvas"
import UserStats from "../../models/UserStats"
import getUserStatsUseCase from "../../useCases/user/getUserStatsUseCase"
import getStatLeaderboardUseCase from "../../useCases/user/getStatLeaderboardUseCase"
import { CanvasRenderingContext2D } from "canvas"
import { OrderType, secondsToTimeString, StatType, UserStat } from '../../domain/loungeFunctions'
import Color from 'color'
import '../../domain/numberExtensions' //Can this be imported once from a central module?
import { LeaderboardResponse, LeaderboardUserResponse } from "../../models/response/LeaderboardResponse"
import { SlashCommandBuilder } from "@discordjs/builders"
import { createText } from "../../domain/loungeCanvas"
import getHouseDetailsUseCase from "../../useCases/house/getHouseDetails"
import loungeApi from "../../api/loungeApi"
import LoungeUser from "../../models/LoungeUser"
import getUserFullDataUseCase from "../../useCases/user/getUserFullDataUseCase"
import getUserPointsUseCase from "../../useCases/house/getUserPointsUseCase"
import { DateTime } from "luxon"

function createDivider(
    ctx: CanvasRenderingContext2D,
    color: string,
    x: number,
    y: number,
    w: number,
    labelTextColor: string = '#000000',
    dividerHeight: number = 1,
    header: string = ""
) {
    var grd = ctx.createLinearGradient(x, y, x + w, y + dividerHeight)
    grd.addColorStop(0, `${Color(color).alpha(0)}`)
    grd.addColorStop(0.25, `${Color(color).alpha(1)}`)
    grd.addColorStop(0.75, `${Color(color).alpha(1)}`)
    grd.addColorStop(1, `${Color(color).alpha(0)}`)
    ctx.fillStyle = grd
    ctx.fillRect(x, y, w, dividerHeight)
    createText(ctx, labelTextColor, `18px Quicksand`, header, x, y-2)
}

async function getCanvas(user: User, loungeUser: LoungeUser) : Promise<Buffer> {
    const canvas = Canvas.createCanvas(1000, 560)
    const ctx = canvas.getContext('2d')
    var houseDetails = await getHouseDetailsUseCase(loungeUser.attributes.house, loungeApi)

    var grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    grd.addColorStop(0, loungeUser.stats.tier.primaryColor)
    grd.addColorStop(0.15, loungeUser.stats.tier.primaryColor)
    if (loungeUser.attributes.house != null) {
        grd.addColorStop(0.16, `#${houseDetails.primaryColor}`)
        grd.addColorStop(0.30, `#${houseDetails.primaryColor}00`)
        grd.addColorStop(0.44, `#${houseDetails.primaryColor}00`)
        grd.addColorStop(0.59, `#${houseDetails.primaryColor}`)
    } else {
        grd.addColorStop(0.16, loungeUser.stats.tier.secondaryColor)
        grd.addColorStop(0.59, loungeUser.stats.tier.secondaryColor)
    }
    grd.addColorStop(0.60, loungeUser.stats.tier.primaryColor)
    grd.addColorStop(1, loungeUser.stats.tier.primaryColor)

    ctx.fillStyle = grd
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = `${Color(loungeUser.stats.tier.secondaryColor).darken(0.5).alpha(0.5)}`
    ctx.fillRect(500, 20, 450, 530)

    const avatar = await Canvas.loadImage(user.displayAvatarURL({format: 'png'}))
    ctx.save()
    ctx.arc(300, canvas.height / 2, 100, 0, Math.PI * 2)
    ctx.clip()
    ctx.drawImage(avatar, 200, (canvas.height / 2) - 100, 200, 200)
    ctx.restore()

    var textColor : string
    if (Color(loungeUser.stats.tier.secondaryColor).isLight()) {
        textColor = '#000000'
    } else {
        textColor = '#ffffff'
    }

    var annualPoints = await getUserPointsUseCase(loungeUser.attributes.discordId, DateTime.now().startOf('year').toSeconds(), DateTime.now().toSeconds(), loungeApi)
    createText(ctx, textColor, `36px Quicksand`, houseDetails.name, 300, (canvas.height / 2) - 150, 'center')
    createText(ctx, textColor, `18px Quicksand`, `${DateTime.now().year}`, 300, (canvas.height / 2) + 125, 'center')
    createText(ctx, textColor, `24px Quicksand`, `${annualPoints.points.withCommas()} Points`, 300, (canvas.height / 2) + 150, 'center')

    createText(ctx, textColor, '72px Quicksand', loungeUser.stats.level.level.toString(), 25, 100)

    createText(ctx, textColor, '32px Quicksand', loungeUser.stats.tier.title, 550, 75)
    createText(ctx, textColor, '38px Quicksand', loungeUser.attributes.nickname.toUpperCase(), 550, 120, 'left', 350)

    createDivider(ctx, "#C0C0C0", 150, (canvas.height / 2) + 160, 300, textColor)

    var dailyPoints = await getUserPointsUseCase(loungeUser.attributes.discordId, DateTime.now().startOf('day').toSeconds(), DateTime.now().toSeconds(), loungeApi)
    var weeklyPoints = await getUserPointsUseCase(loungeUser.attributes.discordId, DateTime.now().startOf('week').toSeconds(), DateTime.now().toSeconds(), loungeApi)
    var monthlyPoints = await getUserPointsUseCase(loungeUser.attributes.discordId, DateTime.now().startOf('month').toSeconds(), DateTime.now().toSeconds(), loungeApi)
    createText(ctx, textColor, '18px Quicksand', `Daily`, 200, 465, 'left')
    createText(ctx, textColor, '18px Quicksand', `Weekly`, 200, 490, 'left')
    createText(ctx, textColor, '18px Quicksand', `Monthly`, 200, 515, 'left')
    createText(ctx, textColor, '18px Quicksand', dailyPoints.points.withCommas(), 400, 465, 'right')
    createText(ctx, textColor, '18px Quicksand', weeklyPoints.points.withCommas(), 400, 490, 'right')
    createText(ctx, textColor, '18px Quicksand', monthlyPoints.points.withCommas(), 400, 515, 'right')



    createDivider(ctx, '#C0C0C0', 525, 145, 425, textColor, 1, 'Progression')


    //XP Bar backgrounds
    if (Color(loungeUser.stats.tier.secondaryColor).isLight()) {
        ctx.fillStyle = `${Color(loungeUser.stats.tier.primaryColor).whiten(0.75).hex()}`
    } else {
        ctx.fillStyle = `${Color(loungeUser.stats.tier.primaryColor).blacken(0.75).hex()}`
    }
    ctx.fillRect(550, 175, 350, 15)
    ctx.fillRect(550, 225, 350, 15)


    //XP Bars
    ctx.fillStyle = `${Color(loungeUser.stats.tier.primaryColor).lighten(0.2)}`
    var levelXpPercent = loungeUser.stats.level.currentLevelProgress / (loungeUser.stats.level.nextLevelExp - loungeUser.stats.level.currentLevelExp)
    var tierXpPercent = loungeUser.stats.level.currentTitleProgress / (loungeUser.stats.level.nextTitleExp - loungeUser.stats.level.currentTitleExp)
    ctx.fillRect(550, 175, 350 * levelXpPercent, 15)
    ctx.fillRect(550, 225, 350 * tierXpPercent, 15)

    //Current and next levels and titles
    ctx.fillStyle = textColor
    ctx.font = '24px Quicksand'
    ctx.fillText(`${loungeUser.stats.level.level}`, 550, 170)
    ctx.fillText(`${loungeUser.stats.tier.title}`, 550, 220)

    ctx.textAlign = 'right'
    ctx.fillText(`${loungeUser.stats.level.nextLevel}`, 900, 170)
    ctx.fillText(`${loungeUser.stats.tier.nextTitleName}`, 900, 220)

    createDivider(ctx, '#C0C0C0', 525, 275, 425, textColor, 1, 'All Time')


    //XP Bar Labels
    ctx.font = '12px Boldsand'
    // Is this actually doing anything??
    var startPoint = 550
    if (levelXpPercent < 0.25) {
        ctx.textAlign = 'left'
        startPoint = 555
    } else {
        ctx.textAlign = 'right'
        startPoint = 545
    }
    ctx.fillStyle = textColor
    ctx.fillText(`${Math.floor(levelXpPercent * 100)}%`, startPoint + (350 * levelXpPercent), 187)
    ctx.fillText(`${Math.floor(tierXpPercent * 100)}%`, startPoint + (350 * tierXpPercent), 237)


    //Medals
    

    //Stats
    var statsTextStyle = `20px Quicksand`
    createText(ctx, textColor, statsTextStyle, `Messages Sent`, 550, 300)
    createText(ctx, textColor, statsTextStyle, `Voice Chat`, 550, 330)
    createText(ctx, textColor, statsTextStyle, `House Points`, 550, 360)
    //createText(ctx, textColor, statsTextStyle, `Kudos`, 550, 390)

    var allPoints = await getUserPointsUseCase(loungeUser.attributes.discordId, 0, DateTime.now().toSeconds(), loungeApi)
    createText(ctx, textColor, statsTextStyle, `${loungeUser.stats.level.messagesSent.withCommas()}`, 900, 300, 'right')
    createText(ctx, textColor, statsTextStyle, `${secondsToTimeString(loungeUser.stats.level.secondsVoice)}`, 900, 330, 'right')
    createText(ctx, textColor, statsTextStyle, `${allPoints.points}`, 900, 360, 'right')
    //createText(ctx, textColor, statsTextStyle, `${loungeUser.stats.kudos}`, 900, 390, 'right')
    
    createDivider(ctx, '#C0C0C0', 525, 415, 425, textColor, 1, 'Rankings')


    //Rankings
    createText(ctx, textColor, statsTextStyle, `Level`, 550, 440)
    createText(ctx, textColor, statsTextStyle, `Messages`, 550, 470)
    createText(ctx, textColor, statsTextStyle, `Voice`, 550, 500)

    var messagePromise = getStatLeaderboardUseCase(StatType.TotalMessages, OrderType.DESC, Repository)
    var voicePromise = getStatLeaderboardUseCase(StatType.TotalVoice, OrderType.DESC, Repository)
    var xpPromise = getStatLeaderboardUseCase(StatType.CurrentLevel, OrderType.DESC, Repository)
    await Promise.all([messagePromise, voicePromise, xpPromise]).then((value: [LeaderboardResponse, LeaderboardResponse, LeaderboardResponse]) => {
        var messageRank = value[0].members.findIndex((leaderboardUser: LeaderboardUserResponse) => {
            return leaderboardUser.discordId == user.id.toString()
        }) + 1
        var voiceRank = value[1].members.findIndex((leaderboardUser: LeaderboardUserResponse) => {
            return leaderboardUser.discordId == user.id.toString()
        }) + 1
        var xpRank = value[2].members.findIndex((leaderboardUser: LeaderboardUserResponse) => {
            return leaderboardUser.discordId == user.id.toString()
        }) + 1
        createText(ctx, textColor, statsTextStyle, `${xpRank}`, 900, 440, 'right')
        createText(ctx, textColor, statsTextStyle, `${messageRank}`, 900, 470, 'right')
        createText(ctx, textColor, statsTextStyle, `${voiceRank}`, 900, 500, 'right') 
    })


    return canvas.toBuffer()
}


const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Retrives Lounge stats for either you or an indicated user')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('A specific user to get Lounge Stats for')
        ),
    (interaction: CommandInteraction) => {
        if (interaction.member !== null) {
            var targetId: string = interaction.member.user.id
            var optionalTarget: User | null = interaction.options.getUser('user')
            if (optionalTarget !== null) {
                targetId = optionalTarget.id
            }
            getUserFullDataUseCase(targetId, Repository)
                .then((response: LoungeUser | ErrorMessage) => {
                    if (response instanceof LoungeUser && interaction.member?.user instanceof User) {
                        var canvasBuffer : Promise<Buffer>
                        if (optionalTarget !== null) {
                            canvasBuffer = getCanvas(optionalTarget, response)
                        } else {
                            canvasBuffer = getCanvas(interaction.member.user, response)
                        }
                        canvasBuffer.then((attachment: Buffer) => {
                            interaction.reply({files: [{ attachment: attachment }]})
                        })
                    } else if (response instanceof ErrorMessage) {
                        interaction.reply({content: `There was an error: ${response.message}`, ephemeral: true})
                    }
                })
        }
    }
)

export default command