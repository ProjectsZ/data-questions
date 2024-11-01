"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailData = void 0;
/* Middleware personalizado: Realizando validaciones para las rutas */
const express_1 = require("express");
const express_validator_1 = require("express-validator");
class EmailData {
    constructor() {
    }
    validateEmail(req, res = express_1.response, next) {
        /* Validamos la data ----------------------------------------- */
        /* Atrapar todos los errores que pasaron por el Middleware */
        const datos = (0, express_validator_1.validationResult)(req);
        console.log("--------> ", datos);
        // if(datos.isEmpty() ){ /* si no esta vacio hay errores */
        //     return res.status(400).json({
        //         ok: false,
        //         errors: errores.mapped()
        //     });
        // }
        // /* No se produjo errores -> continuamos con el código */
        // next();
    }
}
exports.EmailData = EmailData;
