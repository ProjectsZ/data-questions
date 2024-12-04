"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
// Logica de lo que va hacer nuestra ruta
const express_1 = require("express");
const user_model_1 = __importDefault(require("../models/user.model"));
// import { validationResult } from 'express-validator'
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../helpers/jwt");
class UserController {
    constructor() {
    }
    // Obtener todos los usuarios
    async getUsers(req, res) {
        /**Usamos un nombre cualquiera (startPage) para los parametros  */
        const startPage = Number(req.query.startPage) || 0;
        const totalPages = 5; // total de pages a mostrar
        // Corre de manera simultanea el const 'usuarios' y 'totalItems'
        /**
         * all() esto adjunta en un array muchas promesas y los corre de manera simultanea.
         */
        try {
            const [usuarios, totalItems] = await Promise.all([
                user_model_1.default.find({}, `usr_email 
                               usr_username 
                               usr_img 
                               usr_role
                               usr_createdAt 
                               usr_is_google_authenticated`)
                    .skip(startPage) /** iniciar desde la data N° startPage */
                    .limit(totalPages), /** mostrar solo totalPages datas */
                user_model_1.default.countDocuments() /* por warning error: no usar .count()  */
            ]);
            res.json({
                ok: true,
                usuarios,
                total_user: totalItems
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                ok: false,
                msg: 'Error al obtener los Usuarios'
            });
        }
    }
    // Obtener un usuario por su ID
    async getUserById(req, res) {
        const userId = req.params.id;
        try {
            const usuario = await user_model_1.default.findById(userId, `
                                                        usr_username 
                                                        usr_email 
                                                        usr_role 
                                                        usr_is_active 
                                                        usr_createdAt 
                                                        usr_updatedAt
                                                        `)
                .populate('usr_infp_id', 'infp_name infp_lastname infp_telephone infp_img'); // Populamos los datos de InformacionPersonal
            ;
            if (!usuario) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Usuario no encontrado'
                });
            }
            res.json({
                ok: true,
                usuario
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                ok: false,
                msg: 'Error al obtener el usuario.'
            });
        }
    }
    async createUsers(req, res = express_1.response) {
        const { usr_password, usr_email, usr_username } = req.body;
        try {
            /* Validando si existe ya un email en la base de datos
             * .findOne():  */
            const existEmail = await user_model_1.default.findOne({ usr_email });
            if (existEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'el correo ya se encuentra registrado!...'
                });
            }
            /* Validando si el teléfono sea único
             * */
            const existUsername = await user_model_1.default.findOne({ usr_username });
            if (existUsername) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El usuario ya se encuentra en uso!...'
                });
            }
            // Crear el nuevo User
            const usuario = new user_model_1.default(req.body);
            /* Encriptar contraseña */
            const salt = bcryptjs_1.default.genSaltSync(); /* esto genera data de manera aleatoria */
            usuario.usr_password = bcryptjs_1.default.hashSync(usr_password, salt);
            /* para grabar en la base de datos */
            await usuario.save(); /* la carga puede ser rápido o lento */
            /* await: esperar esta promesa( .save()) termine luego
                    recien correr la siguiente linea de codigo  */
            /*Esto se tiene que llamar sólo por una vez
              (para evitar errores)*/
            /**Token */
            const token = await new jwt_1.Jwt().generateJWT(usuario.usr_id || usuario._id);
            res.json({
                ok: true,
                usuario,
                token
            });
        }
        catch (error) {
            console.log(error);
            /* Si se dispara este error, voy a pedir al
               status 500 (error interno que tengo que manejarlo) */
            res.status(500).json({
                ok: false,
                msg: 'Error inesperado! ...'
            });
        }
        /* ----------------------------------------------------------- */
    }
    /* Update User  ------------------------------------------------- */
    async updateUser(req, res = express_1.response) {
        // Validar token y comprobar si es el usuario correcto
        /** obteniendo el id  */
        /* controlar campos de acceso especiales */
        const { usr_password, usr_google_access, usr_email, ...usrUpdatedData } = req.body;
        const uid = req.params.id;
        try {
            /* Necesito el id,  */
            const userDB = await user_model_1.default.findById(uid);
            /**Si no existe el usuario */
            if (!userDB) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe un usuario con ese id'
                });
            }
            /** if usuario de la base de datos es literamente igual a
             *  email del que viene, entonces no se actualiza el email */
            // if(userDB.email === req.body.email){
            if (userDB.usr_email != usr_email) {
                //extraer dato, para evitar problemas de validación
                //     delete campos.email; 
                // }else{
                const existEmail = await user_model_1.default.findOne({ usr_email });
                //   { email: req.body.email });
                /**Verificamos que en email si existe (en all la base de datos) */
                if (existEmail) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Ya existe un usuario con ese email'
                    });
                }
            }
            /* Solo se podra cambiar datos si no es usuario de google */
            if (!userDB.usr_is_google_authenticated) {
                usrUpdatedData.email = usr_email;
            }
            else if (userDB.usr_email !== usr_email) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Usuarios de Google no pueden cambiar su correo'
                });
            }
            /* información que es obligatoria (por Mongo),
             * pero no se quiero mostrarlo  */
            // delete campos.password;
            // delete campos.google_access;
            /** Para indicar que siempre me regrese el nuevo/o data actualizada
             *   { new: true  }
             * useFindAndModify: false :
             *   DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()`
             *   without the `useFindAndModify` option set to false are deprecated */
            const usuarioActualizado = await user_model_1.default.findByIdAndUpdate(uid, usrUpdatedData, { new: true, useFindAndModify: false });
            res.json({
                ok: true,
                usuario: usuarioActualizado
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Error inesperado!...'
            });
        }
    }
    // Cambiar la contraseña de un usuario
    async changePassword(req, res = express_1.response) {
        const { usr_password_old, usr_password_new } = req.body;
        const userId = req.params.id;
        try {
            const usuarioDB = await user_model_1.default.findById(userId);
            if (!usuarioDB) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Usuario no encontrado'
                });
            }
            // Verificar la contraseña anterior
            const validPassword = bcryptjs_1.default.compareSync(usr_password_old, usuarioDB.usr_password);
            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Contraseña antigua incorrecta'
                });
            }
            // Encriptar la nueva contraseña
            const salt = bcryptjs_1.default.genSaltSync();
            const hashedPassword = bcryptjs_1.default.hashSync(usr_password_new, salt);
            // Actualizar la contraseña
            usuarioDB.usr_password = hashedPassword;
            await usuarioDB.save();
            res.json({
                ok: true,
                msg: 'Contraseña cambiada con éxito'
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                ok: false,
                msg: 'Error al cambiar la contraseña.'
            });
        }
    }
    // Restablecer la contraseña con el token de recuperación
    async resetPassword(req, res = express_1.response) {
        const { usr_id, token, newPassword } = req.body;
        try {
            // Buscar al usuario por ID
            const usuarioDB = await user_model_1.default.findById(usr_id);
            if (!usuarioDB) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Usuario no encontrado'
                });
            }
            // Verificar si el token coincide
            if (usuarioDB.usr_recoveryToken !== token) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Token de recuperación no válido o expirado'
                });
            }
            // Encriptar la nueva contraseña
            const salt = bcryptjs_1.default.genSaltSync();
            const hashedPassword = bcryptjs_1.default.hashSync(newPassword, salt);
            // Actualizar la contraseña del usuario
            usuarioDB.usr_password = hashedPassword;
            usuarioDB.usr_recoveryToken = ''; // Limpiar el token de recuperación después de usarlo
            await usuarioDB.save();
            res.json({
                ok: true,
                msg: 'Contraseña restablecida con éxito'
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                ok: false,
                msg: 'Error al restablecer la contraseña.'
            });
        }
    }
    /**Delete User ---------------------------------------------------
     * No se recomienda tanto borrar registros de la base de datos, sino
     * crear un desactivador/ocultarlos     */
    async deleteUser(req, res = express_1.response) {
        const uid = req.params.id;
        try {
            /* Verificar si existe el usuario en la base de datos */
            const usuarioDB = await user_model_1.default.findById(uid);
            if (!usuarioDB) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe un usuario con ese id'
                });
            }
            /** Con esto borramos el usuario */
            await user_model_1.default.findByIdAndDelete(uid);
            res.json({
                ok: true,
                msg: 'Usuario eliminado, satisfactoriamente!'
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Error inesperadoo! ...'
            });
        }
    }
}
exports.UserController = UserController;
