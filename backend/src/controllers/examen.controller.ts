
import { Request, Response, response } from 'express';
import Alternativa, { IAlternativa } from '../models/alternativa.model';

import Categoria, { ICategoria } from '../models/categoria.model';  // Asegúrate de que el modelo de Categoria está importado correctamente
import Curso, { ICurso } from '../models/curso.model';  // Modelo de Curso importado para verificar si el curso asociado existe
import Examen, { IExamen } from '../models/examen.model';
import Pregunta, { IPregunta } from '../models/pregunta.model';

export class ExamenController{

    constructor(){
        
    }

    // Crear un nuevo examen
    async createExamen(req: Request, res: Response): Promise<Response> {
        const { exm_description, exm_status, exm_duration, exm_attempts, exm_teacher_user_id, exm_crs_id, exm_pr } = req.body;

        try {
            // Crear el examen
            const nuevoExamen = new Examen({
                exm_description,
                exm_status,
                exm_duration,
                exm_attempts,
                exm_teacher_user_id,
                exm_crs_id,
                exm_pr
            });

            // Guardar el examen en la base de datos
            await nuevoExamen.save();

            return res.json({
                ok: true,
                msg: 'Examen creado exitosamente',
                examen: nuevoExamen
            });
        } catch (error) {
            console.error('Error al crear el examen:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al crear el examen.'
            });
        }
    }

    // Obtener un examen por ID
    async getExamenById(req: Request, res: Response): Promise<Response> {
        const { exm_id } = req.params;

        try {
            const examen = await Examen.findById(exm_id).populate('exm_pr exm_teacher_user_id exm_crs_id');
            if (!examen) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Examen no encontrado.'
                });
            }

            return res.json({
                ok: true,
                examen
            });
        } catch (error) {
            console.error('Error al obtener el examen:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener el examen.'
            });
        }
    }

    // Obtener exámenes por ID del profesor
    async getExamenesByTeacherId(req: Request, res: Response): Promise<Response> {
        const { exm_teacher_usr_id } = req.params;

        try {
            const examenes = await Examen.find({ exm_teacher_user_id: exm_teacher_usr_id }).populate('exm_pr exm_teacher_user_id exm_crs_id');
            return res.json({
                ok: true,
                examenes
            });
        } catch (error) {
            console.error('Error al obtener los exámenes del profesor:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener los exámenes del profesor.'
            });
        }
    }

    // Actualizar un examen
    async updateExamen(req: Request, res: Response): Promise<Response> {
        const { exm_id } = req.params;
        const { exm_description, exm_status, exm_duration, exm_attempts } = req.body;

        try {
            const examen = await Examen.findById(exm_id);
            if (!examen) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Examen no encontrado.'
                });
            }

            examen.exm_description = exm_description;
            examen.exm_status = exm_status;
            examen.exm_duration = exm_duration;
            examen.exm_attempts = exm_attempts;

            await examen.save();

            return res.json({
                ok: true,
                msg: 'Examen actualizado exitosamente',
                examen
            });
        } catch (error) {
            console.error('Error al actualizar el examen:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al actualizar el examen.'
            });
        }
    }

    // Eliminar un examen
    async deleteExamen(req: Request, res: Response): Promise<Response> {
        const { exm_id } = req.params;

        try {
            const examen = await Examen.findByIdAndDelete(exm_id);
            if (!examen) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Examen no encontrado.'
                });
            }

            return res.json({
                ok: true,
                msg: 'Examen eliminado exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar el examen:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al eliminar el examen.'
            });
        }
    }

    // Obtener los exámenes por su estado (activo/inactivo)
    async getExamenesByStatus(req: Request, res: Response): Promise<Response> {
        const { exm_status } = req.params;

        try {
            const examenes = await Examen.find({ exm_status }).populate('exm_pr exm_teacher_user_id exm_crs_id');
            return res.json({
                ok: true,
                examenes
            });
        } catch (error) {
            console.error('Error al obtener exámenes por estado:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener los exámenes por estado.'
            });
        }
    }

    // Obtener los exámenes por rango de fechas
    async getExamenesByDateRange(req: Request, res: Response): Promise<Response> {
        const { startDate, endDate } = req.body;

        try {
            const examenes = await Examen.find({
                exm_created_at: { $gte: new Date(startDate), $lte: new Date(endDate) }
            }).populate('exm_pr exm_teacher_user_id exm_crs_id');

            return res.json({
                ok: true,
                examenes
            });
        } catch (error) {
            console.error('Error al obtener exámenes por rango de fechas:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener exámenes por fecha.'
            });
        }
    }

    // Obtener la duración de un examen
    async getExamenDuration(req: Request, res: Response): Promise<Response> {
        const { exm_id } = req.params;

        try {
            const examen = await Examen.findById(exm_id);
            if (!examen) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Examen no encontrado.'
                });
            }

            return res.json({
                ok: true,
                duration: examen.exm_duration
            });
        } catch (error) {
            console.error('Error al obtener la duración del examen:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener la duración del examen.'
            });
        }
    }

    // Obtener los intentos permitidos de un examen
    async getExamenAttempts(req: Request, res: Response): Promise<Response> {
        const { exm_id } = req.params;

        try {
            const examen = await Examen.findById(exm_id);
            if (!examen) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Examen no encontrado.'
                });
            }

            return res.json({
                ok: true,
                attempts: examen.exm_attempts
            });
        } catch (error) {
            console.error('Error al obtener los intentos permitidos del examen:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener los intentos permitidos del examen.'
            });
        }
    }


}