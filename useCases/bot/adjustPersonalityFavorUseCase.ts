import botApi from "../../api/bot/botApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function adjustPersonalityFavorUseCase(personalityId: number, userId: string, amount: number, repository: typeof botApi) : Promise<SqlResponse> {
    return repository.adjustPersonalityFavor(personalityId, userId, amount)
}