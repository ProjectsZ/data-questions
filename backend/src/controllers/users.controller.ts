// Logica de lo que va hacer nuestra ruta
import { Request, Response, response } from 'express';
import User from '../models/user.model';
// import { validationResult } from 'express-validator'
import bcrypt from 'bcryptjs';
import { Jwt } from '../helpers/jwt';


export class UsersController{

    constructor(){

    }
    
    async getUsers(req: Request, res: Response){
        /**Usamos un nombre cualquiera (startPage) para los parametros  */
        const startPage = Number(req.query.startPage) || 0;
        const totalPages = 5; // total de pages a mostrar
        
        // Corre de manera simultanea el const 'usuarios' y 'totalItems'
        /**
         * all() esto adjunta en un array muchas promesas y los corre de manera simultanea.
         */
        
        const [ usuarios, totalItems ] = await Promise.all([
            User.find({}, `usr_first_name 
                           usr_last_name 
                           usr_email 
                           usr_username 
                           usr_img 
                           usr_role 
                           usr_tel 
                           usr_pais 
                           usr_dni 
                           usr_createdAt 
                           usr_google_access`)
                                 .skip( startPage ) /** iniciar desde la data N° startPage */
                                 .limit( totalPages ), /** mostrar solo totalPages datas */
            User.countDocuments() /* por warning error: no usar .count()  */
        ]);


        res.json({
                ok: true,
                usuarios,
                total_user: totalItems
            });
    }

    async createUsers(req: Request, res: Response = response){

        const { usr_password, usr_email, usr_telephone } = req.body;
        
        try{
            /* Validando si existe ya un email en la base de datos
             * .findOne():  */
            const existEmail = await User.findOne({ usr_email });

            if( existEmail ){
                return res.status(400).json({
                            ok: false,
                            msg: 'el correo ya se encuentra registrado!...'
                        });
            }

            /* Validando si el teléfono sea único
             * */
            const existTelephone = await User.findOne( { usr_telephone } );

            if( existTelephone ){
              return res.status(400).json({
                  ok: false,
                  msg: 'el número de teléfono ya se encuentra en uso!...'
              });
            }
            
            const usuario = new User( req.body );
            
            /* Encriptar contraseña */
            const salt = bcrypt.genSaltSync(); /* esto genera data de manera aleatoria */
            usuario.usr_password = bcrypt.hashSync( usr_password, salt );
                       
            /* para grabar en la base de datos */
            await usuario.save(); /* la carga puede ser rápido o lento */
            /* await: esperar esta promesa( .save()) termine luego
                    recien correr la siguiente linea de codigo  */
            /*Esto se tiene que llamar sólo por una vez
              (para evitar errores)*/

             /**Token */
             const token = await new Jwt().generateJWT(usuario.id);

            res.json({
                    ok: true,
                    usuario,
                    token
                });
        }catch(error){
            console.log(error);
            /* Si se dispara este error, voy a pedir al
               status 500 (error interno que tengo que manejarlo) */
            res.status(500).json({
                ok: false,
                msg: 'Error inesperado! ...'
            });
        } 
        /* ----------------------------------------------------------- */
        
    }

    
    /* Update User  ------------------------------------------------- */
    async updateUser(req: Request, res: Response = response){
        // Validar token y comprobar si es el usuario correcto
        /** obteniendo el id  */
        const uid = req.params.id;


        try{
            
            /* Necesito el id,  */
            const userDB = await User.findById( uid );
            /**Si no existe el usuario */
            if(!userDB){
              return res.status(404).json({
                  ok: false,
                  msg: 'No existe un usuario con ese id'
              });
            }
          
            /* controlar campos de acceso especiales */
            const { usr_password, usr_google_access, usr_email, ...campos } = req.body;
            /** if usuario de la base de datos es literamente igual a
             *  email del que viene, entonces no se actualiza el email */
            // if(userDB.email === req.body.email){
            if(userDB.usr_email != usr_email){
                //extraer dato, para evitar problemas de validación
            //     delete campos.email; 
            // }else{
                const existEmail = await User.findOne({ email: usr_email });
                                            //   { email: req.body.email });
                /**Verificamos que en email si existe (en all la base de datos) */
                if(existEmail){
                  return res.status(400).json({
                      ok: false,
                      msg: 'Ya existe un usuario con ese email'
                  });
                }
            }

            /* Solo se podra cambiar datos si no es usuario de google */
            if( !userDB.usr_google_access ){
                campos.email = usr_email;
            } else if( userDB.usr_email !== usr_email ){
                return res.status(400).json({
                    ok: false,
                    msg: 'Usuarios de Google no pueden cambiar su correo'
                });
            }


            /* información que es obligatoria (por Mongo),
             * pero no se quiero mostrarlo  */
            // delete campos.password;
            // delete campos.google_access;
            /** Para indicar que siempre me regrese el nuevo/o data actualizada
             *   { new: true  }
             * useFindAndModify: false : 
             *   DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()`
             *   without the `useFindAndModify` option set to false are deprecated */
            const usuarioActualizado = await User.findByIdAndUpdate( 
                      uid, campos,
                     { new: true, useFindAndModify: false } );

            res.json({
                ok:true,
                usuario: usuarioActualizado
            });

        }catch(error){
            console.log(error);
            res.status(500).json({
                ok:false,
                msg: 'Error inesperado!...'
            });
        }
    }

    /**Delete User ---------------------------------------------------
     * No se recomienda tanto borrar registros de la base de datos, sino
     * crear un desactivador/ocultarlos     */
    async deleteUser( req: Request, res: Response = response ){

        const uid = req.params.id;

        try{
            /* Verificar si existe el usuario en la base de datos */
            const usuarioDB = await User.findById( uid );

            if(!usuarioDB){
              return res.status(404).json({
                  ok: false,
                  msg: 'No existe un usuario con ese id'
              });
            }

            /** Con esto borramos el usuario */
            await User.findByIdAndDelete( uid );

            res.json({
                ok:true,
                msg: 'Usuario eliminado, satisfactoriamente!'
            });

        }catch(error){
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Error inesperadoo! ...'
            });
        }
    }

}
