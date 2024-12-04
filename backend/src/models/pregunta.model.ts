import mongoose, { Schema, Document } from 'mongoose';

// Definimos la interfaz para la pregunta
export interface IPregunta extends Document {
    pr_content: string;              // Contenido de la pregunta
    pr_img: string;               // Imagen asociada con la pregunta
    pr_answer: IAnswer[];            // Respuesta asociada con la pregunta
    pr_type: string;              // Tipo de la pregunta (probablemente un ENUM)
    pr_difficulty: string;        // Dificultad de la pregunta (probablemente un ENUM)
    pr_time: number;              // Tiempo en minutos para resolver la pregunta
    pr_tags: string;              // Etiquetas asociadas con la pregunta
    pr_cat_id: number;             // ID de la categoría de la pregunta
    pr_id?: string;
}

interface IAnswer {
    pr_id: string;
    pr_opt_id: string;
    pr_answer: string;
    pr_description: string;
}

// Esquema para la pregunta
const PreguntaSchema: Schema = new Schema({
    pr_content: { type: String, required: true },
    pr_img: { type: String },  // Puede ser opcional si no siempre tiene una imagen
    pr_answer: [{ 
        pr_id: { type: String, required: true },
        pr_opt_id: { type: Schema.Types.ObjectId, ref: 'Alternativa', required: true }, // Referencia a las alternativas
        pr_answer: { type: String, required: true },  // Texto de la respuesta del usuario
        pr_description: { type: String }  // Texto - descripcion
    }],
    pr_type: { type: String, required: true, enum: ['MULTIPLE', 'TRUE_FALSE', 'FILL_IN_THE_BLANK'] },  // Tipo de pregunta, ENUM con valores posibles
    pr_difficulty: { type: String, required: true, enum: ['EASY', 'MEDIUM', 'HARD'] }, // Dificultad, ENUM con valores posibles
    pr_time: { type: Number, required: true },  // Tiempo para resolver la pregunta en minutos
    pr_tags: { type: String },  // Etiquetas asociadas con la pregunta
    pr_cat_id: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true }  // ID de la categoría    
});

/* export the model and return your IUser interface */
export default mongoose.model<IPregunta>('Pregunta', PreguntaSchema );