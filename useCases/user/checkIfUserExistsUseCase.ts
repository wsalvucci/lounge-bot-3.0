import TheLoungeApi from "../../api/loungeApi"
import LoungeUser from "../../models/LoungeUser"

export default function checkIfUserExistsUseCase(discordId: string, repository: typeof TheLoungeApi) : Promise<Boolean> {
    return repository.checkIfUserExists(discordId)
}