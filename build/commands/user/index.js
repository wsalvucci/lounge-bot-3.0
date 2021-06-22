"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandModule_1 = __importDefault(require("../../models/CommandModule"));
const stats_1 = __importDefault(require("./stats"));
const moduleList = new CommandModule_1.default([
    stats_1.default
]);
exports.default = moduleList;
//# sourceMappingURL=index.js.map