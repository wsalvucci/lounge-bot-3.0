import loungeApi from "../../api/loungeApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function addUserRecordUseCase(discordId: string, timestamp: number, message: number, voice: number, repository: typeof loungeApi) : Promise<SqlResponse> {
    return repository.addPersonalRecord(discordId, timestamp, message, voice)
}