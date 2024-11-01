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
        this.app.listen(this.PORT, () => {
            console.log("servidor corriendo en el puerto "
                + this.PORT);
        });
    }
}
const aplication = new App();
