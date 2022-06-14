import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import SlashCommand from "../../models/SlashCommand";
import { createUserUseCase } from "../../useCases/user/createUserUseCase";
import { DateTime } from 'luxon'
import Repository from '../../api/loungeApi'
import SqlResponse from "../../responseModels/SqlResponse";

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('createaccount')
        .setDescription('Creates an account for The Lounge if you do not have one'),
    (interaction: CommandInteraction) => {
        if (interaction.member == null) return
        createUserUseCase(
            interaction.member.user.id,
            interaction.member.user.username,
            Math.floor(DateTime.now().toSeconds()),
            1,
            Repository
        ).then((response: SqlResponse) => {
            if (response.errno !== undefined) {
                if (response.errno === 1062) {
                    interaction.reply({content: 'There is already an account with your ID', ephemeral: true})
                } else {
                    interaction.reply({content: `There was an error creating your account:\n${response.sqlMessage}\n${response.sql}`, ephemeral: true})
                }
            } else {
                interaction.reply({content: `Your account has been created!`, ephemeral: true})
            }
        })
    }
)

export default command