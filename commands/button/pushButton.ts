import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import buttonApi from "../../api/button/buttonApi";
import SlashCommand from "../../models/SlashCommand";
import getButtonUseCase from "../../useCases/button/getButtonUseCase";
import pushButtonUseCase from "../../useCases/button/pushButtonUseCase";
import { DateTime } from "luxon";
import getRoundUseCase from "../../useCases/button/getRoundUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('pushbutton')
        .setDescription('Pushes someone\'s button')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The button you want to push')
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
        if (targetButtonDetails.buttonBroken == 1) {
            interaction.reply({content: 'That button is broken', ephemeral: true})
            return
        }
        if (targetButtonDetails.timePressed !== null) {
            interaction.reply({content: 'That button has already been pushed this round', ephemeral: true})
            return
        }
        if (userButtonDetails.actionTaken == 0 || userButtonDetails.userId == "") {
            var roundDetails = await getRoundUseCase(interaction.guildId, buttonApi)
            var currentTime = DateTime.now().toSeconds()
            await pushButtonUseCase(user.id, currentTime, target.id, currentTime - roundDetails.roundStart, roundDetails.roundEnd - currentTime, buttonApi)
            if (user.id == target.id) {
                interaction.channel?.send({content: `<@${user.id}> has pushed their button`})
            } else {
                interaction.channel?.send({content: `<@${user.id}> has pushed <@${target.id}>'s button`})
            }
            interaction.reply({content: `Task failed successfully`, ephemeral: true})
        } else {
            interaction.reply({content: `You have already used your action for this round.`, ephemeral: true})
        }
    }
)

export default command