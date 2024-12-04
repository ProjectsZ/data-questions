
import mongoose, { Document, Schema } from 'mongoose';

/* Modelo de mongoose 
 * (El cual es el encargado de ponerle ciertas restricciones) */
export interface IUser extends Document {                      
    usr_username: string;              // Nombre de usuario
    usr_email: string;                 // Correo electrónico del usuario
    usr_password: string;              // Contraseña del usuario
    usr_recoveryToken: string;         // Token de recuperación de contraseña
    usr_role: IRole;                   // Rol del usuario
    usr_is_google_authenticated: boolean; // Indica si el usuario tiene autenticación por Google
    usr_is_active: boolean;            // Estado activo/inactivo del usuario
    usr_updatedAt: Date;               // Fecha de última actualización
    usr_createdAt: Date;               // Fecha de creación del usuario
    usr_infp_id: string;               // ID adicional de información (probablemente relacionado con el usuario)
    usr_id?: string;                    // Identificador único del usuario
}

export interface IRole {
    r_name: string;
    r_description: string;
    r_level: string;
}

export interface IConfirmEmail {  usr_username: string; usr_email: string; url: string; };
export interface ISendMail {   send(): Promise<void>; };

const UserSchema: Schema = new Schema({
    usr_username: { type: String, required: true },
    usr_email: { type: String, required: true },
    usr_password: { type: String, required: true },
    usr_recoveryToken: { type: String, default: '' },
    usr_role: { 
        r_name: { type: String, required: true, default: 'USER_ROLE' },
        r_description: { type: String },
        r_level: { type: String, required: true, default: 'chicken' },
    },
    usr_is_google_authenticated: { 
        type: Boolean, 
        default: false 
    },
    usr_is_active: { type: Boolean, default: false },
    usr_updatedAt : { type: Date },
    usr_createdAt : { type: Date, default: Date.now, required : true },
    usr_infp_id: { type: Schema.Types.ObjectId, ref: 'InformacionPersonal' }
},
);

/* subscribir el method - renombrar _id   (MODO 2)  */
UserSchema.methods.toJSON = function(){
    const {  _id, __v, password, ...data }: any = this.toObject();
    data.usr_id = _id;        
    return data;
};

// usrusername, add usr_firstName and usr_lastName in interface and Schema
// UserSchema.virtual("usrusername").get(function(this: { usr_firstName: string, usr_lastName: string}) {
//     return this.usr_firstName + " " + this.usr_lastName ;
// }) ;

/* export the model and return your IUser interface */
export default mongoose.model<IUser>('User', UserSchema );
