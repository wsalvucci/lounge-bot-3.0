import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import SlashCommand from "../../models/SlashCommand";
import activeBets from './activeBets'
import getBet from './getBet'
import placeBet from './placeBet'
import checkBet from './checkBet'
import checkAllBets from './checkAllbets'
import deleteBet from './deleteBet'
import createBet from './createBet'
import createBetOption from './createBetOption'
import concludeBet from './concludeBet'

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('bets')
        .setDescription('Contains commands related to betting')
        .addSubcommand(subcommand =>
            subcommand.setName('checkbet')
            .setDescription('Returns the details of a bet you placed for a given bet ID')
            .addIntegerOption(option =>
                option.setName('betid')
                    .setDescription('The ID of the bet you want to check your wager')
                    .setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('activebets')
                .setDescription('Returns all bets that are active')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('checkallbets')
                .setDescription('Returns the details of all bets you have placed that are active')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('deletebet')
                .setDescription('Deletes your bet for the given Bet ID')
                .addIntegerOption(option =>
                    option.setName('betid')
                        .setDescription('The ID of the bet you want to remove your wager from')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('getbet')
                .setDescription('Returns details for a single bet')
                .addIntegerOption(option =>
                    option.setName('betid')
                        .setDescription('The ID of the bet you want details for')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('placebet')
                .setDescription('Places a bet for the given optionId and amount')
                .addIntegerOption(option => 
                    option.setName('betoptionid')
                        .setDescription('The ID of the bet option (not the id of the bet event)')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('The amount you want to bet')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('createbet')
                .setDescription('Creates a new bet if you have permission')
                .addStringOption(option =>
                    option.setName('betname')
                        .setDescription('The name of the bet')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('betdescription')
                        .setDescription('The description of the bet event')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('openingtimestamp')
                        .setDescription('When the bet will become available for users to bet on')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('closingtimestamp')
                        .setDescription('When the bet will close down for new/modified bets')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('hiddentimestamp')
                        .setDescription('When the bet will no longer be listed in the active bets')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('createbetoption')
                .setDescription('Creates a bet option for the given bet ID')
                .addIntegerOption(option =>
                    option.setName('betid')
                        .setDescription('The bet ID you want to add this option to')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('optionname')
                        .setDescription('The name of the bet option')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('optiondescription')
                        .setDescription('The description of the bet option')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('betline')
                        .setDescription('The betting line of the option')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('concludebet')
                .setDescription('Concludes a bet and pays out the winners')
                .addIntegerOption(option =>
                    option.setName('betid')
                        .setDescription('The ID of the bet you want to conclude')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('winningoption')
                        .setDescription('The winning option that will be paid out from the bet. Set to -1 for no winner.')
                        .setRequired(true)
                )
        ),
    async (interaction: CommandInteraction) => {
        switch(interaction.options.getSubcommand(true)) {
            case 'checkbet': checkBet.method(interaction); break
            case 'activebets': activeBets.method(interaction); break
            case 'checkallbets': checkAllBets.method(interaction); break
            case 'deletebet': deleteBet.method(interaction); break
            case 'getbet': getBet.method(interaction); break
            case 'placebet': placeBet.method(interaction); break
            case 'createbet': createBet.method(interaction); break
            case 'createbetoption': createBetOption.method(interaction); break
            case 'concludebet': concludeBet.method(interaction); break
        }
    }
)

export default command