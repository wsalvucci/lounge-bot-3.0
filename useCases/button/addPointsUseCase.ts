import buttonApi from "../../api/button/buttonApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function addPointsUseCase(discordId: string, points: number, repository: typeof buttonApi) : Promise<SqlResponse> {
    return repository.addScore(discordId, points)
}