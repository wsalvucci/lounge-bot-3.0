import betsApi from "../../api/bets/betsApi";
import UserBet from "../../models/bets/UserBet";

export default function getUserBetsOptionUseCase(userId: string, repository: typeof betsApi) : Promise<UserBet[]> {
    return repository.getUserBets(userId)
}