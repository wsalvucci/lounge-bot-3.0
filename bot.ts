require('dotenv').config()

import { ApplicationCommandData, Client, CommandInteraction, Intents, Interaction, Message } from 'discord.js'
import CommandModule from './models/CommandModule'
import SlashCommand from './models/SlashCommand'
const Discord = require('discord.js')
const client : Client = new Discord.Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES]})
require('./api/userRoutes')

client.once('ready', () => {
    console.log('Ready!')
})

import userCommands from './commands/user'

var commandModules = [
    userCommands
]

client.on('messageCreate', async (message : Message) => {
    if (!client.application?.owner) await client.application?.fetch()

    if (message.content.toLowerCase() === '!deploy' && message.author.id == client.application?.owner?.id) {
        const data : ApplicationCommandData[] = []

        commandModules.forEach((cModule: CommandModule) => {
            cModule.commands.forEach((command: SlashCommand) => {
                data.push(command.details)
            })
        })

        //const commands = await client.application.commands.set(data)
        const commands = await client.guilds.cache.get('695403120758489181')?.commands.set(data)
        console.log(commands)
    }
})

client.on('interactionCreate', (interaction : Interaction) => {
    if (!interaction.isCommand()) return

    commandModules.forEach((cModule: CommandModule) => {
        cModule.commands.forEach((command: SlashCommand) => {
            if (interaction.commandName === command.details.name) {
                command.method(interaction)
            }
        })
    })
})


client.login(process.env.BOT_TOKEN)

export default client
