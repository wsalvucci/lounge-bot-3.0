import { GuildMember, Message } from "discord.js";
import getUserFullDataUseCase from "useCases/user/getUserFullDataUseCase";
import getUserStatsUseCase from "useCases/user/getUserStatsUseCase";
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
        var messageXp = XP_PER_MESSAGE
        var userData = await getUserFullDataUseCase(member.id, loungeApi)
        if (userData.attributes.stunned == 1) {
            messageXp = 0
        } else {
            messageXp = XP_PER_MESSAGE + (XP_PER_MESSAGE * guildConfig.xpModifier)
        }
        addMessageUseCase(message.member.id, messageXp, loungeApi)
    })
}