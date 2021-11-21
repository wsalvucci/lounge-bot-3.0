import botApi from "../../api/bot/botApi";
import GuildConfig from "../../models/bot/Guild";

export default function getGuildConfigUseCase(id: string, repository: typeof botApi) : Promise<GuildConfig> {
    return repository.getGuild(id)
}