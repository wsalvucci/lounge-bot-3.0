class WeatherCoordinates {
    lon: number
    lat: number
    constructor(lon: number = 0, lat: number = 0) {
        this.lon = lon
        this.lat = lat
    }
}

class WeatherStatusList {
    list: WeatherStatus[]
    constructor(
        list: WeatherStatus[] = []
    ) {
        this.list = list
    }
}

class WeatherMain {
    temp: number
    feelsLike: number
    pressure: number
    humidity: number
    minTemp: number
    maxTemp: number
    seaLevel: number
    grndLevel: number

    constructor(
        temp: number = 0,
        feelsLike: number = 0,
        pressure: number = 0,
        humidity: number = 0,
        minTemp: number = 0,
        maxTemp: number = 0,
        seaLevel: number = 0,
        grndLevel: number = 0
    ) {
        this.temp = temp
        this.feelsLike = feelsLike
        this.minTemp = minTemp
        this.maxTemp = maxTemp
        this.pressure = pressure
        this.humidity = humidity
        this.seaLevel = seaLevel
        this.grndLevel = grndLevel
    }
}

class WeatherWind {
    speed: number
    deg: number
    gust: number

    constructor(
        speed: number = 0,
        deg: number = 0,
        gust: number = 0
    ) {
        this.speed = speed
        this.deg = deg
        this.gust = gust
    }
}

class WeatherClouds {
    all: number
    constructor(all: number = 0) { this.all = all }
}

class WeatherPrecip {
    oneHour: number
    threeHour: number

    constructor(
        oneHour: number = 0,
        threeHour: number = 0
    ) {
        this.oneHour = oneHour
        this.threeHour = threeHour
    }
}

class WeatherSys {
    type: number
    id: number
    message: number
    country: string
    sunrise: number
    sunset: number

    constructor(
        type: number = 0,
        id: number = 0,
        message: number = 0,
        country: string = "",
        sunrise: number = 0,
        sunset: number = 0
    ) {
        this.type = type
        this.id = id
        this.message = message
        this.country = country
        this.sunrise = sunrise
        this.sunset = sunset
    }
}


class WeatherStatus {
    id: number
    main: string
    description: string
    icon: string

    constructor(
        id: number = 0,
        main: string = "",
        description: string = "",
        icon: string = ""
    ) {
        this.id = id
        this.main = main
        this.description = description
        this.icon = icon
    }
}

class CurrentWeather {
    coordinates: WeatherCoordinates
    weather: WeatherStatusList
    base: string
    main: WeatherMain
    visibility: number
    wind: WeatherWind
    clouds: WeatherClouds
    // rain: WeatherPrecip
    // snow: WeatherPrecip
    dt: number
    sys: WeatherSys
    timezone: number
    id: number
    name: string
    cod: number
    
    constructor(
        coordinates: WeatherCoordinates = new WeatherCoordinates(),
        weather: WeatherStatusList = new WeatherStatusList(),
        base: string = "",
        main: WeatherMain = new WeatherMain(),
        visibility: number = -1,
        wind: WeatherWind = new WeatherWind(),
        clouds: WeatherClouds = new WeatherClouds(),
        // rain: WeatherPrecip,
        // snow: WeatherPrecip,
        dt: number = -1,
        sys: WeatherSys = new WeatherSys(),
        timezone: number = -1,
        id: number = -1,
        name: string = "",
        cod: number = -1
    ) {
        this.coordinates = coordinates
        this.weather = weather
        this.base = base
        this.main = main
        this.visibility = visibility
        this.wind = wind
        this.clouds = clouds
        // this.rain = rain
        // this.snow = snow
        this.dt = dt
        this.sys = sys
        this.timezone = timezone
        this.id = id
        this.name = name
        this.cod = cod
    }

    static toCurrentWeatherData(data: any) {
        var statusList: WeatherStatus[] = []
        data.weather.forEach((data: any) => {
            statusList.push(
                new WeatherStatus(data.id, data.main, data.description, data.icon)
            )
        });
        return new CurrentWeather(
            new WeatherCoordinates(
                data.coord.lon,
                data.coord.lat
            ),
            new WeatherStatusList(
                statusList
            ),
            data.base,
            new WeatherMain(
                data.main.temp,
                data.main.feels_like,
                data.main.pressure,
                data.main.humidity,
                data.main.temp_min,
                data.main.temp_max,
                data.main.sea_level,
                data.main.grnd_level
            ),
            data.visibility,
            new WeatherWind(
                data.wind.speed,
                data.wind.deg,
                data.wind.gust
            ),
            new WeatherClouds(
                data.clouds.all
            ),
            // new WeatherPrecip(
            //     data.rain['1h'],
            //     data.rain['3h']
            // ),
            // new WeatherPrecip(
            //     data.snow['1h'],
            //     data.snow['3h']
            // ),
            data.dt,
            new WeatherSys(
                data.sys.type,
                data.sys.id,
                data.sys.message,
                data.sys.country,
                data.sys.sunrise,
                data.sys.sunset
            ),
            data.timezone,
            data.id,
            data.name,
            data.cod
        )
    }
}

export default CurrentWeather