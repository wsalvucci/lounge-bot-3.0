import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import gulagApi from "../../api/gulag/gulagApi";
import Repository from "../../api/loungeApi"
import Bribe from "../../models/gulag/Bribe";
import Trial from "../../models/gulag/Trial";
import SlashCommand from "../../models/SlashCommand";
import getActiveTrialsUseCase from "../../useCases/gulag/getActiveTrialsUseCase";
import getTrialBribesUseCase from "../../useCases/gulag/getTrialBribesUseCase";
import removeTrialBribeUseCase from "../../useCases/gulag/removeTrialBribeUseCase";
import checkIfUserExistsUseCase from "../../useCases/user/checkIfUserExistsUseCase";
import incrementUserStatUseCase from "../../useCases/user/incrementUserStatUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('removebribe')
        .setDescription('Removes your bribe from the given trial')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user whos trial you are removing your bribe from (the one being accused)')
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

        await removeTrialBribeUseCase(targetedTrial.id, member.user.id, gulagApi)
        await incrementUserStatUseCase(member.user.id, 'coins', currentBribe.bribeAmount, Repository)

        interaction.reply({content: `Your bribe of ${currentBribe.bribeAmount} in favor of ${currentBribe.bribeVote} has been removed from the trial of ${trialUser}`, ephemeral: true})
    }
)

export default command