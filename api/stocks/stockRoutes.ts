import app from "../../domain/expressModule";
import processDatabaseRequest from "../processDatabaseRequest";
import { buyStock, getStocks, sellStock } from "./stockRequests";

app.get(`/stocks/buyStock`, (req: any, res: any) => {
    processDatabaseRequest(buyStock(req.query.discordId, req.query.stockSymbol, req.query.quantity, req.query.costPerShare, req.query.timestamp), res)
})

app.get(`/stocks/sellStock`, (req: any, res: any) => {
    processDatabaseRequest(sellStock(req.query.discordId, req.query.stockSymbol, req.query.quantity), res)
})

app.get(`/stocks/getStocks`, (req: any, res: any) => {
    processDatabaseRequest(getStocks(req.query.discordId), res)
})