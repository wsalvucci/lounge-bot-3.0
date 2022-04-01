import buttonApi from "../../api/button/buttonApi";
import UserButton from "../../models/button/UserButton";

export default function getButtonUseCase(discordId: string, repository: typeof buttonApi) : Promise<UserButton> {
    return repository.getButton(discordId)
}