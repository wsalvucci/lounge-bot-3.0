import TheLoungeApi from "../../api/loungeApi";
import UserTitle from "../../models/UserTitle";

export default function getUserTitleUseCase(titleId: number, repository: typeof TheLoungeApi) : Promise<UserTitle> {
    return repository.getTitle(titleId).then((userTitle: UserTitle) => {
        return userTitle
    })
}