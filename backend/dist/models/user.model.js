"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
;
;
const UserSchema = new mongoose_1.Schema({
    usr_name: { type: String, required: true },
    usr_username: { type: String, required: true },
    usr_email: { type: String, required: true },
    usr_password: { type: String, required: true },
    usr_telephone: { type: String, required: true },
    usr_recoveryToken: { type: String, default: '' },
    usr_img: { type: String },
    usr_role: { type: String /*  or Number */,
        required: true,
        default: 'USER_ROLE' /* or 0 */ },
    usr_google_access: {
        type: Boolean,
        default: false
    },
    usr_updatedAt: { type: Date },
    usr_createdAt: { type: Date, default: Date.now, required: true }
});
/* subscribir el method - renombrar _id   (MODO 2)  */
UserSchema.methods.toJSON = function () {
    const { _id, __v, password, ...data } = this.toObject();
    data.uid = _id;
    return data;
};
// usrusername, add usr_firstName and usr_lastName in interface and Schema
// UserSchema.virtual("usrusername").get(function(this: { usr_firstName: string, usr_lastName: string}) {
//     return this.usr_firstName + " " + this.usr_lastName ;
// }) ;
/* export the model and return your IUser interface */
exports.default = mongoose_1.default.model('User', UserSchema);
