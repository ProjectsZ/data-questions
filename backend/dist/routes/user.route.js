"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
// Middlewares
const validate_data_custom_1 = require("./../middlewares/validate-data.custom");
const validate_jwt_custom_1 = require("./../middlewares/validate-jwt.custom");
const email_data_custom_1 = require("../middlewares/email-data.custom");
// Controllers
const user_controller_1 = require("../controllers/user.controller");
class UserRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        // Instanciamos el controlador
        this.usersC = new user_controller_1.UserController();
        // Instanciamos los middlewares de validación
        this.validarCampos = new validate_data_custom_1.ValidateData();
        this.validarJWT = new validate_jwt_custom_1.ValidateJWTcustom();
        this.validarEmail = new email_data_custom_1.EmailData();
        // Inicializamos las rutas
        this.getRoutesUsers();
        this.getRouteUserById();
        this.postRoutesUsers();
        this.putRoutesUsers();
        this.putRouteChangePassword();
        this.putRouteResetPassword();
        this.deleteRoutesUsers();
    }
    // Ruta para obtener todos los usuarios con paginación
    getRoutesUsers() {
        this.router.get('/', [
            this.validarJWT.validateJWT
        ], (req, res) => {
            this.usersC.getUsers(req, res);
        });
    }
    // Ruta para obtener un usuario por ID
    getRouteUserById() {
        this.router.get('/:id', [
            this.validarJWT.validateJWT
        ], (req, res) => {
            this.usersC.getUserById(req, res);
        });
    }
    // Ruta para registrar un nuevo usuario
    postRoutesUsers() {
        this.router.post('/', [
            // Validación de los datos del cuerpo de la solicitud
            (0, express_validator_1.check)('usr_name', 'El nombre del usuario es obligatorio').not().isEmpty(),
            (0, express_validator_1.check)('usr_username', 'El nick es obligatorio').not().isEmpty()
                .isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres'),
            (0, express_validator_1.check)('usr_email', 'El email es obligatorio').isEmail().withMessage('El email proporcionado no es válido'),
            (0, express_validator_1.check)('usr_password', 'La contraseña es obligatoria').not().isEmpty()
                .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
            (0, express_validator_1.check)('usr_telephone', 'El número de teléfono es obligatorio').not().isEmpty(),
            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req, res) => {
            this.usersC.createUsers(req, res);
        });
    }
    // Ruta para actualizar los datos de un usuario
    putRoutesUsers() {
        this.router.put('/:id', [
            this.validarJWT.validateJWT, // Validamos el JWT
            (0, express_validator_1.check)('usr_username', 'El nombre de usuario es obligatorio').not().isEmpty(),
            (0, express_validator_1.check)('usr_email', 'El email es obligatorio').isEmail(),
            (0, express_validator_1.check)('usr_role', 'El rol es obligatorio').not().isEmpty(),
            this.validarCampos.validateInputs, // Validación de campos
        ], (req, res) => {
            this.usersC.updateUser(req, res);
        });
    }
    // Ruta para cambiar la contraseña de un usuario
    putRouteChangePassword() {
        this.router.put('/:id/change-password', [
            this.validarJWT.validateJWT, // Validamos el JWT
            (0, express_validator_1.check)('usr_password_old', 'La contraseña antigua es obligatoria').not().isEmpty(),
            (0, express_validator_1.check)('usr_password_new', 'La nueva contraseña es obligatoria').not().isEmpty().isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres'),
            this.validarCampos.validateInputs, // Validación de campos
        ], (req, res) => {
            this.usersC.changePassword(req, res);
        });
    }
    // Ruta para restablecer la contraseña de un usuario usando un token
    putRouteResetPassword() {
        this.router.put('/:id/reset-password', [
            (0, express_validator_1.check)('token', 'El token de recuperación es obligatorio').not().isEmpty(),
            (0, express_validator_1.check)('newPassword', 'La nueva contraseña es obligatoria').not().isEmpty().isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres'),
            this.validarCampos.validateInputs, // Validación de campos
        ], (req, res) => {
            this.usersC.resetPassword(req, res);
        });
    }
    // Ruta para eliminar un usuario
    deleteRoutesUsers() {
        this.router.delete('/:id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req, res) => {
            this.usersC.deleteUser(req, res);
        });
    }
}
exports.UserRoute = UserRoute;
