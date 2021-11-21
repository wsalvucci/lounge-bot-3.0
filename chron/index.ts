import personalityController from './botPersonalityController'
import trialController from './trialController'

export function startPersonalityController(guildId: string) {
    personalityController(guildId)
}

export function startTrialController() {
    trialController()
}