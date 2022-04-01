import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import buttonApi from "../../api/button/buttonApi";
import client from "../../bot";
import UserButton from "../../models/button/UserButton";
import SlashCommand from "../../models/SlashCommand";
import getAllButtonsUseCase from "../../useCases/button/getAllButtonsUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Checks the leaderboard')
    ,
    async (interaction: CommandInteraction) => {
        var scores = await getAllButtonsUseCase(buttonApi)

        var leaderboard = new MessageEmbed()
            .setTitle(`Fools Button Leaderboard`)
        
        scores
        .sort((a: UserButton, b: UserButton) => {
            return b.score - a.score
        })
        .forEach((button: UserButton) => {
            var username : string | undefined = client.users.cache.get(button.userId)?.username
            if (username == undefined) username = button.userId
            leaderboard.addField(username, button.score.toString())
        });

        interaction.reply({embeds: [leaderboard]})
    }
)

export default command