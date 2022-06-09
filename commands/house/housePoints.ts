import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { DateTime } from "luxon";
import loungeApi from "../../api/loungeApi";
import Canvas, { createDefaultBackground, createDivider, createText } from "../../domain/loungeCanvas";
import House from "../../models/house/House";
import SlashCommand from "../../models/SlashCommand";
import getAllHouseDetailsUseCase from "../../useCases/house/getAllHouseDetailsUseCase";
import getHousePointsUseCase from "../../useCases/house/getHousePointsUseCase";
import checkIfUserExistsUseCase from "../../useCases/user/checkIfUserExistsUseCase";
import getUserFullDataUseCase from "../../useCases/user/getUserFullDataUseCase";

async function getCanvas(list: {details: House, annualPoints: number, monthlyPoints: number, weeklyPoints: number, dailyPoints: number}[]) : Promise<Buffer> {
    const canvas = Canvas.createCanvas(1000, 560)
    const ctx = canvas.getContext('2d')
    createDefaultBackground(canvas, ctx)

    // list.forEach((house: {details: House, annualPoints: number, monthlyPoints: number, weeklyPoints: number, dailyPoints: number}, index: number) => {
    //     //Randomizer for testing
    //     house.annualPoints = Math.round(Math.random() * 100000)
    //     house.monthlyPoints = Math.round(Math.random() * house.annualPoints)
    //     house.weeklyPoints = Math.round(Math.random() * house.monthlyPoints)
    //     house.dailyPoints = Math.round(Math.random() * house.weeklyPoints)
    // })

    var leaderPoints = 0
    list.forEach((house: {details: House, annualPoints: number, monthlyPoints: number, weeklyPoints: number, dailyPoints: number}, index: number) => {
        leaderPoints = Math.max(leaderPoints, isNaN(house.annualPoints) ? 0 : house.annualPoints)
    })

    list.forEach((house: {details: House, annualPoints: number, monthlyPoints: number, weeklyPoints: number, dailyPoints: number}, index: number) => {
        if (isNaN(house.annualPoints)) house.annualPoints = 0
        if (isNaN(house.monthlyPoints)) house.monthlyPoints = 0
        if (isNaN(house.weeklyPoints)) house.weeklyPoints = 0
        if (isNaN(house.dailyPoints)) house.dailyPoints = 0


        var yAdjustment = canvas.height * 0.15 * (house.annualPoints / leaderPoints)
        var xPos = 100 + (800 * (index / 3))

        var grd = ctx.createLinearGradient(xPos, canvas.height * 0.40 - yAdjustment, xPos, canvas.height * 0.9)
        grd.addColorStop(0, `#${house.details.primaryColor}`)
        grd.addColorStop(1, `#${house.details.primaryColor}00`)
        ctx.fillStyle = grd
        ctx.fillRect(xPos - 100, canvas.height * 0.40 - yAdjustment, 200, canvas.height)

        createText(ctx, `#ffffff`, '36px Boldsand', house.details.name, xPos, canvas.height * 0.25 - yAdjustment, 'center')
        createText(ctx, `#ffffff`, '24px Boldsand', `${house.annualPoints.withCommas()}pts`, xPos, canvas.height * 0.35 - yAdjustment, 'center')
    
        createDivider(ctx, '#ffffff', xPos - 100, canvas.height * 0.40 - yAdjustment, 200)
    
        createText(ctx, `#ffffff`, `24px Quicksand`, `Monthly`, xPos, canvas.height * 0.50, 'center')
        createText(ctx, `#ffffff`, `24px Quicksand`, `Weekly`, xPos, canvas.height * 0.65, 'center')
        createText(ctx, `#ffffff`, `24px Quicksand`, `Daily`, xPos, canvas.height * 0.80, 'center')
    
        createText(ctx, `#ffffff`, `24px Quicksand`, house.monthlyPoints.withCommas(), xPos, canvas.height * 0.50 + 25, 'center')
        createText(ctx, `#ffffff`, `24px Quicksand`, house.weeklyPoints.withCommas(), xPos, canvas.height * 0.65 + 25, 'center')
        createText(ctx, `#ffffff`, `24px Quicksand`, house.dailyPoints.withCommas(), xPos, canvas.height * 0.80 + 25, 'center')
    })

    return canvas.toBuffer()
}

const command = new SlashCommand(
    new SlashCommandBuilder(),
    async (interaction: CommandInteraction) => {
        var member = interaction.member as GuildMember
        var userExists = await checkIfUserExistsUseCase(member.id, loungeApi)
        if (!userExists) {
            interaction.reply({content: 'You need an account to do that', ephemeral: true})
            return
        }
        var allHouseData = await getAllHouseDetailsUseCase(loungeApi)
        var datalist : {details: House, annualPoints: number, monthlyPoints: number, weeklyPoints: number, dailyPoints: number}[] = []
        var currentTime = DateTime.now()
        for (var i = 0; i < allHouseData.length; i++) {
            var currentItem = allHouseData[i]
            var annualPoints = await getHousePointsUseCase(currentItem.id, currentTime.startOf('year').toSeconds(), currentTime.toSeconds(), loungeApi)
            var monthlyPoints = await getHousePointsUseCase(currentItem.id, currentTime.startOf('month').toSeconds(), currentTime.toSeconds(), loungeApi)
            var weeklyPoints = await getHousePointsUseCase(currentItem.id, currentTime.startOf('week').toSeconds(), currentTime.toSeconds(), loungeApi)
            var dailyPoints = await getHousePointsUseCase(currentItem.id, currentTime.startOf('day').toSeconds(), currentTime.toSeconds(), loungeApi)
            datalist.push({details: currentItem, annualPoints: annualPoints.points, monthlyPoints: monthlyPoints.points, weeklyPoints: weeklyPoints.points, dailyPoints: dailyPoints.points})
        }



        var canvasBuffer = getCanvas(datalist)
        canvasBuffer.then((attachment: Buffer) => {
            interaction.reply({files: [{ attachment: attachment }]})
        })
    }
)

export default command