class Guild {
    id: string
    announcementsChannel: string
    competitionChannel: string
    afkChannel: string
    gulagRole: string
    normalRole: string

    constructor(
        id: string,
        announcementsChannel: string,
        competitionChannel: string,
        afkChannel: string,
        gulagRole: string,
        normalRole: string
    ) {
        this.id = id
        this.announcementsChannel = announcementsChannel
        this.competitionChannel = competitionChannel
        this.afkChannel = afkChannel
        this.gulagRole = gulagRole
        this.normalRole = normalRole
    }

    static toDomainModel(data: any) : Guild {
        return new Guild(
            data.guildId,
            data.announcementsChannelId,
            data.competitionChannelId,
            data.afkChannelId,
            data.gulagRoleId,
            data.normalRoleId
        )
    }
}

export default Guild