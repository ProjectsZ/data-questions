"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsRoute = void 0;
// Ruta: api/uploads
const express_1 = require("express");
const validate_jwt_custom_1 = require("../middlewares/validate-jwt.custom");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const upload_controller_1 = require("../controllers/upload.controller");
class UploadsRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.validarJWT = new validate_jwt_custom_1.ValidateJWTcustom();
        this.archivoUploadC = new upload_controller_1.UploadController();
        this.putRouteUpload();
        this.getRouteImage();
    }
    /** Primera ruta: Uploads  */
    putRouteUpload() {
        this.router.use((0, express_fileupload_1.default)());
        this.router.put('/:name_type/:id', [
            this.validarJWT.validateJWT
        ], (req, res) => {
            this.archivoUploadC.fileUpload(req, res);
        });
    }
    /** Ruta: para obtener imagenes vista previa */
    getRouteImage() {
        this.router.get('/:name_type/:photo_image', [], this.archivoUploadC.fileViewImage);
    }
}
exports.UploadsRoute = UploadsRoute;
