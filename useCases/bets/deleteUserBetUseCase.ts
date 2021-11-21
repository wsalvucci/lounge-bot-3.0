import betsApi from "../../api/bets/betsApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function deleteUserBetUseCase(userId: string, betId: number, repository: typeof betsApi) : Promise<SqlResponse> {
    return repository.deleteUserBet(userId, betId)
}