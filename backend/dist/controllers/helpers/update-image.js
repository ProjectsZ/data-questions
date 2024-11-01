"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateImage = void 0;
// UpdateImage: 
const user_model_1 = __importDefault(require("./../models/user.model"));
const document_model_1 = __importDefault(require("./../models/document.model"));
const fs_1 = __importDefault(require("fs")); /* Paquete de Node: para leer file system, carpetas, archivos */
const cloudinary_config_1 = require("./../database/cloudinary-config");
class UpdateImage {
    constructor() {
    }
    /** ----------------------------------------------------------------------------------
     * @Param name_type: tipo de parametros que trae e.g.: ['users', 'document', 'document-template']
     * @Param id: id del usuario
     * @Param fileName: Nombre del archivo + tipo de extensión       */
    async updateImage(name_type, id, fileName) {
        let pathOld = '';
        // name_type pueden ser valores validos ['users', 'document', 'document-template']
        switch (name_type) {
            case 'document':
                const documento = await document_model_1.default.findById(id);
                if (!documento) {
                    console.log("No se logro subir la imagen.");
                    return false;
                }
                pathOld = `./uploads/${name_type}/${documento.doc_img}`;
                this.deleteImage(pathOld);
                documento.doc_img = fileName;
                await documento.save();
                return true;
                break; // nunca llegará al break por que al terminar siempre retorna true
            case 'users':
                const usuario = await user_model_1.default.findById(id);
                if (!usuario) {
                    console.log("No se logro subir la imagen!");
                    return false;
                }
                pathOld = `./uploads/${name_type}/${usuario.usr_img}`;
                this.deleteImage(pathOld);
                usuario.usr_img = fileName;
                await usuario.save();
                return true;
                break; // nunca llegará al break por que al terminar siempre retorna true
        }
    }
    /**
     *  Método para poder subir cualquier imagen
     * @param name_type  Es el nombre de la ruta
     * @param id Es el id del objeto que se va a editar/subir la imagen
     * @param fileName Es el file, imagen nueva a subir/actualizar
     * @param dataSchema Es el model
     * @param key_img Es el key exacto (del model ó del parámetro dataSchema) de las imagenes
     * @returns false (error, undefined) or true
     */
    async updateImg(name_type, id, fileName, dataSchema, key_img) {
        if (!id || typeof id === 'undefined') {
            return console.log("Error con el id, esta llegando null o undefined");
        }
        // name_type pueden ser valores validos ['users', 'document', 'document-template']
        const dataDB = await dataSchema.findById(id);
        if (!dataDB) { // para cortar la subida de la imagen cuando no existe
            console.log("No se logro subir la imagen");
            return false;
        }
        /* Verificamos que el key (que se esta enviando desde el parametro)
        * pertenesca al dataDB */
        if (!(key_img in dataDB)) {
            console.log("--> No, esta key no pertenece al objeto");
            return false;
        }
        //    console.log(dataDB);
        const pathOld = `./uploads/${name_type}/${dataDB[key_img]}`;
        /* Borrar la imagen */
        this.deleteImage(pathOld);
        dataDB[key_img] = fileName;
        // console.log(dataDB);
        await dataDB.save();
    }
    deleteImage(path) {
        /* Si existe un path  */
        if (fs_1.default.existsSync(path)) {
            fs_1.default.unlinkSync(path); // subscribira/Borrando la imagen anterior
        }
    }
    async updateMedia(_id, dataSchema, data) {
        if (!_id || typeof _id === 'undefined') {
            return console.log("Error con el id, esta llegando null o undefined");
        }
        const dataDB = await dataSchema.findById(_id);
        if (!dataDB) { // para cortar la subida de la imagen cuando no existe
            console.log("No existe tal dato");
            return false;
        }
        const changeData = {
            ...data,
        };
        await dataSchema.findByIdAndUpdate(_id, changeData, { new: true, useFindAndModify: false });
        return true;
    }
    /**
     *  Método para poder subir cualquier imagen
     * @param name_type  Es el nombre de la ruta
     * @param id Es el id del objeto que se va a editar/subir la imagen
     * @param fileName Es el file, imagen nueva a subir/actualizar
     * @param dataSchema Es el model
     * @param key_img Es el key exacto (del model ó del parámetro dataSchema) de las imagenes
     * @returns false (error, undefined) or true
     */
    async updateImgUser(pathOld, id, mimeType, size, fileName, fileIdCloudinary, fileURLCloudinary) {
        if (!id || typeof id === 'undefined') {
            return console.log("Error con el id, esta llegando null o undefined");
        }
        // name_type pueden ser valores validos ['users', 'document', 'document-template']
        const dataDB = await user_model_1.default.findById(id);
        if (!dataDB) { // para cortar la subida de la imagen cuando no existe
            console.log("No se logro subir la imagen");
            return false;
        }
        // delete image del cloudnary
        const mci = dataDB.usr_media.m_cloudinary_id;
        if (mci) {
            const imageDelete = await new cloudinary_config_1.CloudinaryConfig().delete(mci);
            // console.log(imageDelete); // { result: 'ok' }
        }
        const changeData = {
            usr_media: {
                m_cloudinary_id: fileIdCloudinary,
                m_cloudinary_media: fileURLCloudinary,
                m_name: fileName,
                m_mimetype: mimeType,
                m_size: size
            }
        };
        // console.log(fileName);
        // console.log(dataDB);
        /* Borrar la imagen */
        this.deleteImage(pathOld);
        await user_model_1.default.findByIdAndUpdate(id, changeData, { new: true, useFindAndModify: false });
    }
    async updateOneMedia(_id, dataSchema, data) {
        if (!_id || typeof _id === 'undefined') {
            return console.log("Error con el id, esta llegando null o undefined");
        }
        const dataDB = await dataSchema.findById(_id);
        if (!dataDB) { // para cortar la subida de la imagen cuando no existe
            console.log("No existe tal dato");
            return false;
        }
        const changeData = {
            ...data,
        };
        await dataSchema.findByIdAndUpdate(_id, changeData, { new: true, useFindAndModify: false });
        return true;
    }
    async updateMultiMedia(_id, dataSchema, data) {
        if (!_id || typeof _id === 'undefined') {
            return console.log("Error con el id, esta llegando null o undefined");
        }
        const dataDB = await dataSchema.findById(_id);
        if (!dataDB) { // para cortar la subida de la imagen cuando no existe
            console.log("No existe tal dato");
            return false;
        }
        const changeData = {
            ...data,
        };
        await dataSchema.findByIdAndUpdate(_id, changeData, { new: true, useFindAndModify: false });
        return true;
    }
}
exports.UpdateImage = UpdateImage;
