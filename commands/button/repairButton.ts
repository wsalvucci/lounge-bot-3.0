import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { DateTime } from "luxon";
import buttonApi from "../../api/button/buttonApi";
import SlashCommand from "../../models/SlashCommand";
import breakButtonUseCase from "../../useCases/button/breakButtonUseCase";
import getButtonUseCase from "../../useCases/button/getButtonUseCase";
import getRoundUseCase from "../../useCases/button/getRoundUseCase";
import repairButtonUseCase from "../../useCases/button/repairButtonUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('repairbutton')
        .setDescription('Repairs someone\'s button')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The button you want to repair')
                .setRequired(true)
        ),
    async (interaction: CommandInteraction) => {
        if (interaction.guildId == null) return

        var user = interaction.member as GuildMember
        var target = interaction.options.getUser('target', true)

        if (target.bot) {
            interaction.reply({content: 'Bots are immune', ephemeral: true})
            return
        }

        var userButtonDetails = await getButtonUseCase(user.id, buttonApi)
        var targetButtonDetails = await getButtonUseCase(target.id, buttonApi)
        if (targetButtonDetails.buttonBroken !== 1) {
            interaction.reply({content: `That button is not broken`, ephemeral: true})
            return
        }
        if (userButtonDetails.actionTaken == 0 || userButtonDetails.userId == "") {
            var roundDetails = await getRoundUseCase(interaction.guildId, buttonApi)
            var currentTime = DateTime.now().toSeconds()
            await repairButtonUseCase(user.id, currentTime, target.id, currentTime - roundDetails.roundStart, roundDetails.roundEnd - currentTime, buttonApi)
            if (user.id == target.id) {
                interaction.channel?.send({content: `<@${user.id}> has repaired their own button`})
            } else {
                interaction.channel?.send({content: `<@${user.id}> has repaired <@${target.id}>'s button`})
            }
            interaction.reply({content: `Task failed successfully`, ephemeral: true})
        } else {
            interaction.reply({content: `You have already used your action for this round.`, ephemeral: true})
        }
    }
)

export default command