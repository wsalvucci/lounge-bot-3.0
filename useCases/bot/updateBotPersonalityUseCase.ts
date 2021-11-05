import botApi from "../../api/bot/botApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function updateBotPersonalityUseCase(id: number, repository: typeof botApi) : Promise<SqlResponse> {
    return botApi.updatePersonality(id)
}