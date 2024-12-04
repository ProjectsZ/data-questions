"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluacionRoute = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
// Middlewares
const validate_data_custom_1 = require("./../middlewares/validate-data.custom");
const validate_jwt_custom_1 = require("./../middlewares/validate-jwt.custom");
// Controllers
const evaluacion_controller_1 = require("../controllers/evaluacion.controller");
class EvaluacionRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        // Instanciamos el controlador
        this.evaluacionC = new evaluacion_controller_1.EvaluacionController();
        // Instanciamos los middlewares de validación
        this.validarCampos = new validate_data_custom_1.ValidateData();
        this.validarJWT = new validate_jwt_custom_1.ValidateJWTcustom();
        // Inicializamos las rutas
        this.postCreateEvaluacion();
        this.getEvaluacionById();
        this.getEvaluacionesByExamenId();
        this.getEvaluacionesByStudentId();
        this.putUpdateEvaluacion();
        this.deleteEvaluacion();
        this.getEvaluacionesByDateRange();
        this.getAverageScoreByExamenId();
        this.getEvaluacionesByScoreThreshold();
        this.getEvaluacionFeedback();
    }
    // Ruta para crear una nueva evaluación
    postCreateEvaluacion() {
        this.router.post('/', [
            // Validaciones de los datos
            (0, express_validator_1.check)('eva_exm_id', 'El ID del examen es obligatorio').not().isEmpty(),
            (0, express_validator_1.check)('eva_student_usr_id', 'El ID del estudiante es obligatorio').not().isEmpty(),
            (0, express_validator_1.check)('eva_date', 'La fecha de la evaluación es obligatoria').isDate(),
            (0, express_validator_1.check)('eva_score', 'El puntaje de la evaluación es obligatorio').isNumeric().withMessage('El puntaje debe ser un número'),
            (0, express_validator_1.check)('eva_feedback', 'La retroalimentación es obligatoria').not().isEmpty(),
            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req, res) => {
            this.evaluacionC.createEvaluacion(req, res);
        });
    }
    // Ruta para obtener una evaluación por ID
    getEvaluacionById() {
        this.router.get('/:eva_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.evaluacionC.getEvaluacionById(req, res);
        });
    }
    // Ruta para obtener evaluaciones por ID de examen
    getEvaluacionesByExamenId() {
        this.router.get('/examen/:eva_exm_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.evaluacionC.getEvaluacionesByExamenId(req, res);
        });
    }
    // Ruta para obtener evaluaciones por ID de estudiante
    getEvaluacionesByStudentId() {
        this.router.get('/estudiante/:eva_student_usr_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.evaluacionC.getEvaluacionesByStudentId(req, res);
        });
    }
    // Ruta para actualizar evaluación (puntaje y retroalimentación)
    putUpdateEvaluacion() {
        this.router.put('/:eva_id', [
            // Validaciones de los datos
            (0, express_validator_1.check)('eva_score', 'El puntaje de la evaluación es obligatorio').optional().isNumeric().withMessage('El puntaje debe ser un número'),
            (0, express_validator_1.check)('eva_feedback', 'La retroalimentación es obligatoria').optional().not().isEmpty(),
            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req, res) => {
            this.evaluacionC.updateEvaluacion(req, res);
        });
    }
    // Ruta para eliminar una evaluación
    deleteEvaluacion() {
        this.router.delete('/:eva_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.evaluacionC.deleteEvaluacion(req, res);
        });
    }
    // Ruta para obtener evaluaciones por rango de fechas
    getEvaluacionesByDateRange() {
        this.router.post('/date-range', [
            this.validarJWT.validateJWT, // Validamos el JWT
            (0, express_validator_1.check)('startDate', 'La fecha de inicio es obligatoria').isDate(),
            (0, express_validator_1.check)('endDate', 'La fecha de fin es obligatoria').isDate(),
            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req, res) => {
            this.evaluacionC.getEvaluacionesByDateRange(req, res);
        });
    }
    // Ruta para obtener el puntaje promedio de un examen
    getAverageScoreByExamenId() {
        this.router.get('/:eva_exm_id/average-score', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.evaluacionC.getAverageScoreByExamenId(req, res);
        });
    }
    // Ruta para obtener evaluaciones por puntaje mínimo
    getEvaluacionesByScoreThreshold() {
        this.router.get('/score/:minScore', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.evaluacionC.getEvaluacionesByScoreThreshold(req, res);
        });
    }
    // Ruta para obtener retroalimentación de la evaluación
    getEvaluacionFeedback() {
        this.router.get('/:eva_id/feedback', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.evaluacionC.getEvaluacionFeedback(req, res);
        });
    }
}
exports.EvaluacionRoute = EvaluacionRoute;
