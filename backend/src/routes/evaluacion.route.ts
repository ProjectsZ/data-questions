import { Request, Response, Router } from 'express';
import { check } from 'express-validator';

// Middlewares
import { ValidateData } from './../middlewares/validate-data.custom';
import { ValidateJWTcustom } from './../middlewares/validate-jwt.custom';

// Controllers
import { EvaluacionController } from '../controllers/evaluacion.controller';

export class EvaluacionRoute {

    router = Router();

    // Instanciamos el controlador
    evaluacionC: EvaluacionController = new EvaluacionController();

    // Instanciamos los middlewares de validación
    validarCampos: ValidateData = new ValidateData();
    validarJWT: ValidateJWTcustom = new ValidateJWTcustom();

    constructor() {
        // Inicializamos las rutas
        this.postCreateEvaluacion();
        this.getEvaluacionById();
        this.getEvaluacionesByExamenId();
        this.getEvaluacionesByStudentId();
        this.putUpdateEvaluacion();
        this.deleteEvaluacion();
        this.getEvaluacionesByDateRange();
        this.getAverageScoreByExamenId();
        this.getEvaluacionesByScoreThreshold();
        this.getEvaluacionFeedback();
    }

    // Ruta para crear una nueva evaluación
    postCreateEvaluacion() {
        this.router.post('/', [
            // Validaciones de los datos
            check('eva_exm_id', 'El ID del examen es obligatorio').not().isEmpty(),
            check('eva_student_usr_id', 'El ID del estudiante es obligatorio').not().isEmpty(),
            check('eva_date', 'La fecha de la evaluación es obligatoria').isDate(),
            check('eva_score', 'El puntaje de la evaluación es obligatorio').isNumeric().withMessage('El puntaje debe ser un número'),
            check('eva_feedback', 'La retroalimentación es obligatoria').not().isEmpty(),

            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req: Request, res: Response) => {
            this.evaluacionC.createEvaluacion(req, res);
        });
    }

    // Ruta para obtener una evaluación por ID
    getEvaluacionById() {
        this.router.get('/:eva_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.evaluacionC.getEvaluacionById(req, res);
        });
    }

    // Ruta para obtener evaluaciones por ID de examen
    getEvaluacionesByExamenId() {
        this.router.get('/examen/:eva_exm_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.evaluacionC.getEvaluacionesByExamenId(req, res);
        });
    }

    // Ruta para obtener evaluaciones por ID de estudiante
    getEvaluacionesByStudentId() {
        this.router.get('/estudiante/:eva_student_usr_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.evaluacionC.getEvaluacionesByStudentId(req, res);
        });
    }

    // Ruta para actualizar evaluación (puntaje y retroalimentación)
    putUpdateEvaluacion() {
        this.router.put('/:eva_id', [
            // Validaciones de los datos
            check('eva_score', 'El puntaje de la evaluación es obligatorio').optional().isNumeric().withMessage('El puntaje debe ser un número'),
            check('eva_feedback', 'La retroalimentación es obligatoria').optional().not().isEmpty(),

            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req: Request, res: Response) => {
            this.evaluacionC.updateEvaluacion(req, res);
        });
    }

    // Ruta para eliminar una evaluación
    deleteEvaluacion() {
        this.router.delete('/:eva_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.evaluacionC.deleteEvaluacion(req, res);
        });
    }

    // Ruta para obtener evaluaciones por rango de fechas
    getEvaluacionesByDateRange() {
        this.router.post('/date-range', [
            this.validarJWT.validateJWT, // Validamos el JWT
            check('startDate', 'La fecha de inicio es obligatoria').isDate(),
            check('endDate', 'La fecha de fin es obligatoria').isDate(),
            
            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req: Request, res: Response) => {
            this.evaluacionC.getEvaluacionesByDateRange(req, res);
        });
    }

    // Ruta para obtener el puntaje promedio de un examen
    getAverageScoreByExamenId() {
        this.router.get('/:eva_exm_id/average-score', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.evaluacionC.getAverageScoreByExamenId(req, res);
        });
    }

    // Ruta para obtener evaluaciones por puntaje mínimo
    getEvaluacionesByScoreThreshold() {
        this.router.get('/score/:minScore', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.evaluacionC.getEvaluacionesByScoreThreshold(req, res);
        });
    }

    // Ruta para obtener retroalimentación de la evaluación
    getEvaluacionFeedback() {
        this.router.get('/:eva_id/feedback', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.evaluacionC.getEvaluacionFeedback(req, res);
        });
    }
}