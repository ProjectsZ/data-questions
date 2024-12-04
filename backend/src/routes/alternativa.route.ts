import { Request, Response, Router } from 'express';
import { check } from 'express-validator';

// Middlewares
import { ValidateData } from './../middlewares/validate-data.custom';
import { ValidateJWTcustom } from './../middlewares/validate-jwt.custom';

// Controllers
import { AlternativaController } from '../controllers/alternativa.controller';

export class AlternativaRoute {

    router = Router();

    // Instanciamos el controlador
    alternativaC: AlternativaController = new AlternativaController();

    // Instanciamos los middlewares de validación
    validarCampos: ValidateData = new ValidateData();
    validarJWT: ValidateJWTcustom = new ValidateJWTcustom();

    constructor() {
        // Inicializamos las rutas
        this.postCreateAlternativa();
        this.getAlternativaById();
        this.getAlternativasByPreguntaId();
        this.putUpdateAlternativa();
        this.deleteAlternativa();
        this.getCorrectAlternativasByPreguntaId();
    }

    // Ruta para crear una nueva alternativa
    postCreateAlternativa() {
        this.router.post('/', [
            // Validaciones de los datos
            check('opt_pr_id', 'El ID de la pregunta es obligatorio').not().isEmpty(),
            check('opt_text', 'El texto de la alternativa es obligatorio').not().isEmpty(),
            check('opt_is_correct', 'Debe indicar si la alternativa es correcta').isBoolean(),

            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req: Request, res: Response) => {
            this.alternativaC.createAlternativa(req, res);
        });
    }

    // Ruta para obtener una alternativa por ID
    getAlternativaById() {
        this.router.get('/:opt_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.alternativaC.getAlternativaById(req, res);
        });
    }

    // Ruta para obtener todas las alternativas de una pregunta por ID
    getAlternativasByPreguntaId() {
        this.router.get('/pregunta/:opt_pr_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.alternativaC.getAlternativasByPreguntaId(req, res);
        });
    }

    // Ruta para actualizar una alternativa
    putUpdateAlternativa() {
        this.router.put('/:opt_id', [
            // Validaciones de los datos
            check('opt_text', 'El texto de la alternativa es obligatorio').optional().not().isEmpty(),
            check('opt_img', 'La imagen de la alternativa es opcional').optional(),
            check('opt_description', 'La descripción de la alternativa es opcional').optional(),

            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req: Request, res: Response) => {
            this.alternativaC.updateAlternativa(req, res);
        });
    }

    // Ruta para eliminar una alternativa
    deleteAlternativa() {
        this.router.delete('/:opt_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.alternativaC.deleteAlternativa(req, res);
        });
    }

    // Ruta para obtener las alternativas correctas de una pregunta
    getCorrectAlternativasByPreguntaId() {
        this.router.get('/correctas/pregunta/:opt_pr_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.alternativaC.getCorrectAlternativasByPreguntaId(req, res);
        });
    }
}