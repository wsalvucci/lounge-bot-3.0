import { SlashCommandBuilder } from "@discordjs/builders";
import { Collection, CommandInteraction, Message, MessageEmbed, MessageReaction, User } from "discord.js";
import SlashCommand from "../../models/SlashCommand";
import checkIfUserExistsUseCase from "../../useCases/user/checkIfUserExistsUseCase";
import Repository from "../../api/loungeApi"
import getUserStatsUseCase from "../../useCases/user/getUserStatsUseCase";
import { APIMessage } from "discord.js/node_modules/discord-api-types";
import respecUserUseCase from "../../useCases/user/respecUserUseCase";
import { DateTime } from "luxon";

const COST_PER_SPEC_POINT = 1000
const TIME_BETWEEN_RESPECS = 604800

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('respec')
        .setDescription('Respec your stats to regain points and asign them elsewhere')
        .addIntegerOption(option => 
            option.setName('atk')
                .setDescription('What you want to reset your Attack stat to')
                .setRequired(true)
            )
        .addIntegerOption(option => 
            option.setName('def')
                .setDescription('What you want to reset your Defense stat to')
                .setRequired(true)
            )
        .addIntegerOption(option => 
            option.setName('matk')
                .setDescription('What you want to reset your Magic Attack stat to')
                .setRequired(true)
            )
        .addIntegerOption(option => 
            option.setName('mdef')
                .setDescription('What you want to reset your Magic Defense stat to')
                .setRequired(true)
            )
        .addIntegerOption(option => 
            option.setName('agi')
                .setDescription('What you want to reset your Agility stat to')
                .setRequired(true)
            )
        .addIntegerOption(option => 
            option.setName('hp')
                .setDescription('What you want to reset your Health stat to')
                .setRequired(true)
            )
        .addIntegerOption(option => 
            option.setName('cha')
                .setDescription('What you want to reset your Charisma stat to')
                .setRequired(true)
            ),
        async (interaction: CommandInteraction) => {
            var member = interaction.member
            if (member == null) return

            var memberExists = await checkIfUserExistsUseCase(member.user.id, Repository)
            if (!memberExists) {
                interaction.reply({content: 'You need an account to respec your stats', ephemeral: true})
                return
            }

            var atk = interaction.options.getInteger('atk', true)
            var def = interaction.options.getInteger('def', true)
            var matk = interaction.options.getInteger('matk', true)
            var mdef = interaction.options.getInteger('mdef', true)
            var agi = interaction.options.getInteger('agi', true)
            var hp = interaction.options.getInteger('hp', true)
            var cha = interaction.options.getInteger('cha', true)

            if (atk < 0 || def < 0 || matk < 0 || mdef < 0 || agi < 0 || hp < 0 || cha < 0) {
                interaction.reply({content: 'You cannot set a stat negative', ephemeral: true})
                return
            }

            var userStats = await getUserStatsUseCase(member.user.id, Repository)

            if (DateTime.now().toSeconds() - userStats.respecTimestamp < TIME_BETWEEN_RESPECS) {
                interaction.reply({content: `You cannot respec again until <t:${userStats.respecTimestamp + TIME_BETWEEN_RESPECS}>`, ephemeral: true})
                return
            }

            var atkDiff = userStats.atk - atk
            var defDiff = userStats.def - def
            var matkDiff = userStats.matk - matk
            var mdefDiff = userStats.mdef - mdef
            var agiDiff = userStats.agi - agi
            var hpDiff = userStats.hp - hp
            var chaDiff = userStats.cha - cha

            if (atkDiff < 0) {
                interaction.reply({content: `You can't remove ${atk} points from Attack when its current value is ${userStats.atk}`, ephemeral: true})
                return
            }
            if (defDiff < 0) {
                interaction.reply({content: `You can't remove ${def} points from Defense when its current value is ${userStats.def}`, ephemeral: true})
                return
            }
            if (matkDiff < 0) {
                interaction.reply({content: `You can't remove ${matk} points from Magic Attack when its current value is ${userStats.matk}`, ephemeral: true})
                return
            }
            if (mdefDiff < 0) {
                interaction.reply({content: `You can't remove ${mdef} points from Magic Defense when its current value is ${userStats.mdef}`, ephemeral: true})
                return
            }
            if (agiDiff < 0) {
                interaction.reply({content: `You can't remove ${agi} points from Agility when its current value is ${userStats.agi}`, ephemeral: true})
                return
            }
            if (hpDiff < 0) {
                interaction.reply({content: `You can't remove ${hp} points from Health when its current value is ${userStats.hp}`, ephemeral: true})
                return
            }
            if (chaDiff < 0) {
                interaction.reply({content: `You can't remove ${cha} points from Charisma when its current value is ${userStats.cha}`, ephemeral: true})
                return
            }

            var totalPoints = atkDiff + defDiff + matkDiff + mdefDiff + agiDiff + hpDiff + chaDiff
            var totalCost = totalPoints * COST_PER_SPEC_POINT

            const respecPreview = new MessageEmbed()
                .setTitle(`${member.user.username}'s Respec Preview'`)
                .addFields(
                    {name: 'Attack', value: `${atk} (-${atkDiff})`},
                    {name: 'Defense', value: `${def} (-${defDiff})`},
                    {name: 'Magic Attack', value: `${matk} (-${matkDiff})`},
                    {name: 'Magic Defense', value: `${mdef} (-${mdefDiff})`},
                    {name: 'Agility', value: `${agi} (-${agiDiff})`},
                    {name: 'Health', value: `${hp} (-${hpDiff})`},
                    {name: 'Charisma', value: `${cha} (-${chaDiff})`},
                    {name: 'TOTAL COST', value: `${totalCost.withCommas()}`},
                    {name: 'Next Respec', value: `<t:${userStats.respecTimestamp + TIME_BETWEEN_RESPECS}>`}
                )
            
            var previewMessage = await interaction.channel?.send({embeds: [respecPreview]})

            interaction.reply({content: `${member.user}, confirm your respec. This will auto-deny if no response is given for 30 seconds.`, fetchReply: true}).then(async (message: Message | APIMessage) => {
                if (message instanceof Message) {
                    await message.react('⬆️')
                    await message.react('⬇️')

                    const filter = (reaction : MessageReaction, user: User) => {
                        return (reaction.emoji.name === '⬆️' || reaction.emoji.name === '⬇️') && user.id === member?.user.id
                    }

                    const collector = message.createReactionCollector({filter, time: 30000})

                    collector.on('collect', (reaction: MessageReaction, user: User) => {
                        if (reaction.emoji.name == '⬆️') {
                            collector.stop('Confirmed')
                        } else if (reaction.emoji.name == '⬇️') {
                            collector.stop('Denied')
                        }
                    })
        
                    collector.on('end', (collected: Collection<string, MessageReaction>, reason: string) => {
                        if (reason == 'Confirmed') {
                            if (member == null) return
                            respecUserUseCase(member?.user.id, atk, def, matk, mdef, agi, hp, cha, totalCost, totalPoints, DateTime.now().toSeconds(), Repository)
                        }
                        message?.delete()
                        previewMessage?.delete()
                    })
                }
            })
        }
)

export default command