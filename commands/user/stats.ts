import SlashCommand from "../../models/SlashCommand"
import { CommandInteraction, CommandInteractionOption, MessageAttachment, MessageEmbed, User } from 'discord.js'
import Repository from "../../api/loungeApi"
import ErrorMessage from "../../models/ErrorMessage"
import Canvas from "../../domain/loungeCanvas"
import UserStats from "../../models/UserStats"
import getUserStatsUseCase from "../../useCases/user/getUserStatsUseCase"
import getStatLeaderboardUseCase from "../../useCases/user/getStatLeaderboardUseCase"
import { NodeCanvasRenderingContext2D } from "canvas"
import { OrderType, secondsToTimeString, StatType, UserStat } from '../../domain/loungeFunctions'
import Color from 'color'
import '../../domain/numberExtensions' //Can this be imported once from a central module?
import { LeaderboardResponse, LeaderboardUserResponse } from "../../models/response/LeaderboardResponse"
import { SlashCommandBuilder } from "@discordjs/builders"
import { createText } from "../../domain/loungeCanvas"

// function createText(
//     ctx: NodeCanvasRenderingContext2D,
//     fillStyle: string,
//     font: string,
//     text: string,
//     x: number,
//     y: number,
//     alignment: CanvasTextAlign = 'left')
//     {
//         ctx.fillStyle = fillStyle
//         ctx.font = font
//         ctx.textAlign = alignment
//         ctx.fillText(text, x, y)
//     }

function createDivider(
    ctx: NodeCanvasRenderingContext2D,
    color: string,
    x: number,
    y: number,
    w: number,
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
    createText(ctx, '#ffffff', `18px Quicksand`, header, x, y-2)
}

