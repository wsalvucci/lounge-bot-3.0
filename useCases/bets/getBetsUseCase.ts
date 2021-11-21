import betsApi from "../../api/bets/betsApi";
import Bet from "../../models/bets/Bet";

export default function getBetsUseCase(startingTimestamp: number, endingTimestamp: number, repository: typeof betsApi) : Promise<Bet[]> {
    return repository.getBets(startingTimestamp, endingTimestamp)
}