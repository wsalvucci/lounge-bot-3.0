class BetOption {
    betOptionId: number
    betId: number
    optionName: string
    optionDescription: string
    optionLine: number

    constructor(
        betOptionId: number,
        betId: number,
        optionName: string,
        optionDescription: string,
        optionLine: number
    ) {
        this.betOptionId = betOptionId
        this.betId = betId
        this.optionName = optionName
        this.optionDescription = optionDescription
        this.optionLine = optionLine
    }

    static toDomainModel(data: any) : BetOption {
        return new BetOption(
            data.betOptionId,
            data.betId,
            data.optionName,
            data.optionDescription,
            data.optionLine
        )
    }
}

export default BetOption