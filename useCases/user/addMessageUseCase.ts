import loungeApi from "../../api/loungeApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function addMessageUseCase(discordId: string, xp: number, repository: typeof loungeApi) : Promise<SqlResponse> {
    return repository.addMessage(discordId, xp)
}