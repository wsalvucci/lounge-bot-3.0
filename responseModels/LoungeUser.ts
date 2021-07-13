class LoungeUser {
    details: LoungeUserDetails
    stats: LoungeUserStats

    constructor(
        details: LoungeUserDetails,
        stats: LoungeUserStats
    ) {
        this.details = details
        this.stats = stats
    }

    static dataToModel(data: any) : LoungeUser {
        return new LoungeUser(
            new LoungeUserDetails(
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
                data.coins,
                data.timesGulaged,
                data.usersGulaged,
                data.timeInGulag
            )
        )
    }
}

class LoungeUserDetails {
    discordId: string
    name: string
    nickname: string
    timeAdded: number
    color: string
    activeTitleId: number

    constructor(
        discordId: string,
        name: string,
        nickname: string,
        timeAdded: number,
        color: string,
        activeTitleId: number
    ) {
        this.discordId = discordId
        this.name = name
        this.nickname = nickname
        this.timeAdded = timeAdded
        this.color = color
        this.activeTitleId = activeTitleId
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
    coins: number
    timesGulaged: number
    usersGulaged: number
    timeInGulag: number

    constructor(
        messagesSent: number,
        secondsVoice: number,
        usersSlapped: number,
        beenSlapped: number,
        luck: number,
        dailyStats: LoungeUserDailyStats,
        weeklyStats: LoungeUserWeeklyStats,
        monthlyStats: LoungeUserMonthlyStats,
        coins: number,
        timesGulaged: number,
        usersGulaged: number,
        timeInGulag: number
    ) {
        this.messagesSent = messagesSent
        this.secondsVoice = secondsVoice
        this.usersSlapped = usersSlapped
        this.beenSlapped = beenSlapped
        this.luck = luck
        this.dailyStats = dailyStats
        this.weeklyStats = weeklyStats
        this.monthlyStats = monthlyStats
        this.coins = coins
        this.timesGulaged = timesGulaged
        this.usersGulaged = usersGulaged
        this.timeInGulag = timeInGulag
    }
}

class LoungeUserTimedStats {
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