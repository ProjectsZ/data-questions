
import express, { Application, Request, Response } from 'express';
import bodyparser from 'body-parser';
import mongoose from 'mongoose';

import { Config } from './configuration/database/config';
import dotenv from 'dotenv';
import cors from 'cors';

/* Routes */
import { AuthRoute, UsersRoute } from './routes/auth.route';

// Variables de entorno  ******************************
const config = dotenv.config({ path: 'process.env' });

class App{

    /* Crear/inicializar el servidor de express  */
    app: Application = express();  
    
    /* Environtment - Variables de entorno (process.env)   */
    PORT: any = process.env.PORT;

    // Base de datos connectandose
    db : Config;

    // Routes: Users, Login
    usersR: UsersRoute = new UsersRoute();
    userLoginR: AuthRoute = new AuthRoute();
   


    constructor(){

        this.db = new Config();

        // Configurar Cors
        this.app.use( cors() );

        // Lectura y parseo del body (colocar antes de las 'rutas' )
        this.app.use( express.json() );

        // Directorio público
        this.app.use( express.static('public') );

        // Rutas usando Middlewares  localhost:4100/api/users
        this.app.use( '/api/users', this.usersR.router );           //  './routes/user'
        this.app.use( '/api/login', this.userLoginR.router );       //  (Login) usando Middlewares  


        this.app.listen( this.PORT, ()=>{
                console.log("servidor corriendo en el puerto "
                             + this.PORT);
        } );

    }

}

const aplication = new App();
