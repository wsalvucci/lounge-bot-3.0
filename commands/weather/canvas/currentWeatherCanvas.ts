import CurrentWeather from "../../../models/response/CurrentWeather";
import Canvas, { createDefaultBackground, createText } from "../../../domain/loungeCanvas"
import Color from "color";
import { NodeCanvasRenderingContext2D } from "canvas";

function createWeatherGuage(
    ctx: NodeCanvasRenderingContext2D,
    x: number,
    y: number,
    title: string,
    width: number,
    height: number,
    value: number,
    minValue: number,
    maxValue: number,
    primaryColor: string = '#FFFFFF',
    cautionColor: string = '#FFFF00',
    dangerColor: string = '#FF0000',
    minDanger?: number,
    maxDanger?: number,
    minCaution?: number,
    maxCaution?: number
) {
    var range = maxValue - minValue

    var minDangerWidth = 0
    var minCautionWidth = 0
    var maxCautionWidth = 0
    var maxDangerWidth = 0

    if (minDanger !== undefined) {
        ctx.fillStyle = dangerColor
        minDangerWidth = width * ((minDanger - minValue) / range)
        ctx.fillRect(x, y + height * 0.9, minDangerWidth, height * 0.1)
    }
    if (minCaution !== undefined) {
        ctx.fillStyle = cautionColor
        minCautionWidth = width * ((minCaution - minValue) / range)
        ctx.fillRect(x + minDangerWidth, y + height * 0.9, minCautionWidth - minDangerWidth, height * 0.1)
    }
    if (maxDanger !== undefined) {
        ctx.fillStyle = dangerColor
        maxDangerWidth = width * ((maxValue - maxDanger) / range)
        ctx.fillRect(x + width - maxDangerWidth, y + height * 0.9, maxDangerWidth, height * 0.1)
    }
    if (maxCaution !== undefined) {
        ctx.fillStyle = cautionColor
        maxCautionWidth = width * ((maxValue - maxCaution) / range)
        ctx.fillRect(x + width - maxCautionWidth, y + height * 0.9, maxCautionWidth - maxDangerWidth, height * 0.1)
    }

    ctx.fillStyle = `${Color(primaryColor).alpha(0.25)}`
    ctx.fillRect(x, y, width, height * 0.9)

    if (minDanger !== undefined && value < minDanger) {
        ctx.fillStyle = dangerColor
    } else if (minCaution !== undefined && value < minCaution) {
        ctx.fillStyle = cautionColor
    } else if (maxDanger !== undefined && value > maxDanger) {
        ctx.fillStyle = dangerColor
    } else if (maxCaution !== undefined && value > maxCaution) {
        ctx.fillStyle = cautionColor
    } else {
        ctx.fillStyle = primaryColor
    }
    createText(ctx, ctx.fillStyle, '36px Boldsand', title, x, y - 10, 'left')
    ctx.fillRect(x, y, width * ((value - minValue) / range), height * 0.9)
}

