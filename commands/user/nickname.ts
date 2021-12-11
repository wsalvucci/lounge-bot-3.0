import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import Repository from "../../api/loungeApi";
import SlashCommand from "../../models/SlashCommand";
import SqlResponse from "../../responseModels/SqlResponse";
import setUserNicknameUseCase from "../../useCases/user/setUserNicknameUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('nickname')
        .setDescription('Changes your nickname in the server')
        .addStringOption(option =>
            option.setName('newname')
                .setDescription('Your new nickname')
                .setRequired(true)
        ),
    (interaction: CommandInteraction) => {
        if (interaction.member !== null) {
            var nickname = interaction.options.get('newname', true)
            if (nickname === undefined) return
            setUserNicknameUseCase(interaction.member.user.id, nickname.toString(), Repository).then((response: SqlResponse) => {
                var guildMember = interaction.member as GuildMember
                guildMember.setNickname(nickname?.toString()).then((guildMember: GuildMember) => {
                    interaction.reply({content: `Your nickname has been changed to ${nickname}!`, ephemeral: true})
                }).catch((error: any) => {
                    interaction.reply({content: `There was an error changing your nickname:\n\n ${error}`, ephemeral: true})
                })
            })
        }
    }
)

export default command