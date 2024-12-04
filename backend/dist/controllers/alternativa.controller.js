"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlternativaController = void 0;
const alternativa_model_1 = __importDefault(require("../models/alternativa.model"));
class AlternativaController {
    constructor() {
    }
    // Crear una nueva alternativa
    async createAlternativa(req, res) {
        const { opt_pr_id, opt_text, opt_img, opt_description, opt_is_correct } = req.body;
        try {
            // Crear nueva alternativa
            const nuevaAlternativa = new alternativa_model_1.default({
                opt_pr_id,
                opt_text,
                opt_img,
                opt_description,
                opt_is_correct
            });
            // Guardar la nueva alternativa en la base de datos
            await nuevaAlternativa.save();
            return res.json({
                ok: true,
                msg: 'Alternativa creada exitosamente',
                alternativa: nuevaAlternativa
            });
        }
        catch (error) {
            console.error('Error al crear la alternativa:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al crear la alternativa.'
            });
        }
    }
    // Obtener alternativa por ID
    async getAlternativaById(req, res) {
        const { opt_id } = req.params;
        try {
            const alternativa = await alternativa_model_1.default.findById(opt_id);
            if (!alternativa) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Alternativa no encontrada.'
                });
            }
            return res.json({
                ok: true,
                alternativa
            });
        }
        catch (error) {
            console.error('Error al obtener la alternativa:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener la alternativa.'
            });
        }
    }
    // Obtener todas las alternativas por ID de pregunta
    async getAlternativasByPreguntaId(req, res) {
        const { opt_pr_id } = req.params;
        try {
            const alternativas = await alternativa_model_1.default.find({ opt_pr_id });
            return res.json({
                ok: true,
                alternativas
            });
        }
        catch (error) {
            console.error('Error al obtener las alternativas de la pregunta:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener las alternativas.'
            });
        }
    }
    // Actualizar alternativa
    async updateAlternativa(req, res) {
        const { opt_id } = req.params;
        const { opt_text, opt_img, opt_description } = req.body;
        try {
            const alternativa = await alternativa_model_1.default.findById(opt_id);
            if (!alternativa) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Alternativa no encontrada.'
                });
            }
            // Actualizar los campos de la alternativa
            alternativa.opt_text = opt_text;
            alternativa.opt_img = opt_img;
            alternativa.opt_description = opt_description;
            // Guardar la alternativa actualizada
            await alternativa.save();
            return res.json({
                ok: true,
                msg: 'Alternativa actualizada exitosamente',
                alternativa
            });
        }
        catch (error) {
            console.error('Error al actualizar la alternativa:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al actualizar la alternativa.'
            });
        }
    }
    // Eliminar alternativa
    async deleteAlternativa(req, res) {
        const { opt_id } = req.params;
        try {
            const alternativa = await alternativa_model_1.default.findById(opt_id);
            if (!alternativa) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Alternativa no encontrada.'
                });
            }
            // Eliminar la alternativa
            await alternativa_model_1.default.findByIdAndDelete(opt_id);
            return res.json({
                ok: true,
                msg: 'Alternativa eliminada exitosamente.'
            });
        }
        catch (error) {
            console.error('Error al eliminar la alternativa:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al eliminar la alternativa.'
            });
        }
    }
    // Obtener las alternativas correctas de una pregunta
    async getCorrectAlternativasByPreguntaId(req, res) {
        const { opt_pr_id } = req.params;
        try {
            const alternativasCorrectas = await alternativa_model_1.default.find({
                opt_pr_id,
                opt_is_correct: true
            });
            return res.json({
                ok: true,
                alternativasCorrectas
            });
        }
        catch (error) {
            console.error('Error al obtener las alternativas correctas:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener las alternativas correctas.'
            });
        }
    }
}
exports.AlternativaController = AlternativaController;
