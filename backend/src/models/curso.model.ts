import mongoose, { Schema, Document } from 'mongoose';

// Definimos la interfaz para un curso (ICurso)
export interface ICurso extends Document {    
    crs_name: string;         // Nombre del curso
    crs_description: string;  // Descripción del curso
    crs_code: string;         // Código del curso
    crs_id?: string;           // ID del curso
}

// Esquema para el curso (Curso)
const CursoSchema: Schema = new Schema<ICurso>({
    crs_name: { type: String, required: true },
    crs_description: { type: String, required: true },
    crs_code: {   type: String,   required: true, unique: true  }
}, {
    timestamps: true  // Agregar campos de fecha de creación y actualización automáticamente
});

// Exportamos el modelo de Curso
export default mongoose.model<ICurso>('Curso', CursoSchema);