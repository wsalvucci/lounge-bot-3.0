import buttonApi from "../../api/button/buttonApi";
import UserButton from "../../models/button/UserButton";

export default function getAllButtonsUseCase(repository: typeof buttonApi) : Promise<UserButton[]> {
    return repository.getAllButtons()
}