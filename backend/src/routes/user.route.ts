import { Request, Response, Router } from 'express';
import { check } from 'express-validator';

// Middlewares
import { ValidateData } from './../middlewares/validate-data.custom';
import { ValidateJWTcustom } from './../middlewares/validate-jwt.custom';
import { EmailData } from '../middlewares/email-data.custom';

// Controllers
import { UserController } from '../controllers/user.controller';

export class UserRoute {
    
    router = Router();

    // Instanciamos el controlador
    usersC: UserController = new UserController();

    // Instanciamos los middlewares de validación
    validarCampos: ValidateData = new ValidateData();
    validarJWT: ValidateJWTcustom = new ValidateJWTcustom();
    validarEmail: EmailData = new EmailData();

    constructor() {
        // Inicializamos las rutas
        this.getRoutesUsers();
        this.getRouteUserById();
        this.postRoutesUsers();
        this.putRoutesUsers();
        this.putRouteChangePassword();
        this.putRouteResetPassword();
        this.deleteRoutesUsers();
    }

    // Ruta para obtener todos los usuarios con paginación
    getRoutesUsers() {
        this.router.get('/', [ 
            this.validarJWT.validateJWT 
        ], (req: Request, res: Response) => {            
            this.usersC.getUsers(req, res);
        });
    }

    // Ruta para obtener un usuario por ID
    getRouteUserById() {
    
        this.router.get('/:id', [
            this.validarJWT.validateJWT
        ],
             (req: Request, res: Response) => {           

            this.usersC.getUserById(req, res);
        });
    }

    // Ruta para registrar un nuevo usuario
    postRoutesUsers() {

        this.router.post('/', [
            // Validación de los datos del cuerpo de la solicitud
            check('usr_name', 'El nombre del usuario es obligatorio').not().isEmpty(),
            check('usr_username', 'El nick es obligatorio').not().isEmpty()
                .isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres'),
            check('usr_email', 'El email es obligatorio').isEmail().withMessage('El email proporcionado no es válido'),
            check('usr_password', 'La contraseña es obligatoria').not().isEmpty()
                .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
            check('usr_telephone', 'El número de teléfono es obligatorio').not().isEmpty(),

            // Middleware para manejar errores de validación
            this.validarCampos.validateInputs
        ], (req: Request, res: Response) => {
            this.usersC.createUsers(req, res);
        });

    }

    // Ruta para actualizar los datos de un usuario
    putRoutesUsers() {
        this.router.put('/:id', [
            this.validarJWT.validateJWT, // Validamos el JWT
            check('usr_username', 'El nombre de usuario es obligatorio').not().isEmpty(),
            check('usr_email', 'El email es obligatorio').isEmail(),
            check('usr_role', 'El rol es obligatorio').not().isEmpty(),
            this.validarCampos.validateInputs, // Validación de campos
        ], (req:Request, res: Response) => {
            this.usersC.updateUser(req, res);
        });
    }

    // Ruta para cambiar la contraseña de un usuario
    putRouteChangePassword() {
        this.router.put('/:id/change-password', [
            this.validarJWT.validateJWT, // Validamos el JWT
            check('usr_password_old', 'La contraseña antigua es obligatoria').not().isEmpty(),
            check('usr_password_new', 'La nueva contraseña es obligatoria').not().isEmpty().isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres'),
            this.validarCampos.validateInputs, // Validación de campos
        ], (req:Request, res: Response)=>{
            this.usersC.changePassword(req, res);
        } );
    }

    // Ruta para restablecer la contraseña de un usuario usando un token
    putRouteResetPassword() {
        this.router.put('/:id/reset-password', [
            check('token', 'El token de recuperación es obligatorio').not().isEmpty(),
            check('newPassword', 'La nueva contraseña es obligatoria').not().isEmpty().isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres'),
            this.validarCampos.validateInputs, // Validación de campos
        ], (req:Request, res: Response)=>{
            this.usersC.resetPassword(req, res);
        });
    }

    // Ruta para eliminar un usuario
    deleteRoutesUsers() {
        this.router.delete('/:id', [
            this.validarJWT.validateJWT // Validamos el JWT
        ], (req: Request, res: Response) => {
            this.usersC.deleteUser(req, res);
        });
    }
}

