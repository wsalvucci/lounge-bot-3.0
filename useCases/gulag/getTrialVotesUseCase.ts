import gulagApi from "../../api/gulag/gulagApi";
import TrialVote from "../../models/gulag/Vote";

export default function getTrialVotesUseCase(trialId: number, repository: typeof gulagApi) : Promise<TrialVote[]> {
    return repository.getTrialVotes(trialId)
}