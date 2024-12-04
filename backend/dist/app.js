"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./configuration/database/config");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
/* Routes */
const auth_route_1 = require("./routes/auth.route");
const pregunta_route_1 = require("./routes/pregunta.route");
const informacion_personal_route_1 = require("./routes/informacion-personal.route");
const examen_route_1 = require("./routes/examen.route");
const curso_route_1 = require("./routes/curso.route");
const categoria_route_1 = require("./routes/categoria.route");
const alternativa_route_1 = require("./routes/alternativa.route");
// Variables de entorno  ******************************
const config = dotenv_1.default.config({ path: 'process.env' });
class App {
    constructor() {
        /* Crear/inicializar el servidor de express  */
        this.app = (0, express_1.default)();
        /* Environtment - Variables de entorno (process.env)   */
        this.PORT = process.env.PORT;
        // Routes: Users, Login
        this.usersR = new auth_route_1.UsersRoute();
        this.userLoginR = new auth_route_1.AuthRoute();
        this.preguntaR = new pregunta_route_1.PreguntaRoute();
        this.infoPersonalR = new informacion_personal_route_1.InformacionPersonalRoute();
        this.examenR = new examen_route_1.ExamenRoute();
        this.evaluacionR = new examen_route_1.ExamenRoute();
        this.cursoR = new curso_route_1.CursoRoute();
        this.categoriaR = new categoria_route_1.CategoriaRoute();
        this.alternativaR = new alternativa_route_1.AlternativaRoute();
        this.db = new config_1.Config();
        // Configurar Cors
        this.app.use((0, cors_1.default)());
        // Lectura y parseo del body (colocar antes de las 'rutas' )
        this.app.use(express_1.default.json());
        // Directorio público
        this.app.use(express_1.default.static('public'));
        // Rutas usando Middlewares  localhost:4100/api/users
        this.app.use('/api/users', this.usersR.router); //  './routes/user'
        this.app.use('/api/login', this.userLoginR.router); //  (Login) usando Middlewares  
        this.app.use('/api/pregunta', this.preguntaR.router); //  (Pregunta) usando Middlewares
        this.app.use('/api/informacion-personal', this.infoPersonalR.router); //  (InformacionPersonal) usando Middlewares    
        this.app.use('/api/examen', this.examenR.router); //  (Examen) usando Middlewares
        this.app.use('/api/evaluacion', this.evaluacionR.router); //  (Evaluacion) usando Middlewares
        this.app.use('/api/curso', this.cursoR.router); //  (Curso) usando Middlewares
        this.app.use('/api/categoria', this.categoriaR.router); //  (Categoria) usando Middlewares
        this.app.use('/api/alternativa', this.alternativaR.router); //  (Alternativa) usando Middlewares
        this.app.listen(this.PORT, () => {
            console.log("servidor corriendo en el puerto "
                + this.PORT);
        });
    }
}
const aplication = new App();
