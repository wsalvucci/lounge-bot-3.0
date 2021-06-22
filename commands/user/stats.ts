import SlashCommand from "../../models/SlashCommand"
import { CommandInteraction } from 'discord.js'

const command = new SlashCommand(
    {
        name: "stats",
        description: "Shows you your Lounge stats"
    },
    (interaction: CommandInteraction) => {
        interaction.reply('Pong!')
            .catch((err: any) => {
                console.error(err)
            })
    }
)

export default command