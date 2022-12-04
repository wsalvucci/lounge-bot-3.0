import { AnyChannel, Channel, GuildMember, VoiceChannel } from "discord.js";
import getUserFullDataUseCase from "../useCases/user/getUserFullDataUseCase";
import botApi from "../api/bot/botApi";
import loungeApi from "../api/loungeApi";
import client from "../bot";
import getGuildConfigUseCase from "../useCases/bot/getGuildConfigUseCase";
import addVoiceUseCase from "../useCases/user/addVoiceUseCase";
import userIgnoreList from "./userIgnoreList";

export default function (guildId: string) {
    setInterval(() => {
        client.channels.cache.forEach(async (channel: AnyChannel) => {
            // Without fetching, client will have an outdated list of members and never refresh
            var fetchedChannel = await client.channels.fetch(channel.id);
            if (fetchedChannel instanceof VoiceChannel) {
                var members = fetchedChannel.members;
                if (members.size <= 1) return; // No point in running
                var score = fetchedChannel.members.size - 1;

                var guildConfig = await getGuildConfigUseCase(guildId, botApi);

                members.forEach((member: GuildMember) => {
                    if (member.user.bot) {
                        score = score - 1;
                    }
                    if (member.voice.selfVideo) {
                        score = score + 1;
                    }
                    if (member.voice.streaming) {
                        score = score + 1;
                    }
                    if (member.voice.selfMute) {
                        score = score - 1;
                    }
                    if (member.voice.selfDeaf) {
                        score = score - 1;
                    }
                    score = Math.max(0, score);
                });

                members.forEach(async (member: GuildMember) => {
                    // Temp fix for test/dummy accounts
                    // Ignore users in this list
                    if (
                        userIgnoreList.find((id: string) => id == member.id) !=
                        undefined
                    )
                        return;

                    var voiceXp = Math.round(
                        score + score * parseFloat(guildConfig.xpModifier)
                    );
                    var userData = await getUserFullDataUseCase(
                        member.id,
                        loungeApi
                    );
                    if (userData.attributes.stunned == 1) {
                        voiceXp = 0;
                    }
                    addVoiceUseCase(member.id, score, voiceXp, loungeApi);
                });
            }
        });
    }, 1000);
}
