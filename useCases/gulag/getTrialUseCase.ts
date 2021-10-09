import gulagApi from "../../api/gulag/gulagApi";
import Trial from "../../models/gulag/Trial";

export default function getTrialUseCase(trialId: number, repository: typeof gulagApi): Promise<Trial> {
    return repository.getTrial(trialId)
}