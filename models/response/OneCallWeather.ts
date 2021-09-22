class OneCall {
    lat: number
    lon: number
    timezone: string
    timezoneOffset: number
    currentConditions: OneCallCurrentConditions
    warnings: OneCallWarning[] | undefined

    constructor (
        lat: number,
        lon: number,
        timezone: string,
        timezoneOffset: number,
        currentConditions: OneCallCurrentConditions,
        warnings: OneCallWarning[] | undefined
    ) {
        this.lat = lat
        this.lon = lon
        this.timezone = timezone
        this.timezoneOffset = timezoneOffset
        this.currentConditions = currentConditions
        this.warnings = warnings
    }

    static toOneCall(data: any) : OneCall {
        return new OneCall(
            data.lat,
            data.lon,
            data.timezone,
            data.timezone_offset,
            OneCallCurrentConditions.toOneCallCurrentConditions(data.current),
            OneCallWarning.toOneCallWarning(data.alerts)
        )
    }
}

class OneCallCurrentConditions {
    dt: number
    sunrise: number
    sunset: number
    temp: number
    feelsLike: number
    pressure: number
    humidity: number
    dewPoint: number
    uvi: number
    clouds: number
    visibility: number
    windSpeed: number
    windGust: number
    windDeg: number
    weather: OneCallCurrentWeather
    snow: OneCallCurrentPrecip | undefined
    rain: OneCallCurrentPrecip | undefined

    constructor(
        dt: number,
        sunrise: number,
        sunset: number,
        temp: number,
        feelsLike: number,
        pressure: number,
        humidity: number,
        dewPoint: number,
        uvi: number,
        clouds: number,
        visibility: number,
        windSpeed: number,
        windGust: number,
        windDeg: number,
        weather: OneCallCurrentWeather,
        snow: OneCallCurrentPrecip | undefined,
        rain: OneCallCurrentPrecip | undefined
    ) {
        this.dt = dt
        this.sunrise = sunrise
        this.sunset = sunset
        this.temp = temp
        this.feelsLike = feelsLike
        this.pressure = pressure
        this.humidity = humidity
        this.dewPoint = dewPoint
        this.uvi = uvi
        this.clouds = clouds
        this.visibility = visibility
        this.windSpeed = windSpeed
        this.windGust = windGust
        this.windDeg = windDeg
        this.weather = weather
        this.snow = snow
        this.rain = rain
    }

    static toOneCallCurrentConditions(data: any) : OneCallCurrentConditions {
        return new OneCallCurrentConditions(
            data.dt,
            data.sunrise,
            data.sunset,
            data.temp,
            data.feels_like,
            data.pressure,
            data.humidity,
            data.dew_point,
            data.uvi,
            data.clouds,
            data.visibility,
            data.wind_speed,
            data.wind_gust,
            data.wind_deg,
            OneCallCurrentWeather.toOneCallCurrentWeather(data.weather),
            OneCallCurrentPrecip.toOneCallCurrentPrecip(data.snow),
            OneCallCurrentPrecip.toOneCallCurrentPrecip(data.rain)
        )
    }
}

class OneCallCurrentWeather {
    id: number
    main: string
    description: string
    icon: string

    constructor (
        id: number,
        main: string,
        description: string,
        icon: string
    ) {
        this.id = id
        this.main = main
        this.description = description
        this.icon = icon
    }

    static toOneCallCurrentWeather(data: any) : OneCallCurrentWeather {
        return new OneCallCurrentWeather(
            data[0].id,
            data[0].main,
            data[0].description,
            data[0].icon
        )
    }
}

class OneCallCurrentPrecip {
    oneHour: number

    constructor (
        oneHour: number
    ) {
        this.oneHour = oneHour
    }

    static toOneCallCurrentPrecip(data: any) : OneCallCurrentPrecip | undefined {
        if (data !== undefined) {
            return new OneCallCurrentPrecip(data["1h"])
        } else {
            return undefined
        }
    }
}

class OneCallWarning {
    senderName: string
    event: string
    start: number
    end: number
    description: string

    constructor (
        senderName: string,
        event: string,
        start: number,
        end: number,
        description: string
    ) {
        this.senderName = senderName
        this.event = event
        this.start = start
        this.end = end
        this.description = description
    }

    static toOneCallWarning(data: any) : OneCallWarning[] | undefined {
        if (data !== undefined) {
            var warningsList = new Array()
            data.forEach((warning: any) => {
                warningsList.push(
                    new OneCallWarning(
                        warning.sender_name,
                        warning.event,
                        warning.start,
                        warning.end,
                        warning.description
                    )
                )
            });
            return warningsList
        } else {
            return undefined
        }
    }
}

export default OneCall