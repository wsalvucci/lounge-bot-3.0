class Bet {
    betId: number
    betName: string
    betDescription: string
    openingTimestamp: number
    closingTimestamp: number
    hiddenTimestamp: number
    concluded: number

    constructor(
        betId: number,
        betName: string,
        betDescription: string,
        openingTimestamp: number,
        closingTimestamp: number,
        hiddenTimestamp: number,
        concluded: number
    ) {
        this.betId = betId
        this.betName = betName
        this.betDescription = betDescription
        this.openingTimestamp = openingTimestamp
        this.closingTimestamp = closingTimestamp
        this.hiddenTimestamp = hiddenTimestamp
        this.concluded = concluded
    }

    static toDomainModel(data: any) : Bet {
        if (data !== undefined) {
            return new Bet(
                data.betId,
                data.betName,
                data.betDescription,
                data.openingTimestamp,
                data.closingTimestamp,
                data.hiddenTimestamp,
                data.concluded
            )
        } else {
            return new Bet(
                -1,
                "",
                "",
                -1,
                -1,
                -1,
                -1
            )
        }
    }
}

export default Bet