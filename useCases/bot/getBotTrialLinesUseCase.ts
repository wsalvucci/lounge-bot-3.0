import botApi from "../../api/bot/botApi";
import BotPersonality from "../../models/bot/BotPersonality";
import { TrialResultLine } from "../../models/bot/TrialResultLine";

export default function getBotTrialLinesUseCase(botPersonality: BotPersonality, repository: typeof botApi) : Promise<TrialResultLine[]> {
    return repository.getTrialResultLines(botPersonality.id)
}