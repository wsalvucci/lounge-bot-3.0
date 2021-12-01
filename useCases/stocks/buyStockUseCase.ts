import stocksApi from "../../api/stocks/stocksApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function buyStockUseCase(discordId: string, stockSymbol: string, quantity: number, costPerShare: number, timestamp: number, repository: typeof stocksApi): Promise<SqlResponse> {
    return repository.buyStock(discordId, stockSymbol, quantity, costPerShare, timestamp)
}