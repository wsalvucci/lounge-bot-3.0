import app from "../../domain/expressModule";
import processDatabaseRequest from "../processDatabaseRequest";
import { adjustPersonalityFavor, getBotPersonalities, getCurrentPersonality, getGuild, getIntroLines, getPersonalityFavor, getSlapResponseLines, getTrialResultLines, setBirthdayActive, updateBotPersonality } from "./botRequests";

app.get(`/bot/personalities`, (req: any, res: any) => {
    processDatabaseRequest(getBotPersonalities(), res)
})

app.get(`/bot/updatePersonality`, (req: any, res: any) => {
    processDatabaseRequest(updateBotPersonality(req.query.personalityId), res)
})

app.get(`/bot/getPersonality`, (req: any, res: any) => {
    processDatabaseRequest(getCurrentPersonality(), res)
})

app.get(`/bot/guild`, (req: any, res: any) => {
    processDatabaseRequest(getGuild(req.query.guildId), res)
})

app.get(`/bot/introLines`, (req: any, res: any) => {
    processDatabaseRequest(getIntroLines(req.query.personalityId), res)
})

app.get(`/bot/trialResultLines`, (req: any, res: any) => {
    processDatabaseRequest(getTrialResultLines(req.query.personalityId), res)
})

app.get(`/bot/slapResponseLines`, (req: any, res: any) => {
    processDatabaseRequest(getSlapResponseLines(req.query.personalityId, req.query.responseType), res)
})

app.get(`/guild/setBirthdayActive`, (req: any, res: any) => {
    processDatabaseRequest(setBirthdayActive(req.query.guildId, req.query.active), res)
})

app.get(`/bot/adjustPersonalityFavor`, (req: any, res: any) => {
    processDatabaseRequest(adjustPersonalityFavor(req.query.personalityId, req.query.userId, req.query.amount), res)
})

app.get(`/bot/getPersonalityFavor`, (req: any, res: any) => {
    processDatabaseRequest(getPersonalityFavor(req.query.personalityId, req.query.userId), res)
})