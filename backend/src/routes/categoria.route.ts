import { Request, Response, Router } from 'express';
import { check } from 'express-validator';

// Middlewares
import { ValidateData } from './../middlewares/validate-data.custom';
import { ValidateJWTcustom } from './../middlewares/validate-jwt.custom';

// Controllers
import { CategoriaController } from '../controllers/categoria.controller';

export class CategoriaRoute {

    router = Router();

    // Instanciamos el controlador
    categoriaC: CategoriaController = new CategoriaController();

    // Instanciamos los middlewares de validación
    validarCampos: ValidateData = new ValidateData();
    validarJWT: ValidateJWTcustom = new ValidateJWTcustom();

    constructor() {
        // Inicializamos las rutas
        this.postCreateCategoria();
        this.getCategoriaById();
        this.getAllCategorias();
        this.putUpdateCategoria();
        this.deleteCategoria();
        this.getCategoriasByCursoId();
        this.searchCategorias();
    }

    // Ruta para crear una nueva categoría
    postCreateCategoria() {
        this.router.post('/', [
            // Validaciones de los datos
            check('cat_title', 'El título de la categoría es obligatorio').not().isEmpty(),
            check('cat_subtitle', 'El subtítulo de la categoría es obligatorio').not().isEmpty(),
            check('cat_description', 'La descripción de la categoría es obligatoria').not().isEmpty(),
            check('cat_crs_id', 'El ID del curso asociado es obligatorio').not().isEmpty(),

            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req: Request, res: Response) => {
            this.categoriaC.createCategoria(req, res);
        });
    }

    // Ruta para obtener una categoría por su ID
    getCategoriaById() {
        this.router.get('/:cat_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.categoriaC.getCategoriaById(req, res);
        });
    }

    // Ruta para obtener todas las categorías
    getAllCategorias() {
        this.router.get('/', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.categoriaC.getAllCategorias(req, res);
        });
    }

    // Ruta para actualizar una categoría
    putUpdateCategoria() {
        this.router.put('/:cat_id', [
            // Validaciones de los datos
            check('cat_title', 'El título de la categoría es obligatorio').optional().not().isEmpty(),
            check('cat_subtitle', 'El subtítulo de la categoría es obligatorio').optional().not().isEmpty(),
            check('cat_description', 'La descripción de la categoría es obligatoria').optional().not().isEmpty(),
            check('cat_crs_id', 'El ID del curso asociado es obligatorio').optional().not().isEmpty(),

            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req: Request, res: Response) => {
            this.categoriaC.updateCategoria(req, res);
        });
    }

    // Ruta para eliminar una categoría
    deleteCategoria() {
        this.router.delete('/:cat_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.categoriaC.deleteCategoria(req, res);
        });
    }

    // Ruta para obtener categorías por curso
    getCategoriasByCursoId() {
        this.router.get('/curso/:crs_id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.categoriaC.getCategoriasByCursoId(req, res);
        });
    }

    // Ruta para buscar categorías por nombre
    searchCategorias() {
        this.router.get('/search/:query', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.categoriaC.searchCategorias(req, res);
        });
    }
}