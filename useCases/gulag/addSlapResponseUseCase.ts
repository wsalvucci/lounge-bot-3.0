import gulagApi from "../../api/gulag/gulagApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function addSlapResponseUseCase(userId: string, personalityId: number, responseType: number, responseText: string, repository: typeof gulagApi) : Promise<SqlResponse> {
    return repository.addSlapResponse(userId, personalityId, responseType, responseText)
}