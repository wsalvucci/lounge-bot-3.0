import query from '../../domain/database'

export function getBets(timestamp: number) {
    return query(`SELECT * FROM bets WHERE openingTimestamp <= ${timestamp} and closingTimestamp >= ${timestamp}`)
}

export function getBet(betId: number) {
    return query(`SELECT * FROM bets WHERE betId = ${betId}`)
}

export function addBet(betName: string, betDescription: string, openingTimestamp: number, closingTimestamp: number, hiddenTimestamp: number) {
    return query(`INSERT INTO bets (betName, betDescription, openingTimestamp, closingTimestamp, hiddenTimestamp) VALUES ('${betName}', '${betDescription}', ${openingTimestamp}, ${closingTimestamp}, ${hiddenTimestamp})`)
}

export function updateBet(betId: number, betName: string, betDescription: string, openingTimestamp: number, closingTimestamp: number) {
    return query(`UPDATE bets SET betName = '${betName}', betDescription = '${betDescription}', openingTimestamp = ${openingTimestamp}, closingTimestamp = ${closingTimestamp} WHERE betId = ${betId}`)
}

export function concludeBet(betId: number) {
    return query(`UPDATE bets SET concluded = 1 WHERE betId = ${betId}`)
}

export function getBetOptions(betId: number) {
    return query(`SELECT * FROM bet_options WHERE betId = ${betId}`)
}

export function getBetOption(betOptionId: number) {
    return query(`SELECT * FROM bet_options WHERE betOptionId = ${betOptionId}`)
}

export function addBetOption(betId: number, optionName: string, optionDescription: string, optionLine: number) {
    return query(`INSERT INTO bet_options (betId, optionName, optionDescription, optionLine) VALUES (${betId}, '${optionName}', '${optionDescription}', ${optionLine})`)
}

export function updateBetOption(betId: number, optionName: string, optionDescription: string, optionLine: number) {
    return query(`UPDATE bet_options SET betId = ${betId}, optionName = '${optionName}', optionDescription = '${optionDescription}', optionLine = ${optionLine} WHERE betId = ${betId}`)
}

export function getUserBets(userId: string) {
    return query(`SELECT * FROM user_bets WHERE userId = ${userId}`)
}

export function getUserBet(userId: string, betId: number) {
    return query(`SELECT * FROM user_bets WHERE userId = ${userId} and betId = ${betId}`)
}

export function placeBet(userId: string, betId: number, betSelection: number, betAmount: number) {
    return query(`INSERT INTO user_bets (userId, betId, betSelection, betAmount) VALUES (${userId}, ${betId}, ${betSelection}, ${betAmount}) ON DUPLICATE KEY UPDATE betSelection = ${betSelection}, betAmount = ${betAmount}`)
}

export function deleteUserBet(userId: string, betId: number) {
    return query(`DELETE FROM user_bets WHERE userId = ${userId} and betId = ${betId}`)
}

export function getAllUserBetsForBet(betId: number) {
    return query(`SELECT * FROM user_bets WHERE betId = ${betId}`)
}