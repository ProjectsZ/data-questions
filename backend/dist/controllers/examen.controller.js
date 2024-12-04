"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamenController = void 0;
const examen_model_1 = __importDefault(require("../models/examen.model"));
class ExamenController {
    constructor() {
    }
    // Crear un nuevo examen
    async createExamen(req, res) {
        const { exm_description, exm_status, exm_duration, exm_attempts, exm_teacher_user_id, exm_crs_id, exm_pr } = req.body;
        try {
            // Crear el examen
            const nuevoExamen = new examen_model_1.default({
                exm_description,
                exm_status,
                exm_duration,
                exm_attempts,
                exm_teacher_user_id,
                exm_crs_id,
                exm_pr
            });
            // Guardar el examen en la base de datos
            await nuevoExamen.save();
            return res.json({
                ok: true,
                msg: 'Examen creado exitosamente',
                examen: nuevoExamen
            });
        }
        catch (error) {
            console.error('Error al crear el examen:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al crear el examen.'
            });
        }
    }
    // Obtener un examen por ID
    async getExamenById(req, res) {
        const { exm_id } = req.params;
        try {
            const examen = await examen_model_1.default.findById(exm_id).populate('exm_pr exm_teacher_user_id exm_crs_id');
            if (!examen) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Examen no encontrado.'
                });
            }
            return res.json({
                ok: true,
                examen
            });
        }
        catch (error) {
            console.error('Error al obtener el examen:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener el examen.'
            });
        }
    }
    // Obtener exámenes por ID del profesor
    async getExamenesByTeacherId(req, res) {
        const { exm_teacher_usr_id } = req.params;
        try {
            const examenes = await examen_model_1.default.find({ exm_teacher_user_id: exm_teacher_usr_id }).populate('exm_pr exm_teacher_user_id exm_crs_id');
            return res.json({
                ok: true,
                examenes
            });
        }
        catch (error) {
            console.error('Error al obtener los exámenes del profesor:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener los exámenes del profesor.'
            });
        }
    }
    // Actualizar un examen
    async updateExamen(req, res) {
        const { exm_id } = req.params;
        const { exm_description, exm_status, exm_duration, exm_attempts } = req.body;
        try {
            const examen = await examen_model_1.default.findById(exm_id);
            if (!examen) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Examen no encontrado.'
                });
            }
            examen.exm_description = exm_description;
            examen.exm_status = exm_status;
            examen.exm_duration = exm_duration;
            examen.exm_attempts = exm_attempts;
            await examen.save();
            return res.json({
                ok: true,
                msg: 'Examen actualizado exitosamente',
                examen
            });
        }
        catch (error) {
            console.error('Error al actualizar el examen:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al actualizar el examen.'
            });
        }
    }
    // Eliminar un examen
    async deleteExamen(req, res) {
        const { exm_id } = req.params;
        try {
            const examen = await examen_model_1.default.findByIdAndDelete(exm_id);
            if (!examen) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Examen no encontrado.'
                });
            }
            return res.json({
                ok: true,
                msg: 'Examen eliminado exitosamente'
            });
        }
        catch (error) {
            console.error('Error al eliminar el examen:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al eliminar el examen.'
            });
        }
    }
    // Obtener los exámenes por su estado (activo/inactivo)
    async getExamenesByStatus(req, res) {
        const { exm_status } = req.params;
        try {
            const examenes = await examen_model_1.default.find({ exm_status }).populate('exm_pr exm_teacher_user_id exm_crs_id');
            return res.json({
                ok: true,
                examenes
            });
        }
        catch (error) {
            console.error('Error al obtener exámenes por estado:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener los exámenes por estado.'
            });
        }
    }
    // Obtener los exámenes por rango de fechas
    async getExamenesByDateRange(req, res) {
        const { startDate, endDate } = req.body;
        try {
            const examenes = await examen_model_1.default.find({
                exm_created_at: { $gte: new Date(startDate), $lte: new Date(endDate) }
            }).populate('exm_pr exm_teacher_user_id exm_crs_id');
            return res.json({
                ok: true,
                examenes
            });
        }
        catch (error) {
            console.error('Error al obtener exámenes por rango de fechas:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener exámenes por fecha.'
            });
        }
    }
    // Obtener la duración de un examen
    async getExamenDuration(req, res) {
        const { exm_id } = req.params;
        try {
            const examen = await examen_model_1.default.findById(exm_id);
            if (!examen) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Examen no encontrado.'
                });
            }
            return res.json({
                ok: true,
                duration: examen.exm_duration
            });
        }
        catch (error) {
            console.error('Error al obtener la duración del examen:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener la duración del examen.'
            });
        }
    }
    // Obtener los intentos permitidos de un examen
    async getExamenAttempts(req, res) {
        const { exm_id } = req.params;
        try {
            const examen = await examen_model_1.default.findById(exm_id);
            if (!examen) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Examen no encontrado.'
                });
            }
            return res.json({
                ok: true,
                attempts: examen.exm_attempts
            });
        }
        catch (error) {
            console.error('Error al obtener los intentos permitidos del examen:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener los intentos permitidos del examen.'
            });
        }
    }
}
exports.ExamenController = ExamenController;
