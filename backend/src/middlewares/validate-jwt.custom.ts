
import { Request, Response, response } from 'express';
import jwt from 'jsonwebtoken';
import { Jwt } from './../helpers/jwt';
import User from "./../models/user.model";


export class ValidateJWTcustom{
    
    constructor(){
    }

    /**Validando el JWT y devolviendo el id
     * @param req: es de tipo "any"; dado que si se manda "Request" los datos son muy controlados
     *        por lo cual da error (al no reconocer req.uid por ejemplo), alternativa usar "any"
     * @param res: es de tipo "Response"; para controlar/mandar errores usando status().json
     * @param next: es de tipo "any"; es el middleware, que avanzará si se realiza el matching route.
     *        O simplemente es una especie de callback, para pasar al siguiente middleware. */
    validateJWT(req: any, res: Response, next: any){

        /**Naturalemnte el JWT  */
        let key_vs = `${ process.env.JWT_SECRET }`;

        // /**Leer el token */
        const token = req.header('x-token');
        // console.log(token);
        /**Verificar el token, si no hay toquen no se hace nada más */
        if(!token){
          return res.status(401).json({
              ok: false,
              msg: 'No hay token en la petición'
          });
        }
        /**Para verificar el JWT */
        try{
            const uid  =  jwt.verify( token, key_vs );
            // console.log(uid);
            req.uid = uid; 
            //     /**Necesario para validar datos */
            next();

        }catch(error){
            // console.log(error);
            console.log("→ Token expirado o no valido!");
            return  res.status(401).json({
                  ok: false,
                  msg: 'Disculpe, pero usted no tiene autorización para acceder a la plataforma, por favor ingrese su usuario o registrase.'
            });
        }
    }

    async validateADMIN(req: any, res: Response, next: any){

        const uid = req.uid.uid;
        // const usrid = req.params["usrid"];

        try{
            
            const usuarioDB = await User.findById(uid);

            if(!usuarioDB){
                return res.status(404).json({
                    ok: false,
                    msg: "User not exist"
                });
            }

            if( usuarioDB.usr_role !== 'ADMIN_ROLE'  /* && usrid === uid */ ){
                return res.status(403).json({
                    ok: false,
                    msg: 'You have no privilege to do that'
                })
            }

            // validar admin para editar perfil propio
            // if( usuarioDB.usr_role === 'ADMIN_ROLE' || usrid === uid ){
            //     next();
            // }else{
            //     return res.status(403).json({
            //         ok: false,
            //         msg: 'You have no privilege to do that'
            //     })
            // }

            next();
            
        }catch(error){
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Hablar con el admin'
            });
        }
    }
}
