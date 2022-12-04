import { GuildMember, Message } from "discord.js";
import getUserFullDataUseCase from "../useCases/user/getUserFullDataUseCase";
import getUserStatsUseCase from "../useCases/user/getUserStatsUseCase";
import botApi from "../api/bot/botApi";
import loungeApi from "../api/loungeApi";
import client from "../bot";
import getGuildConfigUseCase from "../useCases/bot/getGuildConfigUseCase";
import addMessageUseCase from "../useCases/user/addMessageUseCase";
import userIgnoreList from "./userIgnoreList";

const XP_PER_MESSAGE = 100;

export default function (guildId: string) {
    client.on("messageCreate", async (message: Message) => {
        var guildConfig = await getGuildConfigUseCase(guildId, botApi);
        if (message.member == null || message.member.user.bot) return;
        var member = message.member as GuildMember;

        // Temp fix for test/dummy accounts
        // Ignore users in this list
        if (userIgnoreList.find((id: string) => id == member.id) != undefined)
            return;

        var messageXp = XP_PER_MESSAGE;
        var userData = await getUserFullDataUseCase(member.id, loungeApi);
        if (userData.attributes.stunned == 1) {
            messageXp = 0;
        } else {
            messageXp =
                XP_PER_MESSAGE +
                XP_PER_MESSAGE * parseFloat(guildConfig.xpModifier);
        }
        addMessageUseCase(message.member.id, messageXp, loungeApi);
    });
}
