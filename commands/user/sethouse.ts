import { SlashCommandBuilder } from "@discordjs/builders";
import loungeApi from "../../api/loungeApi";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import SlashCommand from "../../models/SlashCommand";
import getUserFullDataUseCase from "../../useCases/user/getUserFullDataUseCase";
import setUserPropertyUseCase from "../../useCases/user/setUserPropertyUseCase";
import getHouseDetailsUseCase from "../../useCases/house/getHouseDetails";
import getGuildConfigUseCase from "../../useCases/bot/getGuildConfigUseCase";
import botApi from "../../api/bot/botApi";
import checkIfUserExistsUseCase from "../../useCases/user/checkIfUserExistsUseCase";
import { createUserUseCase } from "../../useCases/user/createUserUseCase";
import { DateTime } from "luxon";

const command = new SlashCommand(
    new SlashCommandBuilder(),
    async (interaction: CommandInteraction) => {
        var member = interaction.member as GuildMember
        var houseId = interaction.options.getInteger('house', true)

        var userExists = await checkIfUserExistsUseCase(member.id, loungeApi)
        if (userExists) {
            var userData = await getUserFullDataUseCase(member.id, loungeApi)
            if (userData.attributes.house != null) {
                interaction.reply({content: 'You already created your account and chose your house.', ephemeral: true})
                return
            } else {
                await setUserPropertyUseCase(member.id, 'house', houseId, loungeApi)
            }
        } else {
            await createUserUseCase(member.id, member.user.username, DateTime.now().toSeconds(), houseId, loungeApi)
        }


        var houseDetails = await getHouseDetailsUseCase(houseId, loungeApi)
        var headMasterDetails = await getUserFullDataUseCase(houseDetails.headmaster, loungeApi)
        var guildConfig = await getGuildConfigUseCase(member.guild.id, botApi)
        const houseEmbed = new MessageEmbed()
            .setTitle(`Welcome to ${houseDetails.name}!`)
            .setColor(`#${houseDetails.primaryColor}`)
            .addField(`Headmaster`, headMasterDetails.attributes.name)

        member.roles.add(houseDetails.roleId).catch((err: any) => console.error(err))
        member.roles.remove(guildConfig.initiateRole).catch((err: any) => console.error(err))
        member.roles.add(guildConfig.normalRole).catch((err: any) => console.error(err))

        interaction.reply({embeds: [houseEmbed], ephemeral: true})
    }
)

export default command