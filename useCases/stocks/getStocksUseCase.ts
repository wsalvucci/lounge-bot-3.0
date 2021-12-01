import stocksApi from "../../api/stocks/stocksApi";
import UserStock from "../../models/stocks/UserStock";

export default function getStocksUseCase(discordId: string, repository: typeof stocksApi) : Promise<UserStock[]> {
    return repository.getStocks(discordId)
}