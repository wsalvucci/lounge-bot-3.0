import betsApi from "../../api/bets/betsApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function addBetUseCase(betName: string, betDescription: string, openingTimestamp: number, closingTimestamp: number, hiddenTimestamp: number, repository: typeof betsApi) : Promise<SqlResponse> {
    return repository.addBet(betName, betDescription, openingTimestamp, closingTimestamp, hiddenTimestamp)
}