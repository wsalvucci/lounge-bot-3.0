import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import SlashCommand from "../../models/SlashCommand";
import getCurrentWeatherUseCase from "../../useCases/weather/getCurrentWeatherUseCase";
import weatherApi from "../../api/weatherApi";
import CurrentWeather from "../../models/response/CurrentWeather";
import currentWeatherCanvas from "./canvas/currentWeatherCanvas";

enum Timeframe {
    CURRENT = 'current',
    HALFDAY = 'halfday',
    FIVEDAY = 'fiveday'
}

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Return various weather reports for any area in the US')
        .addIntegerOption(option => 
            option.setName('zipcode')
                .setDescription('The zipcode for the area you want the weather for')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('timeframe')
                .setDescription('What timeframe you want the weather for (Default: Current)')
                .addChoice('Current', Timeframe.CURRENT)
                .addChoice('12 Hour', Timeframe.HALFDAY)
                .addChoice('Five Day', Timeframe.FIVEDAY)),
    (interaction: CommandInteraction) => {
        var zipCode = interaction.options.getInteger('zipcode', true)
        if (isNaN(zipCode)) { 
            interaction.reply({content: 'You must supply a valid zipcode in the format of `12345`', ephemeral: true})
            return
        }
        var timeFrame = interaction.options.getString('timeframe')
        if (timeFrame === null) {
            getCurrentWeatherUseCase(zipCode, weatherApi)
                .then((weather: CurrentWeather) => {
                    currentWeatherCanvas(weather)
                        .then((attachment: Buffer) => {
                            interaction.reply({files: [{attachment: attachment}]})
                        })
                })
        } else {

        }
    }
)

export default command