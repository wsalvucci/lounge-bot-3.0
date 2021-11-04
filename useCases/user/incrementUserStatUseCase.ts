import TheLoungeApi from "../../api/loungeApi"
import SqlResponse from "../../responseModels/SqlResponse";

export default function incrementUserStatUseCase(discordId: string, statName: string, amount: number, repository: typeof TheLoungeApi) : Promise<SqlResponse> {
    return repository.incrementUserProperty(discordId, statName, amount)
}