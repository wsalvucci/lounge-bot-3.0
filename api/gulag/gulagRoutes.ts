import app from "../../domain/expressModule";
import processDatabaseRequest from "../processDatabaseRequest";
import { addTrial, addTrialVote, getActiveTrials, getTrial } from "./gulagRequests";

app.get(`/gulag/addTrial`, (req: any, res: any) => {
    processDatabaseRequest(addTrial(req.query.accuserId, req.query.targetId, req.query.accusation, req.query.timestamp, req.query.judgeType), res)
})

app.get(`/gulag/addTrialVote`, (req: any, res: any) => {
    processDatabaseRequest(addTrialVote(req.query.trialId, req.query.voterId, req.query.vote), res)
})

app.get(`/gulag/getTrial`, (req: any, res: any) => {
    processDatabaseRequest(getTrial(req.query.trialId), res)
})

app.get(`/gulag/getActiveTrials`, (req: any, res: any) => {
    processDatabaseRequest(getActiveTrials(), res)
})