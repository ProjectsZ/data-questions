"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateImage = void 0;
const informacion_personal_model_1 = __importDefault(require("./../models/informacion-personal.model"));
const pregunta_model_1 = __importDefault(require("./../models/pregunta.model"));
const alternativa_model_1 = __importDefault(require("./../models/alternativa.model"));
const fs_1 = __importDefault(require("fs")); /* Paquete de Node: para leer file system, carpetas, archivos */
class UpdateImage {
    constructor() {
    }
    /** ----------------------------------------------------------------------------------
     * @Param name_type: tipo de parametros que trae e.g.: ['users', 'document', 'document-template']
     * @Param id: id del opcionA
     * @Param fileName: Nombre del archivo + tipo de extensión       */
    async updateImage(name_type, id, fileName) {
        let pathOld = '';
        // name_type pueden ser valores validos ['users', 'document', 'document-template']
        switch (name_type) {
            case 'Alternativa':
                const opcionA = await alternativa_model_1.default.findById(id);
                if (!opcionA) {
                    console.log("No se logro subir la imagen!");
                    return false;
                }
                pathOld = `./uploads/${name_type}/${opcionA.opt_img}`;
                this.deleteImage(pathOld);
                opcionA.opt_img = fileName;
                await opcionA.save();
                return true;
                break; // nunca llegará al break por que al terminar siempre retorna true
            case 'InformacionPersonal':
                const personalInfo = await informacion_personal_model_1.default.findById(id);
                if (!personalInfo) { // para cortar la subida de la imagen cuando no existe
                    console.log("No se logro subir la imagen");
                    return false;
                }
                pathOld = `./uploads/${name_type}/${personalInfo.infp_img}`;
                /* Borrar la imagen */
                this.deleteImage(pathOld);
                personalInfo.infp_img = fileName;
                await personalInfo.save();
                return true;
                break; // nunca llegará al break por que al terminar siempre retorna true
            case 'Pregunta':
                const questionP = await pregunta_model_1.default.findById(id);
                if (!questionP) {
                    console.log("No se logro subir la imagen.");
                    return false;
                }
                pathOld = `./uploads/${name_type}/${questionP.pr_img}`;
                this.deleteImage(pathOld);
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
    async updateImg(My_model, name_type, abbreviation, id, fileName) {
        let pathOld = '';
        const data = await My_model.findById(id);
        if (!data) {
            console.log("No se logró subir la imagen!");
            return false;
        }
        console.log(data);
        switch (abbreviation) {
            case 'opt':
                pathOld = `./uploads/${name_type}/${data.tm_img}`;
                this.deleteImage(pathOld);
                data.opt_img = fileName;
                return true;
                break;
            case 'pr':
                pathOld = `./uploads/${name_type}/${data.tm_img}`;
                this.deleteImage(pathOld);
                data.pr_img = fileName;
                return true;
                break;
            case 'infp':
                pathOld = `./uploads/${name_type}/${data.usr_img}`;
                this.deleteImage(pathOld);
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
    deleteImage(path) {
        /* Si existe un path  */
        if (fs_1.default.existsSync(path)) {
            fs_1.default.unlinkSync(path); // subscribira/Borrando la imagen anterior
        }
    }
}
exports.UpdateImage = UpdateImage;
