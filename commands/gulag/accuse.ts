import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction, Message, MessageReaction, ReactionEmoji, User } from "discord.js"
import SlashCommand from "../../models/SlashCommand"
import getUserStatsUseCase from "../../useCases/user/getUserStatsUseCase"
import Repository from "../../api/loungeApi"
import setUserPropertyUseCase from "../../useCases/user/setUserPropertyUseCase"
import { StatType } from "../../domain/loungeFunctions"
import getActiveTrialsUseCase from "../../useCases/gulag/getActiveTrialsUseCase"
import gulagApi from "../../api/gulag/gulagApi"
import Trial from "../../models/gulag/Trial"
import addTrialUseCase from "../../useCases/gulag/addTrialUseCase"
import { DateTime } from "luxon"

const votingReactionFilter = (reaction: MessageReaction, user: User) => {
    return reaction.emoji.name == 'upwards button' || reaction.emoji.name == 'downwards button'
}

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('accuse')
        .setDescription('Accuse someone of something to send them to the gulag')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user you want to accuse')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('accusation')
                .setDescription('What you\'re accusing the target of')
                .setRequired(true)
        ),
    async (interaction: CommandInteraction) => {
        var member = interaction.member
        var accused = interaction.options.getUser('target')
        var accusation = interaction.options.getString('accusation')
        if (member == null || accused == null || accusation == null) return

        var userStats = await getUserStatsUseCase(member.user.id, Repository)
        if (userStats.coins < 10000) {
            interaction.reply({content: 'You need at least 10,000 Lounge Coins to make an accusation', ephemeral: true})
            return
        }

        var activeTrials = await getActiveTrialsUseCase(gulagApi)
        if (activeTrials.find((trial: Trial) => { return trial.accuserId == member?.user.id || trial.targetId == member?.user.id}) !== undefined) {
            interaction.reply({content: `You cannot accuse someone while you are involved in an active trial!`, ephemeral: true})
            return
        }
        if (activeTrials.find((trial: Trial) => { return trial.accuserId == accused?.id || trial.targetId == accused?.id}) !== undefined) {
            interaction.reply({content: `You cannot accuse someone who is involved in an active trial!`, ephemeral: true})
            return
        }

        await setUserPropertyUseCase(member !== null ? member.user.id : "", StatType.Coins, userStats.coins - 0, Repository)

        interaction.reply(`${member.user} has accused ${accused} of ${accusation}!!!`)

        // Create trial here in database and return id and judge type
        await addTrialUseCase(member.user.id, accused.id, accusation, DateTime.now().toSeconds(), 0, gulagApi)


        interaction.channel?.send(
            'The trial is underway! Use `/vote 00 yea/nea` to participate!\nUse `/bribe 00 amount` to bribe the judge!\nThe judge for this trial is -personality-'
            )
    }
)

export default command