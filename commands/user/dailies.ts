import { SlashCommandBuilder } from "@discordjs/builders";
import loungeApi from "api/loungeApi";
import { CommandInteraction, GuildMember } from "discord.js";
import Canvas, { createDefaultBackground } from "domain/loungeCanvas";
import BotConfig from "models/bot/BotConfig";
import LoungeUser from "models/LoungeUser";
import SlashCommand from "models/SlashCommand";
import checkIfUserExistsUseCase from "useCases/user/checkIfUserExistsUseCase";



async function getCanvas(user: LoungeUser, botConfig: BotConfig) : Promise<Buffer> {
    const canvas = Canvas.createCanvas(1000, 560)
    const ctx = canvas.getContext('2d')

    createDefaultBackground(canvas, ctx)


}

const command = new SlashCommand(
    new SlashCommandBuilder(),
    async (interaction: CommandInteraction) => {
        var member = interaction.member as GuildMember

        var userExists = await checkIfUserExistsUseCase(member.id, loungeApi)
        if (!userExists) {
            interaction.reply({content: `You need to join a house to do that`, ephemeral: true})
            return
        }


    }
)