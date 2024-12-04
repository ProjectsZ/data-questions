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
// Esquema para la evaluación (Evaluacion)
const EvaluacionSchema = new mongoose_1.Schema({
    eva_exam_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Examen', // Referencia al modelo de Examen
        required: true
    },
    eva_student_usr_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Usuario', // Referencia al modelo de Usuario (estudiante)
        required: true
    },
    eva_date: {
        type: Date,
        required: true,
        default: Date.now // Asignamos la fecha de creación por defecto (actual)
    },
    eva_score: {
        type: Number,
        required: true
    },
    eva_feedback: {
        type: String,
        required: true
    },
    eva_id: {
        type: String,
        default: null
    }
}, {
    timestamps: true // Agregar campos de fecha de creación y actualización automáticamente
});
// Exportamos el modelo de Evaluación
exports.default = mongoose_1.default.model('Evaluacion', EvaluacionSchema);
