import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed, TextChannel } from "discord.js";
import { DateTime } from "luxon";
import botApi from "../../api/bot/botApi";
import loungeApi from "../../api/loungeApi";
import client from "../../bot";
import House from "../../models/house/House";
import SlashCommand from "../../models/SlashCommand";
import getGuildConfigUseCase from "../../useCases/bot/getGuildConfigUseCase";
import addHousePointEventUseCase from "../../useCases/house/addHousePointEventUseCase";
import getHouseDetailsUseCase from "../../useCases/house/getAllHouseDetailsUseCase";
import checkIfUserExistsUseCase from "../../useCases/user/checkIfUserExistsUseCase";
import getUserFullDataUseCase from "../../useCases/user/getUserFullDataUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder(),
    async (interaction: CommandInteraction) => {
        var member = interaction.member as GuildMember
        var userExists = await checkIfUserExistsUseCase(member.id, loungeApi)
        if (!userExists) {
            interaction.reply({content: 'You have to be a housemaster to do that.', ephemeral: true})
            return
        }
        var userData = await getUserFullDataUseCase(member.id, loungeApi)
        var allHouseData = await getHouseDetailsUseCase(loungeApi)
        if (allHouseData.find((house: House) => house.headmaster == userData.attributes.discordId) == undefined) {
            interaction.reply({content: 'You have to be a housemaster to do that.', ephemeral: true})
            return
        }
        var target = interaction.options.getUser('user', true)
        var targetData = await getUserFullDataUseCase(target.id, loungeApi)
        var points = interaction.options.getInteger('points', true)
        var reason = interaction.options.getString('reason', true)

        await addHousePointEventUseCase(target.id, userData.attributes.discordId, points, reason, targetData.attributes.house, Math.floor(DateTime.now().toSeconds()), loungeApi)

        if (interaction.guildId != null) {
            var guildConfig = await getGuildConfigUseCase(interaction.guildId, botApi)
            var channel = await client.channels.fetch(guildConfig.pointsChannel) as TextChannel
            var targetHouseDetails = allHouseData.find((house: House) => house.id == targetData.attributes.house)
            var pointEmbed = new MessageEmbed()
                .setTitle(`Points earned for ${targetHouseDetails?.name}`)
                .setColor(`#${targetHouseDetails?.primaryColor}`)
                .addField(`Member`, `${targetData.attributes.name}`)
                .addField(`Points`, `${points}`)
                .addField(`Housemaster`, `${member.displayName}`)
                .addField(`Reason`, `${reason}`)
            
            channel.send({embeds: [pointEmbed]})
        }

        interaction.reply({content: `Gave ${points} points to ${target.username} of houseid ${targetData.attributes.house}`, ephemeral: true})
    }
)

export default command