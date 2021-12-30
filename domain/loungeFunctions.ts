import { GuildMember } from "discord.js"
import gulagApi from "../api/gulag/gulagApi"
import GuildConfig from "../models/bot/Guild"
import SqlResponse from "../responseModels/SqlResponse"
import gulagUserUseCase from "../useCases/gulag/gulagUserUseCase"
import unGulagUserUseCase from "../useCases/gulag/unGulagUserUseCase"

export class LevelStats {
    discordId: string
    messagesSent: number
    secondsVoice: number
    usersSlapped: number
    beenSlapped: number
    usersGulaged: number
    beenGulaged: number
    exp: number
    level: number
    nextLevel: number
    currentLevelExp: number
    nextLevelExp: number
    currentLevelProgress: number
    totalLevelProgress: number
    title: TierData
    currentTitleExp: number
    nextTitle: TierData
    nextTitleExp: number
    currentTitleProgress: number
    totalTitleProgress: number

    constructor(
        discordId: string,
        messagesSent: number,
        secondsVoice: number,
        usersSlapped: number,
        beenSlapped: number,
        usersGulaged: number,
        beenGulaged: number,
        exp: number,
        level: number,
        nextLevel: number,
        currentLevelExp: number,
        nextLevelExp: number,
        currentLevelProgress: number,
        totalLevelProgress: number,
        title: TierData,
        currentTitleExp: number,
        nextTitle: TierData,
        nextTitleExp: number,
        currentTitleProgress: number,
        totalTitleProgress: number
    ) {
        this.discordId = discordId
        this.messagesSent = messagesSent
        this.secondsVoice = secondsVoice
        this.usersSlapped = usersSlapped
        this.beenSlapped = beenSlapped
        this.usersGulaged = usersGulaged
        this.beenGulaged = beenGulaged
        this.exp = exp
        this.level = level
        this.nextLevel = nextLevel
        this.currentLevelExp = currentLevelExp
        this.nextLevelExp = nextLevelExp
        this.currentLevelProgress = currentLevelProgress
        this.totalLevelProgress = totalLevelProgress
        this.title = title
        this.currentTitleExp = currentTitleExp
        this.nextTitle = nextTitle
        this.nextTitleExp = nextTitleExp
        this.currentTitleProgress = currentTitleProgress
        this.totalTitleProgress = totalTitleProgress
    }
}

export class TierData {
    title: string
    titleLevel: number
    primaryColor: string
    secondaryColor: string
    nextTitleLevel: number
    nextTitleName: string
    titleLeftText: string
    titleRightText: string

    constructor(
        title: string,
        titleLevel: number,
        primaryColor: string,
        secondaryColor: string,
        nextTitleLevel: number,
        nextTitleName: string,
        titleLeftText: string = "",
        titleRightText: string = "",
    ) {
        this.title = title
        this.titleLevel = titleLevel
        this.primaryColor = primaryColor
        this.secondaryColor = secondaryColor
        this.nextTitleLevel = nextTitleLevel
        this.nextTitleName = nextTitleName
        this.titleLeftText = titleLeftText
        this.titleRightText = titleRightText
    }
}

