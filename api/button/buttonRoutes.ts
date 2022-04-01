import app from "../../domain/expressModule";
import processDatabaseRequest from "../processDatabaseRequest";
import { addScore, getAllButtons, getButton, getRound, getScores, startNewRound, takeAction } from "./buttonRequests";

app.get(`/button/takeAction`, (req: any, res: any) => {
    processDatabaseRequest(takeAction(req.query.discordId, req.query.action, req.query.timestamp, req.query.targetId, req.query.roundTime, req.query.roundTimeLeft, req.query.breakButton), res)
})

app.get(`/button/getButton`, (req: any, res: any) => {
    processDatabaseRequest(getButton(req.query.discordId), res)
})

app.get(`/button/getAllButtons`, (req: any, res: any) => {
    processDatabaseRequest(getAllButtons(), res)
})

app.get(`/button/startNewRound`, (req: any, res: any) => {
    processDatabaseRequest(startNewRound(req.query.guildId, req.query.roundStart, req.query.roundEnd), res)
})

app.get(`/button/getRound`, (req: any, res: any) => {
    processDatabaseRequest(getRound(req.query.guildId), res)
})

app.get(`/button/addScore`, (req: any, res: any) => {
    processDatabaseRequest(addScore(req.query.discordId, req.query.points), res)
})
