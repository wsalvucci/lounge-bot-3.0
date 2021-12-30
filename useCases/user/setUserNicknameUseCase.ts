import TheLoungeApi from "../../api/loungeApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function setUserNicknameUseCase(discordId: string, nickname: string, repository: typeof TheLoungeApi) : Promise<SqlResponse> {
    return repository.setUserProperty(discordId, 'nickname', nickname)
}