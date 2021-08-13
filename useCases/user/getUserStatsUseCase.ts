import TheLoungeApi from "../../api/loungeApi";
import LoungeUser from "../../models/LoungeUser";
import UserStats from "../../models/UserStats";
import UserTitle from "../../models/UserTitle";
import getUserTitleUseCase from "./getUserTitleUseCase";
import { getLevelStats, statsToTitle } from '../../domain/loungeFunctions'

export default function getUserStatsUseCase(discordId: string, repository: typeof TheLoungeApi) : Promise<UserStats> {
    return repository.getUser(discordId)
        .then((user: LoungeUser) => {
            var stats = new UserStats(
                user.attributes.nickname,
                "",
                getLevelStats(
                    discordId,
                    user.stats.secondsVoice,
                    user.stats.messagesSent,
                    user.stats.usersSlapped,
                    user.stats.beenSlapped,
                    user.stats.usersGulaged,
                    user.stats.timesGulaged),
                statsToTitle(user.stats.secondsVoice, user.stats.messagesSent, user.stats.usersSlapped, user.stats.beenSlapped)
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