import query from '../../domain/database'

export function getBotPersonalities() {
    return query(`SELECT * FROM bot_personalities`)
}

export function updateBotPersonality(id: number) {
    return query(`UPDATE bot_config SET personality = ${id} WHERE botId = 1`)
}

export function getGuild(id: string) {
    console.log(`SELECT * FROM guildconfig WHERE guildId = ${id}`)
    return query(`SELECT * FROM guildconfig WHERE guildId = ${id}`)
}

export function getIntroLines(id: number) {
    return query(`SELECT * FROM personality_intro_lines WHERE botId = ${id}`)
}