import { Request, Response, response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path'; //nodeJS
import fs from 'fs';
import { UpdateImage } from '../helpers/update-file';

export class UploadController{


    constructor(){
    }
    
    /**@parms req: is type 'Request' or if error occurs use 'any'. */
    async fileUpload( req: any, res: Response = response ){

        const tipo = req.params.name_type; /* /:name_type */
        const id = req.params.id; /* /:id */

        // Validar tipo
        const tiposValidos = ['users', 'document', 'document-template'];
        if(!tiposValidos.includes(tipo)){
            return res.status(400).json({
                ok:false,
                msg: 'No es un archivo permitido'
            });
        }

        // Validar que exista un archivo
        if(!req.files || Object.keys(req.files).length === 0){
            return res.status(400).json({
                ok: false,
                msg: 'No hay ningún archivo'
            });
        }

        // Procesando la imagen...
        const file = req.files.imagen;
        
        const soloNombre = file.name.split('.');
        const extensionArchivo = soloNombre[ soloNombre.length -1 ];
        
        // Validando extensión del archivo
        const extensionValida = ['png', 'jpg', 'jpeg', 'gif', 'pdf'];
        if(!extensionValida.includes(extensionArchivo)){
          return res.status(400).json({
              ok: false,
              msg: 'No es una extensión permitida'
          });
        }

        // Generar el nombre del archivo usando uuid
        const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

        // Crear el path donde se guardará la imagen
        const path = `./uploads/${ tipo }/${ nombreArchivo }`;

        // Mover la imagen en el path creado
        file.mv( path, (err: any)=>{
            if(err){
                console.log(err);
                return res.status(500).json({
                  ok: false,
                  msg: 'Error al mover la imagen'
              });
            }

            // Actualizar base de datos            
            new UpdateImage().updateImage(tipo, id, nombreArchivo);

            res.json({
                ok: true,
                msg: 'Archivo Subido',
                nameArchive: nombreArchivo
            });
        });


    }

    /**
     * Mostar imagen desde el path     */
    async fileViewImage(req: Request, res: Response = response){

        const tipo = req.params.name_type;
        const imagen = req.params.photo_image;

        const pathImg = path.join(__dirname, `../../uploads/${tipo}/${imagen}`);

        // Verificar si existe la imagen
        if( fs.existsSync( pathImg ) ){
            /* Para decirle que me responda con una imagen y no un JSON usar: */
            res.sendFile( pathImg );
        }else{
            res.sendFile( path.join(__dirname, `../../uploads/no-img.png`) );
        }

    }

}