export function levelToTitle(level: number): TierData {
    if (level < 5) { //0-4
        return new TierData(
            'Initiate',
            0,
            '#ffffff',
            '#ffffff',
            5,
            'Tier I'
            )
    } else if (level < 20) { // 5-19
        return new TierData(
            'Tier I',
            5,
            '#ffffff',
            '#000000',
            20,
            'Tier II'
            )
    } else if (level < 30) { //20-29
        return new TierData(
            'Tier II',
            20,
            '#964B00',
            '#ffffff',
            30,
            'Tier III'
            )
    } else if (level < 40) { //30-39
        return new TierData(
            'Tier III',
            30,
            '#964B00',
            '#000000',
            40,
            'Tier IV'
            )
    } else if (level < 50) { //40-49
        return new TierData(
            'Tier IV',
            40,
            '#ffc000',
            '#ffffff',
            50,
            'Tier V'
            )
    } else if (level < 60) { //50-59
        return new TierData(
            'Tier V',
            50,
            '#ffc000',
            '#000000',
            60,
            'C Class'
            )
    } else if (level < 80) { //60-79
        return new TierData(
            'C Class',
            60,
            '#00b050',
            '#ffffff',
            80,
            'B Class'
            )
    } else if (level < 100) { //80-99
        return new TierData(
            'B Class',
            80,
            '#00b050',
            '#000000',
            100,
            'A Class'
            )
    } else if (level < 120) { //100-119
        return new TierData(
            'A Class',
            100,
            '#33303C',
            '#282430',
            120,
            'S Class'
            )
    } else if (level < 140) { //120-139
        return new TierData(
            'S Class',
            120,
            '#0070c0',
            '#000000',
            140,
            'Master'
            )
    } else if (level < 160) { //140-159
        return new TierData(
            'Master',
            140,
            '#7030a0',
            '#ffffff',
            160,
            'Grandmaster'
            )
    } else if (level < 180) { //160-179
        return new TierData(
            'Grandmaster',
            160,
            '#7030a0',
            '#000000',
            180,
            'Guildmaster'
            )
    } else if (level < 200) { //180-199
        return new TierData(
            'Guildmaster',
            180,
            '#a50021',
            '#000000',
            200,
            'X Class'
            )
    } else if (level > 200) { //200+
        return new TierData(
            'X Class',
            200,
            '#a50021',
            '#000000',
            999,
            'N/A'
            )
    }
    return new TierData(
        'Unknown',
        0,
        '#ffffff',
        '#ffffff',
        1,
        'Unknown'
        )
}

export function statsToExp(secondsVoice: number, messagesSent: number, usersSlapped: number, beenSlapped: number) : number {
    return secondsVoice + (messagesSent * 100) + ((usersSlapped + beenSlapped) * 20)
}
export function expToLevel(exp: number) : number {return Math.floor(Math.pow(exp / 0.6,0.284))}
export function statsTolevel(secondsVoice: number, messagesSent: number, usersSlapped: number, beenSlapped: number) : number {
    return expToLevel(statsToExp(secondsVoice, messagesSent, usersSlapped, beenSlapped))
}
export function statsToTitle(secondsVoice: number, messagesSent: number, usersSlapped: number, beenSlapped: number) : TierData {
    return levelToTitle(statsTolevel(secondsVoice, messagesSent, usersSlapped, beenSlapped))
}
export function levelToTier(level: number): Tier {
    if (level < 5) {
        return Tier.Initiate
    } else if (level < 20) {
        return Tier.TierI
    } else if (level < 30) {
        return Tier.TierII
    } else if (level < 40) {
        return Tier.TierIII
    } else if (level < 50) {
        return Tier.TierIV
    } else if (level < 60) {
        return Tier.TierV
    } else if (level < 80) {
        return Tier.CCLass
    } else if (level < 100) {
        return Tier.BClass
    } else if (level < 120) {
        return Tier.AClass
    } else if (level < 140) {
        return Tier.SClass
    } else if (level < 160) {
        return Tier.Master
    } else if (level < 180) {
        return Tier.Grandmaster
    } else if (level < 200) {
        return Tier.Guildmaster
    } else {
        return Tier.XClass
    }
}
export function levelExpRequirement(level: number) : number {return Math.pow(level, (1/0.284)) * 0.6}
export function expProgress(exp: number, target: number) : number {return Math.floor(exp - target)}
export function getLevelStats(
    discordId: string,
    exp: number,
    secondsVoice: number,
    messagesSent: number,
    usersSlapped: number,
    beenSlapped: number,
    usersGulaged: number,
    beenGulaged: number): LevelStats {
    // The level of the user
    var level = expToLevel(exp)

    // The amount of experience required to reach the user's level
    var currentLevelExpReq = levelExpRequirement(level)

    // The user's next level
    var nextLevel = level + 1

    // The amount of experience required to reach the user's next level
    var nextLevelExpReq = levelExpRequirement(nextLevel)

    // The amount of progress the user has made through their current level
    var currentLevelProgress = expProgress(exp, currentLevelExpReq)

    // The total amount of progress required to advance to the user's next level
    var totalLevelProgress = expProgress(nextLevelExpReq, currentLevelExpReq)

    // The user's title data derived from their current level
    var title = levelToTitle(level)

    // The user's next title derived from their current level
    var nextTitle = levelToTitle(nextLevel)

    // The amount of experience required to reach the user's title
    var currentTitleExpReq = levelExpRequirement(title.titleLevel)

    // The amount of experience required to reach the user's next title
    var nextTitleExpReq = levelExpRequirement(title.nextTitleLevel)

    // The amount of progress the user has made through their current title
    var currentTitleProgress = expProgress(exp, currentTitleExpReq)

    // The amount of progress required to advance to the user's next title
    var totalTitleProgress = expProgress(nextTitleExpReq, currentTitleExpReq)

    return new LevelStats(
        discordId,
        messagesSent,
        secondsVoice,
        usersSlapped,
        beenSlapped,
        usersGulaged,
        beenGulaged,
        exp,
        level,
        level + 1,
        currentLevelExpReq,
        nextLevelExpReq,
        currentLevelProgress,
        totalLevelProgress,
        title,
        currentTitleExpReq,
        nextTitle,
        nextTitleExpReq,
        currentTitleProgress,
        totalTitleProgress
    )
}

