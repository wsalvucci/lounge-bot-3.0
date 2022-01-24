import botApi from "../../api/bot/botApi";
import ActiveRole from "../../models/shop/ActiveRole";

export default function getAllActiveRolesUseCase(repository: typeof botApi) : Promise<ActiveRole[]> {
    return repository.getAllActiveRoles()
}