import { ApplicationCommandData, CommandInteraction } from "discord.js"
import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders"

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