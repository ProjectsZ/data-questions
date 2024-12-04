"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Esquema para la categoría (Categoria)
const CategoriaSchema = new mongoose_1.Schema({
    cat_title: { type: String, required: true },
    cat_subtitle: { type: String, required: true },
    cat_description: { type: String, required: true },
    cat_crs_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Curso', // Referencia a la colección "Curso"
        required: true
    }
}, {
    timestamps: true // Agregar campos de fecha de creación y actualización automáticamente
});
/* subscribir el method - renombrar _id   (MODO 2)  */
CategoriaSchema.methods.toJSON = function () {
    const { _id, ...data } = this.toObject();
    data.cat_id = _id;
    return data;
};
// Exportamos el modelo de Categoria
exports.default = mongoose_1.default.model('Categoria', CategoriaSchema);
