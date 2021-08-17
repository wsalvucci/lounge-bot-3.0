import Repository from "../../api/loungeApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function setUserPropertyUseCase(discordId: string, propertyName: string, value: string | number, repository: typeof Repository) : Promise<SqlResponse> {
    return repository.setUserProperty(discordId, propertyName, value)
}