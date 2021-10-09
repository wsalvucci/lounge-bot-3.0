import query from "../../domain/database"

export function addTrial(accuserId: string, targetId: string, accusation: string, timestamp: number, judgeType: number) {
    return query(`INSERT INTO trials (accuserId, targetId, accusation, timestamp, judgeType) VALUES ('${accuserId}', '${targetId}', '${accusation}', ${timestamp}, ${judgeType})`)
}

export function addTrialVote(trialId: number, voterId: string, vote: number) {
    return query(`INSERT INTO trial_votes (trialId, voterId, vote) VALUES (${trialId}, '${voterId}', ${vote}) ON DUPLICATE KEY UPDATE vote = ${vote}`)
}

export function getTrial(trialId: number) {
    return query(`SELECT * FROM trials WHERE trialId = ${trialId}`)
}

export function getActiveTrials() {
    return query(`SELECT * FROM trials WHERE concluded = 0`)
}