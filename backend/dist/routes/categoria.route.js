"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaRoute = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
// Middlewares
const validate_data_custom_1 = require("./../middlewares/validate-data.custom");
const validate_jwt_custom_1 = require("./../middlewares/validate-jwt.custom");
// Controllers
const categoria_controller_1 = require("../controllers/categoria.controller");
class CategoriaRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        // Instanciamos el controlador
        this.categoriaC = new categoria_controller_1.CategoriaController();
        // Instanciamos los middlewares de validación
        this.validarCampos = new validate_data_custom_1.ValidateData();
        this.validarJWT = new validate_jwt_custom_1.ValidateJWTcustom();
        // Inicializamos las rutas
        this.postCreateCategoria();
        this.getCategoriaById();
        this.getAllCategorias();
        this.putUpdateCategoria();
        this.deleteCategoria();
        this.getCategoriasByCursoId();
        this.searchCategorias();
    }
    // Ruta para crear una nueva categoría
    postCreateCategoria() {
        this.router.post('/', [
            // Validaciones de los datos
            (0, express_validator_1.check)('cat_title', 'El título de la categoría es obligatorio').not().isEmpty(),
            (0, express_validator_1.check)('cat_subtitle', 'El subtítulo de la categoría es obligatorio').not().isEmpty(),
            (0, express_validator_1.check)('cat_description', 'La descripción de la categoría es obligatoria').not().isEmpty(),
            (0, express_validator_1.check)('cat_crs_id', 'El ID del curso asociado es obligatorio').not().isEmpty(),
            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req, res) => {
            this.categoriaC.createCategoria(req, res);
        });
    }
    // Ruta para obtener una categoría por su ID
    getCategoriaById() {
        this.router.get('/:cat_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.categoriaC.getCategoriaById(req, res);
        });
    }
    // Ruta para obtener todas las categorías
    getAllCategorias() {
        this.router.get('/', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.categoriaC.getAllCategorias(req, res);
        });
    }
    // Ruta para actualizar una categoría
    putUpdateCategoria() {
        this.router.put('/:cat_id', [
            // Validaciones de los datos
            (0, express_validator_1.check)('cat_title', 'El título de la categoría es obligatorio').optional().not().isEmpty(),
            (0, express_validator_1.check)('cat_subtitle', 'El subtítulo de la categoría es obligatorio').optional().not().isEmpty(),
            (0, express_validator_1.check)('cat_description', 'La descripción de la categoría es obligatoria').optional().not().isEmpty(),
            (0, express_validator_1.check)('cat_crs_id', 'El ID del curso asociado es obligatorio').optional().not().isEmpty(),
            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req, res) => {
            this.categoriaC.updateCategoria(req, res);
        });
    }
    // Ruta para eliminar una categoría
    deleteCategoria() {
        this.router.delete('/:cat_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.categoriaC.deleteCategoria(req, res);
        });
    }
    // Ruta para obtener categorías por curso
    getCategoriasByCursoId() {
        this.router.get('/curso/:crs_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.categoriaC.getCategoriasByCursoId(req, res);
        });
    }
    // Ruta para buscar categorías por nombre
    searchCategorias() {
        this.router.get('/search/:query', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.categoriaC.searchCategorias(req, res);
        });
    }
}
exports.CategoriaRoute = CategoriaRoute;
