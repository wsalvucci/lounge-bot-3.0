class LoungeUserStats {
    name: string
    timeAdded: number
    color: string
    title: string
    messagesSent: number
    secondsVoice: number
    usersSlapped: number
    beenSlapped: number
    luck: number
    coins: number
    timesGulaged: number
    usersGulaged: number
    timeInGulag: number

    constructor(
        name: string,
        timeAdded: number,
        color: string,
        title: string,
        messagesSent: number,
        secondsVoice: number,
        usersSlapped: number,
        beenSlapped: number,
        luck: number,
        coins: number,
        timesGulaged: number,
        usersGulaged: number,
        timeInGulag: number
    ) {
        this.name = name
        this.timeAdded = timeAdded
        this.color = color
        this.title = title
        this.messagesSent = messagesSent
        this.secondsVoice = secondsVoice
        this.usersSlapped = usersSlapped
        this.beenSlapped = beenSlapped
        this.luck = luck
        this.coins = coins
        this.timesGulaged = timesGulaged
        this.usersGulaged = usersGulaged
        this.timeInGulag = timeInGulag
    }
}

export default LoungeUserStats