class Bet {
    betId: number
    betName: string
    betDescription: string
    openingTimestamp: number
    closingTimestamp: number

    constructor(
        betId: number,
        betName: string,
        betDescription: string,
        openingTimestamp: number,
        closingTimestamp: number
    ) {
        this.betId = betId
        this.betName = betName
        this.betDescription = betDescription
        this.openingTimestamp = openingTimestamp
        this.closingTimestamp = closingTimestamp
    }

    static toDomainModel(data: any) : Bet {
        return new Bet(
            data.betId,
            data.betName,
            data.betDescription,
            data.openingTimestamp,
            data.closingTimestamp
        )
    }
}

export default Bet