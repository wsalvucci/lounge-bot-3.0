class UserBet {
    userId: string
    betId: number
    betSelection: number
    betAmount: number

    constructor(
        userId: string,
        betId: number,
        betSelection: number,
        betAmount: number
    ) {
        this.userId = userId
        this.betId = betId
        this.betSelection = betSelection
        this.betAmount = betAmount
    }

    static toDomainModel(data: any) : UserBet {
        if (data !== undefined) {
            return new UserBet(
                data.userId,
                data.betId,
                data.betSelection,
                data.betAmount
            )
        } else {
            return new UserBet(
                "",
                -1,
                -1,
                -1
            )
        }
    }
}

export default UserBet