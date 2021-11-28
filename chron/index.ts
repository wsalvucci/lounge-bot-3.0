import personalityController from './botPersonalityController'
import timedResultsController from './timedResultsController'
import trialController from './trialController'
import voiceScoreController from './voiceScoreController'
import messageScoreController from './messageScoreController'
import levelUpController from './levelUpController'

export function startPersonalityController(guildId: string) {
    personalityController(guildId)
}

export function startTrialController() {
    trialController()
}

export function startTimedResultsController(guildId: string) {
    timedResultsController(guildId)
}

export function startVoiceScoreController(guildId: string) {
    voiceScoreController(guildId)
}

export function startMessageScoreController(guildId: string) {
    messageScoreController(guildId)
}

export function startLevelUpController(guildId: string) {
    levelUpController(guildId)
}