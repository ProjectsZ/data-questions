
import mongoose, { Document, Schema } from 'mongoose';

/* Modelo de mongoose 
 * (El cual es el encargado de ponerle ciertas restricciones) */
export interface IUser extends Document{
    usr_name: string;
    usr_username: string;
    usr_email: string;
    usr_password: string;
    usr_telephone: number;
    usr_recoveryToken: string;
    usr_img: string;
    usr_role: string; // or number
    usr_google_access: boolean;
    usr_updatedAt : Date;
    usr_createdAt : Date;
    // uid?: string;
}

export interface IConfirmEmail {
    usr_username: string;
    usr_email: string;
    url: string;
};

export interface ISendMail {
    send(): Promise<void>;
};

const UserSchema: Schema = new Schema({
    usr_name: { type: String, required: true },
    usr_username: { type: String, required: true },
    usr_email: { type: String, required: true },
    usr_password: { type: String, required: true },
    usr_telephone: { type: String, required: true },
    usr_recoveryToken: { type: String, default: '' },
    usr_img: { type:String },
    usr_role: { type: String /*  or Number */, 
        required: true, 
        default: 'USER_ROLE' /* or 0 */ },
    usr_google_access: { 
        type: Boolean, 
        default: false 
    },
    usr_updatedAt : { type: Date },
    usr_createdAt : { type: Date, default: Date.now, required : true }
},
// { /* subscribir el method - renombrar _id   (MODO 1)  */
//     toJSON: {
//         transform: (doc, ret): any =>{
//             const { _id, __v, password, ...object } = ret;
//             object.uid = _id;
//             return object;
//         }
//     }
// }
);

/* subscribir el method - renombrar _id   (MODO 2)  */
UserSchema.methods.toJSON = function(){
    const {  _id, __v, password, ...data }: any = this.toObject();

    data.uid = _id;
        
    return data;
};

// usrusername, add usr_firstName and usr_lastName in interface and Schema
// UserSchema.virtual("usrusername").get(function(this: { usr_firstName: string, usr_lastName: string}) {
//     return this.usr_firstName + " " + this.usr_lastName ;
// }) ;

/* export the model and return your IUser interface */
export default mongoose.model<IUser>('User', UserSchema );
