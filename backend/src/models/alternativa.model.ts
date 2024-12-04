
import mongoose, { Document, Schema } from "mongoose";

export interface IAlternativa extends Document{
    opt_text: string;
    opt_img: string;
    opt_description: string;
    opt_id?: string;
}


const AlternativaSchema: Schema = new Schema<IAlternativa>({
    opt_text: { type: String, required: true },
    opt_img: { type: String    },
    opt_description: { type: String,  required: true }
}, {
    timestamps: true  // Agregar campos de fecha de creación y actualización automáticamente
});

// Exportamos el modelo de Alternativa
export default mongoose.model<IAlternativa>('Alternativa', AlternativaSchema);
