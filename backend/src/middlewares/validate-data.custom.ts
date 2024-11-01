/* Middleware personalizado: Realizando validaciones para las rutas */
import { Request, Response, response } from 'express';
import { validationResult } from 'express-validator'

export class ValidateData{

    constructor(){
    }

    validateInputs(req: Request, res: Response = response, next: any): any{
        
        /* Validamos la data ----------------------------------------- */
        /* Atrapar todos los errores que pasaron por el Middleware */
        const errores = validationResult( req );

        if( !errores.isEmpty() ){ /* si no esta vacio hay errores */
            return res.status(400).json({
                ok: false,
                errors: errores.mapped()
            });
        }

        /* No se produjo errores -> continuamos con el código */
        next();
    }

}
