import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { DateTime } from "luxon";
import betsApi from "../../api/bets/betsApi";
import BetOption from "../../models/bets/BetOption";
import SlashCommand from "../../models/SlashCommand";
import getBetOptionsUseCase from "../../useCases/bets/getBetOptionsUseCase";
import getBetUseCase from "../../useCases/bets/getBetUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('getbet')
        .setDescription('Returns details for a single bet')
        .addIntegerOption(option =>
            option.setName('betid')
                .setDescription('The ID of the bet you want details for')
                .setRequired(true)),
    async (interaction: CommandInteraction) => {
        var betId = interaction.options.getInteger('betid', true)
        var betDetails = await getBetUseCase(betId, betsApi)
        var betOptions = await getBetOptionsUseCase(betId, betsApi)

        var betDetailEmbed = new MessageEmbed()
            .setTitle(betDetails.betName)
            
        var status = "Open"
        var now = DateTime.now().toSeconds()
        if (now > betDetails.closingTimestamp) {
            status = "Running"
        }
        if (now > betDetails.hiddenTimestamp) {
            status = "Finished"
        }
        if (betDetails.concluded == 1) {
            status = "Concluded"
        }

        betDetailEmbed.addField(
            'Open',
            `<t:${betDetails.openingTimestamp}>`
        )
        betDetailEmbed.addField(
            'Close',
            `<t:${betDetails.closingTimestamp}>`
        )

        betDetailEmbed.addField(
            `Status`,
            status
        )
        
        betOptions.forEach((option: BetOption) => {
            betDetailEmbed.addField(
                `${option.betOptionId} - ${option.optionName}`,
                option.optionLine.toString() 
            )
        });

        interaction.reply({ephemeral: true, embeds: [betDetailEmbed]})
    }
)

export default command