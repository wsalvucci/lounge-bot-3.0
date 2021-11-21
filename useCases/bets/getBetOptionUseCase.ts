import betsApi from "../../api/bets/betsApi";
import BetOption from "../../models/bets/BetOption";

export default function getBetOptionUseCase(betOptionId: number, repository: typeof betsApi) : Promise<BetOption> {
    return repository.getBetOption(betOptionId)
}