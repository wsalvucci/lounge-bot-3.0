import { CommandInteraction, CommandInteractionOption, User } from "discord.js"
import { OrderType, StatType, StatTypeToString, UserStat } from "../../domain/loungeFunctions"
import SlashCommand from "../../models/SlashCommand"
import getStatLeaderboardUseCase from "../../useCases/user/getStatLeaderboardUseCase"
import Repository from "../../api/loungeApi"
import { LeaderboardResponse, LeaderboardUserResponse } from "../../models/response/LeaderboardResponse"
import { SlashCommandBuilder } from "@discordjs/builders"
import Canvas from "../../domain/loungeCanvas"
import { CanvasRenderingContext2D } from "canvas"
import Color from "color"

function createText(
    ctx: CanvasRenderingContext2D,
    fillStyle: string,
    font: string,
    text: string,
    x: number,
    y: number,
    alignment: CanvasTextAlign = 'left') {
    ctx.fillStyle = fillStyle
    ctx.font = font
    ctx.textAlign = alignment
    ctx.fillText(text, x, y)
}

function createDivider(
    ctx: CanvasRenderingContext2D,
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

async function getLeaderboardCanvas(user: User, leaderboard: LeaderboardResponse, statName: string) : Promise<Buffer> {
    const canvas = Canvas.createCanvas(1000, 560)
    const ctx = canvas.getContext('2d')

    var primaryColor = '#33303C'
    var secondaryColor = '#282430'

    var grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    grd.addColorStop(0, primaryColor)
    grd.addColorStop(0.15, primaryColor)
    grd.addColorStop(0.16, secondaryColor)
    grd.addColorStop(0.60, secondaryColor)
    grd.addColorStop(0.61, primaryColor)
    grd.addColorStop(1, primaryColor)
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    var userIsTopFive = false

    createText(ctx, `#ffffff`, '60px Boldsand', statName + ' Leaderboard', 500, 75, 'center')

    for (var i = 0; i < 5; i++) {
        var rankColor = '#707070'
        if (i == 0) { rankColor = '#FFA500'}
        if (i == 1) { rankColor = '#C0C0C0'}
        if (i == 2) { rankColor = '#DA771A'}
        if (i == 3) { rankColor = '#D3DF85' }
        if (i == 4) { rankColor = '#FBAB7F' }
        // Canvas text draws upwards from the point, so the first y position must be > 0
        var currentY = 75 + (75 * (i+1))
        createText(ctx, rankColor, '48px Boldsand', `${i + 1}`, 50, currentY)
        createText(ctx, rankColor, '48px Boldsand', leaderboard.members[i].name, 100, currentY)
        createText(ctx, rankColor, '48px Boldsand' , leaderboard.members[i].statValue.withCommas(), 900, currentY, 'right')
        if (leaderboard.members[i].discordId === user.id) {
            userIsTopFive = true
        }
    }

    if (!userIsTopFive) {
        var userIndex = leaderboard.members.findIndex((row: LeaderboardUserResponse) => {
            return row.discordId == user.id
        })
        var userData = leaderboard.members.find((row: LeaderboardUserResponse) => {
            return row.discordId == user.id
        })
        if (userData !== undefined) {
            createText(ctx, '#ffffff', '48px Boldsand', `${userIndex + 1}`, 50, 525)
            createText(ctx, '#ffffff', '48px Boldsand', userData.name, 100, 525)
            createText(ctx, '#ffffff', '48px Boldsand', userData.statValue.withCommas(), 900, 525, 'right')
        }
    }

    return canvas.toBuffer()
}

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Shows the leaderboard for a specific Lounge Stat')
        .addStringOption(option =>
            option.setName('stat')
                .setDescription('The stat to show the leaderboard for')
                .setRequired(true)
                .addChoice('Messages Sent', StatType.TotalMessages)
                .addChoice('Seconds Voice', StatType.TotalVoice)
                .addChoice('Users Slapped', StatType.UsersSlapped)
                .addChoice('Been Slapped', StatType.BeenSlapped)
                .addChoice('Coins', StatType.Coins)
                .addChoice('Users Gulaged', StatType.UsersGulaged)
                .addChoice('Been Gulaged', StatType.TimesGulaged)
                .addChoice('Time in Gulag', StatType.TimeInGulag)
                .addChoice('Daily Messages', StatType.DailyMessages)
                .addChoice('Daily Voice', StatType.DailyVoice)
                .addChoice('Weekly Messages', StatType.WeeklyMessages)
                .addChoice('Weekly Voice', StatType.WeeklyVoice)
                .addChoice('Monthly Messages', StatType.MonthlyMessages)
                .addChoice('Monthly Voice', StatType.MonthlyVoice)
                .addChoice('Luck', StatType.Luck)

        ),
    (interaction: CommandInteraction) => {
        var statEnum = interaction.options.getString('stat', true)
        getStatLeaderboardUseCase(statEnum, OrderType.DESC, Repository)
            .then((leaderboard: LeaderboardResponse) => {
                if (interaction.member?.user instanceof User) {
                    getLeaderboardCanvas(interaction.member.user, leaderboard, StatTypeToString(statEnum))
                        .then((attachment: Buffer) => {
                            interaction.reply({files: [{ attachment: attachment }]})
                        })
                }
            })
    }
)

export default command