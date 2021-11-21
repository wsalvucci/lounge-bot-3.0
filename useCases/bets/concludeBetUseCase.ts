import betsApi from "../../api/bets/betsApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function concludeBetUseCase(betId: number, repository: typeof betsApi) : Promise<SqlResponse> {
    return repository.concludeBet(betId)
}