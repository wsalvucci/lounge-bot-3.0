import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import botApi from "../../api/bot/botApi";
import loungeApi from "../../api/loungeApi";
import SlashCommand from "../../models/SlashCommand";
import adjustGuildXpUseCase from "../../useCases/bot/adjustGuildXpUseCase";
import checkIfUserExistsUseCase from "../../useCases/user/checkIfUserExistsUseCase";
import getUserStatsUseCase from "../../useCases/user/getUserStatsUseCase";
import incrementUserStatUseCase from "../../useCases/user/incrementUserStatUseCase";

const BOOST_CONVERSION = 0.001 // 1 coin = 0.001% boost : 1,000 coins = 1% boost

const command = new SlashCommand(
    new SlashCommandBuilder(),
    async (interaction: CommandInteraction) => {
        var amount = interaction.options.getInteger('amount', true)

        if (amount < 1000) {
            interaction.reply({content: 'You must pay at least 1000 coins to boost the server', ephemeral: true})
            return
        } else {
            amount = amount - (amount % 1000)
        }

        var member = interaction.member as GuildMember
        var userExists = await checkIfUserExistsUseCase(member.id, loungeApi)

        if (!userExists) {
            interaction.reply({content: 'You cannot buy boosts without an account', ephemeral: true})
            return
        }

        var userData = await getUserStatsUseCase(member.id, loungeApi)

        if (amount > userData.coins) {
            interaction.reply({content: `You don't have ${amount} coins. You only have ${userData.coins}`, ephemeral: true})
            return
        }

        if (interaction.guildId == null) {
            interaction.reply({content: `This command must be used in a server.`, ephemeral: true})
            return
        }

        var boost = amount / 100000 //100x more to account for 1% needing to convert to 0.01

        await adjustGuildXpUseCase(interaction.guildId, boost, botApi)
        await incrementUserStatUseCase(member.id, 'coins', -amount, loungeApi)

        interaction.reply({content: `You have boosted the server today ${boost * 100}% for ${amount} coins.`})
    }
)

export default command