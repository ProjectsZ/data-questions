"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRoute = exports.AuthRoute = void 0;
// Ruta: /api/login y /api/users
const express_1 = require("express");
const express_validator_1 = require("express-validator");
// Middlewares
const validate_data_custom_1 = require("./../middlewares/validate-data.custom");
const validate_jwt_custom_1 = require("./../middlewares/validate-jwt.custom");
const email_data_custom_1 = require("../middlewares/email-data.custom");
// Controllers
const auth_controller_1 = require("./../controllers/auth.controller");
const users_controller_1 = require("../controllers/users.controller");
class AuthRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.validarCampos = new validate_data_custom_1.ValidateData();
        this.validarJWT = new validate_jwt_custom_1.ValidateJWTcustom();
        this.authC = new auth_controller_1.AuthController();
        this.postRoutesLogin();
        this.postRouteLoginGoogle();
        this.getRouteLoginRenewToken();
    }
    postRoutesLogin() {
        this.router.post('/', (req, res) => {
            (0, express_validator_1.check)('usr_email', 'El email es obligatorio').isEmail(),
                (0, express_validator_1.check)('usr_password', 'El password es obligatorio').not().isEmpty(),
                this.validarCampos.validateInputs;
            this.authC.login;
        });
    }
    // Google sign-in
    postRouteLoginGoogle() {
        this.router.post('/google', () => {
            (0, express_validator_1.check)('token', 'El token google es obligatorio').not().isEmpty(),
                // this.validarCampos.validateInputs,
                this.authC.loginGoogleSignIn;
        });
    }
    getRouteLoginRenewToken() {
        this.router.get('/renew', [
        // this.validarJWT.validateJWT
        ], this.authC.renewToken);
    }
}
exports.AuthRoute = AuthRoute;
class UsersRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        // No se logra mandar el controlador, por que no captura los req y res de la otra clase, CORREXION MOMENTANEA HASTA LA PROXIMA ACTUALIZACION
        this.usersC = new users_controller_1.UsersController(); // usersC: UsersController = new UsersController();
        this.validarCampos = new validate_data_custom_1.ValidateData();
        this.validarJWT = new validate_jwt_custom_1.ValidateJWTcustom();
        this.validarEmail = new email_data_custom_1.EmailData();
        this.getRoutesUsers();
        this.postRoutesUsers();
        this.putRoutesUsers();
        this.deleteRoutesUsers();
    }
    /* Primera ruta: Usuarios  */
    getRoutesUsers() {
        /* Él getUsers no se esta ejecutando (osea no se llama getUsers() )
           simplemente se está mandando como referencia a la función. */
        this.router.get('/', () => {
            this.validarJWT.validateJWT,
                this.usersC.getUsers;
        });
    }
    // Registro de usuario
    postRoutesUsers() {
        this.router.post('/register', [
            /* check('<name-data>', '<message-when-error-occurs>') */
            (0, express_validator_1.check)('usr_name', 'El nombre del usuario es obligatorio').not().isEmpty(),
            (0, express_validator_1.check)('usr_username', 'El nick es obligatorio').not().isEmpty(), /* name (required) */
            (0, express_validator_1.check)('usr_email', 'El email es obligatorio').isEmail(), /* email (required) */
            (0, express_validator_1.check)('usr_password', 'La contrasenha es obligatoria').not().isEmpty().isLength({ min: 8 }).withMessage('La contraseña debe tener minimo 8 letras'), /* password (is Email) */
            (0, express_validator_1.check)('usr_telephone', 'El número de teléfono es obligatorio').not().isEmpty(),
            this.validarCampos.validateInputs, /* Este tiene que ir último */
            // this.validarEmail.validateEmail,                
        ], this.usersC.createUsers);
    }
    putRoutesUsers() {
        /**Mandamos el _id or uid or id que del usuario del que se desee actualizar */
        this.router.put('/:id', [
            this.validarJWT.validateJWT, /**colocado arriba si falla, no continuará al errar */
            (0, express_validator_1.check)('usr_username', 'El nombre es obligatorio').not().isEmpty(), /* name (required) */
            (0, express_validator_1.check)('usr_email', 'El email es obligatorio').isEmail(), /* email (required) */
            (0, express_validator_1.check)('usr_role', 'El role es obligatorio').not().isEmpty(),
            this.validarCampos.validateInputs, /* Este tiene que ir último */
        ], this.usersC.updateUser);
    }
    deleteRoutesUsers() {
        this.router.delete('/:id', [
            this.validarJWT.validateJWT
        ], this.usersC.deleteUser);
    }
}
exports.UsersRoute = UsersRoute;
