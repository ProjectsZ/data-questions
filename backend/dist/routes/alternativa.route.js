"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlternativaRoute = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
// Middlewares
const validate_data_custom_1 = require("./../middlewares/validate-data.custom");
const validate_jwt_custom_1 = require("./../middlewares/validate-jwt.custom");
// Controllers
const alternativa_controller_1 = require("../controllers/alternativa.controller");
class AlternativaRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        // Instanciamos el controlador
        this.alternativaC = new alternativa_controller_1.AlternativaController();
        // Instanciamos los middlewares de validación
        this.validarCampos = new validate_data_custom_1.ValidateData();
        this.validarJWT = new validate_jwt_custom_1.ValidateJWTcustom();
        // Inicializamos las rutas
        this.postCreateAlternativa();
        this.getAlternativaById();
        this.getAlternativasByPreguntaId();
        this.putUpdateAlternativa();
        this.deleteAlternativa();
        this.getCorrectAlternativasByPreguntaId();
    }
    // Ruta para crear una nueva alternativa
    postCreateAlternativa() {
        this.router.post('/', [
            // Validaciones de los datos
            (0, express_validator_1.check)('opt_pr_id', 'El ID de la pregunta es obligatorio').not().isEmpty(),
            (0, express_validator_1.check)('opt_text', 'El texto de la alternativa es obligatorio').not().isEmpty(),
            (0, express_validator_1.check)('opt_is_correct', 'Debe indicar si la alternativa es correcta').isBoolean(),
            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req, res) => {
            this.alternativaC.createAlternativa(req, res);
        });
    }
    // Ruta para obtener una alternativa por ID
    getAlternativaById() {
        this.router.get('/:opt_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.alternativaC.getAlternativaById(req, res);
        });
    }
    // Ruta para obtener todas las alternativas de una pregunta por ID
    getAlternativasByPreguntaId() {
        this.router.get('/pregunta/:opt_pr_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.alternativaC.getAlternativasByPreguntaId(req, res);
        });
    }
    // Ruta para actualizar una alternativa
    putUpdateAlternativa() {
        this.router.put('/:opt_id', [
            // Validaciones de los datos
            (0, express_validator_1.check)('opt_text', 'El texto de la alternativa es obligatorio').optional().not().isEmpty(),
            (0, express_validator_1.check)('opt_img', 'La imagen de la alternativa es opcional').optional(),
            (0, express_validator_1.check)('opt_description', 'La descripción de la alternativa es opcional').optional(),
            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req, res) => {
            this.alternativaC.updateAlternativa(req, res);
        });
    }
    // Ruta para eliminar una alternativa
    deleteAlternativa() {
        this.router.delete('/:opt_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.alternativaC.deleteAlternativa(req, res);
        });
    }
    // Ruta para obtener las alternativas correctas de una pregunta
    getCorrectAlternativasByPreguntaId() {
        this.router.get('/correctas/pregunta/:opt_pr_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.alternativaC.getCorrectAlternativasByPreguntaId(req, res);
        });
    }
}
exports.AlternativaRoute = AlternativaRoute;
