import stocksApi from "../../api/stocks/stocksApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function sellStockUseCase(discordId: string, stockSymbol: string, quantity: number, repository: typeof stocksApi) : Promise<SqlResponse> {
    return repository.sellStock(discordId, stockSymbol, quantity)
}