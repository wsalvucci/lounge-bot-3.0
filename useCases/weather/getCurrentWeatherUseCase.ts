import CurrentWeather from "../../models/response/CurrentWeather";
import WeatherApi from '../../api/weatherApi'

export default function getCurrentWeatherUseCase(zipcode: number, repository: typeof WeatherApi) : Promise<CurrentWeather> {
    return repository.getCurrentWeather(zipcode.toString())
}