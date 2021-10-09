import gulagApi from "../../api/gulag/gulagApi";
import Trial from "../../models/gulag/Trial";

export default function getActiveTrialsUseCase(repository: typeof gulagApi): Promise<Trial[]> {
    return gulagApi.getActiveTrials()
}