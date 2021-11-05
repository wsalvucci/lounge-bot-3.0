require('dotenv').config()

import { Client, Guild, Intents, Interaction, Message } from 'discord.js'
import CommandModule from './models/CommandModule'
import SlashCommand from './models/SlashCommand'
import { REST } from '@discordjs/rest'
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES]})

// Load APIs
require('./api/userRoutes')
require('./api/gulag/gulagRoutes')
require('./api/bot/botRoutes')

client.once('ready', () => {
    console.log('Ready!')
})

import userCommands from './commands/user'
import weatherCommands from './commands/weather'
import gulagCommands from './commands/gulag'
import { Routes } from 'discord-api-types/v9'
import { startPersonalityController } from './chron'

var commandModules = [
    userCommands,
    weatherCommands,
    gulagCommands
]

const token: string = process.env.BOT_TOKEN || ""

client.on('messageCreate', async (message : Message) => {
    if (!client.application?.owner) await client.application?.fetch()

    if (message.content.toLowerCase() === '!deploy' && message.author.id == client.application?.owner?.id) {
        const data: any = []

        commandModules.forEach((cModule: CommandModule) => {
            cModule.commands.forEach((command: SlashCommand) => {
                data.push(command.details.toJSON())
            })
        })

        const rest: REST = new REST({ version: '9' }).setToken(token);

        (async () => {
            try {
                console.log('Started refreshing application (/) commands.');

                await rest.put(
                    Routes.applicationGuildCommands('695402691622338601', '695403120758489181'),
                    {body: data}
                )

                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error)
            }
        })()
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

client.login(process.env.BOT_TOKEN).then((value: string) => {
    // Load Chron Tasks
    client.guilds.cache.forEach((guild: Guild) => {
        startPersonalityController(guild.id)
    })
})

export default client