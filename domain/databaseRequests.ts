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