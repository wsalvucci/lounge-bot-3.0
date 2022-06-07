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
        initiateRole: string
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
            data.initiateRoleId
        )
    }
}

export default GuildConfig