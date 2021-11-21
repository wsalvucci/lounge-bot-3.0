import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import botApi from "../../api/bot/botApi";
import gulagApi from "../../api/gulag/gulagApi";
import { unGulagUser } from "../../domain/loungeFunctions";
import Gulag from "../../models/gulag/Gulag";
import SlashCommand from "../../models/SlashCommand";
import getGuildConfigUseCase from "../../useCases/bot/getGuildConfigUseCase";
import getActiveGulagsUseCase from "../../useCases/gulag/getActiveGulagsUseCase";
import mineGulagUseCase from "../../useCases/gulag/mineGulagUseCase";

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('mine')
        .setDescription('Toil away in the gulag and reduce your time by a set amount')
        .addStringOption(option =>
            option.setName('power')
                .setDescription('How risky of a swing to you want to make?')
                .setRequired(true)
                .addChoice('Normal (no risk)', 'normal')
                .addChoice('Aggressive (moderate risk)', 'aggressive')
                .addChoice('Radical (high risk)', 'radical')
        ),
    async (interaciton: CommandInteraction) => {
        var member = interaciton.member as GuildMember

        var activeGulags = await getActiveGulagsUseCase(gulagApi)
        var gulagStatus = activeGulags.find((gulag: Gulag) => {return gulag.victimId == member.id})

        if (gulagStatus == undefined) {
            interaciton.reply({content: `You are not currently in the gulag!`, ephemeral: true})
            return
        }

        var mineOption = interaciton.options.getString('power', true)
        var mineResult = 0

        switch(mineOption) {
            case 'normal': mineResult = 5; break
            case 'aggressive': mineResult = Math.max(Math.round(Math.random() * 20) - 10, 0); break
            case 'radical': mineResult = Math.max(Math.round(Math.random() * 40) - 25, 0); break
        }

        if (mineResult <= 0) {
            interaciton.reply({content: `You failed to mine anything properly.`})
        } else {
            mineGulagUseCase(member.id, mineResult, gulagApi)
            if (gulagStatus.points - mineResult <= 0) {
                interaciton.reply({content: `YOU HAVE FREED YOURSELF FROM THE GULAG!`})
                unGulagUser(await getGuildConfigUseCase(interaciton.guildId, botApi), member, gulagApi)
            } else {
                interaciton.reply({content: `Your hard work has reduced your sentence by ${mineResult} points. It is now ${gulagStatus.points - mineResult}.`})
            }
        }
    }
)

export default command