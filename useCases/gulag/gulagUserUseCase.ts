import gulagApi from "../../api/gulag/gulagApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function gulagUserUseCase(userId: string, attackerId: string, timestamp: number, points: number, repository: typeof gulagApi) : Promise<SqlResponse> {
    return repository.gulagUser(userId, attackerId, timestamp, points)
}