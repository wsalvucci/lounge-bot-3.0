import gulagApi from "../../api/gulag/gulagApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function addTrialUseCase(guildId: string, accuserId: string, targetId: string, accusation: string, timestamp: number, judgeType: number, repository: typeof gulagApi) : Promise<SqlResponse> {
    return repository.addTrial(guildId, accuserId, targetId, accusation, timestamp, judgeType)
}