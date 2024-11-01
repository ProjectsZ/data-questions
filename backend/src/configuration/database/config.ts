
import mongoose from 'mongoose';

export class Config{
    
    user: any = process.env.DB_user;
    password: any = process.env.DB_pass;
    db: any = process.env.DB_CNN;
    
    constructor(){
        this.retornar();
    }
    
    async retornar(){
        try{
            await mongoose.connect(`mongodb+srv://${ this.user }:${ this.password }@${ this.db }`, {}); 
             console.log("DB online");
        }catch(error){
            console.log(error);
            throw new Error("Error al iniciar la bd");
        }
        
    }
}
