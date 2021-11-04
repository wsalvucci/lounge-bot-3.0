import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import SlashCommand from "../../models/SlashCommand";
import checkIfUserExistsUseCase from "../../useCases/user/checkIfUserExistsUseCase";
import Repository from "../../api/loungeApi"
import getActiveTrialsUseCase from "../../useCases/gulag/getActiveTrialsUseCase";
import gulagApi from "../../api/gulag/gulagApi"
import Trial from "../../models/gulag/Trial";
import addTrialVoteUseCase from "../../useCases/gulag/addTrialVoteUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Vote in a trial')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user whos trial you are voting in (the one being accused)')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('vote')
                .setDescription('Your vote')
                .setRequired(true)
                .addChoice('Yea', 'yea')
                .addChoice('Nea', 'nea')
                .addChoice('Abstain', 'abstain')
        ),
    async (interaction: CommandInteraction) => {
        var member = interaction.member
        var trialUser = interaction.options.getUser('user')
        var vote = interaction.options.getString('vote')
        if (member == null) return

        var memberExists = await checkIfUserExistsUseCase(member.user.id, Repository)
        if (!memberExists) {
            interaction.reply({content: 'You need an account to vote in a trial', ephemeral: true})
            return
        }

        var activeTrials = await getActiveTrialsUseCase(gulagApi)
        var targetedTrial = activeTrials.find((trial: Trial) => { return trial.targetId == trialUser?.id})
        if (targetedTrial !== undefined) {
            if (targetedTrial.accuserId == member.user.id || targetedTrial.targetId == member.user.id) {
                interaction.reply({content: `You cannot vote in a trial you're involved in.`, ephemeral: true})
                return
            } else {
                var voteValue = 0
                if (vote == 'yea') {
                    voteValue = 1
                } else if (vote == 'nea') {
                    voteValue = -1
                } else if (vote == 'abstain') {
                    voteValue = 0
                }
                await addTrialVoteUseCase(targetedTrial.id, member.user.id, voteValue, gulagApi)
                interaction.reply({content: `Your vote of ${vote} for the trial against ${trialUser} has been registered!`, ephemeral: true})
            }
        } else {
            interaction.reply({content: `That person is not currently under trial.`, ephemeral: true},)
            return
        }
    }
)

export default command