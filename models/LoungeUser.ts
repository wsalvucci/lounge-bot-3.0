class LoungeUser {
    attributes: LoungeUserAttributes
    stats: LoungeUserStats

    constructor (
        attributes: LoungeUserAttributes,
        stats: LoungeUserStats
    ) {
        this.attributes = attributes
        this.stats = stats
    }

    static toDomainModel(data: any) : LoungeUser {
        return new LoungeUser(
            new LoungeUserAttributes(
                data.discordId,
                data.name,
                data.nickname,
                data.timeAdded,
                data.color,
                data.activeTitleId
            ),
            new LoungeUserStats(
                data.messagesSent,
                data.secondsVoice,
                data.usersSlapped,
                data.beenSlapped,
                data.luck,
                new LoungeUserDailyStats(
                    data.dailyMessagesSent,
                    data.dailySecondsVoice
                ),
                new LoungeUserWeeklyStats(
                    data.weeklyMessagesSent,
                    data.weeklySecondsVoice
                ),
                new LoungeUserMonthlyStats(
                    data.monthlyMessagesSent,
                    data.monthlySecondsVoice
                ),
                data.timesGulaged,
                data.usersGulaged,
                data.coins
            )
        )
    }
}

class LoungeUserAttributes {
    discordId: string
    name: string
    nickname: string
    timeAdded: number
    color: string
    titleId: number

    constructor(
        discordId: string,
        name: string,
        nickname: string,
        timeAdded: number,
        color: string,
        titleId: number
    ) {
        this.discordId = discordId
        this.name = name
        this.nickname = nickname
        this.timeAdded = timeAdded
        this.color = color
        this.titleId = titleId
    }
}

class LoungeUserStats {
    messagesSent: number
    secondsVoice: number
    usersSlapped: number
    beenSlapped: number
    luck: number
    dailyStats: LoungeUserDailyStats
    weeklyStats: LoungeUserWeeklyStats
    monthlyStats: LoungeUserMonthlyStats
    timesGulaged: number
    usersGulaged: number
    coins: number

    constructor(
        messagesSent: number,
        secondsVoice: number,
        usersSlapped: number,
        beenSlapped: number,
        luck: number,
        dailyStats: LoungeUserDailyStats,
        weeklyStats: LoungeUserWeeklyStats,
        monthlyStats: LoungeUserMonthlyStats,
        timesGulaged: number,
        usersGulaged: number,
        coins: number
    ) {
        this.messagesSent = messagesSent
        this.secondsVoice = secondsVoice
        this.usersSlapped = usersSlapped
        this.beenSlapped = beenSlapped
        this.luck = luck
        this.dailyStats = dailyStats
        this.weeklyStats = weeklyStats
        this.monthlyStats = monthlyStats
        this.timesGulaged = timesGulaged
        this.usersGulaged = usersGulaged
        this.coins = coins
    }
}

abstract class LoungeUserTimedStats {
    messagesSent: number
    secondsVoice: number

    constructor(
        messagesSent: number,
        secondsVoice: number
    ) {
        this.messagesSent = messagesSent
        this.secondsVoice = secondsVoice
    }
}

class LoungeUserDailyStats extends LoungeUserTimedStats {}

class LoungeUserWeeklyStats extends LoungeUserTimedStats {}

class LoungeUserMonthlyStats extends LoungeUserTimedStats {}

export default LoungeUser