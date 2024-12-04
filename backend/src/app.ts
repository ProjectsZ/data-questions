
import express, { Application, Request, Response } from 'express';
import bodyparser from 'body-parser';
import mongoose from 'mongoose';

import { Config } from './configuration/database/config';
import dotenv from 'dotenv';
import cors from 'cors';

/* Routes */
import { AuthRoute, UsersRoute } from './routes/auth.route';
import { PreguntaRoute } from './routes/pregunta.route';
import { InformacionPersonalRoute } from './routes/informacion-personal.route';
import { ExamenRoute } from './routes/examen.route';
import { CursoRoute } from './routes/curso.route';
import { CategoriaRoute } from './routes/categoria.route';
import { AlternativaRoute } from './routes/alternativa.route';

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
    preguntaR: PreguntaRoute = new PreguntaRoute();
    infoPersonalR: InformacionPersonalRoute = new InformacionPersonalRoute();
    examenR: ExamenRoute = new ExamenRoute();
    evaluacionR: ExamenRoute = new ExamenRoute();
    cursoR: CursoRoute = new CursoRoute();
    categoriaR: CategoriaRoute = new CategoriaRoute();
    alternativaR: AlternativaRoute = new AlternativaRoute();


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
        this.app.use( '/api/pregunta', this.preguntaR.router );     //  (Pregunta) usando Middlewares
        this.app.use( '/api/informacion-personal', this.infoPersonalR.router ); //  (InformacionPersonal) usando Middlewares    
        this.app.use( '/api/examen', this.examenR.router );         //  (Examen) usando Middlewares
        this.app.use( '/api/evaluacion', this.evaluacionR.router ); //  (Evaluacion) usando Middlewares
        this.app.use( '/api/curso', this.cursoR.router );           //  (Curso) usando Middlewares
        this.app.use( '/api/categoria', this.categoriaR.router );   //  (Categoria) usando Middlewares
        this.app.use( '/api/alternativa', this.alternativaR.router ); //  (Alternativa) usando Middlewares

        this.app.listen( this.PORT, ()=>{
                console.log("servidor corriendo en el puerto "
                             + this.PORT);
        } );

    }

}

const aplication = new App();
