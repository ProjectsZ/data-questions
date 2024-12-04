"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursoRoute = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
// Middlewares
const validate_data_custom_1 = require("./../middlewares/validate-data.custom");
const validate_jwt_custom_1 = require("./../middlewares/validate-jwt.custom");
// Controllers
const curso_controller_1 = require("../controllers/curso.controller");
class CursoRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        // Instanciamos el controlador
        this.cursoC = new curso_controller_1.CursoController();
        // Instanciamos los middlewares de validación
        this.validarCampos = new validate_data_custom_1.ValidateData();
        this.validarJWT = new validate_jwt_custom_1.ValidateJWTcustom();
        // Inicializamos las rutas
        this.postCreateCurso();
        this.getCursoById();
        this.getAllCursos();
        this.putUpdateCurso();
        this.deleteCurso();
        this.getCursoByCode();
        this.getCursosByName();
        this.searchCursos();
    }
    // Ruta para crear un nuevo curso
    postCreateCurso() {
        this.router.post('/', [
            // Validaciones de los datos
            (0, express_validator_1.check)('crs_name', 'El nombre del curso es obligatorio').not().isEmpty(),
            (0, express_validator_1.check)('crs_description', 'La descripción del curso es obligatoria').not().isEmpty(),
            (0, express_validator_1.check)('crs_code', 'El código del curso es obligatorio').not().isEmpty(),
            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req, res) => {
            this.cursoC.createCurso(req, res);
        });
    }
    // Ruta para obtener un curso por su ID
    getCursoById() {
        this.router.get('/:crs_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.cursoC.getCursoById(req, res);
        });
    }
    // Ruta para obtener todos los cursos
    getAllCursos() {
        this.router.get('/', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.cursoC.getAllCursos(req, res);
        });
    }
    // Ruta para actualizar un curso
    putUpdateCurso() {
        this.router.put('/:crs_id', [
            // Validaciones de los datos
            (0, express_validator_1.check)('crs_name', 'El nombre del curso es obligatorio').optional().not().isEmpty(),
            (0, express_validator_1.check)('crs_description', 'La descripción del curso es obligatoria').optional().not().isEmpty(),
            (0, express_validator_1.check)('crs_code', 'El código del curso es obligatorio').optional().not().isEmpty(),
            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req, res) => {
            this.cursoC.updateCurso(req, res);
        });
    }
    // Ruta para eliminar un curso
    deleteCurso() {
        this.router.delete('/:crs_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.cursoC.deleteCurso(req, res);
        });
    }
    // Ruta para obtener un curso por su código
    getCursoByCode() {
        this.router.get('/code/:crs_code', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.cursoC.getCursoByCode(req, res);
        });
    }
    // Ruta para obtener cursos por nombre
    getCursosByName() {
        this.router.get('/name/:crs_name', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.cursoC.getCursosByName(req, res);
        });
    }
    // Ruta para buscar cursos con un query
    searchCursos() {
        this.router.get('/search/:query', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.cursoC.searchCursos(req, res);
        });
    }
}
exports.CursoRoute = CursoRoute;
