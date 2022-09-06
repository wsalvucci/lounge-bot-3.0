import botApi from "api/bot/botApi";
import BotConfig from "models/bot/BotConfig";

export default function getBotConfigUseCase(repository: typeof botApi) : Promise<BotConfig> {
    return repository.getBotConfig()
}