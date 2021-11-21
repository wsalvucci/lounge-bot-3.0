import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { DateTime } from "luxon";
import betsApi from "../../api/bets/betsApi";
import loungeApi from "../../api/loungeApi";
import { StatType } from "../../domain/loungeFunctions";
import SlashCommand from "../../models/SlashCommand";
import deleteUserBetUseCase from "../../useCases/bets/deleteUserBetUseCase";
import getBetUseCase from "../../useCases/bets/getBetUseCase";
import getUserBetOptionUseCase from "../../useCases/bets/getUserBetOptionUseCase";
import incrementUserStatUseCase from "../../useCases/user/incrementUserStatUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('deletebet')
        .setDescription('Deletes your bet for the given Bet ID')
        .addIntegerOption(option =>
            option.setName('betid')
                .setDescription('The ID of the bet you want to remove your wager from')
                .setRequired(true)
        ),
    async (interaction: CommandInteraction) => {
        var member = interaction.member as GuildMember
        var betId = interaction.options.getInteger('betid', true)
        var betDetails = await(getBetUseCase(betId, betsApi))
        var userBetDetails = await getUserBetOptionUseCase(member.id, betId, betsApi)

        if (betDetails.betId == -1 || betDetails.closingTimestamp < DateTime.now().toSeconds()) {
            interaction.reply({content: `There are no active bets with that ID`, ephemeral: true})
            return
        }
        if (userBetDetails.betId == -1) {
            interaction.reply({content: `You do not have any bets for that event`, ephemeral: true})
            return
        }

        await deleteUserBetUseCase(member.id, betId, betsApi)
        await incrementUserStatUseCase(member.id, StatType.Coins, userBetDetails.betAmount, loungeApi)
        interaction.reply({content: `Your bet for ${betDetails.betName} has been deleted`, ephemeral: true})
    }
)

export default command