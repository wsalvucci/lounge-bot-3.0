import SlashCommand from "../../models/SlashCommand"
import { APIMessage, CommandInteraction, MessageAttachment, MessageEmbed, User } from 'discord.js'
import getUserStatsUseCase from "../../useCases/getUserStatsUseCase"
import Repository from "../../api/Repository"
import LoungeUserStats from "../../models/LoungeUserStats"
import ErrorMessage from "../../models/ErrorMessage"
import Canvas from "canvas"

async function getCanvas(stats: LoungeUserStats) : Promise<Buffer> {
    const canvas = Canvas.createCanvas(1000, 365)
    const ctx = canvas.getContext('2d')

    const attachment = new MessageAttachment(canvas.toBuffer(), `${stats.name}-stats.jpg`)

    return canvas.toBuffer()
}

const command = new SlashCommand(
    {
        name: "stats",
        description: "Shows you your Lounge stats"
    },
    (interaction: CommandInteraction) => {
        if (interaction.member !== null) {
            getUserStatsUseCase(interaction.member.user.id, Repository)
                .then((response: LoungeUserStats | ErrorMessage) => {
                    if (response instanceof LoungeUserStats) {
                        getCanvas(response)
                            .then((attachment: Buffer) => {
                                //interaction.channel.send({files: attachment, split: false})
                            })
                    } else if (response instanceof ErrorMessage) {
                        interaction.reply({content: `There was an error: ${response.message}`, ephemeral: true})
                    }
                })
        }
        interaction.reply('Pong!')
            .catch((err: any) => {
                console.error(err)
            })
    }
)

export default command