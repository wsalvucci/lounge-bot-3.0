import botApi from "../../api/bot/botApi";
import PersonalityFavor from "../../models/bot/PersonalityFavor";

export default function getPersonalityFavorUseCase(personalityId: number, userId: string, repository: typeof botApi) : Promise<PersonalityFavor> {
    return repository.getPersonalityFavor(personalityId, userId)
}