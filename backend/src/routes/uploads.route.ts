// Ruta: api/uploads
import { application, Request, Response, Router } from "express";
import { ValidateJWTcustom } from "../middlewares/validate-jwt.custom";
import expressFileUpload from 'express-fileupload';
import { UploadController } from "../controllers/upload.controller";

export class UploadsRoute{

    router = Router();

    validarJWT: ValidateJWTcustom = new ValidateJWTcustom();
    archivoUploadC: UploadController = new UploadController();
    
    constructor(){
        this.putRouteUpload();
        this.getRouteImage();
    }
    
    /** Primera ruta: Uploads  */    
    putRouteUpload(){
        this.router.use( expressFileUpload() );
        this.router.put('/:name_type/:id',[
        this.validarJWT.validateJWT
      ] , (req: Request, res: Response) =>{
        this.archivoUploadC.fileUpload(req, res);
      } );
    }

    /** Ruta: para obtener imagenes vista previa */
    getRouteImage(){
        this.router.get('/:name_type/:photo_image', [
        ], this.archivoUploadC.fileViewImage );
    }
}
