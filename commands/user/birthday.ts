import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { DateTime } from "luxon";
import loungeApi from "../../api/loungeApi";
import SlashCommand from "../../models/SlashCommand";
import checkIfUserExistsUseCase from "../../useCases/user/checkIfUserExistsUseCase";
import getUserFullDataUseCase from "../../useCases/user/getUserFullDataUseCase";
import setUserPropertyUseCase from "../../useCases/user/setUserPropertyUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('birthday')
        .setDescription('Adds your birthday to your account if it is not already set.')
        .addIntegerOption(option =>
            option.setName('day')
                .setDescription('The day of your birthday')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('month')
                .setDescription('The month of your birthday')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('year')
                .setDescription('The year of your birth')
                .setRequired(true)
        ),
    async (interaction: CommandInteraction) => {
        var member = interaction.member as GuildMember

        var userExists = await checkIfUserExistsUseCase(member.id, loungeApi)

        if (!userExists) {
            interaction.reply({content: 'You need an account to set your birthday.', ephemeral: true})
            return
        }

        var userData = await getUserFullDataUseCase(member.id, loungeApi)

        if (userData.attributes.birthday == -1) {
            var day = interaction.options.getInteger('day', true)
            var month = interaction.options.getInteger('month', true)
            var year = interaction.options.getInteger('year', true)

            var birthdayObject = DateTime.fromObject({month: month, day: day, year: year})
            if (birthdayObject.isValid) {
                var birthdaySeconds = birthdayObject.toSeconds()
                await setUserPropertyUseCase(member.id, 'birthday', birthdaySeconds, loungeApi)
                interaction.reply({content: 'Birthday set.', ephemeral: true})
            } else {
                interaction.reply({content: 'Invalid date.', ephemeral: true})
            }
        } else {
            interaction.reply({content: 'Your birthday has already been set. You need to ping Sealith for it to be reset.', ephemeral: true})
        }
    }
)

export default command