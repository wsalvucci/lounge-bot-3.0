import personalityController from './botPersonalityController'
import timedResultsController from './timedResultsController'
import trialController from './trialController'

export function startPersonalityController(guildId: string) {
    personalityController(guildId)
}

export function startTrialController() {
    trialController()
}

export function startTimedResultsController(guildId: string) {
    timedResultsController(guildId)
}