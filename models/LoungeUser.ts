import { getLevelStats, LevelStats, levelToTitle, TierData } from "../domain/loungeFunctions"

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
                data.activeTitleId,
                data.birthday,
                data.stunned,
                data.house
            ),
            new LoungeUserStats(
                data.xp,
                getLevelStats(
                    data.discordId,
                    data.xp,
                    data.currentLevel,
                    data.secondsVoice,
                    data.messagesSent,
                    data.usersSlapped,
                    data.beenSlapped,
                    data.usersGulaged,
                    data.timesGulaged
                ),
                levelToTitle(data.currentLevel),
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
                data.coins,
                data.atk,
                data.def,
                data.matk,
                data.mdef,
                data.agi,
                data.hp,
                data.cha,
                data.respecTimestamp,
                data.specPoints,
                data.accusationTimestamp,
                data.points,
                data.dailyPoints,
                data.weeklyPoints,
                data.monthlyPoints,
                data.annualPoints,
                data.kudos
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
    birthday: number
    stunned: number
    house: number

    constructor(
        discordId: string,
        name: string,
        nickname: string,
        timeAdded: number,
        color: string,
        titleId: number,
        birthday: number,
        stunned: number,
        house: number
    ) {
        this.discordId = discordId
        this.name = name
        this.nickname = nickname
        this.timeAdded = timeAdded
        this.color = color
        this.titleId = titleId
        this.birthday = birthday
        this.stunned = stunned
        this.house = house
    }
}

class LoungeUserStats {
    xp: number
    level: LevelStats
    tier: TierData
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
    atk: number
    def: number
    matk: number
    mdef: number
    agi: number
    hp: number
    cha: number
    respecTimestamp: number
    specPoints: number
    accusationTimestamp: number
    points: number
    dailyPoints: number
    weeklyPoints: number
    monthlyPoints: number
    annualPoints: number
    kudos: number

    constructor(
        xp: number,
        level: LevelStats,
        tier: TierData,
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
        coins: number,
        atk: number,
        def: number,
        matk: number,
        mdef: number,
        agi: number,
        hp: number,
        cha: number,
        respecTimestamp: number,
        specPoints: number,
        accusationTimestamp: number,
        points: number,
        dailyPoints: number,
        weeklyPoints: number,
        monthlyPoints: number,
        annualPoints: number,
        kudos: number
    ) {
        this.xp = xp
        this.level = level
        this.tier = tier
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
        this.atk = atk
        this.def = def
        this.matk = matk
        this.mdef = mdef
        this.agi = agi
        this.hp = hp
        this.cha = cha
        this.respecTimestamp = respecTimestamp
        this.specPoints = specPoints
        this.accusationTimestamp = accusationTimestamp
        this.points = points
        this.dailyPoints = dailyPoints
        this.weeklyPoints = weeklyPoints
        this.monthlyPoints = monthlyPoints
        this.annualPoints = annualPoints
        this.kudos = kudos
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