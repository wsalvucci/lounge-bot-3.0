import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import gulagApi from "../../api/gulag/gulagApi";
import loungeApi from "../../api/loungeApi";
import SlashCommand from "../../models/SlashCommand";
import SqlResponse from "../../responseModels/SqlResponse";
import addSlapResponseUseCase from "../../useCases/gulag/addSlapResponseUseCase";
import checkIfUserExistsUseCase from "../../useCases/user/checkIfUserExistsUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('addslapresponse')
        .setDescription('Add a custom response for the bot and rarity of your chosing.')
        .addIntegerOption(option => 
            option.setName('personality')
                .setDescription('The bot personality you want to add a slap line to')
                .setRequired(true)
                .addChoices([
                    ["Viktor", 1],
                    ["Edna", 2],
                ])
        )
        .addIntegerOption(option => 
            option.setName('rarity')
                .setDescription('What type of response')
                .setRequired(true)
                .addChoices([
                    ["Legendary Bad, 1%, Attacker is Gulaged", 1],
                    ["Epic Bad, 4%", 2],
                    ["Rare Bad, 10%", 3],
                    ["Uncommon Bad, 10%", 4],
                    ["Common, 50%", 5],
                    ["Uncommon Good, 10%", 6],
                    ["Rare Good, 10%", 7],
                    ["Epic Good, 4%", 8],
                    ["Legendary Good, 1%, Victim is Gulaged", 9]
                ])
        )
        .addStringOption(option =>
            option.setName('response')
                .setDescription('The response. [a] - attacker name. [v] - victim name. [au] or [vu] - name all caps.')
                .setRequired(true)
        ),
    async (interaction: CommandInteraction) => {
        var member = interaction.member as GuildMember
        var userExists = await checkIfUserExistsUseCase(member.id, loungeApi)

        if (!userExists) {
            interaction.reply({content: "You have to have an account to submit slap lines to Lounge Bot", ephemeral: true})
            return
        }

        var personalityId = interaction.options.getInteger('personality', true)
        var rarity = interaction.options.getInteger('rarity', true)
        var responseText = interaction.options.getString('response', true)

        addSlapResponseUseCase(member.id, personalityId, rarity, responseText, gulagApi)
            .then((response: SqlResponse) => {
                interaction.reply({content: `Your response \`${responseText}\` for rarity \`${rarity}\` for bot personality \`${personalityId}\` has been added.`, ephemeral: true})
            })
            .catch((error: any) => {
                interaction.reply({content: `There was an error:\n${error}`, ephemeral: true})
            })
    }
)

export default command