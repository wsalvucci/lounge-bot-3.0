class BotConfig {
    botId: number
    personality: number
    dailyMessageReq: number
    weeklyMessageReq: number
    dailyVoiceReq: number
    weeklyVoiceReq: number
    dailySlapReq: number
    weeklySlapReq: number
    dailyKudoReq: number
    weeklyKudoReq: number

    constructor(
        botId: number,
        personality: number,
        dailyMessageReq: number,
        weeklyMessageReq: number,
        dailyVoiceReq: number,
        weeklyVoiceReq: number,
        dailySlapReq: number,
        weeklySlapReq: number,
        dailyKudoReq: number,
        weeklyKudoReq: number
    ) {
        this.botId = botId
        this.personality = personality
        this.dailyMessageReq = dailyMessageReq
        this.weeklyMessageReq = weeklyMessageReq
        this.dailyVoiceReq = dailyVoiceReq
        this.weeklyVoiceReq = weeklyVoiceReq
        this.dailySlapReq = dailySlapReq
        this.weeklySlapReq = weeklySlapReq
        this.dailyKudoReq = dailyKudoReq
        this.weeklyKudoReq = weeklyKudoReq
    }

    static toDomainModel(data: any) : BotConfig {
        return new BotConfig(
            data.botId,
            data.personality,
            data.dailyMessageReq,
            data.weeklyMessageReq,
            data.dailyVoiceReq,
            data.weeklyVoiceReq,
            data.dailySlapReq,
            data.weeklySlapReq,
            data.dailyKudoReq,
            data.weeklyKudoReq
        )
    }
}

export default BotConfig