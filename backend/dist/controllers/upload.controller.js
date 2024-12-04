"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const express_1 = require("express");
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path")); //nodeJS
const fs_1 = __importDefault(require("fs"));
const update_file_1 = require("../helpers/update-file");
class UploadController {
    constructor() {
    }
    /**@parms req: is type 'Request' or if error occurs use 'any'. */
    async fileUpload(req, res = express_1.response) {
        const tipo = req.params.name_type; /* /:name_type */
        const id = req.params.id; /* /:id */
        // Validar tipo
        const tiposValidos = ['users', 'document', 'document-template'];
        if (!tiposValidos.includes(tipo)) {
            return res.status(400).json({
                ok: false,
                msg: 'No es un archivo permitido'
            });
        }
        // Validar que exista un archivo
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No hay ningún archivo'
            });
        }
        // Procesando la imagen...
        const file = req.files.imagen;
        const soloNombre = file.name.split('.');
        const extensionArchivo = soloNombre[soloNombre.length - 1];
        // Validando extensión del archivo
        const extensionValida = ['png', 'jpg', 'jpeg', 'gif', 'pdf'];
        if (!extensionValida.includes(extensionArchivo)) {
            return res.status(400).json({
                ok: false,
                msg: 'No es una extensión permitida'
            });
        }
        // Generar el nombre del archivo usando uuid
        const nombreArchivo = `${(0, uuid_1.v4)()}.${extensionArchivo}`;
        // Crear el path donde se guardará la imagen
        const path = `./uploads/${tipo}/${nombreArchivo}`;
        // Mover la imagen en el path creado
        file.mv(path, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al mover la imagen'
                });
            }
            // Actualizar base de datos            
            new update_file_1.UpdateImage().updateImage(tipo, id, nombreArchivo);
            res.json({
                ok: true,
                msg: 'Archivo Subido',
                nameArchive: nombreArchivo
            });
        });
    }
    /**
     * Mostar imagen desde el path     */
    async fileViewImage(req, res = express_1.response) {
        const tipo = req.params.name_type;
        const imagen = req.params.photo_image;
        const pathImg = path_1.default.join(__dirname, `../../uploads/${tipo}/${imagen}`);
        // Verificar si existe la imagen
        if (fs_1.default.existsSync(pathImg)) {
            /* Para decirle que me responda con una imagen y no un JSON usar: */
            res.sendFile(pathImg);
        }
        else {
            res.sendFile(path_1.default.join(__dirname, `../../uploads/no-img.png`));
        }
    }
}
exports.UploadController = UploadController;
