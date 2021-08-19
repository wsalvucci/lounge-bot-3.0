import Repository from "../../api/loungeApi";
import SqlResponse from "../../responseModels/SqlResponse";

export function createUserUseCase(discordId: string, name: string, timestamp: number, repository: typeof Repository) : Promise<SqlResponse> {
    return repository.createAccount(discordId, name, timestamp)
}