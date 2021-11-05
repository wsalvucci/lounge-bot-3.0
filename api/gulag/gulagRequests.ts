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

export function getTrialBribes(trialId: number) {
    return query(`SELECT * FROM trial_bribes WHERE trialId = ${trialId}`)
}

export function addTrialBribe(trialId: number, discordId: string, amount: number, vote: number) {
    return query(`INSERT INTO trial_bribes (trialId, discordId, bribeAmount, bribeVote) VALUES (${trialId}, ${discordId}, ${amount}, ${vote}) ON DUPLICATE KEY UPDATE bribeAmount = ${amount}, bribeVote = ${vote}`)
}

export function removeTrialBribe(trialId: number, discordId: string) {
    return query(`DELETE FROM trial_bribes WHERE trialId = ${trialId} and discordId = ${discordId}`)
}