"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const connection = mysql2_1.default.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB
});
function default_1(query) {
    return new Promise(function (resolve, reject) {
        connection.query(query, function (err, res) {
            if (err)
                reject(err);
            resolve(res);
        });
    });
}
exports.default = default_1;
//# sourceMappingURL=database.js.map