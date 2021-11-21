import app from "../../domain/expressModule";
import processDatabaseRequest from "../processDatabaseRequest";
import { addBet, addBetOption, deleteUserBet, getBet, getBetOption, getBetOptions, getBets, getUserBet, getUserBets, placeBet, updateBet, updateBetOption } from "./betsRequests";

app.get(`/bets/getBets`, (req: any, res: any) => {
    processDatabaseRequest(getBets(req.query.timestamp), res)
})

app.get(`/bets/getBet`, (req: any, res: any) => {
    processDatabaseRequest(getBet(req.query.betId), res)
})

app.get(`/bets/addBet`, (req: any, res: any) => {
    processDatabaseRequest(addBet(req.query.betName, req.query.betDescription, req.query.openingTimestamp, req.query.closingTimestamp), res)
})

app.get(`/bets/updateBet`, (req: any, res: any) => {
    processDatabaseRequest(updateBet(req.query.betId, req.query.betName, req.query.betDescription, req.query.openingTimestamp, req.query.closingTimestamp), res)
})

app.get(`/bets/getBetOptions`, (req: any, res: any) => {
    processDatabaseRequest(getBetOptions(req.query.betId), res)
})

app.get(`/bets/getBetOption`, (req: any, res: any) => {
    processDatabaseRequest(getBetOption(req.query.betOptionId), res)
})

app.get(`/bets/addBetOption`, (req: any, res: any) => {
    processDatabaseRequest(addBetOption(req.query.betId, req.query.optionName, req.query.optionDescription, req.query.optionLine), res)
})

app.get(`/bets/updateBetOption`, (req: any, res: any) => {
    processDatabaseRequest(updateBetOption(req.query.betId, req.query.optionName, req.query.optionDescription, req.query.optionLine), res)
})

app.get(`/bets/getUserBets`, (req: any, res: any) => {
    processDatabaseRequest(getUserBets(req.query.userId), res)
})

app.get(`/bets/getUserBet`, (req: any, res: any) => {
    processDatabaseRequest(getUserBet(req.query.userId, req.query.betId), res)
})

app.get(`/bets/placeBet`, (req: any, res: any) => {
    processDatabaseRequest(placeBet(req.query.userId, req.query.betId, req.query.betSelection, req.query.betAmount), res)
})

app.get(`/bets/deleteUserBet`, (req: any, res: any) => {
    processDatabaseRequest(deleteUserBet(req.query.userId, req.query.betId), res)
})