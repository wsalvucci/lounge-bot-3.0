// const fetch = require("node-fetch")
// import client from "../../bot"
// import Quote from "../../models/stocks/Quote"

// const key = process.env.STOCKS_API_KEY
// const endpoint = ''

// const {Client} = require('iexjs')
// const iexClient = new Client({api_token: "pk_e9136c1903924aed8ce0a2d0f091fce1", version: "v1"})
// iexClient.chart({symbol: "AAPL", range: "1m"}).then((res: any) => {
//     console.log(res);
// });

// function apiCall(path: string) {
//     return new Promise(function(resolve, reject) {
//         fetch(`${endpoint}${path}&token=${key}`)
//             .then((res: { json : () => any}) => res.json())
//             .then((json: string) => {resolve(json)})
//             .catch((err: any) => reject(err))
//     })
// }

// class StocksApi {
//     async getQuote(ticker: string) : Promise<Quote> {
//         return apiCall(`quote?symbol=${ticker}`)
//             .then((data: any) => Quote.toDomainModel(data))
//     }
// }

// export default new StocksApi