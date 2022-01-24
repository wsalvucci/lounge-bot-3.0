import botApi from "../../api/bot/botApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function adjustGuildXpUseCase(guildId: string, amount: number, repository: typeof botApi) : Promise<SqlResponse> {
    return repository.adjustGuildXp(guildId, amount)
}