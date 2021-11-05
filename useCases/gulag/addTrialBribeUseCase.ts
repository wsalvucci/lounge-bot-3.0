import gulagApi from "../../api/gulag/gulagApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function addTrialBribeUseCase(trialId: number, discordId: string, bribeAmount: number, bribeVote: number, repository: typeof gulagApi) : Promise<SqlResponse> {
    return repository.addTrialBribe(trialId, discordId, bribeAmount, bribeVote)
}