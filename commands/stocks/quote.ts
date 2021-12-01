import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import stocksApi from "../../api/stocks/stocksApi";
import Canvas, { createDefaultBackground, createText } from "../../domain/loungeCanvas";
import SlashCommand from "../../models/SlashCommand";
import Quote from "../../models/stocks/Quote";
import getQuoteUseCase from "../../useCases/stocks/getQuoteUseCase";

async function quoteCanvas(quote: Quote) : Promise<Buffer> {
    const canvas = Canvas.createCanvas(300, 150)
    const ctx = canvas.getContext('2d')
    createDefaultBackground(canvas, ctx)

    createText(ctx, "#ffffff", "36px Boldsand", quote.symbol.toUpperCase(), 25, 45)
    createText(ctx, '#ffffff', '48px Boldsand', `$${quote.lastSalePrice.toString()}`, 25, 100)
    createText(ctx, '#ffffff', '24px Quicksand', `Volume: ${quote.volume.withCommas()}`, 25, 135)

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

        var quoteData = await getQuoteUseCase([ticker], stocksApi)

        quoteCanvas(quoteData[0])
            .then((attachment: Buffer) => {
                interaction.reply({files: [{attachment: attachment}]})
            })
    }
)

export default command