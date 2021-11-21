import betsApi from "../../api/bets/betsApi";
import BetOption from "../../models/bets/BetOption";

export default function getBetOptionsUseCase(betId: number, repository: typeof betsApi) : Promise<BetOption[]> {
    return repository.getBetOptions(betId)
}