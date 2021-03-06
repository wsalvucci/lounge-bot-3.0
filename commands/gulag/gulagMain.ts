import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import SlashCommand from "../../models/SlashCommand";
import accuse from './accuse'
import vote from './vote'
import bribe from './bribe'
import removeBribe from './removeBribe'
import checkBribe from './checkBribe'
import mine from './mine'
import checkGulag from './checkGulag'
import slap from './slap'
import addslapresponse from './addSlapResponse'

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('gulag')
        .setDescription('Contains commands related to gulag features')
        .addSubcommand(subcommand =>
            subcommand.setName('checkgulag')
                .setDescription('Displays a list of active gulag members')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Get the status of a paticular user only')
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('mine')
                .setDescription('Toil away in the gulag and reduce your time by a set amount')
                .addStringOption(option =>
                    option.setName('power')
                        .setDescription('How risky of a swing to you want to make?')
                        .setRequired(true)
                        .addChoice('Normal (no risk)', 'normal')
                        .addChoice('Aggressive (moderate risk)', 'aggressive')
                        .addChoice('Radical (high risk)', 'radical')
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('slap')
                .setDescription('The infamous slap command. Hit a user for a 1% chance of gulaging them.')
                .addUserOption(option =>
                    option.setName('target')
                        .setDescription('The user you want to slap')
                        .setRequired(true)
                )
                .addBooleanOption(option =>
                    option.setName('public')
                        .setDescription('Displays the % of your slap publically')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('addslapresponse')
                .setDescription('Add a custom response for the bot and rarity of your chosing.')
                .addIntegerOption(option => 
                    option.setName('personality')
                        .setDescription('The bot personality you want to add a slap line to')
                        .setRequired(true)
                        .addChoices([
                            ["Viktor", 1],
                            ["Edna", 2],
                        ])
                )
                .addIntegerOption(option => 
                    option.setName('rarity')
                        .setDescription('What type of response')
                        .setRequired(true)
                        .addChoices([
                            ["Legendary Bad, 1%, Attacker is Gulaged", 1],
                            ["Epic Bad, 4%", 2],
                            ["Rare Bad, 10%", 3],
                            ["Uncommon Bad, 10%", 4],
                            ["Common, 50%", 5],
                            ["Uncommon Good, 10%", 6],
                            ["Rare Good, 10%", 7],
                            ["Epic Good, 4%", 8],
                            ["Legendary Good, 1%, Victim is Gulaged", 9]
                        ])
                )
                .addStringOption(option =>
                    option.setName('response')
                        .setDescription('The response. {a} - attacker name. {v} - victim name. {au} or {vu} - name all caps.')
                        .setRequired(true)
                )
        )
        ,
    async (interaction: CommandInteraction) => {
        switch(interaction.options.getSubcommand(true)) {
            case 'checkgulag': checkGulag.method(interaction); break
            case 'mine': mine.method(interaction); break
            case 'slap': slap.method(interaction); break
            case 'addslapresponse': addslapresponse.method(interaction); break
        }
    }
)

export default command