export enum UserStat {
    luck = 'luck',
    level = 'level',
    messagesSent = 'messagesSent',
    secondsVoice = 'secondsVoice',
    usersSlapped = 'usersSlapped',
    beenSlapped = 'beenSlapped',
    coins = 'coins',
    timesGulaged = 'timesGulaged',
    usersGulaged = 'usersGulaged',
    timeInGulag = 'timeInGulag',
    slapRatio = 'slapRatio',
    gulagRatio = 'gulagRatio'
}

export enum OrderType {
    ASC = 'ASC',
    DESC = 'DESC'
}

export enum Tier {
    Initiate = 'Initiate',
    TierI = 'Tier I',
    TierII = 'Tier II',
    TierIII = 'Tier III',
    TierIV = 'Tier IV',
    TierV = 'Tier V',
    CCLass = 'C Class',
    BClass = 'B Class',
    AClass = 'A Class',
    SClass = 'S Class',
    Master = 'Master ',
    Grandmaster = 'Grandmaster',
    Guildmaster = 'Guildmaster',
    XClass = 'X Class'
}

export enum CompetitionLength {
    Daily = 'daily',
    Weekly = 'weekly',
    Monthly = 'monthly'
}

export enum CompetitionType {
    Message = 'message',
    Voice = 'voice'
}

export class UserCompetitionResult {
    name: string
    id: string
    score: number

    constructor(
        name: string,
        id: string,
        score: number
    ) {
        this.name = name
        this.id = id
        this.score = score
    }
}

export enum SlapResponseType {
    LegendaryBad,
    EpicBad,
    RareBad,
    UncommonBad,
    Common,
    UncommonGood,
    RareGood,
    EpicGood,
    LegendaryGood
}

export class ZipCode {
    zip: string
    latitude: number
    longitude: number
    city: string
    state: string
    country: string

    constructor(
        zip: string,
        latitude: number,
        longitude: number,
        city: string,
        state: string,
        country: string
    ) {
        this.zip = zip
        this.latitude = latitude
        this.longitude = longitude
        this.city = city
        this.state = state
        this.country = country
    }

    static toZipCodeData(data: any) : ZipCode {
        return new ZipCode(
            data.zip,
            data.latitude,
            data.longitude,
            data.city,
            data.state,
            data.country
        )
    }
}

