import { CommandInteraction, GuildMember } from "discord.js";
import Repository from "../../api/loungeApi";
import SlashCommand from "../../models/SlashCommand";
import SqlResponse from "../../responseModels/SqlResponse";
import setUserNicknameUseCase from "../../useCases/user/setUserNicknameUseCase";

const command = new SlashCommand(
    {
        name: "nickname",
        description: "Changes your nickname in the server",
        options: [{
            name: 'newname',
            type: 'STRING',
            description: 'Your new nickname',
            required: true
        }]
    },
    (interaction: CommandInteraction) => {
        if (interaction.member !== null) {
            var nickname = interaction.options.get('newname')?.value
            if (nickname === undefined) return
            setUserNicknameUseCase(interaction.member.user.id, nickname.toString(), Repository).then((response: SqlResponse) => {
                var guildMember = interaction.member
                //Wtf
                if (guildMember instanceof GuildMember && nickname !== undefined) {
                    guildMember.setNickname(nickname?.toString()).then((guildMember: GuildMember) => {
                        interaction.reply({content: `Your nickname has been changed to ${nickname}!`, ephemeral: true})
                    }).catch((error: any) => {
                        interaction.reply({content: `There was an error changing your nickname:\n\n ${error}`, ephemeral: true})
                    })
                }
            })
        }
    }
)

export default command