// Ruta: /api/login y /api/users
import { Request, Response, Router } from 'express';
import { check } from 'express-validator';

// Middlewares
import { ValidateData } from './../middlewares/validate-data.custom';
import { ValidateJWTcustom } from './../middlewares/validate-jwt.custom';
import { EmailData } from '../middlewares/email-data.custom';

// Controllers
import { AuthController } from './../controllers/auth.controller';
import { UsersController } from '../controllers/users.controller';

export class AuthRoute{

    router = Router(); 

    validarCampos: ValidateData = new ValidateData();
    validarJWT: ValidateJWTcustom = new ValidateJWTcustom();
    
    authC: AuthController | any = new AuthController();

    constructor(){
        this.postRoutesLogin();
        this.postRouteLoginGoogle();
        this.getRouteLoginRenewToken();
    }

    postRoutesLogin(){
        this.router.post('/', [      
            check('usr_email', 'El email es obligatorio').isEmail(),
            check('usr_password', 'El password es obligatorio').not().isEmpty(),
            this.validarCampos.validateInputs
            
        ], this.authC.login);
    }
 
    // Google sign-in
    postRouteLoginGoogle(){
        this.router.post('/google', [
            check('token', 'El token google es obligatorio').not().isEmpty(),
            // this.validarCampos.validateInputs,

            
        ], this.authC.loginGoogleSignIn );
    }

    getRouteLoginRenewToken(){
        this.router.get('/renew', [
            // this.validarJWT.validateJWT
        ], this.authC.renewToken );
    }

}








export class UsersRoute{
    
        router = Router();
    
        // No se logra mandar el controlador, por que no captura los req y res de la otra clase, CORREXION MOMENTANEA HASTA LA PROXIMA ACTUALIZACION
        usersC: UsersController | any = new UsersController(); // usersC: UsersController = new UsersController();
    
        validarCampos: ValidateData = new ValidateData();
        validarJWT: ValidateJWTcustom | any = new ValidateJWTcustom();
        validarEmail: EmailData = new EmailData();
    
        constructor(){
            this.getRoutesUsers();
            this.postRoutesUsers();
            this.putRoutesUsers();
            this.deleteRoutesUsers();
        }
    
        /* Primera ruta: Usuarios  */
        getRoutesUsers(){
            /* Él getUsers no se esta ejecutando (osea no se llama getUsers() )
               simplemente se está mandando como referencia a la función. */                   
            this.router.get( '/', [
              this.validarJWT.validateJWT,
             
            ], this.usersC.getUsers );

        }
        // Registro de usuario
        postRoutesUsers(){

            this.router.post('/register', [
                /* check('<name-data>', '<message-when-error-occurs>') */
                check('usr_name', 'El nombre del usuario es obligatorio').not().isEmpty(),
                check('usr_username', 'El nick es obligatorio').not().isEmpty(), /* name (required) */
                check('usr_email', 'El email es obligatorio').isEmail(), /* email (required) */
                check('usr_password','La contrasenha es obligatoria').not().isEmpty().isLength({ min: 8 }).withMessage('La contraseña debe tener minimo 8 letras'), /* password (is Email) */
                check('usr_telephone', 'El número de teléfono es obligatorio').not().isEmpty(),
                this.validarCampos.validateInputs, /* Este tiene que ir último */
                // this.validarEmail.validateEmail,                
            ], this.usersC.createUsers );
        }
        
        putRoutesUsers(){
          /**Mandamos el _id or uid or id que del usuario del que se desee actualizar */
          this.router.put('/:id', [
            this.validarJWT.validateJWT, /**colocado arriba si falla, no continuará al errar */
            check('usr_username', 'El nombre es obligatorio').not().isEmpty(), /* name (required) */
            check('usr_email', 'El email es obligatorio').isEmail(), /* email (required) */
            check('usr_role', 'El role es obligatorio').not().isEmpty(),
            this.validarCampos.validateInputs, /* Este tiene que ir último */
          ], this.usersC.updateUser);
        }
        
        deleteRoutesUsers(){
          this.router.delete('/:id',[
            this.validarJWT.validateJWT                        
          ], this.usersC.deleteUser  );
        }
}