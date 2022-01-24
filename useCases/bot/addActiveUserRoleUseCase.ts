import botApi from "../../api/bot/botApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function addActiveUserRoleUseCase(discordId: string, roleId: string, expirationTime: number, repository: typeof botApi) : Promise<SqlResponse> {
    return repository.addActiveUserRole(discordId, roleId, expirationTime)
}