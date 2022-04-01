import query from '../../domain/database'

//Action Codes
//Button Pressed - 1
//Button Broken - 2
//Button Repaired - 3

export function takeAction(discordId: string, action: number, timestamp: number, targetId: string, roundTime: number, roundTimeLeft: number, breakButton: number) {
    // Record the action
    query(`INSERT INTO fools_actions (userId, action, timestamp, target, roundTime, roundTimeLeft) VALUES (${discordId}, ${action}, ${timestamp}, ${targetId}, ${roundTime}, ${roundTimeLeft})`)
    // Update status
    if (action == 1) {
        query(`INSERT INTO fools_buttons (userId, timePressed) VALUES (${targetId}, ${timestamp}) ON DUPLICATE KEY UPDATE timePressed = ${timestamp}`)
    }
    query(`INSERT INTO fools_buttons (userId, actionTaken) VALUES (${discordId}, ${action}) ON DUPLICATE KEY UPDATE actionTaken = ${action}`)
    // Update the target's broken button if applicable
    return query(`INSERT INTO fools_buttons (userId, buttonBroken) VALUES (${targetId}, ${breakButton}) ON DUPLICATE KEY UPDATE buttonBroken = ${breakButton}`)
}

export function getScores() {
    return query(`SELECT userId, score FROM fools_buttons`)
}

export function getButton(discordId: string) {
    return query(`SELECT * FROM fools_buttons WHERE userId = ${discordId}`)
}

export function getAllButtons() {
    return query(`SELECT * FROM fools_buttons`)
}

export function resetRound() {
    return query(`UPDATE fools_buttons SET actionTaken = 0, buttonBroken = 0, timePressed = null`)
}

export function startNewRound(guildId: string, roundStart: number, roundEnd: number) {
    resetRound()
    return query(`INSERT INTO fools_timers (guildId, round, roundStart, roundEnd) VALUES (${guildId}, round, ${roundStart}, ${roundEnd}) ON DUPLICATE KEY UPDATE roundStart = ${roundStart}, roundEnd = ${roundEnd}, round = round + 1`)
}

export function getRound(guildId: string) {
    return query(`SELECT * FROM fools_timers WHERE guildId = ${guildId}`)
}

export function addScore(discordId: string, points: number) {
    return query(`UPDATE fools_buttons SET score = score + ${points} WHERE userId = ${discordId}`)
}