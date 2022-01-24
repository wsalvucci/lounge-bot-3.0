import botApi from "../../api/bot/botApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function removeActiveUserRoleUseCase(discordId: string, roleId: string, repository: typeof botApi) : Promise<SqlResponse> {
    return repository.removeActiveUserRole(discordId, roleId)
}