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

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('gulag')
        .setDescription('Contains commands related gulag features')
        .addSubcommand(subcommand =>
            subcommand.setName('accuse')
                .setDescription('Accuse someone of something to send them to the gulag')
                .addUserOption(option => 
                    option.setName('target')
                        .setDescription('The user you want to accuse')
                        .setRequired(true)
                )
                .addStringOption(option => 
                    option.setName('accusation')
                        .setDescription('What you\'re accusing the target of')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('bribe')
                .setDescription('Bribe the judge of a particular trial')
                .addUserOption(option => 
                    option.setName('user')
                        .setDescription('The user whos trial you are bribing (the one being accused)')
                        .setRequired(true)
                )
                .addIntegerOption(option => 
                    option.setName('amount')
                        .setDescription('The amount of coins you want to bribe the judge with')
                        .setRequired(true)
                )
                .addStringOption(option => 
                    option.setName('vote')
                        .setDescription('What direction you want the bribe to swing the vote')
                        .setRequired(true)
                        .addChoice('Yea', 'yea')
                        .addChoice('Nea', 'nea')
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('checkbribe')
                .setDescription('Checks your current bribe for the given trial')
                .addUserOption(option => 
                    option.setName('user')
                        .setDescription('The user whos trial you are checking your bribe from (the one being accused)')
                        .setRequired(true)
                )
        )
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
            subcommand.setName('removebribe')
                .setDescription('Removes your bribe from the given trial')
                .addUserOption(option => 
                    option.setName('user')
                        .setDescription('The user whos trial you are removing your bribe from (the one being accused)')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('vote')
                .setDescription('Vote in a trial')
                .addUserOption(option => 
                    option.setName('user')
                        .setDescription('The user whos trial you are voting in (the one being accused)')
                        .setRequired(true)
                )
                .addStringOption(option => 
                    option.setName('vote')
                        .setDescription('Your vote')
                        .setRequired(true)
                        .addChoice('Yea', 'yea')
                        .addChoice('Nea', 'nea')
                        .addChoice('Abstain', 'abstain')
                )
        ),
    async (interaction: CommandInteraction) => {
        switch(interaction.options.getSubcommand(true)) {
            case 'accuse': accuse.method(interaction); break
            case 'bribe': bribe.method(interaction); break
            case 'checkbribe': checkBribe.method(interaction); break
            case 'checkgulag': checkGulag.method(interaction); break
            case 'mine': mine.method(interaction); break
            case 'removebribe': removeBribe.method(interaction); break
            case 'vote': vote.method(interaction); break
        }
    }
)