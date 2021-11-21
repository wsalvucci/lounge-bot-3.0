import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { DateTime } from "luxon";
import betsApi from "../../api/bets/betsApi";
import Bet from "../../models/bets/Bet";
import SlashCommand from "../../models/SlashCommand";
import getBetsUseCase from "../../useCases/bets/getBetsUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('activebets')
        .setDescription('Returns all bets that are active'),
    async (interaction: CommandInteraction) => {
        var activeBets = await getBetsUseCase(DateTime.now().toSeconds(), betsApi)

        const listEmbed = new MessageEmbed()
            .setTitle(`Active Bets`)

        activeBets.forEach((bet: Bet) => {
            listEmbed.addField(
                `${bet.betId} - ${bet.betName}`,
                `Closes: <t:${bet.closingTimestamp}>`
            )
        });

        interaction.reply({ephemeral: true, embeds: [listEmbed]})
    }
)

export default command