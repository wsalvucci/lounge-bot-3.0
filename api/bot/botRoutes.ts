import app from "../../domain/expressModule";
import processDatabaseRequest from "../processDatabaseRequest";
import { getBotPersonalities, getGuild, getIntroLines, updateBotPersonality } from "./botRequests";

app.get(`/bot/personalities`, (req: any, res: any) => {
    processDatabaseRequest(getBotPersonalities(), res)
})

app.get(`/bot/updatePersonality`, (req: any, res: any) => {
    processDatabaseRequest(updateBotPersonality(req.query.personalityId), res)
})

app.get(`/bot/guild`, (req: any, res: any) => {
    processDatabaseRequest(getGuild(req.query.guildId), res)
})

app.get(`/bot/intoLines`, (req: any, res: any) => {
    processDatabaseRequest(getIntroLines(req.query.personalityId), res)
})