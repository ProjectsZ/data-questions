/**Generate JWT */
import jwt from 'jsonwebtoken';

export class Jwt{
    
    key_vs: any = process.env.JWT_SECRET;

    constructor(){
    }
    
    /**return promesa JWT */
    generateJWT( uid: any ): Promise<any>{

        return new Promise<any>((resolve, reject)=>{

            const payload = {
                uid
            };

            /**sincrono */
            jwt.sign(payload, this.key_vs, { 
                expiresIn: '7d'
            }, (err, token)=>{
                if(err){
                    console.log(err);
                    reject('no se pudo generar el JWT');
                }else{
                    resolve( token );
                }
            });

        });
    }
    
    generateCodeRandonNoJWT( length: number ){
        let texto = '';
        let characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
        for( let i=0; i < length; i++ ){
            texto +=  characters.charAt( Math.floor(Math.random() * characters.length) );
        }
        
        return texto;
    }

}
