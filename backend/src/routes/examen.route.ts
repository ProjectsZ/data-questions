import { Request, Response, Router } from 'express';
import { check } from 'express-validator';

// Middlewares
import { ValidateData } from './../middlewares/validate-data.custom';
import { ValidateJWTcustom } from './../middlewares/validate-jwt.custom';

// Controllers
import { ExamenController } from '../controllers/examen.controller';

export class ExamenRoute {

    router = Router();

    // Instanciamos el controlador
    examenC: ExamenController = new ExamenController();

    // Instanciamos los middlewares de validación
    validarCampos: ValidateData = new ValidateData();
    validarJWT: ValidateJWTcustom = new ValidateJWTcustom();

    constructor() {
        // Inicializamos las rutas
        this.postCreateExamen();
        this.getExamenById();
        this.getExamenesByTeacherId();
        this.putUpdateExamen();
        this.deleteExamen();
        this.getExamenesByStatus();
        this.getExamenesByDateRange();
        this.getExamenDuration();
        this.getExamenAttempts();
    }

    // Ruta para crear un nuevo examen
    postCreateExamen() {
        this.router.post('/', [
            // Validaciones de los datos
            check('exm_description', 'La descripción del examen es obligatoria').not().isEmpty(),
            check('exm_status', 'El estado del examen es obligatorio').not().isEmpty(),
            check('exm_duration', 'La duración del examen es obligatoria').isNumeric().withMessage('La duración debe ser un número'),
            check('exm_attempts', 'Los intentos del examen son obligatorios').isNumeric().withMessage('Los intentos deben ser un número'),
            check('exm_teacher_user_id', 'El ID del profesor es obligatorio').not().isEmpty(),
            check('exm_crs_id', 'El ID del curso es obligatorio').not().isEmpty(),

            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req: Request, res: Response) => {
            this.examenC.createExamen(req, res);
        });
    }

    // Ruta para obtener un examen por ID
    getExamenById() {
        this.router.get('/:exm_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.examenC.getExamenById(req, res);
        });
    }

    // Ruta para obtener exámenes por ID del profesor
    getExamenesByTeacherId() {
        this.router.get('/teacher/:exm_teacher_usr_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.examenC.getExamenesByTeacherId(req, res);
        });
    }

    // Ruta para actualizar un examen
    putUpdateExamen() {
        this.router.put('/:exm_id', [
            // Validaciones de los datos
            check('exm_description', 'La descripción del examen es obligatoria').optional().not().isEmpty(),
            check('exm_status', 'El estado del examen es obligatorio').optional().not().isEmpty(),
            check('exm_duration', 'La duración del examen es obligatoria').optional().isNumeric().withMessage('La duración debe ser un número'),
            check('exm_attempts', 'Los intentos del examen son obligatorios').optional().isNumeric().withMessage('Los intentos deben ser un número'),

            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req: Request, res: Response) => {
            this.examenC.updateExamen(req, res);
        });
    }

    // Ruta para eliminar un examen
    deleteExamen() {
        this.router.delete('/:exm_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.examenC.deleteExamen(req, res);
        });
    }

    // Ruta para obtener los exámenes por estado (activo/inactivo)
    getExamenesByStatus() {
        this.router.get('/status/:exm_status', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.examenC.getExamenesByStatus(req, res);
        });
    }

    // Ruta para obtener los exámenes por rango de fechas
    getExamenesByDateRange() {
        this.router.post('/date-range', [
            this.validarJWT.validateJWT, // Validamos el JWT
            check('startDate', 'La fecha de inicio es obligatoria').isDate(),
            check('endDate', 'La fecha de fin es obligatoria').isDate(),
            
            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req: Request, res: Response) => {
            this.examenC.getExamenesByDateRange(req, res);
        });
    }

    // Ruta para obtener la duración de un examen
    getExamenDuration() {
        this.router.get('/:exm_id/duration', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.examenC.getExamenDuration(req, res);
        });
    }

    // Ruta para obtener los intentos permitidos de un examen
    getExamenAttempts() {
        this.router.get('/:exm_id/attempts', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.examenC.getExamenAttempts(req, res);
        });
    }
}