import botApi from "../../api/bot/botApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function setBirthdayActiveUseCase(guildId: string, active: number, repository: typeof botApi) : Promise<SqlResponse> {
    return repository.setActiveBirthday(guildId, active)
}