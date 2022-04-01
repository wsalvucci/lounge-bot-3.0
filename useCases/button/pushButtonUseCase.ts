import buttonApi from "../../api/button/buttonApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function pushButtonUseCase(discordId: string, timestamp: number, targetId: string, roundTime: number, roundTimeLeft: number, repository: typeof buttonApi) : Promise<SqlResponse> {
    return repository.takeAction(discordId, 1, timestamp, targetId, roundTime, roundTimeLeft, 0)
}