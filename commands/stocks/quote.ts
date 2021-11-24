import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
//import stocksApi from "../../api/stocks/stocksApi";
import Canvas, { createDefaultBackground, createText } from "../../domain/loungeCanvas";
import SlashCommand from "../../models/SlashCommand";
import Quote from "../../models/stocks/Quote";
//import getQuoteUseCase from "../../useCases/stocks/getQuoteUseCase";

async function quoteCanvas(ticker: string, quote: Quote) : Promise<Buffer> {
    const canvas = Canvas.createCanvas(1000, 500)
    const ctx = canvas.getContext('2d')

    if (quote.current < quote.open) {
        createDefaultBackground(canvas, ctx, "#AA0000", "#101010", 10)
    } else {
        createDefaultBackground(canvas, ctx, "#00AA00", "#101010", 10)
    }

    createText(ctx, "#ffffff", "36px Boldsand", ticker.toUpperCase(), 50, 50)

    return canvas.toBuffer()
}

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Gets the quote of a given ticker (ex. TSLA). Do not use the $ prefix')
        .addStringOption(option =>
            option.setName('ticker')
                .setDescription('The ticker of the stock you want to get a quote of')
                .setRequired(true)
        ),
    async (interaction: CommandInteraction) => {
        var ticker = interaction.options.getString('ticker', true)

        //var quoteData = await getQuoteUseCase(ticker, stocksApi)

        //console.log(quoteData)
    }
)

export default command