import { ApplicationCommandData, CommandInteraction } from "discord.js"

export default class SlashCommand {
    details: ApplicationCommandData
    method: (interaction: CommandInteraction) => void

    constructor(
        details: ApplicationCommandData,
        method: (interaction: CommandInteraction) => void
    ) {
        this.details = details
        this.method = method
    }
}