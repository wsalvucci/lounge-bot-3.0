import ActiveRole from "../../models/shop/ActiveRole";
import BotPersonality from "../../models/bot/BotPersonality";
import GuildConfig from "../../models/bot/Guild";
import PersonalityFavor from "../../models/bot/PersonalityFavor";
import SlapResponseLine from "../../models/bot/SlapResponseLine";
import { TrialResultLine } from "../../models/bot/TrialResultLine";
import SqlResponse from "../../responseModels/SqlResponse";
import apiCall from "../apiCall"
import ShopRole from "../../models/shop/ShopRole";

class BotApi {
    async getPersonalities() : Promise<BotPersonality[]> {
        return apiCall(`/bot/personalities`)
            .then((data: any) => {
                var personalityList: BotPersonality[] = []
                data.forEach((personality: any) => {
                    personalityList.push(BotPersonality.toDomainModel(personality))
                });
                return personalityList
            })
    }

    async getCurrentPersonality() : Promise<BotPersonality> {
        return apiCall('/bot/getPersonality')
            .then((data: any) => BotPersonality.toDomainModel(data[0]))
    }

    async updatePersonality(id: number) : Promise<SqlResponse> {
        return apiCall(`/bot/updatePersonality?personalityId=${id}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async getGuild(id: string) : Promise<GuildConfig> {
        return apiCall(`/bot/guild?guildId=${id}`)
            .then((data: any) => GuildConfig.toDomainModel(data[0]))
    }

    async getPersonalityIntros(id: number) : Promise<string[]> {
        return apiCall(`/bot/introLines?personalityId=${id}`)
            .then((data: any) => {
                var lines : string[] = []
                data.forEach((lineData : any) => {
                    lines.push(lineData.line)
                });
                return lines
            })
    }

    async getTrialResultLines(personalityId: number) : Promise<TrialResultLine[]> {
        return apiCall(`/bot/trialResultLines?personalityId=${personalityId}`)
            .then((data: any) => {
                var lines : TrialResultLine[] = []
                data.forEach((lineData : any) => {
                    lines.push(TrialResultLine.toDomainModel(lineData))
                });
                return lines
            })
    }

    async getSlapResponseLines(personalityId: number, responseType: number) : Promise<SlapResponseLine[]> {
        return apiCall(`/bot/slapResponseLines?personalityId=${personalityId}&responseType=${responseType}`)
            .then((data: any) => {
                var lines : SlapResponseLine[] = []
                data.forEach((lineData : any) => {
                    lines.push(SlapResponseLine.toDomainModel(lineData))
                });
                return lines
            })
    }

    async setActiveBirthday(guildId: string, active: number) : Promise<SqlResponse> {
        return apiCall(`/guild/setBirthdayActive?guildId=${guildId}&active=${active}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async adjustPersonalityFavor(personalityId: number, userId: string, amount: number) : Promise<SqlResponse> {
        return apiCall(`/bot/adjustPersonalityFavor?personalityId=${personalityId}&userId=${userId}&amount=${amount}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async getPersonalityFavor(personalityId: number, userId: string) : Promise<PersonalityFavor> {
        return apiCall(`/bot/getPersonalityFavor?personalityId=${personalityId}&userId=${userId}`)
            .then((data: any) => PersonalityFavor.toDomainModel(data[0]))
    }

    async adjustGuildXp(guildId: string, amount: number) : Promise<SqlResponse> {
        return apiCall(`/bot/adjustGuildXp?guildId=${guildId}&amount=${amount}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async resetGuildXp(guildId: string) : Promise<SqlResponse> {
        return apiCall(`/bot/resetGuildXp?guildId=${guildId}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async getAllActiveRoles() : Promise<ActiveRole[]> {
        return apiCall(`/bot/getAllActiveRoles`)
            .then((data: any) => {
                var roles : ActiveRole[] = []
                data.forEach((roleData: any) => {
                    roles.push(new ActiveRole(roleData.discordId, roleData.roleId, roleData.expirationTime))
                });
                return roles
            })
    }

    async getActiveRoles(discordId: string) : Promise<ActiveRole[]> {
        return apiCall(`/bot/getActiveRoles?discordId=${discordId}`)
            .then((data: any) => {
                var roles : ActiveRole[] = []
                data.forEach((roleData: any) => {
                    roles.push(new ActiveRole(roleData.discordId, roleData.roleId, roleData.expirationTime))
                });
                return roles
            })
    }

    async addActiveUserRole(discordId: string, roleId: string, expirationTime: number) : Promise<SqlResponse> {
        return apiCall(`/bot/addActiveUserRole?discordId=${discordId}&roleId=${roleId}&expirationTime=${expirationTime}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async removeActiveUserRole(discordId: string, roleId: string) : Promise<SqlResponse> {
        return apiCall(`/bot/removeActiveUserRole?discordId=${discordId}&roleId=${roleId}`)
            .then((data: any) => SqlResponse.dataToModel(data))
    }

    async getRoleShop() : Promise<ShopRole[]> {
        return apiCall(`/bot/getRoleShop`)
            .then((data: any) => {
                var shop : ShopRole[] = []
                data.forEach((roleData: any) => {
                    shop.push(new ShopRole(roleData.roleId, roleData.name, roleData.costPerDay))
                });
                return shop
            })
    }

    async getShopRoleInfo(roleId: string) : Promise<ShopRole> {
        return apiCall(`/bot/getShopRoleInfo?roleId=${roleId}`)
            .then((data: any) => ShopRole.toDomainModel(data[0]))
    }
}

export default new BotApi