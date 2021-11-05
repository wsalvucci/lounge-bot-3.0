import botApi from "../../api/bot/botApi";

export default function getBotPersonalityIntroLinesUseCase(id: number, repository: typeof botApi) : Promise<string[]> {
    return botApi.getPersonalityIntros(id)
}