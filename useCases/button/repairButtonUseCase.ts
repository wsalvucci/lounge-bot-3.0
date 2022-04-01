import buttonApi from "../../api/button/buttonApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function repairButtonUseCase(discordId: string, timestamp: number, targetId: string, roundTime: number, roundTimeLeft: number, repository: typeof buttonApi) : Promise<SqlResponse> {
    return repository.takeAction(discordId, 3, timestamp, targetId, roundTime, roundTimeLeft, 0)
}