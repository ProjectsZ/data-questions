import mongoose, { Document, Schema } from "mongoose";

export interface IExamen extends Document{
    exm_description: string;       // Descripción del examen
    exm_status: number;           // Estado del examen (probablemente un TINYINT, 0 = inactivo, 1 = activo)
    exm_created_at: Date;         // Fecha de creación del examen
    usr_updatedAt: Date;         // Fecha de actualización del examen
    exm_duration: number;         // Duración del examen en minutos
    exm_attempts: number;         // Número de intentos permitidos
    exm_teacher_user_id: number;  // ID del profesor que crea el examen
    exm_crs_id: string;               // Probablemente un ID de relación con otro documento (e.g., una entidad de "emoción" o "evaluación")
    exm_pr: string[];
    exm_id?: string;                // Identificador único del examen
}

const ExamenSchema: Schema = new Schema({
    exm_description: { type: String, required: true },
    exm_status: { type: Number, required: true },  // TINYINT como Number
    exm_created_at: { type: Date, default: Date.now, required: true },
    usr_updatedAt: { type: Date },
    exm_duration: { type: Number, required: true },
    exm_attempts: { type: Number, required: true },
    exm_teacher_user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    exm_crs_id: { type: Schema.Types.ObjectId, ref: 'Curso' },
    exm_pr: [ { type: Schema.Types.ObjectId, ref: 'Pregunta' } ]
});


/* export the model and return your IUser interface */
export default mongoose.model<IExamen>('Examen', ExamenSchema );
