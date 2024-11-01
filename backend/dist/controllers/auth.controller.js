"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const express_1 = require("express");
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../helpers/jwt");
const google_verify_1 = require("../helpers/google-verify");
class AuthController {
    constructor() {
    }
    async login(req, res = express_1.response) {
        /**Extraer el email y password del body o datos que se envia */
        const { usr_email, usr_password } = req.body;
        try {
            /**Verificando email */
            const usuarioDB = await user_model_1.default.findOne({ usr_email });
            if (!usuarioDB) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Error con los datos'
                });
            }
            /**Verificando password */
            const validPassword = bcryptjs_1.default.compareSync(usr_password, usuarioDB.usr_password);
            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Error con los datos'
                });
            }
            /**Generar el TOKEN - JWT */
            const token = await new jwt_1.Jwt().generateJWT(usuarioDB._id);
            res.json({
                ok: true,
                token,
                name: usuarioDB.usr_name
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Consulte/hable con el Administrador'
            });
        }
    }
    async login2(req, res = express_1.response) {
        if (req.body.usr_email == null || req.body.usr_password == null) {
            res.send({ error: true, message: 'Invalid request.' });
            return;
        }
        const { usr_email, usr_password } = req.body;
        try {
            const dataDB = await user_model_1.default.findOne({ usr_email });
            // const dataDB:any = await new Promise((resolve, reject)=>{
            //     User.findOne({ email })
            // });
            // mysqlConnection.query('SELECT * FROM USUARIO WHERE correo = "' + req.body.usuario + '" and password ="' + req.body.contrasena + '"', (err, rows, fields) => {
            console.log(dataDB);
            if (!dataDB) {
                return res.send({ error: true, message: 'No se logró encontrar la data' });
            }
            // Verificar contraseña
            const validarContrasenha = bcryptjs_1.default.compareSync(usr_password, dataDB.usr_password);
            if (!validarContrasenha) {
                console.log('La contraseña no es la misma. ¿La has olvidado?');
                return res.send({ error: true, message: 'Correo o contraseña invalido' });
            }
            const token = await new jwt_1.Jwt().generateJWT(dataDB.id);
            res.json({ ok: true, msg: "Se logró ingresar con dicho usuario", token: token });
            //TODO: Guardar el token en la db o algun lugar donde vos peudas relacionar el usuario al token
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                error: true,
                message: 'Datos erroneos'
            });
        }
    }
    // Login Google (manejamos la autenticación de google)
    async loginGoogleSignIn(req, res = express_1.response) {
        const googleToken = req.body.token;
        try {
            // const dataPayload :any = await new GoogleVerify().googleVerify( googleToken );
            const { name, email, picture } = await new google_verify_1.GoogleVerify().googleVerify(googleToken);
            // Para verificar si existe un usuario ya con ese 'email' en uso
            const usuarioDB = await user_model_1.default.findOne({ email });
            let usuario;
            if (!usuarioDB) {
                // Si no existe el usuario se usán los datos provenientes de Google
                usuario = new user_model_1.default({
                    usr_name: name,
                    usr_email: email,
                    usr_password: 'usando_auth_google',
                    usr_img: picture,
                    usr_google_access: true,
                });
            }
            else {
                // caso contrario, si existe el usuario se siguen usándo la misma data
                usuario = usuarioDB;
                usuario.usr_google_access = true;
            }
            //Guardar DB
            await usuario.save();
            // Generar el Token - JWT
            const token = await new jwt_1.Jwt().generateJWT(usuario.id);
            res.json({
                ok: true,
                token
            });
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({
                ok: false,
                msg: 'El token no es correcto!'
            });
        }
    }
    /**
     *  Regresará un nuevo token
     * @param req
     * @param res */
    async renewToken(req, res = express_1.response) {
        const uid = req.uid.uid;
        //Generar el token - jwt
        const token = await new jwt_1.Jwt().generateJWT(uid);
        // Obtener el usuario por uid
        const usuario = await user_model_1.default.findById(uid);
        res.json({
            ok: true,
            uid,
            token,
            usuario
        });
    }
}
exports.AuthController = AuthController;
