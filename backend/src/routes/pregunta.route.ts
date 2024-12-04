import { Request, Response, Router } from 'express';
import { check } from 'express-validator';

// Middlewares
import { ValidateData } from './../middlewares/validate-data.custom';  // Suponemos que el middleware de validación está en este archivo
import { ValidateJWTcustom } from './../middlewares/validate-jwt.custom';  // Suponemos que el middleware de JWT está en este archivo

// Controllers
import { PreguntaController } from '../controllers/pregunta.controller';  // El controlador para manejar la lógica de las preguntas

export class PreguntaRoute {
    
    router = Router();

    // Instanciamos el controlador
    preguntaC: PreguntaController = new PreguntaController();

    // Instanciamos los middlewares de validación
    validarCampos: ValidateData = new ValidateData();
    validarJWT: ValidateJWTcustom = new ValidateJWTcustom();

    constructor() {
        // Inicializamos las rutas
        this.getRoutesPreguntas();
        this.getRoutePreguntaById();
        this.postRoutesPreguntas();
        this.putRoutesPreguntas();
        this.deleteRoutesPreguntas();
    }

    // Ruta para obtener todas las preguntas
    getRoutesPreguntas() {
        this.router.get('/', [
            this.validarJWT.validateJWT  // Aquí podrías agregar más middlewares de validación si es necesario
        ], (req: Request, res: Response) => {
            this.preguntaC.getPreguntas(req, res);
        });
    }

    // Ruta para obtener una pregunta por ID
    getRoutePreguntaById() {
        this.router.get('/:id', [
            this.validarJWT.validateJWT  // Validamos que el usuario esté autenticado
        ], (req: Request, res: Response) => {
            this.preguntaC.getPreguntaById(req, res);
        });
    }

    // Ruta para registrar una nueva pregunta
    postRoutesPreguntas() {
        this.router.post('/', [
            // Validación de los datos del cuerpo de la solicitud
            check('pr_content', 'El contenido de la pregunta es obligatorio').not().isEmpty(),
            check('pr_answer', 'Las respuestas son obligatorias y deben ser un arreglo').isArray().not().isEmpty(),
            check('pr_type', 'El tipo de pregunta es obligatorio').not().isEmpty(),
            check('pr_difficulty', 'La dificultad es obligatoria').not().isEmpty(),
            check('pr_time', 'El tiempo de la pregunta es obligatorio').isInt({ min: 1 }).withMessage('El tiempo debe ser un número mayor que 0'),
            check('pr_tags', 'Las etiquetas son opcionales y deben ser un arreglo').optional().isArray(),
            check('pr_cat_id', 'La categoría es obligatoria y debe ser un ID válido').not().isEmpty().isMongoId().withMessage('La categoría debe ser un ID válido de MongoDB'),

            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req: Request, res: Response) => {
            this.preguntaC.createPregunta(req, res);
        });
    }

    // Ruta para actualizar una pregunta
    putRoutesPreguntas() {
        this.router.put('/:id', [
            this.validarJWT.validateJWT, // Validamos el JWT
            check('pr_content', 'El contenido de la pregunta es obligatorio').not().isEmpty(),
            check('pr_answer', 'Las respuestas son obligatorias y deben ser un arreglo').isArray().not().isEmpty(),
            check('pr_type', 'El tipo de pregunta es obligatorio').not().isEmpty(),
            check('pr_difficulty', 'La dificultad es obligatoria').not().isEmpty(),
            check('pr_time', 'El tiempo de la pregunta es obligatorio').isInt({ min: 1 }).withMessage('El tiempo debe ser un número mayor que 0'),
            check('pr_tags', 'Las etiquetas son opcionales y deben ser un arreglo').optional().isArray(),
            check('pr_cat_id', 'La categoría es obligatoria y debe ser un ID válido').not().isEmpty().isMongoId().withMessage('La categoría debe ser un ID válido de MongoDB'),

            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req: Request, res: Response) => {
            this.preguntaC.updatePregunta(req, res);
        });
    }

    // Ruta para eliminar una pregunta
    deleteRoutesPreguntas() {
        this.router.delete('/:id', [
            this.validarJWT.validateJWT  // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.preguntaC.deletePregunta(req, res);
        });
    }
}