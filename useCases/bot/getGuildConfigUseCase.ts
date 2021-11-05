import botApi from "../../api/bot/botApi";
import Guild from "../../models/bot/Guild";

export default function getGuildConfigUseCase(id: string, repository: typeof botApi) : Promise<Guild> {
    return repository.getGuild(id)
}