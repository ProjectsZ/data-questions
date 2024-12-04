
import { Request, Response, response } from 'express';
import Alternativa, { IAlternativa } from '../models/alternativa.model';

import Curso, { ICurso } from "../models/curso.model";


export class CursoController{

    constructor(){
        
    }

    // Crear un nuevo curso
    async createCurso(req: Request, res: Response) {
        const { crs_name, crs_description, crs_code } = req.body;

        try {
            // Verificar si el código del curso ya existe
            const cursoExistente = await Curso.findOne({ crs_code });
            if (cursoExistente) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un curso con este código.'
                });
            }

            // Crear un nuevo curso
            const nuevoCurso = new Curso({
                crs_name,
                crs_description,
                crs_code
            });

            // Guardar el curso en la base de datos
            await nuevoCurso.save();

            return res.json({
                ok: true,
                msg: 'Curso creado exitosamente',
                curso: nuevoCurso
            });
        } catch (error) {
            console.error('Error al crear el curso:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al crear el curso.'
            });
        }
    }

    // Obtener un curso por su ID
    async getCursoById(req: Request, res: Response): Promise<Response> {
        const { crs_id } = req.params;

        try {
            const curso = await Curso.findById(crs_id);
            if (!curso) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Curso no encontrado.'
                });
            }

            return res.json({
                ok: true,
                curso
            });
        } catch (error) {
            console.error('Error al obtener el curso:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener el curso.'
            });
        }
    }

    // Obtener todos los cursos
    async getAllCursos(req: Request, res: Response): Promise<Response> {
        try {
            const cursos = await Curso.find();
            return res.json({
                ok: true,
                cursos
            });
        } catch (error) {
            console.error('Error al obtener los cursos:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener los cursos.'
            });
        }
    }

    // Actualizar un curso
    async updateCurso(req: Request, res: Response): Promise<Response> {
        const { crs_id } = req.params;
        const { crs_name, crs_description, crs_code } = req.body;

        try {
            // Verificar si el curso existe
            const curso = await Curso.findById(crs_id);
            if (!curso) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Curso no encontrado.'
                });
            }

            // Verificar si el código del curso está siendo actualizado y si ya existe
            if (crs_code && crs_code !== curso.crs_code) {
                const cursoExistente = await Curso.findOne({ crs_code });
                if (cursoExistente) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Ya existe un curso con este código.'
                    });
                }
            }

            // Actualizar el curso
            curso.crs_name = crs_name;
            curso.crs_description = crs_description;
            curso.crs_code = crs_code;

            await curso.save();

            return res.json({
                ok: true,
                msg: 'Curso actualizado exitosamente',
                curso
            });
        } catch (error) {
            console.error('Error al actualizar el curso:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al actualizar el curso.'
            });
        }
    }

    // Eliminar un curso
    async deleteCurso(req: Request, res: Response): Promise<Response> {
        const { crs_id } = req.params;

        try {
            // Verificar si el curso existe
            const curso = await Curso.findById(crs_id);
            if (!curso) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Curso no encontrado.'
                });
            }

            // Eliminar el curso
            await Curso.findByIdAndDelete(crs_id);

            return res.json({
                ok: true,
                msg: 'Curso eliminado exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar el curso:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al eliminar el curso.'
            });
        }
    }

    // Obtener un curso por su código
    async getCursoByCode(req: Request, res: Response): Promise<Response> {
        const { crs_code } = req.params;

        try {
            const curso = await Curso.findOne({ crs_code });
            if (!curso) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Curso no encontrado.'
                });
            }

            return res.json({
                ok: true,
                curso
            });
        } catch (error) {
            console.error('Error al obtener el curso por código:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener el curso por código.'
            });
        }
    }

    // Obtener cursos por nombre
    async getCursosByName(req: Request, res: Response): Promise<Response> {
        const { crs_name } = req.params;

        try {
            const cursos = await Curso.find({ crs_name: { $regex: crs_name, $options: 'i' } });
            return res.json({
                ok: true,
                cursos
            });
        } catch (error) {
            console.error('Error al obtener los cursos por nombre:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener los cursos por nombre.'
            });
        }
    }

    // Buscar cursos con un query
    async searchCursos(req: Request, res: Response): Promise<Response> {
        const { query } = req.params;

        try {
            const cursos = await Curso.find({
                $or: [
                    { crs_name: { $regex: query, $options: 'i' } },
                    { crs_description: { $regex: query, $options: 'i' } }
                ]
            });

            return res.json({
                ok: true,
                cursos
            });
        } catch (error) {
            console.error('Error al buscar cursos:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al buscar cursos.'
            });
        }
    }

}