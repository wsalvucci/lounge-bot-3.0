import loungeApi from "../../api/loungeApi";
import LoungeUser from "../../models/LoungeUser";

export default function getUserPointsUseCase(discordId: string, startTime: number, endTime: number, repository: typeof loungeApi): Promise<{user: LoungeUser, points: number}> {
    return repository.getUserPoints(discordId, startTime, endTime)
}