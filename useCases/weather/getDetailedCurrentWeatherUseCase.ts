import weatherApi from "../../api/weatherApi";
import OneCall from "../../models/response/OneCallWeather";

export default function getCurrentDetailedWeatherUseCase(lat: string, lon: string, repository: typeof weatherApi) : Promise<OneCall> {
    return repository.getDetailedCurrentWeather(lat, lon)
}