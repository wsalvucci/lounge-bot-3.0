import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import loungeApi from "../../api/loungeApi";
import SlashCommand from "../../models/SlashCommand";
import checkIfUserExistsUseCase from "../../useCases/user/checkIfUserExistsUseCase";
import getUserStatsUseCase from "../../useCases/user/getUserStatsUseCase";
import incrementUserStatUseCase from "../../useCases/user/incrementUserStatUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder(),
    async (interaction: CommandInteraction) => {
        
        var member = interaction.member as GuildMember
        var userExists = await checkIfUserExistsUseCase(member.id, loungeApi)

        if (!userExists) {
            interaction.reply({content: 'You give coins without an account', ephemeral: true})
            return
        }

        var target = interaction.options.getUser('target', true)

        var targetExists = await checkIfUserExistsUseCase(target.id, loungeApi)

        if (!targetExists) {
            interaction.reply({content: 'You can\'t give coins to someone that doesn\'t have an account', ephemeral: true})
            return
        }

        var amount = interaction.options.getInteger('amount', true)
        var userData = await getUserStatsUseCase(member.id, loungeApi)

        if (amount <= 0) {
            interaction.reply({content: `No.`, ephemeral: true})
            return
        }
        if (amount > userData.coins) {
            interaction.reply({content: `You tried to give ${amount}, but you only have ${userData.coins}`, ephemeral: true})
            return
        }

        await incrementUserStatUseCase(member.id, 'coins', -amount, loungeApi)
        await incrementUserStatUseCase(target.id, 'coins', amount, loungeApi)
        interaction.reply({content: `<@${member.id}> gave <@${target.id}> ${amount} lounge coins.`})
    }
)

export default command