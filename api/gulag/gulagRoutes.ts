import app from "../../domain/expressModule";
import processDatabaseRequest from "../processDatabaseRequest";
import { addSlapResponse, addTrial, addTrialBribe, addTrialVote, concludeTrial, getActiveGulags, getActiveTrials, getTrial, getTrialBribes, getTrialVotes, gulagUser, mineGulag, removeTrialBribe, unGulagUser } from "./gulagRequests";

app.get(`/gulag/addTrial`, (req: any, res: any) => {
    processDatabaseRequest(addTrial(req.query.guildId, req.query.accuserId, req.query.targetId, req.query.accusation, req.query.timestamp, req.query.judgeType), res)
})

app.get(`/gulag/addTrialVote`, (req: any, res: any) => {
    processDatabaseRequest(addTrialVote(req.query.trialId, req.query.voterId, req.query.vote), res)
})

app.get(`/gulag/getTrialVotes`, (req: any, res: any) => {
     processDatabaseRequest(getTrialVotes(req.query.trialId), res)
})

app.get(`/gulag/getTrial`, (req: any, res: any) => {
    processDatabaseRequest(getTrial(req.query.trialId), res)
})

app.get(`/gulag/getActiveTrials`, (req: any, res: any) => {
    processDatabaseRequest(getActiveTrials(), res)
})

app.get(`/gulag/concludeTrial`, (req: any, res: any) => {
    processDatabaseRequest(concludeTrial(req.query.trialId), res)
})

app.get(`/gulag/getTrialBribes`, (req: any, res: any) => {
    processDatabaseRequest(getTrialBribes(req.query.trialId), res)
})

app.get(`/gulag/addTrialBribe`, (req: any, res: any) => {
    processDatabaseRequest(addTrialBribe(req.query.trialId, req.query.discordId, req.query.amount, req.query.vote), res)
})

app.get(`/gulag/removeTrialBribe`, (req: any, res: any) => {
    processDatabaseRequest(removeTrialBribe(req.query.trialId, req.query.discordId), res)
})

app.get(`/gulag/gulagUser`, (req: any, res: any) => {
    processDatabaseRequest(gulagUser(req.query.userId, req.query.attackerId, req.query.timestamp, req.query.points), res)
})

app.get(`/gulag/unGulagUser`, (req: any, res: any) => {
    processDatabaseRequest(unGulagUser(req.query.userId), res)
})

app.get(`/gulag/mineGulag`, (req: any, res: any) => {
    processDatabaseRequest(mineGulag(req.query.userId, req.query.points), res)
})

app.get(`/gulag/activeGulags`, (req: any, res: any) => {
    processDatabaseRequest(getActiveGulags(), res)
})

app.get(`/gulag/addSlapResponse`, (req: any, res: any) => {
    processDatabaseRequest(addSlapResponse(req.query.userId, req.query.personalityId, req.query.responseType, req.query.responseText), res)
})