import betsApi from "../../api/bets/betsApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function updateBetUseCase(betId: number, betName: string, betDescription: string, openingTimestamp: number, closingTimestamp: number, repository: typeof betsApi) : Promise<SqlResponse> {
    return repository.updateBet(betId, betName, betDescription, openingTimestamp, closingTimestamp)
}