import PersonalInformation from "./../models/informacion-personal.model";  
import Pregunta from "./../models/pregunta.model";
import Alternativa from "./../models/alternativa.model";


import fs from 'fs'; /* Paquete de Node: para leer file system, carpetas, archivos */

export class UpdateImage{
    
    
    constructor(){ 
     }
    
    /** ----------------------------------------------------------------------------------
     * @Param name_type: tipo de parametros que trae e.g.: ['users', 'document', 'document-template']
     * @Param id: id del opcionA
     * @Param fileName: Nombre del archivo + tipo de extensión       */
    public async updateImage(name_type: String, id: String, fileName: any): Promise<any>{

        let pathOld = '';

        // name_type pueden ser valores validos ['users', 'document', 'document-template']
        switch( name_type ){
            case 'Alternativa':
                  const opcionA = await Alternativa.findById( id );
                  if(!opcionA){
                      console.log("No se logro subir la imagen!");
                      return false;
                  }

                  pathOld = `./uploads/${name_type}/${ opcionA.opt_img }`;
                  this.deleteImage( pathOld );
                  
                  opcionA.opt_img = fileName;
                  await opcionA.save();
                  return true;
                  break; // nunca llegará al break por que al terminar siempre retorna true

            case 'InformacionPersonal':
                const personalInfo = await PersonalInformation.findById(id);
                if(!personalInfo){ // para cortar la subida de la imagen cuando no existe
                    console.log("No se logro subir la imagen");
                    return false;
                }

                pathOld=`./uploads/${name_type}/${personalInfo.infp_img}`
                /* Borrar la imagen */
                this.deleteImage( pathOld );

                personalInfo.infp_img = fileName;
                await personalInfo.save();
                return true;
                break; // nunca llegará al break por que al terminar siempre retorna true
            case 'Pregunta':
                const questionP = await Pregunta.findById( id );
                if(!questionP){
                    console.log("No se logro subir la imagen.");
                    return false;
                }

                pathOld=`./uploads/${name_type}/${questionP.pr_img}`;
                this.deleteImage( pathOld );

                questionP.pr_img = fileName;
                await questionP.save();
                return true;
                break; // nunca llegará al break por que al terminar siempre retorna true
            
        }
    }

    /** ----------------------------------------------------------------------------------
     * @Param my_model: tipo any, modelo 
     * @Param name_type: tipo de parametros que trae e.g.: ['users', 'document', 'document-template']
     * @Param id: id del opcionA
     * @Param fileName: Nombre del archivo + tipo de extensión       */
    public async updateImg( My_model:any, name_type: string, abbreviation: string, id: String, fileName: any){

        let pathOld = '';

        const data = await My_model.findById( id );
        if(!data){
            console.log("No se logró subir la imagen!");
            return false;
        }

        console.log(data);

        switch (abbreviation) {
            case 'opt':
              pathOld = `./uploads/${ name_type }/${ data.tm_img }`;
              this.deleteImage( pathOld );
              data.opt_img = fileName;
              return true;
              break;
            case 'pr':
              pathOld = `./uploads/${ name_type }/${ data.tm_img }`;
              this.deleteImage( pathOld );
              data.pr_img = fileName;
              return true;
              break;
            case 'infp':
                pathOld = `./uploads/${ name_type }/${ data.usr_img }`;
                this.deleteImage( pathOld );
                data.infp_img = fileName;
                await data.save();
                return true;
                break;
            default:
                break;
        }        
    }

    /**
     * Borrar la imagen almacenada
     * @param path es el path de donde se encuentra el archivo
     */
    public deleteImage( path: any ){
        /* Si existe un path  */
        if( fs.existsSync( path ) ){
            fs.unlinkSync( path ); // subscribira/Borrando la imagen anterior
        }
    }
}
