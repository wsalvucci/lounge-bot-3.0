import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import SlashCommand from "../../models/SlashCommand";

import stats from './stats'
import nickname from './nickname'
import leaderboard from './leaderboard'
import color from './color'
import createAccount from './createAccount'
import personalRecords from './personalRecords'
import spec from './spec'
import respec from './respec'
import birthday from './birthday'
import sethouse from './sethouse'
import { StatType } from "../../domain/loungeFunctions";

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('user')
        .setDescription('Contains commands related to the user')
        .addSubcommand(subcommand =>
            subcommand.setName('birthday')
                .setDescription('Adds your birthday to your account if it is not already set.')
                .addIntegerOption(option =>
                    option.setName('day')
                        .setDescription('The day of your birthday')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('month')
                        .setDescription('The month of your birthday')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('year')
                        .setDescription('The year of your birth')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('color')
                .setDescription('Changes the color of your name in the server')
                .addStringOption(option =>
                    option.setName('color')
                        .setDescription('The color you want your name in the format `A1B2C3`')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('createaccount')
                .setDescription('Creates an account for The Lounge if you do not have one')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('leaderboard')
                .setDescription('Shows the leaderboard for a specific Lounge Stat')
                .addStringOption(option =>
                    option.setName('stat')
                        .setDescription('The stat to show the leaderboard for')
                        .setRequired(true)
                        .addChoice('Messages Sent', StatType.TotalMessages)
                        .addChoice('Seconds Voice', StatType.TotalVoice)
                        .addChoice('Users Slapped', StatType.UsersSlapped)
                        .addChoice('Been Slapped', StatType.BeenSlapped)
                        .addChoice('Coins', StatType.Coins)
                        .addChoice('Users Gulaged', StatType.UsersGulaged)
                        .addChoice('Been Gulaged', StatType.TimesGulaged)
                        .addChoice('Time in Gulag', StatType.TimeInGulag)
                        .addChoice('Daily Messages', StatType.DailyMessages)
                        .addChoice('Daily Voice', StatType.DailyVoice)
                        .addChoice('Weekly Messages', StatType.WeeklyMessages)
                        .addChoice('Weekly Voice', StatType.WeeklyVoice)
                        .addChoice('Monthly Messages', StatType.MonthlyMessages)
                        .addChoice('Monthly Voice', StatType.MonthlyVoice)
                        .addChoice('Luck', StatType.Luck)
        
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('nickname')
                .setDescription('Changes your nickname in the server')
                .addStringOption(option =>
                    option.setName('newname')
                        .setDescription('Your new nickname')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('personalrecords')
                .setDescription('Returns your personal records for The Lounge')
                .addBooleanOption(option =>
                    option.setName('hidden')
                        .setDescription('Whether to display your personal records to everyone.')
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('stats')
                .setDescription('Retrives Lounge stats for either you or an indicated user')
                .addUserOption(option => 
                    option.setName('user')
                        .setDescription('A specific user to get Lounge Stats for')
                )
        )
        .addSubcommand(subCommand => 
            subCommand.setName('sethouse')
                .setDescription('THIS IS IRREVERSABLE! CHOOSE WISELY!')
                .addIntegerOption(option =>
                    option.setName('house')
                        .setDescription('The house you want to permanently join.')
                        .setRequired(true)
                        .addChoices([
                            ['Nīkyura', 1],
                            ['Chillax', 2],
                            ['Crownguard', 3],
                            ['Imposter', 4]
                        ]))),
    async (interaction: CommandInteraction) => {
        switch(interaction.options.getSubcommand(true)) {
            case 'birthday': birthday.method(interaction); break
            case 'color': color.method(interaction); break
            case 'createaccount': createAccount.method(interaction); break
            case 'leaderboard': leaderboard.method(interaction); break
            case 'nickname': nickname.method(interaction); break
            case 'personalrecords': personalRecords.method(interaction); break
            case 'stats': stats.method(interaction); break
            case 'sethouse': sethouse.method(interaction); break
        }
    }
)

export default command