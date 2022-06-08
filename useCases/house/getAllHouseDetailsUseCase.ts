import loungeApi from "../../api/loungeApi";
import House from "../../models/house/House";

export default function getAllHouseDetailsUseCase(repository: typeof loungeApi) : Promise<House[]> {
    return repository.getAllHouseDetails()
}