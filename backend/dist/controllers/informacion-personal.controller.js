"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InformacionPersonalController = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const informacion_personal_model_1 = __importDefault(require("../models/informacion-personal.model"));
class InformacionPersonalController {
    constructor() {
    }
    // Obtener todos los usuarios
    async createInformacionPersonal(req, res) {
        const { infp_name, infp_lastname, infp_telephone, infp_img, infp_birth_date } = req.body;
        const uid = req.params.id;
        try {
            // Paso 1: Verificar si el usuario existe
            const user = await user_model_1.default.findById(uid);
            if (!user) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No se encontró un usuario con ese ID.'
                });
            }
            const newInfo = new informacion_personal_model_1.default({
                infp_name,
                infp_lastname,
                infp_telephone,
                infp_img,
                infp_birth_date,
            });
            // Guardar en base de datos
            await newInfo.save();
            // Paso 4: Asociar la información personal al usuario
            user.usr_infp_id = newInfo._id.toString();
            const updatedUser = await user.save();
            res.json({
                ok: true,
                msg: 'Información personal creada y asociada correctamente.',
                data: {
                    user: updatedUser,
                    personalInfo: newInfo
                }
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                ok: false,
                msg: 'Error inesperado al crear la información personal.'
            });
        }
    }
    // Actualizar la información personal de un usuario
    async updateInformacionPersonal(req, res) {
        const { infp_name, infp_lastname, infp_telephone, infp_img, infp_birth_date } = req.body;
        const infp_id = req.params.infp_id; // ID de la información personal a actualizar
        const uid = req.params.id; // ID del usuario al que se le actualizará la información
        try {
            // Paso 1: Verificar si el usuario existe
            const user = await user_model_1.default.findById(uid);
            if (!user) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No se encontró un usuario con ese ID.'
                });
            }
            // Paso 2: Verificar si la información personal existe
            const personalInfo = await informacion_personal_model_1.default.findById(infp_id);
            if (!personalInfo) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No se encontró información personal con ese ID.'
                });
            }
            // Paso 3: Actualizar la información personal
            personalInfo.infp_name = infp_name || personalInfo.infp_name;
            personalInfo.infp_lastname = infp_lastname || personalInfo.infp_lastname;
            personalInfo.infp_telephone = infp_telephone || personalInfo.infp_telephone;
            personalInfo.infp_img = infp_img || personalInfo.infp_img;
            personalInfo.infp_birth_date = infp_birth_date || personalInfo.infp_birth_date;
            // Guardar los cambios de la información personal
            await personalInfo.save();
            // Paso 4: Responder con el resultado
            res.json({
                ok: true,
                msg: 'Información personal actualizada correctamente.',
                data: personalInfo
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                ok: false,
                msg: 'Error inesperado al actualizar la información personal.'
            });
        }
    }
    // Método para obtener la información personal por nombre
    async getPersonalInfoByName(req, res) {
        const { infp_name } = req.params; // Nombre que se busca
        try {
            // Buscar la información personal por nombre
            const personalInfo = await informacion_personal_model_1.default.find({ infp_name });
            if (personalInfo.length === 0) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No se encontró información personal con ese nombre.'
                });
            }
            res.json({
                ok: true,
                data: personalInfo
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener la información personal por nombre.'
            });
        }
    }
    // Método para obtener la información personal por fecha de nacimiento
    async getPersonalInfoByBirthDate(req, res) {
        const { infp_birth_date } = req.params; // Fecha de nacimiento a buscar
        try {
            // Convertir la fecha en formato Date para asegurar la comparación correcta
            const birthDate = new Date(infp_birth_date);
            // Buscar la información personal por fecha de nacimiento
            const personalInfo = await informacion_personal_model_1.default.find({ infp_birth_date: birthDate });
            if (personalInfo.length === 0) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No se encontró información personal con esa fecha de nacimiento.'
                });
            }
            res.json({
                ok: true,
                data: personalInfo
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener la información personal por fecha de nacimiento.'
            });
        }
    }
}
exports.InformacionPersonalController = InformacionPersonalController;
