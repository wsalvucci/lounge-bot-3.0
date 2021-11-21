import gulagApi from "../../api/gulag/gulagApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function mineGulagUseCase(userId: string, points: number, repository: typeof gulagApi) : Promise<SqlResponse> {
    return repository.mineGulag(userId, points)
}