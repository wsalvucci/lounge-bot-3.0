import botApi from "../../api/bot/botApi";
import BotPersonality from "../../models/bot/BotPersonality";

export default function getCurrentBotPersonalityUseCase(repository: typeof botApi) : Promise<BotPersonality> {
    return repository.getCurrentPersonality()
}