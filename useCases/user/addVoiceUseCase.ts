import loungeApi from "../../api/loungeApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function addVoiceUseCase(discordId: string, amount: number, xp: number, repository: typeof loungeApi) : Promise<SqlResponse> {
    return repository.addVoice(discordId, amount, xp)
}