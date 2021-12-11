const fetch = require("node-fetch")
import Quote from "../../models/stocks/Quote"
import UserStock from "../../models/stocks/UserStock"
import SqlResponse from "../../responseModels/SqlResponse"
import apiCall from "../apiCall"

const key = process.env.STOCKS_API_KEY
const iexEndpoint = 'https://cloud.iexapis.com/stable/'

function iexApiCall(path: string) {
    return new Promise(function(resolve, reject) {
        fetch(`${iexEndpoint}${path}&token=${key}`)
            .then((res: { json : () => any}) => res.json())
            .then((json: string) => {resolve(json)})
            .catch((err: any) => reject(err))
    })
}

class StocksApi {
    async getQuote(tickers: string[]) : Promise<Quote[]> {
        var tickerCombo = tickers.join(',')
        return iexApiCall(`tops?symbols=${tickerCombo}`)
            .then((data: any) => {
                var stockList : Quote[] = []
                data.forEach((stock: any) => {
                    stockList.push(Quote.toDomainModel(stock))
                });
                return stockList
            })
    }

    async buyStock(discordId: string, stockSymbol: string, quantity: number, costPerShare: number, timestamp: number) : Promise<SqlResponse> {
        return apiCall(`/stocks/buyStock?discordId=${discordId}&stockSymbol=${stockSymbol}&quantity=${quantity}&costPerShare=${costPerShare}&timestamp=${timestamp}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async sellStock(discordId: string, stockSymbol: string, quantity: number) : Promise<SqlResponse> {
        return apiCall(`/stocks/sellStock?discordId=${discordId}&stockSymbol=${stockSymbol}&quantity=${quantity}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async getStocks(discordId: string) : Promise<UserStock[]> {
        return apiCall(`/stocks/getStocks?discordId=${discordId}`)
            .then((data: any) => {
                var stocklist : UserStock[] = []
                data.forEach((stock: any) => {
                    if (stock.quantity > 0) {
                        stocklist.push(UserStock.toDomainModel(stock))
                    }
                });
                return stocklist
            })
    }
}

export default new StocksApi