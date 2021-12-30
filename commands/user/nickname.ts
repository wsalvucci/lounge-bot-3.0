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
            if (nickname.value === undefined) return
            setUserNicknameUseCase(interaction.member.user.id, nickname.value.toString(), Repository).then((response: SqlResponse) => {
                var guildMember = interaction.member as GuildMember
                if (nickname.value == undefined) return
                guildMember.setNickname(nickname.value.toString()).then((guildMember: GuildMember) => {
                    interaction.reply({content: `Your nickname has been changed to ${nickname.value}!`, ephemeral: true})
                }).catch((error: any) => {
                    interaction.reply({content: `There was an error changing your nickname:\n\n ${error}`, ephemeral: true})
                })
            })
        }
    }
)

export default command