// Logica de lo que va hacer nuestra ruta
import { Request, Response, response } from 'express';
import Pregunta, { IPregunta } from "../models/pregunta.model";

import Categoria, { ICategoria } from "../models/categoria.model";
import Alternativa, { IAlternativa }  from '../models/alternativa.model';

export class PreguntaController {

    constructor(){

    }
     

    async createPregunta(req: Request, res: Response) {

        const {
            pr_content,
            pr_img,
            pr_answer,
            pr_type,
            pr_difficulty,
            pr_time,
            pr_tags,
            pr_cat_id
        } = req.body;

        
        try {
            // Verificar si la categoría existe
            const categoria = await Categoria.findById(pr_cat_id);
            if (!categoria) {
                return res.status(400).json({
                    ok: false,
                    msg: 'La categoría especificada no existe.'
                });
            }
    
            // Crear el objeto de la pregunta
            const nuevaPregunta = new Pregunta({
                pr_content,
                pr_img,
                pr_answer,
                pr_type,
                pr_difficulty,
                pr_time,
                pr_tags,
                pr_cat_id
            });
    
            // Guardar la nueva pregunta en la base de datos
            await nuevaPregunta.save();
    
            return res.json({
                ok: true,
                msg: 'Pregunta creada exitosamente',
                pregunta: nuevaPregunta
            });
    
        } catch (error) {
            console.error('Error al crear la pregunta:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al crear la pregunta.'
            });
        }
    }

    async createPregunta2(req: Request, res: Response) {
        const {
            pr_content,
            pr_img,
            pr_answer,
            pr_type,
            pr_difficulty,
            pr_time,
            pr_tags,
            pr_cat_id
        } = req.body;
    
        try {
            // Verificar si la categoría existe
            const categoria = await Categoria.findById(pr_cat_id);
            if (!categoria) {
                return res.status(400).json({
                    ok: false,
                    msg: 'La categoría especificada no existe.'
                });
            }
    
            // Validar las respuestas
            if (pr_answer && Array.isArray(pr_answer)) {
                // Comprobar que cada respuesta tiene un pr_opt_id que sea válido y una referencia a una Alternativa
                for (let answer of pr_answer) {
                    const alternativa = await Alternativa.findById(answer.pr_opt_id);
                    if (!alternativa) {
                        return res.status(400).json({
                            ok: false,
                            msg: `Alternativa con ID ${answer.pr_opt_id} no encontrada.`
                        });
                    }
                }
            } else {
                return res.status(400).json({
                    ok: false,
                    msg: 'Las respuestas deben ser un arreglo de objetos válidos.'
                });
            }
    
            // Crear el objeto de la pregunta
            const nuevaPregunta = new Pregunta({
                pr_content,
                pr_img,
                pr_answer,
                pr_type,
                pr_difficulty,
                pr_time,
                pr_tags,
                pr_cat_id
            });
    
            // Guardar la nueva pregunta en la base de datos
            await nuevaPregunta.save();
    
            return res.json({
                ok: true,
                msg: 'Pregunta creada exitosamente',
                pregunta: nuevaPregunta
            });
    
        } catch (error) {
            console.error('Error al crear la pregunta:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al crear la pregunta.'
            });
        }
    }

    // Obtener todas las preguntas
    async getPreguntas(req: Request, res: Response) {
        try {
            // Obtención de parámetros de paginación desde los query params (si no se proporcionan, se usan valores por defecto)
            const page = Number(req.query.page) || 1;  // Página actual, por defecto 1
            const limit = Number(req.query.limit) || 5;  // Limite de resultados por página, por defecto 5
            const skip = (page - 1) * limit;  // Calcular el número de saltos según la página
    
            // Realizamos las consultas de manera simultánea usando Promise.all
            const [preguntas, totalPreguntas] = await Promise.all([
                Pregunta.find()  // Obtiene todas las preguntas
                    .skip(skip)  // Salta los elementos previos según la página
                    .limit(limit)  // Limita el número de resultados por página
                    .populate('pr_cat_id', 'name')  // Supongo que queremos mostrar el nombre de la categoría
                    .lean(),  // Convierte los documentos a objetos JSON puros (opcional, mejora el rendimiento)
                
                Pregunta.countDocuments()  // Cuenta el total de documentos en la colección
            ]);
    
            // Calculamos el total de páginas
            const totalPages = Math.ceil(totalPreguntas / limit);
    
            res.json({
                ok: true,
                preguntas,
                totalPreguntas,
                totalPages,  // Añadimos totalPages para que el cliente sepa cuántas páginas existen
                currentPage: page,  // Página actual
                perPage: limit,  // Resultados por página
            });
        } catch (error) {
            console.error('Error al obtener preguntas:', error);
    
            res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener las preguntas. Por favor intente nuevamente más tarde.',
            });
        }
    }

    // Obtener pregunta por ID
    async getPreguntaById(req: Request, res: Response){
        const { pr_id } = req.params;

        try {
            const pregunta = await Pregunta.findById(pr_id).populate('pr_cat_id', 'name'); // Populate para obtener la categoría

            if (!pregunta) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Pregunta no encontrada.'
                });
            }

            return res.json({
                ok: true,
                pregunta
            });
        } catch (error) {
            console.error('Error al obtener la pregunta:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener la pregunta.'
            });
        }
    }

    // Obtener preguntas por categoría
    async getPreguntasByCategoryId(req: Request, res: Response) {
        const { pr_cat_id } = req.params;

        try {
            const preguntas = await Pregunta.find({ pr_cat_id }).populate('pr_cat_id', 'name');

            return res.json({
                ok: true,
                preguntas
            });
        } catch (error) {
            console.error('Error al obtener preguntas por categoría:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener las preguntas por categoría.'
            });
        }
    }

    // Obtener preguntas por etiqueta
    async getPreguntasByTag(req: Request, res: Response){
        const { pr_tags } = req.params;

        try {
            const preguntas = await Pregunta.find({ pr_tags: { $in: [pr_tags] } });

            return res.json({
                ok: true,
                preguntas
            });
        } catch (error) {
            console.error('Error al obtener preguntas por etiqueta:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener las preguntas por etiqueta.'
            });
        }
    }

    // Actualizar una pregunta
    async updatePregunta(req: Request, res: Response){
        const { pr_id } = req.params;
        const { pr_content, pr_img, pr_answer, pr_type, pr_difficulty, pr_time, pr_tags, pr_cat_id } = req.body;

        try {
            const pregunta = await Pregunta.findById(pr_id);

            if (!pregunta) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Pregunta no encontrada.'
                });
            }

            // Actualizar la pregunta con los nuevos datos
            pregunta.pr_content = pr_content;
            pregunta.pr_img = pr_img;
            pregunta.pr_answer = pr_answer;
            pregunta.pr_type = pr_type;
            pregunta.pr_difficulty = pr_difficulty;
            pregunta.pr_time = pr_time;
            pregunta.pr_tags = pr_tags;
            pregunta.pr_cat_id = pr_cat_id;

            // Guardar la pregunta actualizada
            await pregunta.save();

            return res.json({
                ok: true,
                msg: 'Pregunta actualizada exitosamente',
                pregunta
            });

        } catch (error) {
            console.error('Error al actualizar la pregunta:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al actualizar la pregunta.'
            });
        }
    }

    // Eliminar una pregunta
    async deletePregunta(req: Request, res: Response) {
        const { pr_id } = req.params;

        try {
            const pregunta = await Pregunta.findById(pr_id);

            if (!pregunta) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Pregunta no encontrada.'
                });
            }

            // Eliminar la pregunta
            await Pregunta.findByIdAndDelete( pr_id );

            return res.json({
                ok: true,
                msg: 'Pregunta eliminada exitosamente.'
            });

        } catch (error) {
            console.error('Error al eliminar la pregunta:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al eliminar la pregunta.'
            });
        }
    }

    // Obtener preguntas por dificultad
    async getPreguntasByDifficulty(req: Request, res: Response) {
        const { pr_difficulty } = req.params;

        try {
            const preguntas = await Pregunta.find({ pr_difficulty });

            return res.json({
                ok: true,
                preguntas
            });
        } catch (error) {
            console.error('Error al obtener preguntas por dificultad:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener las preguntas por dificultad.'
            });
        }
    }

    // Obtener preguntas por tipo
    async getPreguntasByType(req: Request, res: Response) {
        const { pr_type } = req.params;

        try {
            const preguntas = await Pregunta.find({ pr_type });

            return res.json({
                ok: true,
                preguntas
            });
        } catch (error) {
            console.error('Error al obtener preguntas por tipo:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener las preguntas por tipo.'
            });
        }
    }

    // Obtener preguntas por límite de tiempo
    async getPreguntasByTimeLimit(req: Request, res: Response) {
        const { pr_time } = req.params;

        try {
            const preguntas = await Pregunta.find({ pr_time: { $lte: pr_time } });

            return res.json({
                ok: true,
                preguntas
            });
        } catch (error) {
            console.error('Error al obtener preguntas por límite de tiempo:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener las preguntas por límite de tiempo.'
            });
        }
    }

    // Obtener respuestas de una pregunta
    async getPreguntaAnswer(req: Request, res: Response) {
        const { pr_id } = req.params;

        try {
            const pregunta = await Pregunta.findById(pr_id);

            if (!pregunta) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Pregunta no encontrada.'
                });
            }

            const respuestas = pregunta.pr_answer;

            return res.json({
                ok: true,
                respuestas
            });
        } catch (error) {
            console.error('Error al obtener las respuestas de la pregunta:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener las respuestas de la pregunta.'
            });
        }
    }

}

