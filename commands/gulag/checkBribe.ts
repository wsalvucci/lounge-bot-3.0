import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import gulagApi from "../../api/gulag/gulagApi";
import Repository from "../../api/loungeApi"
import Bribe from "../../models/gulag/Bribe";
import Trial from "../../models/gulag/Trial";
import SlashCommand from "../../models/SlashCommand";
import getActiveTrialsUseCase from "../../useCases/gulag/getActiveTrialsUseCase";
import getTrialBribesUseCase from "../../useCases/gulag/getTrialBribesUseCase";
import checkIfUserExistsUseCase from "../../useCases/user/checkIfUserExistsUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('checkbribe')
        .setDescription('Checks your current bribe for the given trial')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user whos trial you are checking your bribe from (the one being accused)')
                .setRequired(true)
        ),
    async (interaction: CommandInteraction) => {
        var member = interaction.member
        if (member == null) return
        var trialUser = interaction.options.getUser('user', true)

        var memberExists = await checkIfUserExistsUseCase(member.user.id, Repository)
        if (!memberExists) {
            interaction.reply({content: 'You need an account to vote in a trial', ephemeral: true})
            return
        }

        var activeTrials = await getActiveTrialsUseCase(gulagApi)
        var targetedTrial = activeTrials.find((trial: Trial) => { return trial.targetId == trialUser.id})
        if (targetedTrial == undefined) {
            interaction.reply({content: `That person is not currently under trial.`, ephemeral: true})
            return
        }

        var activeBribes = getTrialBribesUseCase(targetedTrial.id, gulagApi)
        var currentBribe = (await activeBribes).find((bribe: Bribe) => {return bribe.discordId == member?.user.id})

        if (currentBribe === undefined) {
            interaction.reply({content: `You don't have a bribe for this person's trial.`, ephemeral: true})
            return
        }

        var convertVote = ''
        if (currentBribe.bribeVote == 1) convertVote = 'yea'
        if (currentBribe.bribeVote == -1) convertVote = 'nea'
        interaction.reply({content: `Your current bribe for the trial against ${trialUser} is ${currentBribe.bribeAmount} in favor of ${convertVote}`, ephemeral: true})
    }
)

export default command