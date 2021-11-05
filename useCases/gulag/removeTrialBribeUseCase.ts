import gulagApi from "../../api/gulag/gulagApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function removeTrialBribeUseCase(trialId: number, discordId: string, repository: typeof gulagApi) : Promise<SqlResponse> {
    return repository.removeTrialBribe(trialId, discordId)
}