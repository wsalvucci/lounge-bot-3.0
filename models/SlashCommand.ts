import { ApplicationCommandData, CommandInteraction } from "discord.js"
import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders"

export default class SlashCommand {
    details: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    method: (interaction: CommandInteraction) => any

    constructor(
        details: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">,
        method: (interaction: CommandInteraction) => any
    ) {
        this.details = details
        this.method = method
    }
}