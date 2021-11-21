import gulagApi from "../api/gulag/gulagApi";
import getActiveTrialsUseCase from "../useCases/gulag/getActiveTrialsUseCase";
import schedule from 'node-schedule'
import Trial from "../models/gulag/Trial";
import { DateTime } from "luxon";
import getCurrentBotPersonalityUseCase from "../useCases/bot/getCurrentBotPersonalityUseCase";
import botApi from "../api/bot/botApi";
import getTrialVotesUseCase from "../useCases/gulag/getTrialVotesUseCase";
import getTrialBribesUseCase from "../useCases/gulag/getTrialBribesUseCase";
import TrialVote from "../models/gulag/Vote";
import Bribe from "../models/gulag/Bribe";
import getGuildConfigUseCase from "../useCases/bot/getGuildConfigUseCase";
import client from "../bot";
import { Guild, GuildChannel, TextChannel, ThreadChannel } from "discord.js";
import BotPersonality from "../models/bot/BotPersonality";
import getBotTrialLinesUseCase from "../useCases/bot/getBotTrialLinesUseCase";
import { TrialLineType, TrialResultLine } from "../models/bot/TrialResultLine";
import { gulagUser } from "../domain/loungeFunctions";
import getUserStatsUseCase from "../useCases/user/getUserStatsUseCase";
import loungeApi from "../api/loungeApi";

const TRIAL_DURATION = 86400
const MINIMUM_REQUIRED_YEA_VOTES = 3

const MAXIMUM_BRIBE_VOTE_SWING = 10 //How many votes a bribe can swing the vote total
const GULAG_FAVOR_MULTIPLIER = 100000 //How much a bot's tendency to gulag someone swings the decision
const CORRUPTION_MULTIPLIER = 1 //How much a bot's corruption level impacts bribe effectiveness
const CHARISMA_MULTIPLIER = 0.01 //How much a user's charisma stat helps their chances of not being gulaged (or gulaging their target)

function bribeToVoteSwing(bot: BotPersonality, netBribe: number): number {
    var power = 0.000005 * (netBribe + (GULAG_FAVOR_MULTIPLIER * bot.aggression))
    var numerator = Math.pow((bot.corruption * CORRUPTION_MULTIPLIER), power)
    var denominator = numerator + 1

    return (MAXIMUM_BRIBE_VOTE_SWING * 2) * (numerator / denominator) - MAXIMUM_BRIBE_VOTE_SWING
}

async function charismaToVoteSwing(trial: Trial) : Promise<number> {
    var victimData = await getUserStatsUseCase(trial.targetId, loungeApi)
    var accuserData = await getUserStatsUseCase(trial.accuserId, loungeApi)
    return (victimData.cha * CHARISMA_MULTIPLIER) - (accuserData.cha * CHARISMA_MULTIPLIER)
}

async function executeTrial(trial: Trial) {

    var botConfig = await getCurrentBotPersonalityUseCase(botApi)
    var guildConfig = await getGuildConfigUseCase(trial.guildId, botApi)

    var trialVotes = await getTrialVotesUseCase(trial.id, gulagApi)
    var trialBribes = await getTrialBribesUseCase(trial.id, gulagApi)

    var trialGuild = client.guilds.cache.find((guild: Guild) => {return guild.id == trial.guildId})
    if (trialGuild === undefined) {
        console.error(`No guild found for trial id: ${trial.id}`)
        return
    }

    var resultChannel = client.channels.cache.get(guildConfig.announcementsChannel) as TextChannel
    if (resultChannel == undefined) return

    if (trialVotes.filter((vote: TrialVote) => {
        return vote.vote == 1
    }).length < MINIMUM_REQUIRED_YEA_VOTES) {
        resultChannel.send(`There were not enough yea votes for the trial of ${trialGuild.members.cache.get(trial.targetId)}, so it has been tossed out. (3 yea votes are required)`)
        return
    }

    var netVote = 0
    trialVotes.map((vote: TrialVote) => {
        netVote = netVote + vote.vote
    })

    var netBribes = 0
    trialBribes.map((bribe: Bribe) => {
        switch (bribe.bribeVote) {
            case -1: netBribes = netBribes - bribe.bribeAmount
            break
            case 1: netBribes = netBribes + bribe.bribeAmount
            break
        }
    })

    var decision = netVote + bribeToVoteSwing(botConfig, netBribes) + await charismaToVoteSwing(trial)

    var trialLines = await getBotTrialLinesUseCase(botConfig, botApi)

    var targetMember = trialGuild.members.cache.get(trial.targetId)
    var accuserMember = trialGuild.members.cache.get(trial.accuserId)

    if (targetMember == undefined) {
        console.error('Target member not in guild?!')
        return
    }
    if (accuserMember == undefined) {
        console.error('Accuser member not in guild?!')
        return
    }

    resultChannel.send(`The trial of ${trialGuild.members.cache.get(trial.targetId)} has concluded!`)
    if (netVote > 0) {
        resultChannel.send(trialLines.find((line: TrialResultLine) => {return line.lineType == TrialLineType.JuryVotedGulag})!.trialLine)
    } else if (netVote < 0) {
        resultChannel.send(trialLines.find((line: TrialResultLine) => {return line.lineType == TrialLineType.JuryVotedNoGulag})!.trialLine)
    } else {
        resultChannel.send(trialLines.find((line: TrialResultLine) => {return line.lineType == TrialLineType.JuryVotedHung})!.trialLine)
    }

    if (decision >= 1) {
        if (netVote > 0) {
            resultChannel.send(trialLines.find((line: TrialResultLine) => {return line.lineType == TrialLineType.BotAgreeGulag})!.trialLine)
        } else if (netVote < 0) {
            resultChannel.send(trialLines.find((line: TrialResultLine) => {return line.lineType == TrialLineType.BotOverrideNoGulag})!.trialLine)
        } else {
            resultChannel.send(trialLines.find((line: TrialResultLine) => {return line.lineType == TrialLineType.BotGulagHung})!.trialLine)
        }
        gulagUser(guildConfig, targetMember, accuserMember, DateTime.now().toSeconds(), 50, gulagApi)
    } else if (decision <= -1) {
        if (netVote > 0) {
            resultChannel.send(trialLines.find((line: TrialResultLine) => {return line.lineType == TrialLineType.BotOverrideGulag})!.trialLine)
        } else if (netVote < 0) {
            resultChannel.send(trialLines.find((line: TrialResultLine) => {return line.lineType == TrialLineType.BotAgreeNoGulag})!.trialLine)
        } else {
            resultChannel.send(trialLines.find((line: TrialResultLine) => {return line.lineType == TrialLineType.BotNoGulagHung})!.trialLine)
        }
    } else {
        if (netVote > 0) {
            resultChannel.send(trialLines.find((line: TrialResultLine) => {return line.lineType == TrialLineType.BotHungGulag})!.trialLine)
        } else if (netVote < 0) {
            resultChannel.send(trialLines.find((line: TrialResultLine) => {return line.lineType == TrialLineType.BotHungNoGulag})!.trialLine)
        } else {
            resultChannel.send(trialLines.find((line: TrialResultLine) => {return line.lineType == TrialLineType.BotHungHung})!.trialLine)
        }
    }
}

function checkTrials() {
    schedule.scheduleJob(`10 * * * * *`, async function() {
        var trials = await getActiveTrialsUseCase(gulagApi)

        trials.forEach((trial: Trial) => {
            if (DateTime.now().toSeconds() - trial.timestamp > TRIAL_DURATION) {
                executeTrial(trial)
            }
        })
    })
}

export default function() {
    checkTrials()
}