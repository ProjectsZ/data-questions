
import { Request, Response, response } from 'express';
import User, { IUser } from '../models/user.model';
import bcrypt from 'bcryptjs';
import { Jwt } from '../helpers/jwt';
import { GoogleVerify } from '../helpers/google-verify';

export class AuthController{

    constructor(){
    }

    public async login(req: Request, res: Response = response){

        /**Extraer el email y password del body o datos que se envia */
        const { usr_email, usr_password } = req.body;

        try{
            /**Verificando email */
            const usuarioDB: IUser | null = await User.findOne({ usr_email });
            if(!usuarioDB){
              return res.status(404).json({
                  ok: false,
                  msg: 'Error con los datos'
              });
            }

            /**Verificando password */
            const validPassword = bcrypt.compareSync(
                usr_password, usuarioDB.usr_password);
            if(!validPassword){
              return res.status(400).json({
                  ok: false,
                  msg: 'Error con los datos'
              });
            }
 
            /**Generar el TOKEN - JWT */
            const token = await new Jwt().generateJWT( usuarioDB._id );

            res.json({
                ok: true,
                token,
                name: usuarioDB.usr_name
            });
        }catch(error){
              console.log(error);
              res.status(500).json({
                  ok: false,
                  msg: 'Consulte/hable con el Administrador'
              });
          }
    }


    async login2(req: Request, res: Response = response){
        
    if (req.body.usr_email == null || req.body.usr_password == null) {
        res.send({ error: true, message: 'Invalid request.' });
        return
    }

    const { usr_email, usr_password } = req.body;
   try{


        const dataDB:any = await User.findOne({ usr_email });

        // const dataDB:any = await new Promise((resolve, reject)=>{
        //     User.findOne({ email })
        // });
        // mysqlConnection.query('SELECT * FROM USUARIO WHERE correo = "' + req.body.usuario + '" and password ="' + req.body.contrasena + '"', (err, rows, fields) => {
        
        console.log(dataDB);

        if(!dataDB){
            return res.send({ error: true, message: 'No se logró encontrar la data' });
        }

         // Verificar contraseña
        const validarContrasenha = bcrypt.compareSync(usr_password, dataDB.usr_password);
        if ( !validarContrasenha ) {            
            console.log('La contraseña no es la misma. ¿La has olvidado?');
            return res.send({ error: true, message: 'Correo o contraseña invalido' });
        }

        const token = await new Jwt().generateJWT(dataDB.id);
        res.json({ ok: true, msg: "Se logró ingresar con dicho usuario", token: token});
        //TODO: Guardar el token en la db o algun lugar donde vos peudas relacionar el usuario al token
        
    }catch(error){
        console.log(error);
      res.status(500).json({
          error: true,
          message: 'Datos erroneos'
      });
    }

    }

    // Login Google (manejamos la autenticación de google)
    async loginGoogleSignIn( req: any, res: Response = response ){

        const googleToken = req.body.token;

        try{

            // const dataPayload :any = await new GoogleVerify().googleVerify( googleToken );
            const { name, email, picture } = await new GoogleVerify().googleVerify( googleToken );
            
            // Para verificar si existe un usuario ya con ese 'email' en uso
            const usuarioDB = await User.findOne({ email });
            
            let usuario;
            
            if( !usuarioDB ){
                // Si no existe el usuario se usán los datos provenientes de Google
                usuario = new User({
                    usr_name: name,
                    usr_email: email,
                    usr_password: 'usando_auth_google',
                    usr_img: picture,
                    usr_google_access: true,
                });
            }else{
                // caso contrario, si existe el usuario se siguen usándo la misma data
                usuario = usuarioDB;
                usuario.usr_google_access = true;

            }
            
            //Guardar DB
            await usuario.save();

            // Generar el Token - JWT
            const token = await new Jwt().generateJWT( usuario.id );

            res.json({
                ok: true,
                token
            });

        }catch(error){
              console.log(error);
              return res.status(401).json({
                  ok: false,
                  msg: 'El token no es correcto!'
              });
          }
    }

    /**
     *  Regresará un nuevo token
     * @param req 
     * @param res */
    public async renewToken( req: any, res: Response = response ){

        const uid = req.uid.uid;

        //Generar el token - jwt
        const token = await new Jwt().generateJWT( uid );

        // Obtener el usuario por uid
        const usuario = await User.findById( uid );

        res.json({
            ok: true,
            uid,
            token,
            usuario
        });

    }

}