export default async function currentWeatherCanvas(data: CurrentWeather) : Promise<Buffer> {
    const canvas = Canvas.createCanvas(1000, 560)
    const ctx = canvas.getContext('2d')

    var primaryColor: string = '#33303C'
    var secondaryColor: string = '#282430'
    var textColor: string ='#ffffff'

    var currentTemp = data.main.temp

    if (currentTemp < 0) {
        primaryColor = '#000000',
        secondaryColor = '#101010'
    } else if (currentTemp < 10) {
        primaryColor = '#F500D2',
        secondaryColor = '#B60BDE'
    } else if (currentTemp < 20) {
        primaryColor = '#6101F5',
        secondaryColor = '#260BDE'
    } else if (currentTemp < 30) {
        primaryColor = '#004EF5',
        secondaryColor = '#0B85DE'
        textColor = '#000000'
    } else if (currentTemp < 40) {
        primaryColor = '#00F5E6',
        secondaryColor = '#0BDE94'
        textColor = '#000000'
    } else if (currentTemp < 50) {
        primaryColor = '#00F545',
        secondaryColor = '#0BDE0B'
        textColor = '#000000'
    } else if (currentTemp < 60) {
        primaryColor = '#35F500',
        secondaryColor = '#82DE0B'
        textColor = '#000000'
    } else if (currentTemp < 70) {
        primaryColor = '#F5E80A',
        secondaryColor = '#DEBD02'
        textColor = '#000000'
    } else if (currentTemp < 80) {
        primaryColor = '#F5A306',
        secondaryColor = '#DE7A07'
        textColor = '#000000'
    } else if (currentTemp < 90) {
        primaryColor = '#F53000',
        secondaryColor = '#DE170B'
    } else if (currentTemp < 100) {
        primaryColor = '#F50014',
        secondaryColor = '#DE0B86'
    } else {
        primaryColor = '#ffffff',
        secondaryColor = '#dddddd'
        textColor = '#000000'
    }

    createDefaultBackground(canvas, ctx, `${Color(primaryColor).lighten(0.5)}`, `${Color(secondaryColor).lighten(0.5)}`, 0.05)

    createText(ctx, textColor, '72px Boldsand', data.name, 50, 100, 'left', 400)
    createText(ctx, textColor, '100px Quicksand', `${Math.round(data.main.temp)}\xB0`, 50, 200)
    if (data.weather.list.length > 0) {
        createText(ctx, textColor, '36px Quicksand', data.weather.list[0].main, 250, 175)
    }
    createText(ctx, textColor, '48px Quicksand', `Feels like ${Math.round(data.main.feelsLike)}\xB0`, 50, 250)
    createText(ctx, textColor, '48px Quicksand', `Humidity ${Math.round(data.main.humidity)}%`, 50, 300)
    createText(ctx, textColor, '48px Quicksand', `Wind ${Math.round(data.wind.speed)}mph`, 50, 350)
    createText(ctx, textColor, '48px Quicksand', `Clouds ${Math.round(data.clouds.all)}%`, 50, 400)

    //Guages Background
    ctx.fillStyle = Color(primaryColor).alpha(0.75).darken(0.5).toString()
    ctx.fillRect(475, 0, 500, canvas.height)

    var guageStart = 500
    var guageWidth = 450
    var guageHeight = 20
    var guageStartY = 125
    var guageSpacing = 75

    createWeatherGuage(
        ctx,
        guageStart,
        guageStartY + (guageSpacing * 0),
        'Temperature',
        guageWidth,
        guageHeight,
        data.main.temp,
        -15,
        110,
        '#FFFFFF',
        '#FFFF00',
        '#FF0000',
        0,
        100,
        15,
        90
    )

    createWeatherGuage(
        ctx,
        guageStart,
        guageStartY + (guageSpacing * 1),
        'Feels Like',
        guageWidth,
        guageHeight,
        data.main.feelsLike,
        -30,
        120,
        '#FFFFFF',
        '#FFFF00',
        '#FF0000',
        -5,
        105,
        10,
        95
    )

    createWeatherGuage(
        ctx,
        guageStart,
        guageStartY + (guageSpacing * 2),
        'Humidity',
        guageWidth,
        guageHeight,
        data.main.humidity,
        0,
        100,
        '#FFFFFF',
        '#FFFF00',
        '#FF0000',
        10,
        80,
        20,
        70
    )

    createWeatherGuage(
        ctx,
        guageStart,
        guageStartY + (guageSpacing * 3),
        'Wind',
        guageWidth,
        guageHeight,
        data.wind.speed,
        0,
        100,
        '#FFFFFF',
        '#FFFF00',
        '#FF0000',
        0,
        50,
        0,
        35
    )

    createWeatherGuage(
        ctx,
        guageStart,
        guageStartY + (guageSpacing * 4),
        'Pressure',
        guageWidth,
        guageHeight,
        data.main.pressure,
        975,
        1050,
        '#FFFFFF',
        '#FFFF00',
        '#FF0000',
        1000,
        1030,
        1009,
        1020
    )

    return canvas.toBuffer()
}