import { Request, Response, Router } from 'express';
import { check } from 'express-validator';

// Middlewares
import { ValidateData } from './../middlewares/validate-data.custom';
import { ValidateJWTcustom } from './../middlewares/validate-jwt.custom';

// Controllers
import { InformacionPersonalController } from '../controllers/informacion-personal.controller';

export class InformacionPersonalRoute {
    
    router = Router();

    // Instanciamos el controlador
    informacionPersonalC: InformacionPersonalController = new InformacionPersonalController();

    // Instanciamos los middlewares de validación
    validarCampos: ValidateData = new ValidateData();
    validarJWT: ValidateJWTcustom = new ValidateJWTcustom();

    constructor() {
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
            check('infp_name', 'El nombre es obligatorio').not().isEmpty(),
            check('infp_lastname', 'El apellido es obligatorio').not().isEmpty(),
            check('infp_telephone', 'El teléfono es obligatorio').not().isEmpty(),
            check('infp_birth_date', 'La fecha de nacimiento es obligatoria').not().isEmpty().isDate().withMessage('La fecha de nacimiento no es válida'),
            check('infp_img', 'La imagen es obligatoria').optional(), // Si no se pasa, no es obligatorio

            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req: Request, res: Response) => {
            this.informacionPersonalC.createInformacionPersonal(req, res);
        });
    }

    // Ruta para actualizar la información personal de un usuario
    putUpdateInformacion() {
        this.router.put('/:id/information/:infp_id', [
            // Validaciones de los datos
            check('infp_name', 'El nombre es obligatorio').optional().not().isEmpty(),
            check('infp_lastname', 'El apellido es obligatorio').optional().not().isEmpty(),
            check('infp_telephone', 'El teléfono es obligatorio').optional().not().isEmpty(),
            check('infp_birth_date', 'La fecha de nacimiento es obligatoria').optional().not().isEmpty().isDate().withMessage('La fecha de nacimiento no es válida'),
            check('infp_img', 'La imagen es obligatoria').optional(),

            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req: Request, res: Response) => {
            this.informacionPersonalC.updateInformacionPersonal(req, res);
        });
    }

    // Ruta para obtener la información personal por nombre
    getPersonalInfoByNameRoute() {
        this.router.get('/name/:infp_name', [
            this.validarJWT.validateJWT,  // Validación de JWT (si es necesario)
        ], (req: Request, res: Response) => {
            this.informacionPersonalC.getPersonalInfoByName(req, res);
        });
    }

    // Ruta para obtener la información personal por fecha de nacimiento
    getPersonalInfoByBirthDateRoute() {
        this.router.get('/birthdate/:infp_birth_date', [
            this.validarJWT.validateJWT,  // Validación de JWT (si es necesario)
        ], (req: Request, res: Response) => {
            this.informacionPersonalC.getPersonalInfoByBirthDate(req, res);
        });
    }
}