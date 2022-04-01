import buttonApi from "../../api/button/buttonApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function startNewRoundUseCase(guildId: string, roundStart: number, roundEnd: number, repository: typeof buttonApi) : Promise<SqlResponse> {
    return repository.startNewRound(guildId, roundStart, roundEnd)
}