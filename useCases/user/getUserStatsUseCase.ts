import TheLoungeApi from "../../api/loungeApi";
import LoungeUser from "../../models/LoungeUser";
import UserStats from "../../models/UserStats";
import UserTitle from "../../models/UserTitle";
import getUserTitleUseCase from "./getUserTitleUseCase";

export default function getUserStatsUseCase(discordId: string, repository: typeof TheLoungeApi) : Promise<UserStats> {
    return repository.getUser(discordId)
        .then((user: LoungeUser) => {
            var stats = new UserStats(
                user.attributes.nickname,
                ""
            )
            if (user.attributes.titleId !== undefined) {
                return getUserTitleUseCase(user.attributes.titleId, repository).then((userTitle: UserTitle) => {
                    stats.titleString = userTitle.name
                }).then(() => {
                    return stats
                })
            } else {
                return stats
            }
        })
}