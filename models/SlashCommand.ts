import { ApplicationCommandData, CommandInteraction } from "discord.js"
import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, SlashCommandUserOption } from "@discordjs/builders"

export default class SlashCommand {
    details: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder
    method: (interaction: CommandInteraction) => any

    constructor(
        details: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder,
        method: (interaction: CommandInteraction) => any
    ) {
        this.details = details
        this.method = method
    }
}