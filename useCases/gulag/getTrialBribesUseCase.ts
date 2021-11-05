import gulagApi from "../../api/gulag/gulagApi";
import Bribe from "../../models/gulag/Bribe";

export default function getTrialBribesUseCase(trialId: number, repository: typeof gulagApi) : Promise<Bribe[]> {
    return repository.getTrialBribes(trialId)
}