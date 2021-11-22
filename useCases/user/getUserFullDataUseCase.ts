import loungeApi from "../../api/loungeApi";
import LoungeUser from "../../models/LoungeUser";

export default function getUserFullDataUseCase(discordId: string, repository: typeof loungeApi) : Promise<LoungeUser> {
    return repository.getUser(discordId)
}