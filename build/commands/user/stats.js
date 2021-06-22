"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SlashCommand_1 = __importDefault(require("../../models/SlashCommand"));
const command = new SlashCommand_1.default({
    name: "stats",
    description: "Shows you your Lounge stats"
}, (interaction) => {
    interaction.reply('Pong!')
        .catch((err) => {
        console.error(err);
    });
});
exports.default = command;
//# sourceMappingURL=stats.js.map