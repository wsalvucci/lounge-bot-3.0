import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import SlashCommand from "../../models/SlashCommand";
import xpboost from './boost'
import role from './role'
import givecoins from './giveCoins'

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Contains commands related to the shop')
        .addSubcommand(subcommand =>
            subcommand.setName('boost')
                .setDescription('Increase the xp/coin multiplier for today (will be reset at 3am UTC)')
                .addIntegerOption(option => 
                    option.setName('amount')
                        .setDescription('1 coin = 0.001% : 1,000 coins = 1%')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('role')
                .setDescription('Enables special controls for your account for 24hrs. Extends the time if already bought.')
                .addRoleOption(option =>
                    option.setName('rolename')
                        .setDescription('The role you wish to buy')
                        .setRequired(true)
                        
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('givecoins')
                .setDescription('Give some of your coins to another user')
                .addUserOption(option =>
                    option.setName('target')
                        .setDescription('The user you want to give coins to')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('The amount of coins you want to give.')
                        .setRequired(true)
                )
        ),
    async (interaction: CommandInteraction) => {
        switch(interaction.options.getSubcommand(true)) {
            case 'boost': xpboost.method(interaction); break
            case 'role': role.method(interaction); break
            case 'givecoins': givecoins.method(interaction); break
        }
    }
)

export default command