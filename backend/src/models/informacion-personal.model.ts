
import mongoose, { Document, Schema } from "mongoose";


export interface IPersonalInformation extends Document {    
    infp_name: string;                // Nombre de la persona
    infp_lastname: string;             // Apellido de la persona
    infp_telephone: string;           // Teléfono de la persona
    infp_img: string;                 // URL o ruta de la imagen de la persona
    infp_birth_date: Date;            // Fecha de nacimiento de la persona
    infp_id?: string;                  // Identificador único de la información personal
}

const PersolInformation: Schema = new Schema({
    infp_name: { type: String, require: true  },
    infp_lastname: { type: String, require: true },
    infp_telephone: { type:String, require: true },
    infp_img: { type: String, require: true },
    infp_birth_date: { type:String, require:true }
}); 


/* subscribir el method - renombrar _id   (MODO 2)  */
PersolInformation.methods.toJSON = function(){
    const {  _id, __v, password, ...data }: any = this.toObject();
    data.infp_id = _id;        
    return data;
};

/* export the model and return your IUser interface */
export default mongoose.model<IPersonalInformation>('InformacionPersonal', PersolInformation );
