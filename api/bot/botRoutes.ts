import app from "../../domain/expressModule";
import processDatabaseRequest from "../processDatabaseRequest";
import { addActiveUserRole, adjustGuildXp, adjustPersonalityFavor, getActiveUserRoles, getAllActiveRoles, getBotPersonalities, getCurrentPersonality, getGuild, getIntroLines, getPersonalityFavor, getRoleShop, getShopRoleInfo, getSlapResponseLines, getTrialResultLines, removeActiveUserRole, resetGuildXp, setBirthdayActive, updateBotPersonality } from "./botRequests";

app.get(`/bot/personalities`, (req: any, res: any) => {
    processDatabaseRequest(getBotPersonalities(), res)
})

app.get(`/bot/updatePersonality`, (req: any, res: any) => {
    processDatabaseRequest(updateBotPersonality(req.query.personalityId), res)
})

app.get(`/bot/getPersonality`, (req: any, res: any) => {
    processDatabaseRequest(getCurrentPersonality(), res)
})

app.get(`/bot/guild`, (req: any, res: any) => {
    processDatabaseRequest(getGuild(req.query.guildId), res)
})

app.get(`/bot/introLines`, (req: any, res: any) => {
    processDatabaseRequest(getIntroLines(req.query.personalityId), res)
})

app.get(`/bot/trialResultLines`, (req: any, res: any) => {
    processDatabaseRequest(getTrialResultLines(req.query.personalityId), res)
})

app.get(`/bot/slapResponseLines`, (req: any, res: any) => {
    processDatabaseRequest(getSlapResponseLines(req.query.personalityId, req.query.responseType), res)
})

app.get(`/guild/setBirthdayActive`, (req: any, res: any) => {
    processDatabaseRequest(setBirthdayActive(req.query.guildId, req.query.active), res)
})

app.get(`/bot/adjustPersonalityFavor`, (req: any, res: any) => {
    processDatabaseRequest(adjustPersonalityFavor(req.query.personalityId, req.query.userId, req.query.amount), res)
})

app.get(`/bot/getPersonalityFavor`, (req: any, res: any) => {
    processDatabaseRequest(getPersonalityFavor(req.query.personalityId, req.query.userId), res)
})

app.get(`/bot/adjustGuildXp`, (req: any, res: any) => {
    processDatabaseRequest(adjustGuildXp(req.query.guildId, req.query.amount), res)
})

app.get(`/bot/resetGuildXp`, (req: any, res: any) => {
    processDatabaseRequest(resetGuildXp(req.query.guildId), res)
})

app.get(`/bot/getAllActiveRoles`, (req: any, res: any) => {
    processDatabaseRequest(getAllActiveRoles(), res)
})

app.get(`/bot/getActiveRoles`, (req: any, res: any) => {
    processDatabaseRequest(getActiveUserRoles(req.query.discordId), res)
})

app.get(`/bot/addActiveUserRole`, (req: any, res: any) => {
    processDatabaseRequest(addActiveUserRole(req.query.discordId, req.query.roleId, req.query.expirationTime), res)
})

app.get(`/bot/removeActiveUserRole`, (req: any, res: any) => {
    processDatabaseRequest(removeActiveUserRole(req.query.discordId, req.query.roleId), res)
})

app.get(`/bot/getRoleShop`, (req: any, res: any) => {
    processDatabaseRequest(getRoleShop(), res)
})

app.get(`/bot/getShopRoleInfo`, (req: any, res: any) => {
    processDatabaseRequest(getShopRoleInfo(req.query.roleId), res)
})