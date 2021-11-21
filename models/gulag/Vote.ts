class TrialVote {
    discordId: string
    vote: number

    constructor(
        discordId: string,
        vote: number
    ) {
        this.discordId = discordId
        this.vote = vote
    }

    static toDomainModel(data: any) : TrialVote {
        return new TrialVote(
            data.voterId,
            data.vote
        )
    }
}

export default TrialVote