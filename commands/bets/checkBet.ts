import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { DateTime } from "luxon";
import betsApi from "../../api/bets/betsApi";
import loungeApi from "../../api/loungeApi";
import SlashCommand from "../../models/SlashCommand";
import getBetOptionUseCase from "../../useCases/bets/getBetOptionUseCase";
import getBetUseCase from "../../useCases/bets/getBetUseCase";
import getUserBetOptionUseCase from "../../useCases/bets/getUserBetOptionUseCase";
import checkIfUserExistsUseCase from "../../useCases/user/checkIfUserExistsUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('checkbet')
        .setDescription('Returns the details of a bet you placed for a given bet ID')
        .addIntegerOption(option =>
            option.setName('betid')
                .setDescription('The ID of the bet you want to check your wager')
                .setRequired(true)
        ),
    async (interaction: CommandInteraction) => {
        var member = interaction.member as GuildMember
        var userExists = await checkIfUserExistsUseCase(member.id, loungeApi)
        if (!userExists) {
            interaction.reply({content: `You need an account to place and check bets`, ephemeral: true})
            return
        }
        
        var betId = interaction.options.getInteger('betid', true)
        var betDetails = await getBetUseCase(betId, betsApi)
        var userBetDetails = await getUserBetOptionUseCase(member.id, betId, betsApi)
        var betOptionDetails = await getBetOptionUseCase(userBetDetails.betSelection, betsApi)

        if (betDetails.betId == -1) {
            interaction.reply({content: `There is no bet with that ID`, ephemeral: true})
            return
        }
        if (userBetDetails.betId == -1) {
            interaction.reply({content: `You do not have any bets for that ID`, ephemeral: true})
            return
        }

        var betStatus = ""
        var now = DateTime.now().toSeconds()

        if (now < betDetails.closingTimestamp) {
            betStatus = "Active"
        } else {
            betStatus = "Ended"
        }


        var betDetailEmbed = new MessageEmbed()
            .setTitle(`Your bet for ${betDetails.betName}`)
            .addField(
                `Your selection`,
                `${betOptionDetails.optionName} : ${betOptionDetails.optionLine}`
            )
            .addField(
                `Your wager`,
                `${userBetDetails.betAmount}`
            )
            .addField(
                `Bet Status`,
                `${betStatus}`
            )
        
        interaction.reply({ephemeral: true, embeds: [betDetailEmbed]})
    }
)

export default command