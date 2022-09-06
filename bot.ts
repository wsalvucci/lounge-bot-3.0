require('dotenv').config()

import { Client, Guild, GuildMember, Intents, Interaction, Message, PartialGuildMember } from 'discord.js'
import CommandModule from './models/CommandModule'
import SlashCommand from './models/SlashCommand'
import { REST } from '@discordjs/rest'
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES]})

// Load APIs
require('./api/userRoutes')
require('./api/gulag/gulagRoutes')
require('./api/bot/botRoutes')
require('./api/bets/betsRoutes')
require('./api/stocks/stockRoutes')

client.once('ready', () => {
    console.log('Ready!')
})

import userCommands from './commands/user'
import gulagCommands from './commands/gulag'
import betsCommands from './commands/bets'
import stocksCommands from './commands/stocks'
import shopCommands from './commands/shop'
import houseCommands from './commands/house'
import { Routes } from 'discord-api-types/v9'
import { startPersonalityController, startTimedResultsController, startTrialController, startVoiceScoreController, startMessageScoreController, startLevelUpController, startActiveRoleController, startBirthdayController, startRecurringQuestController } from './chron'
import { updateUserValue } from './domain/databaseRequests'

var commandModules = [
    userCommands,
    gulagCommands,
    betsCommands,
    stocksCommands,
    shopCommands,
    houseCommands
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
                    Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
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

client.on('guildMemberUpdate', (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) => {
    if (oldMember.nickname !== newMember.nickname) {
        if (newMember.nickname != null) {
            updateUserValue(newMember.id, 'nickname', newMember.nickname)
        } else {
            updateUserValue(newMember.id, 'nickname', newMember.user.username)
        }
    }
})

client.login(process.env.BOT_TOKEN).then((value: string) => {
    // Load Chron Tasks
    client.guilds.cache.forEach((guild: Guild) => {
        startPersonalityController(guild.id)
        startTimedResultsController(guild.id)
        startVoiceScoreController(guild.id)
        startMessageScoreController(guild.id)
        startLevelUpController(guild.id)
        startActiveRoleController(guild.id)
        startBirthdayController(guild.id)
        startRecurringQuestController(guild.id)
    })
    startTrialController()
})

export default client