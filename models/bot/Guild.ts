class GuildConfig {
    id: string
    announcementsChannel: string
    competitionChannel: string
    levelChannel: string
    afkChannel: string
    gulagRole: string
    normalRole: string
    xpModifier: string
    birthdayActive: number
    stunnedRole: string
    initiateRole: string
    pointsChannel: string

    constructor(
        id: string,
        announcementsChannel: string,
        competitionChannel: string,
        levelChannel: string,
        afkChannel: string,
        gulagRole: string,
        normalRole: string,
        xpModifier: string,
        birthdayActive: number,
        stunnedRole: string,
        initiateRole: string,
        pointsChannel: string
    ) {
        this.id = id
        this.announcementsChannel = announcementsChannel
        this.competitionChannel = competitionChannel
        this.levelChannel = levelChannel
        this.afkChannel = afkChannel
        this.gulagRole = gulagRole
        this.normalRole = normalRole
        this.xpModifier = xpModifier
        this.birthdayActive = birthdayActive
        this.stunnedRole = stunnedRole
        this.initiateRole = initiateRole
        this.pointsChannel = pointsChannel
    }

    static toDomainModel(data: any) : GuildConfig {
        return new GuildConfig(
            data.guildId,
            data.announcementsChannelId,
            data.competitionChannelId,
            data.levelChannelId,
            data.afkChannelId,
            data.gulagRoleId,
            data.normalRoleId,
            data.xpModifier,
            data.birthdayActive,
            data.stunnedRoleId,
            data.initiateRoleId,
            data.pointsChannelId
        )
    }
}

export default GuildConfig