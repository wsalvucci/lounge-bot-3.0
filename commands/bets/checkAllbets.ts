import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js"
import { DateTime } from "luxon"
import betsApi from "../../api/bets/betsApi"
import SlashCommand from "../../models/SlashCommand"
import getBetOptionUseCase from "../../useCases/bets/getBetOptionUseCase"
import getBetUseCase from "../../useCases/bets/getBetUseCase"
import getUserBetsOptionUseCase from "../../useCases/bets/getUserBetsOptionUseCase"

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('checkallbets')
        .setDescription('Returns the details of all bets you have placed that are active'),
    async (interaction: CommandInteraction) => {
        var member = interaction.member as GuildMember

        var userBets = await getUserBetsOptionUseCase(member.id, betsApi)
        var now = DateTime.now().toSeconds()

        var betDetailsEmbed = new MessageEmbed()
            .setTitle(`Your active bets`)

        for (var i = 0; i < userBets.length; i++) {
            var betDetails = await getBetUseCase(userBets[i].betId, betsApi)
            if (betDetails.closingTimestamp > now) {
                var betOptionDetails = await getBetOptionUseCase(userBets[i].betSelection, betsApi)
                betDetailsEmbed.addField(
                    `${userBets[i].betId} - ${betDetails.betName}`,
                    `${userBets[i].betSelection}: ${betOptionDetails.optionName} (${betOptionDetails.optionLine}) : ${userBets[i].betAmount} coins`
                )
            }
        }

        interaction.reply({ephemeral: true, embeds: [betDetailsEmbed]})
    }
)

export default command