import botApi from "../../api/bot/botApi";
import BotPersonality from "../../models/bot/BotPersonality";
import SqlResponse from "../../responseModels/SqlResponse";

export default function getBotPersonalitiesUseCase(repository: typeof botApi) : Promise<BotPersonality[]> {
    return botApi.getPersonalities()
}