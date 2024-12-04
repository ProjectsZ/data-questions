// Logica de lo que va hacer nuestra ruta
import { Request, Response, response } from 'express';
import User, { IUser } from '../models/user.model';
import PersonalInformation, { IPersonalInformation } from "../models/informacion-personal.model";

// import { validationResult } from 'express-validator'
import bcrypt from 'bcryptjs';
import { Jwt } from '../helpers/jwt';

export class InformacionPersonalController{

    constructor(){

    }
    
    // Obtener todos los usuarios
    async createInformacionPersonal(req: Request, res: Response) {
        const { infp_name, infp_lastname, infp_telephone, infp_img, infp_birth_date } = req.body;
        const uid = req.params.id

        try {

            // Paso 1: Verificar si el usuario existe
            const user = await User.findById(uid);
            if (!user) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No se encontró un usuario con ese ID.'
                });
            }

            const newInfo: IPersonalInformation = new PersonalInformation({
                infp_name,
                infp_lastname,
                infp_telephone,
                infp_img,
                infp_birth_date,
            });

            // Guardar en base de datos
            await newInfo.save();

            // Paso 4: Asociar la información personal al usuario
            user.usr_infp_id = (newInfo._id as any).toString();
            const updatedUser = await user.save();

            res.json({
                ok: true,
                msg: 'Información personal creada y asociada correctamente.',
                data: {
                    user: updatedUser,
                    personalInfo: newInfo
                }
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                ok: false,
                msg: 'Error inesperado al crear la información personal.'
            });
        }
    }

    // Actualizar la información personal de un usuario
    async updateInformacionPersonal(req: Request, res: Response) {
        const { infp_name, infp_lastname, infp_telephone, infp_img, infp_birth_date } = req.body;
        const infp_id = req.params.infp_id;  // ID de la información personal a actualizar
        const uid = req.params.id;  // ID del usuario al que se le actualizará la información

        try {
            // Paso 1: Verificar si el usuario existe
            const user = await User.findById(uid);
            if (!user) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No se encontró un usuario con ese ID.'
                });
            }

            // Paso 2: Verificar si la información personal existe
            const personalInfo = await PersonalInformation.findById(infp_id);
            if (!personalInfo) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No se encontró información personal con ese ID.'
                });
            }

            // Paso 3: Actualizar la información personal
            personalInfo.infp_name = infp_name || personalInfo.infp_name;
            personalInfo.infp_lastname = infp_lastname || personalInfo.infp_lastname;
            personalInfo.infp_telephone = infp_telephone || personalInfo.infp_telephone;
            personalInfo.infp_img = infp_img || personalInfo.infp_img;
            personalInfo.infp_birth_date = infp_birth_date || personalInfo.infp_birth_date;

            // Guardar los cambios de la información personal
            await personalInfo.save();

            // Paso 4: Responder con el resultado
            res.json({
                ok: true,
                msg: 'Información personal actualizada correctamente.',
                data: personalInfo
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                ok: false,
                msg: 'Error inesperado al actualizar la información personal.'
            });
        }
    }

    // Método para obtener la información personal por nombre
    async getPersonalInfoByName(req: Request, res: Response) {
        const { infp_name } = req.params; // Nombre que se busca

        try {
            // Buscar la información personal por nombre
            const personalInfo = await PersonalInformation.find({ infp_name });

            if (personalInfo.length === 0) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No se encontró información personal con ese nombre.'
                });
            }

            res.json({
                ok: true,
                data: personalInfo
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener la información personal por nombre.'
            });
        }
    }

    // Método para obtener la información personal por fecha de nacimiento
    async getPersonalInfoByBirthDate(req: Request, res: Response) {
        const { infp_birth_date } = req.params; // Fecha de nacimiento a buscar

        try {
            // Convertir la fecha en formato Date para asegurar la comparación correcta
            const birthDate = new Date(infp_birth_date);

            // Buscar la información personal por fecha de nacimiento
            const personalInfo = await PersonalInformation.find({ infp_birth_date: birthDate });

            if (personalInfo.length === 0) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No se encontró información personal con esa fecha de nacimiento.'
                });
            }

            res.json({
                ok: true,
                data: personalInfo
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener la información personal por fecha de nacimiento.'
            });
        }
    }

    // Método para actualizar la imagen de perfil
    

}