import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { DateTime } from "luxon";
import loungeApi from "../../api/loungeApi";
import SlashCommand from "../../models/SlashCommand";
import getUserPointsUseCase from "../../useCases/house/getUserPointsUseCase";
import checkIfUserExistsUseCase from "../../useCases/user/checkIfUserExistsUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder(),
    async (interaction: CommandInteraction) => {
        var member = interaction.member as GuildMember
        var userExists = await checkIfUserExistsUseCase(member.id, loungeApi)
        if (!userExists) {
            interaction.reply({content: 'You have to have an account to do that.', ephemeral: true})
            return
        }
        var currentTime = DateTime.now()
        var dailyPoints = await getUserPointsUseCase(member.id, currentTime.startOf('day').toSeconds(), currentTime.toSeconds(), loungeApi)
        var weeklyPoints = await getUserPointsUseCase(member.id, currentTime.startOf('week').toSeconds(), currentTime.toSeconds(), loungeApi)
        var monthlyPoints = await getUserPointsUseCase(member.id, currentTime.startOf('month').toSeconds(), currentTime.toSeconds(), loungeApi)
        var annualPoints = await getUserPointsUseCase(member.id, currentTime.startOf('year').toSeconds(), currentTime.toSeconds(), loungeApi)
        var allPoints = await getUserPointsUseCase(member.id, 0, currentTime.toSeconds(), loungeApi)

        
    }
)

export default command