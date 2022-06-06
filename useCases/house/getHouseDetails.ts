import loungeApi from "../../api/loungeApi";
import House from "../../models/house/House";

export default function getHouseDetailsUseCase(houseId: number, repository: typeof loungeApi) : Promise<House> {
    return repository.getHouseDetails(houseId)
}