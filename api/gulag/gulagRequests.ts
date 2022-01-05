import query from "../../domain/database"
import mysql2 from 'mysql2'

export function addTrial( guildId: string, accuserId: string, targetId: string, accusation: string, timestamp: number, judgeType: number) {
    return query(`INSERT INTO trials (guildId, accuserId,  targetId, accusation, timestamp, judgeType) VALUES ('${guildId}', '${accuserId}', '${targetId}', '${accusation}', ${timestamp}, ${judgeType})`)
}

export function addTrialVote(trialId: number, voterId: string, vote: number) {
    return query(`INSERT INTO trial_votes (trialId, voterId, vote) VALUES (${trialId}, '${voterId}', ${vote}) ON DUPLICATE KEY UPDATE vote = ${vote}`)
}

export function getTrialVotes(trialId: number) {
    return query(`SELECT * FROM trial_votes WHERE trialId = ${trialId}`)
}

export function getTrial(trialId: number) {
    return query(`SELECT * FROM trials WHERE trialId = ${trialId}`)
}

export function getActiveTrials() {
    return query(`SELECT * FROM trials WHERE concluded = 0`)
}

export function concludeTrial(trialId: number) {
    return query(`UPDATE trials SET concluded = 1 WHERE trialId = ${trialId}`)
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

export function gulagUser(userId: string, attackerId: string, timestamp: number, points: number) {
    query(`INSERT INTO gulag_archive (victimId, attackerId, timestamp) VALUES (${userId}, ${attackerId}, ${timestamp})`)
    return query(`INSERT INTO gulag (victimId, attackerId, timestamp, points) VALUES (${userId}, ${attackerId}, ${timestamp}, ${points}) ON DUPLICATE KEY UPDATE points = ${points}`)
}

export function unGulagUser(userId: string) {
    return query(`DELETE FROM gulag WHERE victimId = ${userId}`)
}

export function mineGulag(userId: string, points: number) {
    return query(`UPDATE gulag SET points = points - ${points} WHERE victimId = ${userId}`)
}

export function getActiveGulags() {
    return query(`SELECT * FROM gulag`)
}

export function addSlapResponse(userId: string, personalityId: number, responseType: number, responseText: string) {
    return query(`INSERT INTO bot_slap_responses (personalityId, responseType, responseText, submittedBy) VALUES (${personalityId}, ${responseType}, ${mysql2.escape(responseText)}, ${userId})`)
}