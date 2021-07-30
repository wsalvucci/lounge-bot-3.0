import SlashCommand from "../../models/SlashCommand"
import { CommandInteraction, MessageAttachment, MessageEmbed, User } from 'discord.js'
import Repository from "../../api/loungeApi"
import ErrorMessage from "../../models/ErrorMessage"
import Canvas from "../../domain/loungeCanvas"
import UserStats from "../../models/UserStats"
import getUserStatsUseCase from "../../useCases/user/getUserStatsUseCase"

async function getCanvas(stats: UserStats) : Promise<Buffer> {
    const canvas = Canvas.createCanvas(1000, 365)
    const ctx = canvas.getContext('2d')

    var grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    grd.addColorStop(0, '#08172A')
    grd.addColorStop(0.66, '#359ED5')
    grd.addColorStop(1, '#08172A')

    ctx.fillStyle = grd
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#ffffff'
    ctx.font = '48px Boldsand'
    ctx.fillText(stats.nickanme, 50, 50)
    ctx.fillText(stats.titleString, 50, 100)

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
                .then((response: UserStats | ErrorMessage) => {
                    if (response instanceof UserStats) {
                        getCanvas(response)
                            .then((attachment: Buffer) => {
                                interaction.reply({files: [{ attachment: attachment }]})
                            })
                    } else if (response instanceof ErrorMessage) {
                        interaction.reply({content: `There was an error: ${response.message}`, ephemeral: true})
                    }
                })
        }
    }
)

export default command