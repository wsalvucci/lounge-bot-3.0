import botApi from "../../api/bot/botApi";
import ActiveRole from "../../models/shop/ActiveRole";

export default function getActiveRolesUseCase(discordId: string, repository: typeof botApi) : Promise<ActiveRole[]> {
    return repository.getActiveRoles(discordId)
}