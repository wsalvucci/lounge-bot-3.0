import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, TextChannel } from "discord.js";
import { DateTime } from "luxon";
import betsApi from "../../api/bets/betsApi";
import { getBetOption } from "../../api/bets/betsRequests";
import botApi from "../../api/bot/botApi";
import loungeApi from "../../api/loungeApi";
import client from "../../bot";
import { StatType } from "../../domain/loungeFunctions";
import SlashCommand from "../../models/SlashCommand";
import concludeBetUseCase from "../../useCases/bets/concludeBetUseCase";
import getAllUserBetsForBetUseCase from "../../useCases/bets/getAllUserBetsForBetUseCase";
import getBetOptionUseCase from "../../useCases/bets/getBetOptionUseCase";
import getBetUseCase from "../../useCases/bets/getBetUseCase";
import getGuildConfigUseCase from "../../useCases/bot/getGuildConfigUseCase";
import incrementUserStatUseCase from "../../useCases/user/incrementUserStatUseCase";

function betToReward(betAmount: number, line: number) {
    if (line < 0) {
        return (betAmount / -line) * 100
    } else {
        return (betAmount / 100) * line
    }
}

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('concludebet')
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
        ),
    async (interaction: CommandInteraction) => {
        var member = interaction.member as GuildMember
        if (member.id !== '194232193025966080') {
            interaction.reply({content: `You do not have permission to conclude bets`, ephemeral: true})
            return
        }

        var betId = interaction.options.getInteger('betid', true)

        var betDetails = await getBetUseCase(betId, betsApi)

        if (betDetails.betId == -1) {
            interaction.reply({content: `There is no bet with this ID`, ephemeral: true})
            return
        }
        if (betDetails.closingTimestamp > DateTime.now().toSeconds()) {
            interaction.reply({content: `This bet has not reached its closing timestamp <t:${betDetails.closingTimestamp}>. Either wait for the closing timestamp or edit it.`, ephemeral: true})
            return
        }
        if (betDetails.concluded == 1) {
            interaction.reply({content: `This bet has already been concluded`, ephemeral: true})
            return
        }

        var winningOption = interaction.options.getInteger('winningoption', true)
        var winningOptionDetails = await getBetOptionUseCase(winningOption, betsApi)
        var allUserBets = await getAllUserBetsForBetUseCase(betId, betsApi)

        for(var i = 0; i < allUserBets.length; i++) {
            var userBet = allUserBets[i]
            if (userBet.betSelection == winningOption) {
                var optionDetails = await getBetOptionUseCase(userBet.betSelection, betsApi)
                var userReward = betToReward(userBet.betAmount, optionDetails.optionLine)
                console.log(`User Reward: ${userReward}`)
                await incrementUserStatUseCase(userBet.userId, StatType.Coins, userReward, loungeApi)
            }
        }

        await concludeBetUseCase(betId, betsApi)
        interaction.reply({content: `Bet ID ${betId} concluded`, ephemeral: true})
        
        if (interaction.guildId == null) {
            console.error('Tried to conlcude bet of server bot does not have access to')
            return
        }
        var guildConfig = await getGuildConfigUseCase(interaction.guildId, botApi)
        var resultChannel = client.channels.cache.get(guildConfig.announcementsChannel) as TextChannel
        if (resultChannel == undefined) return

        resultChannel.send(`The event \`${betDetails.betName}\` has ended and the winning option was \`${winningOptionDetails.betOptionId} : ${winningOptionDetails.optionName} (${winningOptionDetails.optionLine})\``)
    }
)

export default command