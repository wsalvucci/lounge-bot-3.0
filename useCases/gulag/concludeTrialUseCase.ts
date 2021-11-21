import gulagApi from "../../api/gulag/gulagApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function concludeTrialUseCase(trialId: number, repository: typeof gulagApi) : Promise<SqlResponse> {
    return repository.concludeTrial(trialId)
}