import app from "../../domain/expressModule";
import processDatabaseRequest from "../processDatabaseRequest";
import { getBotPersonalities, getCurrentPersonality, getGuild, getIntroLines, getTrialResultLines, updateBotPersonality } from "./botRequests";

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