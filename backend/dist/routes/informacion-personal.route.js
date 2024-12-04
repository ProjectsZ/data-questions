"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InformacionPersonalRoute = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
// Middlewares
const validate_data_custom_1 = require("./../middlewares/validate-data.custom");
const validate_jwt_custom_1 = require("./../middlewares/validate-jwt.custom");
// Controllers
const informacion_personal_controller_1 = require("../controllers/informacion-personal.controller");
class InformacionPersonalRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        // Instanciamos el controlador
        this.informacionPersonalC = new informacion_personal_controller_1.InformacionPersonalController();
        // Instanciamos los middlewares de validación
        this.validarCampos = new validate_data_custom_1.ValidateData();
        this.validarJWT = new validate_jwt_custom_1.ValidateJWTcustom();
        // Inicializamos las rutas
        this.postCreateInformacion();
        this.putUpdateInformacion();
        this.getPersonalInfoByNameRoute();
        this.getPersonalInfoByBirthDateRoute();
    }
    // Ruta para crear la información personal de un usuario
    postCreateInformacion() {
        this.router.post('/:id', [
            // Validaciones de los datos recibidos en el cuerpo de la solicitud
            (0, express_validator_1.check)('infp_name', 'El nombre es obligatorio').not().isEmpty(),
            (0, express_validator_1.check)('infp_lastname', 'El apellido es obligatorio').not().isEmpty(),
            (0, express_validator_1.check)('infp_telephone', 'El teléfono es obligatorio').not().isEmpty(),
            (0, express_validator_1.check)('infp_birth_date', 'La fecha de nacimiento es obligatoria').not().isEmpty().isDate().withMessage('La fecha de nacimiento no es válida'),
            (0, express_validator_1.check)('infp_img', 'La imagen es obligatoria').optional(), // Si no se pasa, no es obligatorio
            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req, res) => {
            this.informacionPersonalC.createInformacionPersonal(req, res);
        });
    }
    // Ruta para actualizar la información personal de un usuario
    putUpdateInformacion() {
        this.router.put('/:id/information/:infp_id', [
            // Validaciones de los datos
            (0, express_validator_1.check)('infp_name', 'El nombre es obligatorio').optional().not().isEmpty(),
            (0, express_validator_1.check)('infp_lastname', 'El apellido es obligatorio').optional().not().isEmpty(),
            (0, express_validator_1.check)('infp_telephone', 'El teléfono es obligatorio').optional().not().isEmpty(),
            (0, express_validator_1.check)('infp_birth_date', 'La fecha de nacimiento es obligatoria').optional().not().isEmpty().isDate().withMessage('La fecha de nacimiento no es válida'),
            (0, express_validator_1.check)('infp_img', 'La imagen es obligatoria').optional(),
            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req, res) => {
            this.informacionPersonalC.updateInformacionPersonal(req, res);
        });
    }
    // Ruta para obtener la información personal por nombre
    getPersonalInfoByNameRoute() {
        this.router.get('/name/:infp_name', [
            this.validarJWT.validateJWT, // Validación de JWT (si es necesario)
        ], (req, res) => {
            this.informacionPersonalC.getPersonalInfoByName(req, res);
        });
    }
    // Ruta para obtener la información personal por fecha de nacimiento
    getPersonalInfoByBirthDateRoute() {
        this.router.get('/birthdate/:infp_birth_date', [
            this.validarJWT.validateJWT, // Validación de JWT (si es necesario)
        ], (req, res) => {
            this.informacionPersonalC.getPersonalInfoByBirthDate(req, res);
        });
    }
}
exports.InformacionPersonalRoute = InformacionPersonalRoute;
