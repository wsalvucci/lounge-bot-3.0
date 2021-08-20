import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, User } from "discord.js";
import SlashCommand from "../../models/SlashCommand";
import { getPersonalRecordsUseCase } from "../../useCases/user/getPersonalRecordsUseCase";
import Repository from '../../api/loungeApi'
import Canvas, { createText } from "../../domain/loungeCanvas"
import { PersonalRecordResponse, PersonalRecordsResponse } from "../../models/response/PersonalRecordsResponse";
import { DateTime } from 'luxon'

async function getPersonalRecordsCanvas(user: User, records: PersonalRecordResponse[]) : Promise<Buffer> {
    const canvas = Canvas.createCanvas(1000, 350)
    const ctx = canvas.getContext('2d')

    var primaryColor = '#33303C'
    var secondaryColor = '#282430'

    var grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    grd.addColorStop(0, primaryColor)
    grd.addColorStop(0.15, primaryColor)
    grd.addColorStop(0.16, secondaryColor)
    grd.addColorStop(0.60, secondaryColor)
    grd.addColorStop(0.61, primaryColor)
    grd.addColorStop(1, primaryColor)
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    createText(ctx, '#ffffff', '48px Boldsand', `${user.username}'s Personal Records`, 50, 50)

    createText(ctx, '#ffffff', '72px Boldsand', 'Message Record', 50, canvas.height * 0.4)
    createText(ctx, '#ffffff', '72px Boldsand', 'Voice Record', 50, canvas.height * 0.8)

    var maxMessageRecord = new PersonalRecordResponse(
        -1, -1, "", -1, -1
    )
    var maxVoiceRecord = new PersonalRecordResponse(
        -1, -1, "", -1, -1
    )
    records.forEach((record: PersonalRecordResponse) => {
        if (record.totalMessage > maxMessageRecord.totalMessage) maxMessageRecord = record
        if (record.totalVoice > maxVoiceRecord.totalVoice) maxVoiceRecord = record
    })

    createText(ctx, '#ffffff', '72px Boldsand', `${maxMessageRecord.totalMessage}`, 900, canvas.height * 0.4, 'right')
    createText(ctx, '#ffffff', '72px Boldsand', `${maxVoiceRecord.totalVoice.withCommas()}`, 900, canvas.height * 0.8, 'right')

    createText(ctx, '#ffffff', '36px Quicksand', `Set on ${DateTime.fromSeconds(maxMessageRecord.timestamp).toFormat('MMMM dd, yyyy')}`, 50, canvas.height * 0.4 + 50)
    createText(ctx, '#ffffff', '36px Quicksand', `Set on ${DateTime.fromSeconds(maxVoiceRecord.timestamp).toFormat('MMMM dd, yyyy')}`, 50, canvas.height * 0.8 + 50)

    return canvas.toBuffer()
}

const command = new SlashCommand(
    new SlashCommandBuilder()
        .setName('personalrecords')
        .setDescription('Returns your personal records for The Lounge')
        .addBooleanOption(option =>
            option.setName('hidden')
                .setDescription('Whether to display your personal records to everyone.')
        ),
    (interaction: CommandInteraction) => {
        if (interaction.member == null) return
        var hideFromChat = interaction.options.getBoolean('hidden')
        getPersonalRecordsUseCase(interaction.member.user.id, Repository)
            .then((records : PersonalRecordsResponse) => {
                if (!(interaction.member?.user instanceof User)) return
                getPersonalRecordsCanvas(interaction.member.user, records.records)
                    .then((attachment: Buffer) => {
                        interaction.reply(
                            {
                                files: [
                                    {
                                        attachment: attachment
                                    }
                                ],
                                ephemeral: hideFromChat !== null ? hideFromChat : false
                            }
                        )
                    })
            })
    }
)

export default command