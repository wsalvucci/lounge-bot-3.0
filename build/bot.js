"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const discord_js_1 = require("discord.js");
const Discord = require('discord.js');
const client = new Discord.Client({ intents: [discord_js_1.Intents.ALL] });
client.once('ready', () => {
    console.log('Ready!');
});
const user_1 = __importDefault(require("./commands/user"));
var commandModules = [
    user_1.default
];
client.on('message', async (message) => {
    if (!client.application?.owner)
        await client.application?.fetch();
    if (message.content.toLowerCase() === '!deploy' && message.author.id == client.application?.owner?.id) {
        const data = [];
        commandModules.forEach((cModule) => {
            cModule.commands.forEach((command) => {
                data.push(command.details);
            });
        });
        //const commands = await client.application.commands.set(data)
        const commands = await client.guilds.cache.get('695403120758489181')?.commands.set(data);
        console.log(commands);
    }
});
client.on('interaction', (interaction) => {
    if (!interaction.isCommand())
        return;
    commandModules.forEach((cModule) => {
        cModule.commands.forEach((command) => {
            if (interaction.commandName === command.details.name) {
                command.method(interaction);
            }
        });
    });
});
client.login(process.env.BOT_TOKEN);
exports.default = client;
//# sourceMappingURL=bot.js.map