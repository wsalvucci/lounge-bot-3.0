import { start } from "repl"
import query from "./database"

export function getUser(discordId: string) {
    return query(`SELECT * FROM users WHERE discordId = ${discordId}`)
}

export function getTitle(titleId: number) {
    return query(`SELECT * FROM titles WHERE titleId = ${titleId}`)
}

export function updateUserValue(discordId: string, statName: string, statValue: any) {
    if (isNaN(statValue)) {
        return query(`UPDATE users SET ${statName} = '${statValue}' WHERE discordId = ${discordId}`)
    } else {
        return query(`UPDATE users SET ${statName} = ${statValue} WHERE discordId = ${discordId}`)
    }
}

export function incrementUserValue(discordId: string, statName: string, amount: number) {
    return query(`UPDATE users SET ${statName} = ${statName} + ${amount} WHERE discordId = ${discordId}`)
}

export function getLeaderboard(statName: string, order: string) {
    return query(`SELECT discordId, name, ${statName} FROM users ORDER BY ${statName} ${order}`)
}

export function createUser(discordId: string, name: string, timeAdded: number, house: number) {
    return query(`INSERT INTO users (discordId, name, timeAdded, house) VALUES ('${discordId}', '${name}', ${timeAdded}, ${house})`)
}

export function getPersonalRecord(discordId: string) {
    return query(`SELECT * FROM daily_personal_records WHERE discordId = ${discordId}`)
}

export function getAllUsers() {
    return query(`SELECT * FROM users`)
}

export function addVoice(discordId: string, amount: number, xp: number) {
    return query(`UPDATE users SET xp = xp + ${xp}, secondsVoice = secondsVoice + 1, dailySecondsVoice = dailySecondsVoice + ${amount}, weeklySecondsVoice = weeklySecondsVoice + ${amount}, monthlySecondsVoice = monthlySecondsVoice + ${amount} WHERE discordId = '${discordId}'`)
}

export function addMessage(discordId: string, xp: number) {
    return query(`UPDATE users SET xp = xp + ${xp}, messagesSent = messagesSent + 1, dailyMessagesSent = dailyMessagesSent + 1, weeklyMessagesSent = weeklyMessagesSent + 1, monthlyMessagesSent = monthlyMessagesSent + 1 WHERE discordId = '${discordId}'`)
}

export function addPersonalRecord(discordId: string, timestamp: number, messages: number, voice: number) {
    return query(`INSERT INTO daily_personal_records (timestamp, discordId, totalMessage, totalVoice) VALUES (${timestamp}, ${discordId}, ${messages}, ${voice})`)
}

export function addServerRecord(timestamp: number, messages: number, voice: number) {
    return query(`INSERT INTO daily_server_records (timestamp, totalMessage, totalVoice) VALUES (${timestamp}, ${messages}, ${voice})`)
}

export function getHouseDetails(houseId: number) {
    return query(`SELECT * FROM houses WHERE houseId = ${houseId}`)
}

export function getAllHouseDetails() {
    return query(`SELECT * FROM houses`)
}

export function addPointEvent(discordId: string, headmasterId: string, points: number, reason: string, houseId: number, timestamp: number) {
    return query(`INSERT INTO house_point_events (discordId, headmasterId, points, reason, house, timestamp) VALUES(${discordId}, ${headmasterId}, ${points}, '${reason}', ${houseId}, ${timestamp})`)
}

export function getHousePoints(houseId: number, startTime: number, endTime: number) {
    return query(`SELECT h.*, sum(p.points) points FROM house_point_events p LEFT JOIN (select * from houses) h ON p.house = h.houseId WHERE p.timestamp >= ${startTime} and p.timestamp <= ${endTime} and p.house = ${houseId}`)
}

export function getUserPoints(discordId: string, startTime: number, endTime: number) {
    return query(`SELECT u.*, sum(p.points) points FROM house_point_events p LEFT JOIN (select * from users) u ON p.discordId = u.discordId WHERE p.timestamp >= ${startTime} and p.timestamp <= ${endTime} and p.discordId = ${discordId}`)
}