import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { DateTime } from "luxon";
import SlashCommand from "../../models/SlashCommand";
import getBetOptionUseCase from "../../useCases/bets/getBetOptionUseCase";
import getBetUseCase from "../../useCases/bets/getBetUseCase";
import placeBetUseCase from "../../useCases/bets/placeBetUseCase";
import betsApi from "../../api/bets/betsApi";
import getUserStatsUseCase from "../../useCases/user/getUserStatsUseCase";
import loungeApi from "../../api/loungeApi";
import incrementUserStatUseCase from "../../useCases/user/incrementUserStatUseCase";
import { StatType } from "../../domain/loungeFunctions";
import getUserBetOptionUseCase from "../../useCases/bets/getUserBetOptionUseCase";
import checkIfUserExistsUseCase from "../../useCases/user/checkIfUserExistsUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('placebet')
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
        ),
    async (interaction: CommandInteraction) => {
        var member = interaction.member as GuildMember
        var betOptionId = interaction.options.getInteger('betoptionid', true)
        var betAmount = interaction.options.getInteger('amount', true)

        var memberExists = await checkIfUserExistsUseCase(member.id, loungeApi)
        if (!memberExists) {
            interaction.reply({content: 'You need an account to place bets', ephemeral: true})
            return
        }

        var betOptionData = await getBetOptionUseCase(betOptionId, betsApi)
        if (betOptionData.betId === undefined) {
            interaction.reply({content: 'That bet option id doesn\'t exist', ephemeral: true})
            return
        }
        var betData = await getBetUseCase(betOptionData.betId, betsApi)

        var now = DateTime.now().toSeconds()
        if (betData.openingTimestamp > now) {
            interaction.reply({content: 'This bet has not opened up for betting yet.', ephemeral: true})
            return
        }
        if (betData.closingTimestamp < now) {
            interaction.reply({content: 'This bet has passed its closing time.', ephemeral: true})
            return
        }

        var userData = await getUserStatsUseCase(member.id, loungeApi)
        var existingBet = await getUserBetOptionUseCase(member.id, betOptionData.betId, betsApi)
        var userExpense = betAmount
        if (existingBet.betId !== -1) {
            var userExpense = betAmount - existingBet.betAmount
        }
        if (userData.coins < userExpense) {
            interaction.reply({content: `You don't have enough lounge coins to place that bet. You offered ${betAmount.withCommas()} but only have ${userData.coins.withCommas()}`, ephemeral: true})
            return
        }
        await incrementUserStatUseCase(member.id, StatType.Coins, -userExpense, loungeApi)

        await placeBetUseCase(member.id, betOptionData.betId, betOptionData.betOptionId, betAmount, betsApi)

        interaction.reply({content: `Your bet of \`${betAmount}\` for bet option ID \`${betOptionData.betOptionId} - ${betOptionData.optionName} (${betOptionData.optionLine})\` in the event \`${betData.betName}\` has been placed!`})
    }
)

export default command