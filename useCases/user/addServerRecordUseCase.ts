import loungeApi from "../../api/loungeApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function addServerRecordUseCase(timestamp: number, messages: number, voice: number, repository: typeof loungeApi) : Promise<SqlResponse> {
    return repository.addServerRecord(timestamp, messages, voice)
}