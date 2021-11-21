import betsApi from "../../api/bets/betsApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function placeBetUseCase(userId: string, betId: number, betSelection: number, betAmount: number, repository: typeof betsApi) : Promise<SqlResponse> {
    return repository.placeBet(userId, betId, betSelection, betAmount)
}