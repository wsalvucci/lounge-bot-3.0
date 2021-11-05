import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import SlashCommand from "../../models/SlashCommand";
import checkIfUserExistsUseCase from "../../useCases/user/checkIfUserExistsUseCase";
import Repository from "../../api/loungeApi"
import getUserStatsUseCase from "../../useCases/user/getUserStatsUseCase";
import getTrialBribesUseCase from "../../useCases/gulag/getTrialBribesUseCase";
import getActiveTrialsUseCase from "../../useCases/gulag/getActiveTrialsUseCase";
import gulagApi from "../../api/gulag/gulagApi";
import Trial from "../../models/gulag/Trial";
import Bribe from "../../models/gulag/Bribe";
import incrementUserStatUseCase from "../../useCases/user/incrementUserStatUseCase";
import addTrialBribeUseCase from "../../useCases/gulag/addTrialBribeUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('bribe')
        .setDescription('Bribe the judge of a particular trial')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user whos trial you are bribing (the one being accused)')
                .setRequired(true)
        )
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('The amount of coins you want to bribe the judge with')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('vote')
                .setDescription('What direction you want the bribe to swing the vote')
                .setRequired(true)
                .addChoice('Yea', 'yea')
                .addChoice('Nea', 'nea')
        ),
    async (interaction: CommandInteraction) => {
        var member = interaction.member
        var trialUser = interaction.options.getUser('user', true)
        var bribe = interaction.options.getInteger('amount', true)
        if (bribe < 0) {
            interaction.reply({content: 'Your bribe cannot be negative.', ephemeral: true})
            return
        }
        var vote = interaction.options.getString('vote', true)
        var voteValue = 0
        if (vote == 'yea') {
            voteValue = 1
        } else if (vote == 'nea') {
            voteValue = -1
        }
        if (member == null) return

        var memberExists = await checkIfUserExistsUseCase(member.user.id, Repository)
        if (!memberExists) {
            interaction.reply({content: 'You need an account to vote in a trial', ephemeral: true})
            return
        }

        var userStats = await getUserStatsUseCase(member.user.id, Repository)
        var activeTrials = await getActiveTrialsUseCase(gulagApi)
        var targetedTrial = activeTrials.find((trial: Trial) => { return trial.targetId == trialUser.id})
        if (targetedTrial == undefined) {
            interaction.reply({content: `That person is not currently under trial.`, ephemeral: true})
            return
        }

        var activeBribes = getTrialBribesUseCase(targetedTrial.id, gulagApi)
        var currentBribe = (await activeBribes).find((bribe: Bribe) => {return bribe.discordId == member?.user.id})
        if (currentBribe !== undefined) {
            var difference = currentBribe.bribeAmount - bribe
            if (userStats.coins + difference < 0) {
                interaction.reply({content: `You don't have enough coins to make that bribe.`, ephemeral: true})
                return
            }

            await incrementUserStatUseCase(member.user.id, 'coins', difference, Repository)
            await addTrialBribeUseCase(targetedTrial.id, member.user.id, bribe, voteValue, gulagApi)

            interaction.reply({content: `Your bribe has been updated to ${bribe} in favor of ${vote}.`, ephemeral: true})
        } else {
            if (userStats.coins < bribe) {
                interaction.reply({content: `You don't have enough coins to make that bribe.`, ephemeral: true},)
                return
            }

            await incrementUserStatUseCase(member.user.id, 'coins', -bribe, Repository)
            await addTrialBribeUseCase(targetedTrial.id, member.user.id, bribe, voteValue, gulagApi)

            interaction.reply({content: `Your bribe has been added as ${bribe} in favor of ${vote}.`, ephemeral: true})
        }
    }
)

export default command