export enum StatType {
    TotalMessages = 'messagesSent',
    TotalVoice = 'secondsVoice',
    DailyMessages = 'dailyMessagesSent',
    DailyVoice = 'dailySecondsVoice',
    WeeklyMessages = 'weeklyMessagesSent',
    WeeklyVoice = 'weeklySecondsVoice',
    MonthlyMessages = 'monthlyMessagesSent',
    MonthlyVoice = 'monthlySecondsVoice',
    Luck = 'luck',
    UsersSlapped = 'usersSlapped',
    BeenSlapped = 'beenSlapped',
    TimesGulaged = 'timesGulaged',
    UsersGulaged = 'usersGulaged',
    TimeInGulag = 'timeInGulag',
    Coins = 'coins',
    XP = 'xp',
    CurrentLevel = 'currentLevel'
}

export function StatTypeToString(statType: StatType | string) {
    if (statType === StatType.TotalMessages) return 'Total Messages'
    if (statType === StatType.TotalVoice) return 'Total Voice'
    if (statType === StatType.DailyMessages) return 'Daily Messages'
    if (statType === StatType.DailyVoice) return 'Daily Voice'
    if (statType === StatType.WeeklyMessages) return 'Weekly Messages'
    if (statType === StatType.WeeklyVoice) return 'Weekly Voice'
    if (statType === StatType.MonthlyMessages) return 'Monthly Messages'
    if (statType === StatType.MonthlyVoice) return 'Monthly Voice'
    if (statType === StatType.Luck) return 'Luck'
    if (statType === StatType.UsersSlapped) return 'Users Slapped'
    if (statType === StatType.BeenSlapped) return 'Been Slapped'
    if (statType === StatType.TimesGulaged) return 'Times Gulaged'
    if (statType === StatType.UsersGulaged) return 'Users Gulaged'
    if (statType === StatType.TimeInGulag) return 'Time In Gulag'
    if (statType === StatType.Coins) return 'Coins'
    return ''
}

export enum GachaStatType {
    Luck = 1,
    LuckAcquired = 2,
    CoinsAcquired = 3,
    ExperienceAcquired = 4,
    SlapDefense = 5,
    SlapOffense = 6
}

export function gachaStatToString(type: GachaStatType) : string {
    switch(type) {
        case GachaStatType.Luck: return "Luck"
        case GachaStatType.LuckAcquired: return "Luck Acquired"
        case GachaStatType.CoinsAcquired: return "Coins Acquired"
        case GachaStatType.ExperienceAcquired: return "Experience Acquired"
        case GachaStatType.SlapDefense: return "Slap Defense"
        case GachaStatType.SlapOffense: return "Slap Offense"
        default: return ""
    }
}

export function secondsToTimeString(seconds: number) : string {
    var remainingSeconds = seconds % 60
    var minutes = Math.floor(seconds / 60) % 60
    var hours = Math.floor(seconds / 3600) % 24
    var days = Math.floor(seconds / 86400)

    var returnString: string = ''
    if (days > 0) {
        returnString = returnString + `${days}d ${hours}h ${minutes}m `
    } else if (hours > 0) {
        returnString = returnString + `${hours}h ${minutes}m `
    } else if (minutes > 0) {
        returnString = returnString + `${minutes}m `
    }
    returnString = returnString + `${remainingSeconds}s`

    return returnString
}

export function gulagUser(guildConfig: GuildConfig, user: GuildMember, attacker: GuildMember, timestamp: number, points: number, repository: typeof gulagApi) : Promise<SqlResponse> {
    if (guildConfig.gulagRole !== null) {
        user.roles.add(guildConfig.gulagRole)
    }
    if (guildConfig.normalRole !== null) {
        user.roles.remove(guildConfig.normalRole)
    }
    return gulagUserUseCase(user.id, attacker.id, timestamp, points, repository)
}

export function unGulagUser(guildConfig: GuildConfig, user: GuildMember, repository: typeof gulagApi) : Promise<SqlResponse> {
    if (guildConfig.normalRole !== null) {
        user.roles.add(guildConfig.normalRole)
    }
    if (guildConfig.gulagRole !== null) {
        user.roles.remove(guildConfig.gulagRole)
    }
    return unGulagUserUseCase(user.id, repository)
}