import gulagApi from "../../api/gulag/gulagApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function unGulagUserUseCase(userId: string, repository: typeof gulagApi) : Promise<SqlResponse> {
    return repository.unGulagUser(userId)
}