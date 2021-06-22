"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbRequest_1 = __importDefault(require("./dbRequest"));
//The sole purpose of this file is to keep the database connection
//alive so it doesn't shut down after a few minutes of inactivity
setInterval(function () {
    dbRequest_1.default('SELECT 1', []);
}, 5000);
//# sourceMappingURL=keepAlive.js.map