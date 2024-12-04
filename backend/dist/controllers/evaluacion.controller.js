"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluacionController = void 0;
const evaluacion_model_1 = __importDefault(require("../models/evaluacion.model")); // Asegúrate de importar el modelo de Examen
class EvaluacionController {
    constructor() {
    }
    // Crear una nueva evaluación
    async createEvaluacion(req, res) {
        const { eva_exm_id, eva_student_usr_id, eva_date, eva_score, eva_feedback } = req.body;
        try {
            // Crear la evaluación
            const nuevaEvaluacion = new evaluacion_model_1.default({
                eva_exam_id: eva_exm_id,
                eva_student_usr_id,
                eva_date,
                eva_score,
                eva_feedback
            });
            // Guardar la evaluación en la base de datos
            await nuevaEvaluacion.save();
            return res.json({
                ok: true,
                msg: 'Evaluación creada exitosamente',
                evaluacion: nuevaEvaluacion
            });
        }
        catch (error) {
            console.error('Error al crear la evaluación:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al crear la evaluación.'
            });
        }
    }
    // Obtener evaluación por ID
    async getEvaluacionById(req, res) {
        const { eva_id } = req.params;
        try {
            const evaluacion = await evaluacion_model_1.default.findById(eva_id).populate('eva_exam_id eva_student_usr_id');
            if (!evaluacion) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Evaluación no encontrada.'
                });
            }
            return res.json({
                ok: true,
                evaluacion
            });
        }
        catch (error) {
            console.error('Error al obtener la evaluación:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener la evaluación.'
            });
        }
    }
    // Obtener evaluaciones por ID de examen
    async getEvaluacionesByExamenId(req, res) {
        const { eva_exm_id } = req.params;
        try {
            const evaluaciones = await evaluacion_model_1.default.find({ eva_exam_id: eva_exm_id }).populate('eva_exam_id eva_student_usr_id');
            return res.json({
                ok: true,
                evaluaciones
            });
        }
        catch (error) {
            console.error('Error al obtener evaluaciones por examen:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener evaluaciones por examen.'
            });
        }
    }
    // Obtener evaluaciones por ID de estudiante
    async getEvaluacionesByStudentId(req, res) {
        const { eva_student_usr_id } = req.params;
        try {
            const evaluaciones = await evaluacion_model_1.default.find({ eva_student_usr_id }).populate('eva_exam_id eva_student_usr_id');
            return res.json({
                ok: true,
                evaluaciones
            });
        }
        catch (error) {
            console.error('Error al obtener evaluaciones por estudiante:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener evaluaciones por estudiante.'
            });
        }
    }
    // Actualizar evaluación (puntaje y retroalimentación)
    async updateEvaluacion(req, res) {
        const { eva_id } = req.params;
        const { eva_score, eva_feedback } = req.body;
        try {
            const evaluacion = await evaluacion_model_1.default.findById(eva_id);
            if (!evaluacion) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Evaluación no encontrada.'
                });
            }
            evaluacion.eva_score = eva_score;
            evaluacion.eva_feedback = eva_feedback;
            await evaluacion.save();
            return res.json({
                ok: true,
                msg: 'Evaluación actualizada exitosamente',
                evaluacion
            });
        }
        catch (error) {
            console.error('Error al actualizar la evaluación:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al actualizar la evaluación.'
            });
        }
    }
    // Eliminar una evaluación
    async deleteEvaluacion(req, res) {
        const { eva_id } = req.params;
        try {
            const evaluacion = await evaluacion_model_1.default.findByIdAndDelete(eva_id);
            if (!evaluacion) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Evaluación no encontrada.'
                });
            }
            return res.json({
                ok: true,
                msg: 'Evaluación eliminada exitosamente'
            });
        }
        catch (error) {
            console.error('Error al eliminar la evaluación:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al eliminar la evaluación.'
            });
        }
    }
    // Obtener evaluaciones por rango de fechas
    async getEvaluacionesByDateRange(req, res) {
        const { startDate, endDate } = req.body;
        try {
            const evaluaciones = await evaluacion_model_1.default.find({
                eva_date: { $gte: new Date(startDate), $lte: new Date(endDate) }
            }).populate('eva_exam_id eva_student_usr_id');
            return res.json({
                ok: true,
                evaluaciones
            });
        }
        catch (error) {
            console.error('Error al obtener evaluaciones por fecha:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener evaluaciones por fecha.'
            });
        }
    }
    // Obtener el puntaje promedio de un examen
    async getAverageScoreByExamenId(req, res) {
        const { eva_exm_id } = req.params;
        try {
            // Buscar las evaluaciones asociadas al examen
            const evaluaciones = await evaluacion_model_1.default.find({ eva_exam_id: eva_exm_id });
            // Si no se encuentran evaluaciones, devolver un error
            if (evaluaciones.length === 0) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No se encontraron evaluaciones para este examen.'
                });
            }
            // Calcular la suma total de los puntajes de las evaluaciones
            const totalScore = evaluaciones.reduce((sum, evaluacion) => sum + evaluacion.eva_score, 0);
            // Calcular el puntaje promedio
            const averageScore = totalScore / evaluaciones.length;
            return res.json({
                ok: true,
                averageScore
            });
        }
        catch (error) {
            console.error('Error al obtener el puntaje promedio del examen:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener el puntaje promedio del examen.'
            });
        }
    }
    // Obtener evaluaciones por puntaje mínimo
    async getEvaluacionesByScoreThreshold(req, res) {
        const { minScore } = req.params;
        try {
            const evaluaciones = await evaluacion_model_1.default.find({ eva_score: { $gte: minScore } }).populate('eva_exam_id eva_student_usr_id');
            return res.json({
                ok: true,
                evaluaciones
            });
        }
        catch (error) {
            console.error('Error al obtener evaluaciones por puntaje:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener evaluaciones por puntaje.'
            });
        }
    }
    // Obtener retroalimentación de la evaluación
    async getEvaluacionFeedback(req, res) {
        const { eva_id } = req.params;
        try {
            const evaluacion = await evaluacion_model_1.default.findById(eva_id);
            if (!evaluacion) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Evaluación no encontrada.'
                });
            }
            return res.json({
                ok: true,
                feedback: evaluacion.eva_feedback
            });
        }
        catch (error) {
            console.error('Error al obtener la retroalimentación de la evaluación:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener la retroalimentación.'
            });
        }
    }
}
exports.EvaluacionController = EvaluacionController;
