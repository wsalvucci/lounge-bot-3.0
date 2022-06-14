import loungeApi from "../../api/loungeApi";
import House from "../../models/house/House";

export default function getHousePointsUseCase(houseId: number, startTime: number, endTime: number, repository: typeof loungeApi): Promise<{house: House, points: number}> {
    return repository.getHousePoints(houseId, startTime, endTime)
}