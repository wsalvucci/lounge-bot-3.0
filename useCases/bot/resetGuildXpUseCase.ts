import botApi from "../../api/bot/botApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function resetGuildXpUseCase(guildId: string, repository: typeof botApi) : Promise<SqlResponse> {
    return repository.resetGuildXp(guildId)
}