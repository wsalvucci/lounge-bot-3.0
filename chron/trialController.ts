import gulagApi from "../api/gulag/gulagApi";
import getActiveTrialsUseCase from "../useCases/gulag/getActiveTrialsUseCase";
import schedule from 'node-schedule'
import Trial from "../models/gulag/Trial";
import { DateTime } from "luxon";
import getCurrentBotPersonalityUseCase from "../useCases/bot/getCurrentBotPersonalityUseCase";
import botApi from "../api/bot/botApi";

const TRIAL_DURATION = 86400

async function executeTrial(trial: Trial) {
    var gulagFavor = 0
    var bribeFavor = 0

    var botConfig = await getCurrentBotPersonalityUseCase(botApi)

    gulagFavor = gulagFavor + botConfig.aggression
    bribeFavor = bribeFavor + botConfig.corruption
}

function checkTrials() {
    schedule.scheduleJob(`10 * * * * *`, async function() {
        var trials = await getActiveTrialsUseCase(gulagApi)

        trials.forEach((trial: Trial) => {
            if (DateTime.now().toSeconds() - trial.timestamp > TRIAL_DURATION) {
                executeTrial(trial)
            }
        })
    })
}

export default function() {
    checkTrials()
}