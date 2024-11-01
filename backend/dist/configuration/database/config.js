"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class Config {
    constructor() {
        this.user = process.env.DB_user;
        this.password = process.env.DB_pass;
        this.db = process.env.DB_CNN;
        this.retornar();
    }
    async retornar() {
        try {
            await mongoose_1.default.connect(`mongodb+srv://${this.user}:${this.password}@${this.db}`, {});
            console.log("DB online");
        }
        catch (error) {
            console.log(error);
            throw new Error("Error al iniciar la bd");
        }
    }
}
exports.Config = Config;
