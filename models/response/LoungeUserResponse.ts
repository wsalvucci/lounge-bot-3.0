class LoungeUserResponse {
    discordId: string
    name: string
    nickname: string
    timeAdded: number
    messagesSent: number
    secondsVoice: number
    color: string
    usersSlapped: number
    beenSlapped: number
    luck: number
    dailyMessagesSent: number
    dailySecondsVoice: number
    weeklyMessagesSent: number
    weeklySecondsVoice: number
    monthlyMessagesSent: number
    monthlySecondsVoice: number
    coins: number
    timesGulaged: number
    usersGulaged: number
    timeInGulag: number
    activeTitleId: number

    constructor(
        discordId: string,
        name: string,
        nickname: string,
        timeAdded: number,
        messagesSent: number,
        secondsVoice: number,
        color: string,
        usersSlapped: number,
        beenSlapped: number,
        luck: number,
        dailyMessagesSent: number,
        dailySecondsVoice: number,
        weeklyMessagesSent: number,
        weeklySecondsVoice: number,
        monthlyMessagesSent: number,
        monthlySecondsVoice: number,
        coins: number,
        timesGulaged: number,
        usersGulaged: number,
        timeInGulag: number,
        activeTitleId: number,
    ) {
        this.discordId = discordId
        this.name = name
        this.nickname = nickname
        this.timeAdded = timeAdded
        this.messagesSent = messagesSent
        this.secondsVoice = secondsVoice
        this.color = color
        this.usersSlapped = usersSlapped
        this.beenSlapped = beenSlapped
        this.luck = luck
        this.dailyMessagesSent = dailyMessagesSent
        this.dailySecondsVoice = dailySecondsVoice
        this.weeklyMessagesSent = weeklyMessagesSent
        this.weeklySecondsVoice = weeklySecondsVoice
        this.monthlyMessagesSent = monthlyMessagesSent
        this.monthlySecondsVoice = monthlySecondsVoice
        this.coins = coins
        this.timesGulaged = timesGulaged
        this.usersGulaged = usersGulaged
        this.timeInGulag = timeInGulag
        this.activeTitleId = activeTitleId
    }
}