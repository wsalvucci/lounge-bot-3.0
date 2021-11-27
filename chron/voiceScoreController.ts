import { Channel, GuildMember, VoiceChannel } from "discord.js"
import botApi from "../api/bot/botApi"
import loungeApi from "../api/loungeApi"
import client from "../bot"
import getGuildConfigUseCase from "../useCases/bot/getGuildConfigUseCase"
import addVoiceUseCase from "../useCases/user/addVoiceUseCase"

export default function(guildId: string) {
    setInterval(() => {
        client.channels.cache.forEach(async (channel: Channel) => {
            if (channel instanceof VoiceChannel) {
                var members = channel.members
                var score = channel.members.size - 1

                var guildConfig = await getGuildConfigUseCase(guildId, botApi)

                members.map((member: GuildMember) => {
                    if (member.user.bot) {score = score - 1}
                    if (member.voice.selfVideo) {score = score + 1}
                    if (member.voice.streaming) {score = score + 1}
                    if (member.voice.selfMute) {score = score - 1}
                    if (member.voice.selfDeaf) {score = score - 1}
                    score = Math.max(0, score)
                })

                members.map((member: GuildMember) => {
                    console.log(score)
                    addVoiceUseCase(member.id, score, Math.round(score + (score * guildConfig.xpModifier)), loungeApi)
                })
            }
        })
    }, 1000)
}