export class LeaderboardResponse {
    members: LeaderboardUserResponse[]

    constructor(
        members: LeaderboardUserResponse[]
    ) {
        this.members = members
    }

    static dataToResponse(data: any, statName: string) : LeaderboardResponse {
        var list: LeaderboardUserResponse[] = []
        data.forEach((user: any) => {
            list.push(
                new LeaderboardUserResponse(
                    user.discordId,
                    user.name,
                    user[statName]
                )
            )
        });
        return new LeaderboardResponse(list)
    }
}

export class LeaderboardUserResponse {
    discordId: string
    name: string
    statValue: number

    constructor(
        discordId: string,
        name: string,
        statValue: number
    ) {
        this.discordId = discordId
        this.name = name
        this.statValue = statValue
    }
}