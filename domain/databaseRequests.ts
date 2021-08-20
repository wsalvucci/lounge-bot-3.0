import query from "./database"

export function getUser(discordId: string) {
    return query(`SELECT * FROM users WHERE discordId = ${discordId}`)
}

export function getTitle(titleId: number) {
    return query(`SELECT * FROM titles WHERE titleId = ${titleId}`)
}

export function updateUserValue(discordId: string, statName: string, statValue: any) {
    return query(`UPDATE users SET ${statName} = '${statValue}' WHERE discordId = ${discordId}`)
}

export function incrementUserValue(discordId: string, statName: string, amount: number) {
    return query(`UPDATE users SET ${statName} = ${statName} + ${amount} WHERE discordId = ${discordId}`)
}

export function getLeaderboard(statName: string, order: string) {
    return query(`SELECT discordId, name, ${statName} FROM users ORDER BY ${statName} ${order}`)
}

export function createUser(discordId: string, name: string, timeAdded: number) {
    return query(`INSERT INTO users (discordId, name, timeAdded) VALUES ('${discordId}', '${name}', ${timeAdded})`)
}

export function getPersonalRecord(discordId: string) {
    return query(`SELECT * FROM daily_personal_records WHERE discordId = ${discordId}`)
}