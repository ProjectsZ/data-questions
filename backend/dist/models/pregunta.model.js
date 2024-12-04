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
// Esquema para la pregunta
const PreguntaSchema = new mongoose_1.Schema({
    pr_content: { type: String, required: true },
    pr_img: { type: String }, // Puede ser opcional si no siempre tiene una imagen
    pr_answer: [{
            pr_id: { type: String, required: true },
            pr_opt_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Alternativa', required: true }, // Referencia a las alternativas
            pr_answer: { type: String, required: true }, // Texto de la respuesta del usuario
            pr_description: { type: String } // Texto - descripcion
        }],
    pr_type: { type: String, required: true, enum: ['MULTIPLE', 'TRUE_FALSE', 'FILL_IN_THE_BLANK'] }, // Tipo de pregunta, ENUM con valores posibles
    pr_difficulty: { type: String, required: true, enum: ['EASY', 'MEDIUM', 'HARD'] }, // Dificultad, ENUM con valores posibles
    pr_time: { type: Number, required: true }, // Tiempo para resolver la pregunta en minutos
    pr_tags: { type: String }, // Etiquetas asociadas con la pregunta
    pr_cat_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Categoria', required: true } // ID de la categoría    
});
/* export the model and return your IUser interface */
exports.default = mongoose_1.default.model('Pregunta', PreguntaSchema);
