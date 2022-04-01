export default class ButtonRound {
    guildId: string
    round: number
    roundStart: number
    roundEnd: number

    constructor(
        guildId: string,
        round: number,
        roundStart: number,
        roundEnd: number
    ) {
        this.guildId = guildId
        this.round = round
        this.roundStart = roundStart
        this.roundEnd = roundEnd
    }

    static toDomainModel(data: any) : ButtonRound {
        return new ButtonRound(
            data.guildId,
            data.round,
            data.roundStart,
            data.roundEnd
        )
    }
}