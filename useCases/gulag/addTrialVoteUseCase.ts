import gulagApi from "../../api/gulag/gulagApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function addTrialVoteUseCase(trialId: number, voterId: string, vote: number, repository: typeof gulagApi): Promise<SqlResponse> {
    return repository.addTrialVote(trialId, voterId, vote)
}