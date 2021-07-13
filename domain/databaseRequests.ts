import query from "./database"

export function getUser(discordId: string) {
    return query(`SELECT * FROM users WHERE discordId = ${discordId}`)
}