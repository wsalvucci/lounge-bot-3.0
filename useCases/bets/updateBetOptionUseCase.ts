import betsApi from "../../api/bets/betsApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function updateBetOptionUseCase(betId: number, optionName: string, optionDescription: string, optionLine: number, repository: typeof betsApi) : Promise<SqlResponse> {
    return repository.updateBetOption(betId, optionName, optionDescription, optionLine)
}