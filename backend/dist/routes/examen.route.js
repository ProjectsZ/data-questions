"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamenRoute = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
// Middlewares
const validate_data_custom_1 = require("./../middlewares/validate-data.custom");
const validate_jwt_custom_1 = require("./../middlewares/validate-jwt.custom");
// Controllers
const examen_controller_1 = require("../controllers/examen.controller");
class ExamenRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        // Instanciamos el controlador
        this.examenC = new examen_controller_1.ExamenController();
        // Instanciamos los middlewares de validación
        this.validarCampos = new validate_data_custom_1.ValidateData();
        this.validarJWT = new validate_jwt_custom_1.ValidateJWTcustom();
        // Inicializamos las rutas
        this.postCreateExamen();
        this.getExamenById();
        this.getExamenesByTeacherId();
        this.putUpdateExamen();
        this.deleteExamen();
        this.getExamenesByStatus();
        this.getExamenesByDateRange();
        this.getExamenDuration();
        this.getExamenAttempts();
    }
    // Ruta para crear un nuevo examen
    postCreateExamen() {
        this.router.post('/', [
            // Validaciones de los datos
            (0, express_validator_1.check)('exm_description', 'La descripción del examen es obligatoria').not().isEmpty(),
            (0, express_validator_1.check)('exm_status', 'El estado del examen es obligatorio').not().isEmpty(),
            (0, express_validator_1.check)('exm_duration', 'La duración del examen es obligatoria').isNumeric().withMessage('La duración debe ser un número'),
            (0, express_validator_1.check)('exm_attempts', 'Los intentos del examen son obligatorios').isNumeric().withMessage('Los intentos deben ser un número'),
            (0, express_validator_1.check)('exm_teacher_user_id', 'El ID del profesor es obligatorio').not().isEmpty(),
            (0, express_validator_1.check)('exm_crs_id', 'El ID del curso es obligatorio').not().isEmpty(),
            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req, res) => {
            this.examenC.createExamen(req, res);
        });
    }
    // Ruta para obtener un examen por ID
    getExamenById() {
        this.router.get('/:exm_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.examenC.getExamenById(req, res);
        });
    }
    // Ruta para obtener exámenes por ID del profesor
    getExamenesByTeacherId() {
        this.router.get('/teacher/:exm_teacher_usr_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.examenC.getExamenesByTeacherId(req, res);
        });
    }
    // Ruta para actualizar un examen
    putUpdateExamen() {
        this.router.put('/:exm_id', [
            // Validaciones de los datos
            (0, express_validator_1.check)('exm_description', 'La descripción del examen es obligatoria').optional().not().isEmpty(),
            (0, express_validator_1.check)('exm_status', 'El estado del examen es obligatorio').optional().not().isEmpty(),
            (0, express_validator_1.check)('exm_duration', 'La duración del examen es obligatoria').optional().isNumeric().withMessage('La duración debe ser un número'),
            (0, express_validator_1.check)('exm_attempts', 'Los intentos del examen son obligatorios').optional().isNumeric().withMessage('Los intentos deben ser un número'),
            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req, res) => {
            this.examenC.updateExamen(req, res);
        });
    }
    // Ruta para eliminar un examen
    deleteExamen() {
        this.router.delete('/:exm_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.examenC.deleteExamen(req, res);
        });
    }
    // Ruta para obtener los exámenes por estado (activo/inactivo)
    getExamenesByStatus() {
        this.router.get('/status/:exm_status', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.examenC.getExamenesByStatus(req, res);
        });
    }
    // Ruta para obtener los exámenes por rango de fechas
    getExamenesByDateRange() {
        this.router.post('/date-range', [
            this.validarJWT.validateJWT, // Validamos el JWT
            (0, express_validator_1.check)('startDate', 'La fecha de inicio es obligatoria').isDate(),
            (0, express_validator_1.check)('endDate', 'La fecha de fin es obligatoria').isDate(),
            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req, res) => {
            this.examenC.getExamenesByDateRange(req, res);
        });
    }
    // Ruta para obtener la duración de un examen
    getExamenDuration() {
        this.router.get('/:exm_id/duration', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.examenC.getExamenDuration(req, res);
        });
    }
    // Ruta para obtener los intentos permitidos de un examen
    getExamenAttempts() {
        this.router.get('/:exm_id/attempts', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.examenC.getExamenAttempts(req, res);
        });
    }
}
exports.ExamenRoute = ExamenRoute;
