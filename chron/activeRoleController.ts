import { DateTime } from 'luxon'
import schedule from 'node-schedule'
import botApi from '../api/bot/botApi'
import client from '../bot'
import ActiveRole from '../models/shop/ActiveRole'
import getAllActiveRolesUseCase from '../useCases/bot/getAllActiveRolesUseCase'
import removeActiveUserRoleUseCase from '../useCases/bot/removeActiveUserRoleUseCase'

function updateActiveRoles(guildId: string) {
    schedule.scheduleJob(`0 * * * * *`, async function() {
        var activeRoles = await getAllActiveRolesUseCase(botApi)

        activeRoles.forEach(async (role: ActiveRole) => {
            if (role.expirationTime < DateTime.now().toSeconds()) {
                await removeActiveUserRoleUseCase(role.discordId, role.roleId, botApi)
                var guildData = await client.guilds.fetch(guildId)
                var userData = await guildData.members.fetch(role.discordId)
                await userData.roles.remove(role.roleId)
            }
        });
    })
}

export default function(guildId: string) {
    updateActiveRoles(guildId)
}