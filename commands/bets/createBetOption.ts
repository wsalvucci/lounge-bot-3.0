import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import betsApi from "../../api/bets/betsApi";
import SlashCommand from "../../models/SlashCommand";
import addBetOptionUseCase from "../../useCases/bets/addBetOptionUseCase";
import getBetUseCase from "../../useCases/bets/getBetUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('createbetoption')
        .setDescription('Creates a bet option for the given bet ID')
        .addIntegerOption(option =>
            option.setName('betid')
                .setDescription('The bet ID you want to add this option to')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('optionname')
                .setDescription('The name of the bet option')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('optiondescription')
                .setDescription('The description of the bet option')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('betline')
                .setDescription('The betting line of the option')
                .setRequired(true)
        ),
    async (interaction: CommandInteraction) => {
        var member = interaction.member as GuildMember
        if (member.id !== '194232193025966080') {
            interaction.reply({content: `You do not have permission to create bets`, ephemeral: true})
            return
        }

        var betId = interaction.options.getInteger('betid', true)
        var optionName = interaction.options.getString('optionname', true)
        var optionDescription = interaction.options.getString('optiondescription', true)
        var betLine = interaction.options.getInteger('betline', true)

        var betDetails = await getBetUseCase(betId, betsApi)
        if (betDetails.betId == -1) {
            interaction.reply({content: `There is no bet with that ID`, ephemeral: true})
            return
        }

        await addBetOptionUseCase(betId, optionName, optionDescription, betLine, betsApi)
        interaction.reply({content: `Your bet option has been created`, ephemeral: true})
    }
)

export default command