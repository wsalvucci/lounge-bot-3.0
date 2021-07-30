import TheLoungeApi from "../../api/loungeApi";
import SqlResponse from "../../responseModels/SqlResponse";

export default function setUserNicknameUseCase(discordId: string, nickname: string, repository: typeof TheLoungeApi) : Promise<SqlResponse> {
    return repository.setNickname(discordId, nickname.toString()).then((response: SqlResponse) => {
        return response
    })
}