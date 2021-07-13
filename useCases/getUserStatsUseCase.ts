import Repository from "../api/Repository";
import ErrorMessage from "../models/ErrorMessage";
import LoungeUserStats from "../models/LoungeUserStats";
import SqlResponse from "../responseModels/SqlResponse";
import LoungeUser from "../responseModels/LoungeUser"

export default function getUserStatsUseCase(discordId: string, repository: typeof Repository) : Promise<LoungeUserStats | ErrorMessage> {
    return repository.getUser(discordId).then((user: LoungeUser | SqlResponse) => {
        if (user instanceof LoungeUser) {
            return new LoungeUserStats(
                user.details.nickname,
                user.details.timeAdded,
                user.details.color,
                "",
                user.stats.messagesSent,
                user.stats.secondsVoice,
                user.stats.usersSlapped,
                user.stats.beenSlapped,
                user.stats.luck,
                user.stats.coins,
                user.stats.timesGulaged,
                user.stats.usersGulaged,
                user.stats.timeInGulag
            )
        } else if (user instanceof SqlResponse) {
            return new ErrorMessage(
                ""
            )
        } else {
            return new ErrorMessage("")
        }
    })
}