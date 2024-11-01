"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jwt = void 0;
/**Generate JWT */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Jwt {
    constructor() {
        this.key_vs = process.env.JWT_SECRET;
    }
    /**return promesa JWT */
    generateJWT(uid) {
        return new Promise((resolve, reject) => {
            const payload = {
                uid
            };
            /**sincrono */
            jsonwebtoken_1.default.sign(payload, this.key_vs, {
                expiresIn: '7d'
            }, (err, token) => {
                if (err) {
                    console.log(err);
                    reject('no se pudo generar el JWT');
                }
                else {
                    resolve(token);
                }
            });
        });
    }
    generateCodeRandonNoJWT(length) {
        let texto = '';
        let characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
        for (let i = 0; i < length; i++) {
            texto += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return texto;
    }
}
exports.Jwt = Jwt;
