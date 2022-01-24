export default class ActiveRole {
    discordId: string
    roleId: string
    expirationTime: number

    constructor(
        discordId: string,
        roleId: string,
        expirationTime: number
    ) {
        this.discordId = discordId
        this.roleId = roleId
        this.expirationTime = expirationTime
    }
}