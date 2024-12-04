import { Request, Response, Router } from 'express';
import { check } from 'express-validator';

// Middlewares
import { ValidateData } from './../middlewares/validate-data.custom';
import { ValidateJWTcustom } from './../middlewares/validate-jwt.custom';

// Controllers
import { CursoController } from '../controllers/curso.controller';

export class CursoRoute {

    router = Router();

    // Instanciamos el controlador
    cursoC: CursoController = new CursoController();

    // Instanciamos los middlewares de validación
    validarCampos: ValidateData = new ValidateData();
    validarJWT: ValidateJWTcustom = new ValidateJWTcustom();

    constructor() {
        // Inicializamos las rutas
        this.postCreateCurso();
        this.getCursoById();
        this.getAllCursos();
        this.putUpdateCurso();
        this.deleteCurso();
        this.getCursoByCode();
        this.getCursosByName();
        this.searchCursos();
    }

    // Ruta para crear un nuevo curso
    postCreateCurso() {
        this.router.post('/', [
            // Validaciones de los datos
            check('crs_name', 'El nombre del curso es obligatorio').not().isEmpty(),
            check('crs_description', 'La descripción del curso es obligatoria').not().isEmpty(),
            check('crs_code', 'El código del curso es obligatorio').not().isEmpty(),

            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req: Request, res: Response) => {
            this.cursoC.createCurso(req, res);
        });
    }

    // Ruta para obtener un curso por su ID
    getCursoById() {
        this.router.get('/:crs_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.cursoC.getCursoById(req, res);
        });
    }

    // Ruta para obtener todos los cursos
    getAllCursos() {
        this.router.get('/', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.cursoC.getAllCursos(req, res);
        });
    }

    // Ruta para actualizar un curso
    putUpdateCurso() {
        this.router.put('/:crs_id', [
            // Validaciones de los datos
            check('crs_name', 'El nombre del curso es obligatorio').optional().not().isEmpty(),
            check('crs_description', 'La descripción del curso es obligatoria').optional().not().isEmpty(),
            check('crs_code', 'El código del curso es obligatorio').optional().not().isEmpty(),

            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req: Request, res: Response) => {
            this.cursoC.updateCurso(req, res);
        });
    }

    // Ruta para eliminar un curso
    deleteCurso() {
        this.router.delete('/:crs_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.cursoC.deleteCurso(req, res);
        });
    }

    // Ruta para obtener un curso por su código
    getCursoByCode() {
        this.router.get('/code/:crs_code', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.cursoC.getCursoByCode(req, res);
        });
    }

    // Ruta para obtener cursos por nombre
    getCursosByName() {
        this.router.get('/name/:crs_name', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.cursoC.getCursosByName(req, res);
        });
    }

    // Ruta para buscar cursos con un query
    searchCursos() {
        this.router.get('/search/:query', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.cursoC.searchCursos(req, res);
        });
    }
}