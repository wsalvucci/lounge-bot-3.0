class GuildConfig {
    id: string
    announcementsChannel: string
    competitionChannel: string
    afkChannel: string
    gulagRole: string
    normalRole: string
    xpModifier: number
    birthdayActive: number

    constructor(
        id: string,
        announcementsChannel: string,
        competitionChannel: string,
        afkChannel: string,
        gulagRole: string,
        normalRole: string,
        xpModifier: number,
        birthdayActive: number
    ) {
        this.id = id
        this.announcementsChannel = announcementsChannel
        this.competitionChannel = competitionChannel
        this.afkChannel = afkChannel
        this.gulagRole = gulagRole
        this.normalRole = normalRole
        this.xpModifier = xpModifier
        this.birthdayActive = birthdayActive
    }

    static toDomainModel(data: any) : GuildConfig {
        return new GuildConfig(
            data.guildId,
            data.announcementsChannelId,
            data.competitionChannelId,
            data.afkChannelId,
            data.gulagRoleId,
            data.normalRoleId,
            data.xpModifier,
            data.birthdayActive
        )
    }
}

export default GuildConfig