async function getCanvas(user: User, stats: UserStats) : Promise<Buffer> {
    const canvas = Canvas.createCanvas(1000, 560)
    const ctx = canvas.getContext('2d')

    var grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    grd.addColorStop(0, stats.tier.primaryColor)
    grd.addColorStop(0.15, stats.tier.primaryColor)
    grd.addColorStop(0.16, stats.tier.secondaryColor)
    grd.addColorStop(0.60, stats.tier.secondaryColor)
    grd.addColorStop(0.61, stats.tier.primaryColor)
    grd.addColorStop(1, stats.tier.primaryColor)

    ctx.fillStyle = grd
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = `${Color(stats.tier.secondaryColor).darken(0.5).alpha(0.5)}`
    ctx.fillRect(500, 20, 450, 530)

    const avatar = await Canvas.loadImage(user.displayAvatarURL({format: 'png'}))
    ctx.save()
    ctx.arc(300, canvas.height / 2, 100, 0, Math.PI * 2)
    ctx.clip()
    ctx.drawImage(avatar, 200, (canvas.height / 2) - 100, 200, 200)
    ctx.restore()

    createText(ctx, '#ffffff', `24px Quicksand`, stats.titleString, 300, (canvas.height / 2) + 150, 'center')

    createText(ctx, '#ffffff', '72px Quicksand', stats.levelStats.level.toString(), 25, 100)

    createText(ctx, '#ffffff', '32px Quicksand', stats.tier.title, 550, 75)
    createText(ctx, '#ffffff', '38px Quicksand', stats.nickanme.toUpperCase(), 550, 120, 'left', 350)

    createDivider(ctx, "#C0C0C0", 150, (canvas.height / 2) + 175, 300)

    const userStatsTextStyle = '18px Quicksand'
    const userStatsNameY = (canvas.height / 2) + 200
    const userStatsValueY = (canvas.height / 2) + 225
    createText(ctx, '#ffffff', userStatsTextStyle, "ATK", 150, userStatsNameY, 'center')
    createText(ctx, '#ffffff', userStatsTextStyle, stats.atk.toString(), 150, userStatsValueY, 'center')
    createText(ctx, '#ffffff', userStatsTextStyle, "DEF", 200, userStatsNameY, 'center')
    createText(ctx, '#ffffff', userStatsTextStyle, stats.def.toString(), 200, userStatsValueY, 'center')
    createText(ctx, '#ffffff', userStatsTextStyle, "MAT", 250, userStatsNameY, 'center')
    createText(ctx, '#ffffff', userStatsTextStyle, stats.matk.toString(), 250, userStatsValueY, 'center')
    createText(ctx, '#ffffff', userStatsTextStyle, "MDE", 300, userStatsNameY, 'center')
    createText(ctx, '#ffffff', userStatsTextStyle, stats.mdef.toString(), 300, userStatsValueY, 'center')
    createText(ctx, '#ffffff', userStatsTextStyle, "AGI", 350, userStatsNameY, 'center')
    createText(ctx, '#ffffff', userStatsTextStyle, stats.agi.toString(), 350, userStatsValueY, 'center')
    createText(ctx, '#ffffff', userStatsTextStyle, "HP", 400, userStatsNameY, 'center')
    createText(ctx, '#ffffff', userStatsTextStyle, stats.hp.toString(), 400, userStatsValueY, 'center')
    createText(ctx, '#ffffff', userStatsTextStyle, "CHA", 450, userStatsNameY, 'center')
    createText(ctx, '#ffffff', userStatsTextStyle, stats.char.toString(), 450, userStatsValueY, 'center')

    createText(ctx, '#ffffff', userStatsTextStyle, `Spec Points Available: ${stats.specPoints}`, 300, userStatsValueY + 25, 'center')


    createDivider(ctx, '#C0C0C0', 525, 145, 425, 1, 'Progression')


    //XP Bar backgrounds
    ctx.fillStyle = `${Color(stats.tier.primaryColor).darken(0.5)}`
    ctx.fillRect(550, 175, 350, 15)
    ctx.fillRect(550, 225, 350, 15)


    //XP Bars
    ctx.fillStyle = `${Color(stats.tier.primaryColor).lighten(0.2)}`
    var levelXpPercent = stats.levelStats.currentLevelProgress / stats.levelStats.nextLevelExp
    var tierXpPercent = stats.levelStats.currentTitleProgress / stats.levelStats.nextTitleExp
    ctx.fillRect(550, 175, 350 * levelXpPercent, 15)
    ctx.fillRect(550, 225, 350 * tierXpPercent, 15)

    //Current and next levels and titles
    ctx.fillStyle = '#ffffff'
    ctx.font = '24px Quicksand'
    ctx.fillText(`${stats.levelStats.level}`, 550, 170)
    ctx.fillText(`${stats.tier.titleLeftText}`, 550, 220)

    ctx.textAlign = 'right'
    ctx.fillText(`${stats.levelStats.nextLevel}`, 900, 170)
    ctx.fillText(`${stats.tier.titleRightText}`, 900, 220)

    createDivider(ctx, '#C0C0C0', 525, 275, 425, 1, 'All Time')


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
    ctx.fillStyle = '#ffffff'
    ctx.fillText(`${Math.floor(levelXpPercent * 100)}%`, startPoint + (350 * levelXpPercent), 187)
    ctx.fillText(`${Math.floor(tierXpPercent * 100)}%`, startPoint + (350 * tierXpPercent), 237)


    //Medals
    

    //Stats
    var statsTextStyle = `20px Quicksand`
    createText(ctx, `#ffffff`, statsTextStyle, `Messages Sent`, 550, 300)
    createText(ctx, `#ffffff`, statsTextStyle, `Voice Chat`, 550, 330)

    createText(ctx, `#ffffff`, statsTextStyle, `${stats.levelStats.messagesSent.withCommas()}`, 900, 300, 'right')
    createText(ctx, `#ffffff`, statsTextStyle, `${secondsToTimeString(stats.levelStats.secondsVoice)}`, 900, 330, 'right')  
    
    createDivider(ctx, '#C0C0C0', 525, 355, 425, 1, 'Rankings')


    //Rankings
    createText(ctx, `#ffffff`, statsTextStyle, `Level`, 550, 380)
    createText(ctx, `#ffffff`, statsTextStyle, `Messages`, 550, 410)
    createText(ctx, `#ffffff`, statsTextStyle, `Voice`, 550, 440) 

    var messagePromise = getStatLeaderboardUseCase(StatType.TotalMessages, OrderType.DESC, Repository)
    var voicePromise = getStatLeaderboardUseCase(StatType.TotalVoice, OrderType.DESC, Repository)
    await Promise.all([messagePromise, voicePromise]).then((value: [LeaderboardResponse, LeaderboardResponse]) => {
        var messageRank = value[0].members.findIndex((leaderboardUser: LeaderboardUserResponse) => {
            return leaderboardUser.discordId == user.id.toString()
        }) + 1
        var voiceRank = value[1].members.findIndex((leaderboardUser: LeaderboardUserResponse) => {
            return leaderboardUser.discordId == user.id.toString()
        }) + 1
        createText(ctx, `#ffffff`, statsTextStyle, `...`, 900, 380, 'right')
        createText(ctx, `#ffffff`, statsTextStyle, `${messageRank}`, 900, 410, 'right')
        createText(ctx, `#ffffff`, statsTextStyle, `${voiceRank}`, 900, 440, 'right') 
    })

    createDivider(ctx, '#C0C0C0', 525, 475, 425, 1, 'Abuse')

    //Slaps and Gulags
    createText(ctx, `#ffffff`, statsTextStyle, `People Slapped`, 550, 500)
    createText(ctx, `#ffffff`, statsTextStyle, `People Gulaged`, 550, 530) 
    createText(ctx, `#ffffff`, statsTextStyle, `${stats.levelStats.usersSlapped}`, 900, 500, 'right')
    createText(ctx, `#ffffff`, statsTextStyle, `${stats.levelStats.usersGulaged}`, 900, 530, 'right')  


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
            getUserStatsUseCase(targetId, Repository)
                .then((response: UserStats | ErrorMessage) => {
                    if (response instanceof UserStats && interaction.member?.user instanceof User) {
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