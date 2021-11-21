import betsApi from "../../api/bets/betsApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function addBetOptionUseCase(betId: number, optionName: string, optionDescription: string, optionLine: number, repository: typeof betsApi) : Promise<SqlResponse> {
    return repository.addBetOption(betId, optionName, optionDescription, optionLine)
}