import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { DateTime } from "luxon";
import botApi from "../../api/bot/botApi";
import loungeApi from "../../api/loungeApi";
import SlashCommand from "../../models/SlashCommand";
import addActiveUserRoleUseCase from "../../useCases/bot/addActiveUserRoleUseCase";
import getShopRoleInfoUseCase from "../../useCases/bot/getShopRoleInfoUseCase";
import checkIfUserExistsUseCase from "../../useCases/user/checkIfUserExistsUseCase";
import getUserStatsUseCase from "../../useCases/user/getUserStatsUseCase";
import incrementUserStatUseCase from "../../useCases/user/incrementUserStatUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder(),
    async (interaction: CommandInteraction) => {
        var role = interaction.options.getRole('rolename', true)
        
        var member = interaction.member as GuildMember
        var userExists = await checkIfUserExistsUseCase(member.id, loungeApi)

        if (!userExists) {
            interaction.reply({content: 'You cannot buy boosts without an account', ephemeral: true})
            return
        }

        var shopInfo = await getShopRoleInfoUseCase(role.id, botApi)

        if (shopInfo.roleId == undefined) {
            interaction.reply({content: 'That role is not listed in the shop', ephemeral: true})
            return
        }

        var userData = await getUserStatsUseCase(member.id, loungeApi)

        if (shopInfo.costPerDay > userData.coins) {
            interaction.reply({content: `This role costs ${shopInfo.costPerDay} and you only have ${userData.coins}`, ephemeral: true})
            return
        }

        var guildRole = await interaction.guild?.roles.fetch(role.id)
        if (guildRole == undefined || guildRole == null) {
            return
        }

        await member.roles.add(guildRole)
        await incrementUserStatUseCase(member.id, 'coins', -shopInfo.costPerDay, loungeApi)
        await addActiveUserRoleUseCase(member.id, guildRole.id, DateTime.now().toSeconds() + 86400, botApi)

        interaction.reply({content: `You have been given the role <@&${guildRole.id}> for ${shopInfo.costPerDay} coins`})
    }
)

export default command