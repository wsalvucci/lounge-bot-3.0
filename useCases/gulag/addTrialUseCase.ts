import gulagApi from "../../api/gulag/gulagApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function addTrialUseCase(accuserId: string, targetId: string, accusation: string, timestamp: number, judgeType: number, repository: typeof gulagApi) : Promise<SqlResponse> {
    return repository.addTrial(accuserId, targetId, accusation, timestamp, judgeType)
}