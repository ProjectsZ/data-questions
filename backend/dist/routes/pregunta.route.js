"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreguntaRoute = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
// Middlewares
const validate_data_custom_1 = require("./../middlewares/validate-data.custom"); // Suponemos que el middleware de validación está en este archivo
const validate_jwt_custom_1 = require("./../middlewares/validate-jwt.custom"); // Suponemos que el middleware de JWT está en este archivo
// Controllers
const pregunta_controller_1 = require("../controllers/pregunta.controller"); // El controlador para manejar la lógica de las preguntas
class PreguntaRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        // Instanciamos el controlador
        this.preguntaC = new pregunta_controller_1.PreguntaController();
        // Instanciamos los middlewares de validación
        this.validarCampos = new validate_data_custom_1.ValidateData();
        this.validarJWT = new validate_jwt_custom_1.ValidateJWTcustom();
        // Inicializamos las rutas
        this.getRoutesPreguntas();
        this.getRoutePreguntaById();
        this.postRoutesPreguntas();
        this.putRoutesPreguntas();
        this.deleteRoutesPreguntas();
    }
    // Ruta para obtener todas las preguntas
    getRoutesPreguntas() {
        this.router.get('/', [
            this.validarJWT.validateJWT // Aquí podrías agregar más middlewares de validación si es necesario
        ], (req, res) => {
            this.preguntaC.getPreguntas(req, res);
        });
    }
    // Ruta para obtener una pregunta por ID
    getRoutePreguntaById() {
        this.router.get('/:id', [
            this.validarJWT.validateJWT // Validamos que el usuario esté autenticado
        ], (req, res) => {
            this.preguntaC.getPreguntaById(req, res);
        });
    }
    // Ruta para registrar una nueva pregunta
    postRoutesPreguntas() {
        this.router.post('/', [
            // Validación de los datos del cuerpo de la solicitud
            (0, express_validator_1.check)('pr_content', 'El contenido de la pregunta es obligatorio').not().isEmpty(),
            (0, express_validator_1.check)('pr_answer', 'Las respuestas son obligatorias y deben ser un arreglo').isArray().not().isEmpty(),
            (0, express_validator_1.check)('pr_type', 'El tipo de pregunta es obligatorio').not().isEmpty(),
            (0, express_validator_1.check)('pr_difficulty', 'La dificultad es obligatoria').not().isEmpty(),
            (0, express_validator_1.check)('pr_time', 'El tiempo de la pregunta es obligatorio').isInt({ min: 1 }).withMessage('El tiempo debe ser un número mayor que 0'),
            (0, express_validator_1.check)('pr_tags', 'Las etiquetas son opcionales y deben ser un arreglo').optional().isArray(),
            (0, express_validator_1.check)('pr_cat_id', 'La categoría es obligatoria y debe ser un ID válido').not().isEmpty().isMongoId().withMessage('La categoría debe ser un ID válido de MongoDB'),
            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req, res) => {
            this.preguntaC.createPregunta(req, res);
        });
    }
    // Ruta para actualizar una pregunta
    putRoutesPreguntas() {
        this.router.put('/:id', [
            this.validarJWT.validateJWT, // Validamos el JWT
            (0, express_validator_1.check)('pr_content', 'El contenido de la pregunta es obligatorio').not().isEmpty(),
            (0, express_validator_1.check)('pr_answer', 'Las respuestas son obligatorias y deben ser un arreglo').isArray().not().isEmpty(),
            (0, express_validator_1.check)('pr_type', 'El tipo de pregunta es obligatorio').not().isEmpty(),
            (0, express_validator_1.check)('pr_difficulty', 'La dificultad es obligatoria').not().isEmpty(),
            (0, express_validator_1.check)('pr_time', 'El tiempo de la pregunta es obligatorio').isInt({ min: 1 }).withMessage('El tiempo debe ser un número mayor que 0'),
            (0, express_validator_1.check)('pr_tags', 'Las etiquetas son opcionales y deben ser un arreglo').optional().isArray(),
            (0, express_validator_1.check)('pr_cat_id', 'La categoría es obligatoria y debe ser un ID válido').not().isEmpty().isMongoId().withMessage('La categoría debe ser un ID válido de MongoDB'),
            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req, res) => {
            this.preguntaC.updatePregunta(req, res);
        });
    }
    // Ruta para eliminar una pregunta
    deleteRoutesPreguntas() {
        this.router.delete('/:id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.preguntaC.deletePregunta(req, res);
        });
    }
}
exports.PreguntaRoute = PreguntaRoute;
