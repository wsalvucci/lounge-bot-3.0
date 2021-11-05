class Bribe {
    trialId: number
    discordId: string
    bribeAmount: number
    bribeVote: number

    constructor(
        trialId: number,
        discordId: string,
        bribeAmount: number,
        bribeVote: number
    ) {
        this.trialId = trialId
        this.discordId = discordId
        this.bribeAmount = bribeAmount
        this.bribeVote = bribeVote
    }

    static toDomainModel(data: any) : Bribe {
        return new Bribe(
            data.trialId,
            data.discordId,
            data.bribeAmount,
            data.bribeVote
        )
    }
}

export default Bribe