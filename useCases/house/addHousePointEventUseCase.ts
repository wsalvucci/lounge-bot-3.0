import loungeApi from "../../api/loungeApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function addHousePointEventUseCase(discordId: string, headmasterId: string, points: number, reason: string, houseId: number, timestamp: number, repository: typeof loungeApi): Promise<SqlResponse> {
    return repository.addHousePointEvent(discordId, headmasterId, points, reason, houseId, timestamp)
}