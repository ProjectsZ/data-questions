
import mongoose, { Schema, Document } from 'mongoose';

// Definimos la interfaz para la evaluación (IEvaluacion)
export interface IEvaluacion extends Document {
    eva_exam_id: mongoose.Types.ObjectId;          // ID del examen asociado (referencia a la colección de Exámenes)
    eva_student_usr_id: mongoose.Types.ObjectId;   // ID del usuario estudiante (referencia a la colección de usuarios)
    eva_date: Date;                                // Fecha de la evaluación
    eva_score: number;                             // Puntuación obtenida por el estudiante
    eva_feedback: string;                          // Retroalimentación del examen
    eva_id?: string;                               // ID opcional para la evaluación
}

// Esquema para la evaluación (Evaluacion)
const EvaluacionSchema: Schema = new Schema<IEvaluacion>({
    eva_exam_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Examen',  // Referencia al modelo de Examen
        required: true 
    },
    eva_student_usr_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario',  // Referencia al modelo de Usuario (estudiante)
        required: true 
    },
    eva_date: { 
        type: Date, 
        required: true, 
        default: Date.now  // Asignamos la fecha de creación por defecto (actual)
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
    timestamps: true  // Agregar campos de fecha de creación y actualización automáticamente
});

// Exportamos el modelo de Evaluación
export default mongoose.model<IEvaluacion>('Evaluacion', EvaluacionSchema);