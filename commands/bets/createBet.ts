import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import betsApi from "../../api/bets/betsApi";
import SlashCommand from "../../models/SlashCommand";
import addBetUseCase from "../../useCases/bets/addBetUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('createbet')
        .setDescription('Creates a new bet if you have permission')
        .addStringOption(option =>
            option.setName('betname')
                .setDescription('The name of the bet')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('betdescription')
                .setDescription('The description of the bet event')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('openingtimestamp')
                .setDescription('When the bet will become available for users to bet on')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('closingtimestamp')
                .setDescription('When the bet will close down for new/modified bets')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('hiddentimestamp')
                .setDescription('When the bet will no longer be listed in the active bets')
                .setRequired(true)
        ),
    async (interaction: CommandInteraction) => {
        var member = interaction.member as GuildMember
        if (member.id !== '194232193025966080') {
            interaction.reply({content: `You do not have permission to create bets`, ephemeral: true})
            return
        }

        var betName = interaction.options.getString('betname', true)
        var betDescription = interaction.options.getString('betdescription', true)
        var openingTimestamp = interaction.options.getInteger('openingtimestamp', true)
        var closingTimestamp = interaction.options.getInteger('closingtimestamp', true)
        var hiddenTimestamp = interaction.options.getInteger('hiddentimestamp', true)

        if (openingTimestamp > closingTimestamp || openingTimestamp > hiddenTimestamp) {
            interaction.reply({content: `The opening timestamp must come before the closing and hidden timestamp`, ephemeral: true})
            return
        }
        if (closingTimestamp > hiddenTimestamp) {
            interaction.reply({content: `The ending timestamp must come before the hidden timestamp`, ephemeral: true})
            return
        }

        await addBetUseCase(betName, betDescription, openingTimestamp, closingTimestamp, hiddenTimestamp, betsApi)
        interaction.reply({content: `Your bet has been created.`, ephemeral: true})
    }
)

export default command