import botApi from "../../api/bot/botApi";
import SlapResponseLine from "../../models/bot/SlapResponseLine";

export default function getBotSlapResponseLinesUseCase(personalityId: number, responseType: number, repository: typeof botApi) : Promise<SlapResponseLine[]> {
    return repository.getSlapResponseLines(personalityId, responseType)
}