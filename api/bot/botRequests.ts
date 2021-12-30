import query from '../../domain/database'

export function getBotPersonalities() {
    return query(`SELECT * FROM bot_personalities`)
}

/**
 * Maybe one day restrict this by guildid. Not too important rn
 */
export function updateBotPersonality(id: number) {
    return query(`UPDATE bot_config SET personality = ${id} WHERE botId = 1`)
}

export function getCurrentPersonality() {
    return query(`SELECT p.* FROM bot_config c LEFT JOIN (SELECT * FROM bot_personalities) p ON c.personality = p.personalityId WHERE botId = 1`)
}

export function getGuild(id: string) {
    return query(`SELECT * FROM guildconfig WHERE guildId = ${id}`)
}

export function getIntroLines(id: number) {
    return query(`SELECT * FROM personality_intro_lines WHERE botId = ${id}`)
}

export function getTrialResultLines(personalityId: number) {
    return query(`SELECT * FROM bot_trial_lines WHERE personalityId = ${personalityId}`)
}

export function getSlapResponseLines(personalityId: number, responseType: number) {
    return query(`SELECT * FROM bot_slap_responses WHERE personalityId = ${personalityId} and responseType = ${responseType}`)
}

export function setBirthdayActive(guildId: number, active: number) {
    return query(`UPDATE guildconfig SET birthdayActive = ${active} WHERE guildId = ${guildId}`)
}

export function adjustPersonalityFavor(personalityId: number, userId: string, amount: number) {
    return query(`INSERT INTO personality_favor (personalityId, userId, favor) VALUES (${personalityId}, ${userId}, ${amount}) ON DUPLICATE KEY UPDATE favor = favor + ${amount}`)
}

export function getPersonalityFavor(personalityId: number, userId: string) {
    //Add the personality data if it doesn't already exist
    query(`INSERT IGNORE personality_favor SET personalityId = ${personalityId}, userId = ${userId}`)
    return query(`SELECT * FROM personality_favor WHERE personalityId = ${personalityId} and userId = ${userId}`)
}