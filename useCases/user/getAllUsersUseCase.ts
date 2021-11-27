import loungeApi from "../../api/loungeApi";
import LoungeUser from "../../models/LoungeUser";

export default function getAllUsersUseCase(repository: typeof loungeApi) : Promise<LoungeUser[]> {
    return repository.getAllUsers()
}