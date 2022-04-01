import schedule from 'node-schedule'
import buttonApi from '../api/button/buttonApi'
import getRoundUseCase from '../useCases/button/getRoundUseCase'
import { DateTime } from 'luxon'
import UserButton from '../models/button/UserButton'
import client from '../bot'
import { TextChannel } from 'discord.js'
import getAllButtonsUseCase from '../useCases/button/getAllButtonsUseCase'
import addPointsUseCase from '../useCases/button/addPointsUseCase'
import startNewRoundUseCase from '../useCases/button/startNewRoundUseCase'
import breakButtonUseCase from '../useCases/button/breakButtonUseCase'
import repairButtonUseCase from '../useCases/button/repairButtonUseCase'
import pushButtonUseCase from '../useCases/button/pushButtonUseCase'

const MAX_ROUND_LENGTH = 1800
const BOT_ACTION_CHANCES = 0.002

function timeToScore(time: number) : number {
    return Math.round(0.02 * Math.pow(time, 1.73))
}

async function runButtonGame(guildId: string) {
    var buttonChannelId = process.env.BUTTON_GAME_CHANNEL
    if (buttonChannelId == undefined) {
        throw('No Button Channel ID Found')
    }
    var buttonGameChannel = await client.channels.fetch(buttonChannelId) as TextChannel
    schedule.scheduleJob(`*/5 * * * * *`, async function() {
        var roundDetails = await getRoundUseCase(guildId, buttonApi)
        var currentTime = DateTime.now().toSeconds()
        if (currentTime > roundDetails.roundEnd) {
            var buttonDetails = await getAllButtonsUseCase(buttonApi)
            var maxButton : UserButton | null = null
            for (var i = 0; i < buttonDetails.length; i++) {
                if (buttonDetails[i].timePressed !== null) {
                    if (maxButton == null || (buttonDetails[i].timePressed > maxButton.timePressed)) {
                        maxButton = buttonDetails[i]
                    }
                }
            }
            if (maxButton !== null) {
                var score = timeToScore(maxButton.timePressed - roundDetails.roundStart)
                buttonGameChannel.send(`<@${maxButton.userId}> won the round and scored ${score} points`)
                await addPointsUseCase(maxButton.userId, score, buttonApi)
                await startNewRoundUseCase(guildId, currentTime, currentTime + Math.round(Math.random() * MAX_ROUND_LENGTH), buttonApi)
            } else {
                var score = timeToScore(roundDetails.roundEnd - roundDetails.roundStart)
                buttonGameChannel.send(`No one pressed their button, so the ${score} points were lost`)
                await startNewRoundUseCase(guildId, currentTime, currentTime + Math.round(Math.random() * MAX_ROUND_LENGTH), buttonApi)
            }
            buttonGameChannel.send({content: `Round ${roundDetails.round + 1} has begun`})
        }

        var botActionRoll = Math.random()
        var appId = client.application?.id
        if (botActionRoll < BOT_ACTION_CHANCES && appId != undefined) {
            var allButtons = await (await getAllButtonsUseCase(buttonApi)).filter((button: UserButton) => button.userId != appId)
            var actionTaken = false
            if (allButtons.length == 0) { actionTaken = true }
            while(!actionTaken && allButtons.length > 0) {
                var target = allButtons[Math.floor(Math.random() * allButtons.length)]
                var triedPush = false
                var triedBreak = false
                var triedRepair = false
                while ((!triedPush || !triedBreak || !triedRepair) && !actionTaken) {
                    var actionRoll = Math.random()
                    if (actionRoll > 0.6666) {
                        if (target.buttonBroken == 0 && target.timePressed == null) {
                            await breakButtonUseCase(appId, currentTime, target.userId, currentTime - roundDetails.roundStart, roundDetails.roundEnd - currentTime, buttonApi)
                            buttonGameChannel.send(`<@${appId}> broke <@${target.userId}>'s button`)
                            actionTaken = true
                        }
                        triedBreak = true
                    } else if (actionRoll > 0.3333) {
                        if (target.buttonBroken == 1 && target.timePressed == null) {
                            await repairButtonUseCase(appId, currentTime, target.userId, currentTime - roundDetails.roundStart, roundDetails.roundEnd - currentTime, buttonApi)
                            buttonGameChannel.send(`<@${appId}> repaired <@${target.userId}>'s button`)
                            actionTaken = true
                        }
                        triedRepair = true
                    } else {
                        if (target.timePressed == null) {
                            await pushButtonUseCase(appId, currentTime, target.userId, currentTime - roundDetails.roundStart, roundDetails.roundEnd - currentTime, buttonApi)
                            buttonGameChannel.send(`<@${appId}> pushed <@${target.userId}>'s button`)
                            actionTaken = true
                        }
                        triedPush = true
                    }
                }
                allButtons = allButtons.filter((button: UserButton) => button.userId != target.userId)
            }
        }
    })
}

export default function(guildId: string) {
    runButtonGame(guildId)
}