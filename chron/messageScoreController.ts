import { GuildMember, Message } from "discord.js";
import botApi from "../api/bot/botApi";
import loungeApi from "../api/loungeApi";
import client from "../bot";
import getGuildConfigUseCase from "../useCases/bot/getGuildConfigUseCase";
import addMessageUseCase from "../useCases/user/addMessageUseCase";

const XP_PER_MESSAGE = 100

export default function(guildId: string) {
    client.on('messageCreate', async (message: Message) => {
        var guildConfig = await getGuildConfigUseCase(guildId, botApi)
        if (message.member == null) return
        var member = message.member as GuildMember
        addMessageUseCase(message.member.id, XP_PER_MESSAGE + (XP_PER_MESSAGE * guildConfig.xpModifier), loungeApi)
    })
}