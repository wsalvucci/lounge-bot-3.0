import loungeApi from "../../api/loungeApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function addHousePointEventUseCase(discordId: string, headmasterId: string, points: number, reason: string, houseId: number, timestamp: number, repository: typeof loungeApi): Promise<SqlResponse> {
    repository.incrementUserProperty(discordId, 'xp', points * 500)
    return repository.addHousePointEvent(discordId, headmasterId, points, reason, houseId, timestamp)
}