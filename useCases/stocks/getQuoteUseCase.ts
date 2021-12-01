import stocksApi from "../../api/stocks/stocksApi";
import Quote from "../../models/stocks/Quote";

export default function getQuoteUseCase(tickers: string[], repository: typeof stocksApi) : Promise<Quote[]> {
    return repository.getQuote(tickers)
}