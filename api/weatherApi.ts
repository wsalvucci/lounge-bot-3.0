import CurrentWeather from "../models/response/CurrentWeather"
import fetch from 'node-fetch'
import OneCall from "../models/response/OneCallWeather"

const endpoint = process.env.WEATHER_API_ENDPOINT
const key = process.env.WEATHER_API_KEY

function apiCall(path: string) {
    return new Promise(function(resolve, reject) {
        fetch(`${endpoint}${path}&appid=${key}`)
            .then((res: { json: () => any }) => res.json())
            .then((json: string) => { resolve(json) })
            .catch((err: any) => reject(err))
    })
}

class WeatherApi {
    async getCurrentWeather(zipcode: string) : Promise<CurrentWeather> {
        return apiCall(`/weather?zip=${zipcode}&units=imperial`)
            .then((data: any) => CurrentWeather.toCurrentWeatherData(data))
    }

    async getDetailedCurrentWeather(lat: string, lon: string) : Promise<OneCall> {
        return apiCall(`/onecall?lat=${lat}&long=${lon}&units=imperial`)
            .then((data: any) => OneCall.toOneCall(data))
    }
}

export default new WeatherApi
