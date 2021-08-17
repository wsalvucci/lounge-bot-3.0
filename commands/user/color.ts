import { SlashCommandBuilder } from "@discordjs/builders";
import Color from "color";
import { CommandInteraction, GuildMember } from "discord.js";
import Repository from "../../api/loungeApi";
import SlashCommand from "../../models/SlashCommand";
import SqlResponse from "../../responseModels/SqlResponse";
import setUserPropertyUseCase from "../../useCases/user/setUserPropertyUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('color')
        .setDescription('Changes the color of your name in the server')
        .addStringOption(option =>
            option.setName('color')
                .setDescription('The color you want your name in the format `A1B2C3`')
                .setRequired(true)
        ),
    (interaction: CommandInteraction) => {
        var member: GuildMember
        if (interaction.member === null || !(interaction.member instanceof GuildMember)) return
        else member = interaction.member
        var selectedColor = interaction.options.getString('color', true)
        setUserPropertyUseCase(member.user.id, 'color', selectedColor, Repository)
            .then((response: SqlResponse) => {
                var currentRoles = interaction.guild?.roles.cache
                var colorRole = currentRoles?.find(role => role.name === `${member.user.username}#${member.user.discriminator}`)
                if (colorRole !== undefined) {
                    colorRole.setColor(`#${selectedColor}`)
                        .then(modifiedRole => {
                            interaction.reply({content: `Your role color was updated successfully to ${modifiedRole.hexColor}`, ephemeral: true})
                            member.roles.add(modifiedRole)
                            .catch(err => {
                                console.log(err)
                                interaction.reply({content: 'There was an error changing your current role color. Did you use the correct format of `A1B2C3`? (Don\'t use hashtags!)', ephemeral: true})
                            })
                        })
                        .catch(err => {
                            console.log(err)
                            interaction.reply({content: 'There was an error changing your current role color. Did you use the correct format of `A1B2C3`? (Don\'t use hashtags!)', ephemeral: true})
                        })
                } else {
                    interaction.guild?.roles.create({
                        name: `${member.user.username}#${member.user.discriminator}`,
                        color: `#${selectedColor}`,
                        position: 20
                    }).then((newRole: any) => {
                        interaction.guild?.members.fetch({user: member.user})
                            .then((member: GuildMember) => member.roles.add(newRole)
                                .then((member: GuildMember) => {
                                    interaction.reply({content: `You have been given a new color role with the color ${newRole.hexColor}`, ephemeral: true})
                                })
                            ).catch((error: any) => {
                                console.log(error)
                                interaction.reply({content: `The role was created, but there was an error in assigning it to you.`, ephemeral: true})
                            })
                        }).catch(err => {
                            console.log(err)
                            interaction.reply({content: 'There was an error creating a role color for you', ephemeral: true})
                        })
                }
            })
            .catch((error: any) => {
                console.log(error)
            })
    }
)

export default command