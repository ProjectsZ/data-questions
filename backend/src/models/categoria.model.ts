import mongoose, { Schema, Document } from 'mongoose';

// Definimos la interfaz para una categoría (ICategoria)
export interface ICategoria extends Document {
    cat_title: string;         // Título de la categoría
    cat_subtitle: string;      // Subtítulo de la categoría
    cat_description: string;   // Descripción de la categoría
    cat_crs_id: mongoose.Types.ObjectId;  // ID del curso asociado a la categoría (referencia a la colección "Curso")
    cat_id?: string;           // ID opcional de la categoría
}

// Esquema para la categoría (Categoria)
const CategoriaSchema: Schema = new Schema<ICategoria>({
    cat_title: { type: String, required: true  },
    cat_subtitle: { type: String, required: true  },
    cat_description: { type: String, required: true   },
    cat_crs_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Curso',  // Referencia a la colección "Curso"
        required: true 
    }
}, {
    timestamps: true  // Agregar campos de fecha de creación y actualización automáticamente
});

/* subscribir el method - renombrar _id   (MODO 2)  */
CategoriaSchema.methods.toJSON = function(){
    const {  _id, ...data }: any = this.toObject();
    data.cat_id = _id;        
    return data;
};

// Exportamos el modelo de Categoria
export default mongoose.model<ICategoria>('Categoria', CategoriaSchema);
