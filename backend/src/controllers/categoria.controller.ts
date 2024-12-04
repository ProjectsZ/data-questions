
import { Request, Response, response } from 'express';
import Alternativa, { IAlternativa } from '../models/alternativa.model';

import Categoria, { ICategoria } from '../models/categoria.model';  // Asegúrate de que el modelo de Categoria está importado correctamente
import Curso, { ICurso } from '../models/curso.model';  // Modelo de Curso importado para verificar si el curso asociado existe


export class CategoriaController{

    constructor(){
        
    }

    // Crear una nueva categoría
    async createCategoria(req: Request, res: Response): Promise<Response> {
        const { cat_title, cat_subtitle, cat_description, cat_crs_id } = req.body;
    
        try {
            // Verificar si el curso asociado existe
            const curso = await Curso.findById(cat_crs_id);
            if (!curso) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El curso especificado no existe.'
                });
            }
    
            // Crear la nueva categoría
            const nuevaCategoria = new Categoria({
                cat_title,
                cat_subtitle,
                cat_description,
                cat_crs_id
            });
    
            // Guardar la categoría en la base de datos
            await nuevaCategoria.save();
    
            return res.json({
                ok: true,
                msg: 'Categoría creada exitosamente',
                categoria: nuevaCategoria
            });
        } catch (error) {
            console.error('Error al crear la categoría:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al crear la categoría.'
            });
        }
    }
    
    // Obtener una categoría por su ID
    async getCategoriaById(req: Request, res: Response): Promise<Response> {
        const { cat_id } = req.params;
    
        try {
            const categoria = await Categoria.findById(cat_id).populate('cat_crs_id');
            if (!categoria) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Categoría no encontrada.'
                });
            }
    
            return res.json({
                ok: true,
                categoria
            });
        } catch (error) {
            console.error('Error al obtener la categoría:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener la categoría.'
            });
        }
    }
    
    // Obtener todas las categorías
    async getAllCategorias(req: Request, res: Response): Promise<Response> {
        try {
            const categorias = await Categoria.find().populate('cat_crs_id');
            return res.json({
                ok: true,
                categorias
            });
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener las categorías.'
            });
        }
    }
    
    // Actualizar una categoría
    async updateCategoria(req: Request, res: Response): Promise<Response> {
        const { cat_id } = req.params;
        const { cat_title, cat_subtitle, cat_description, cat_crs_id } = req.body;
    
        try {
            // Verificar si la categoría existe
            const categoria = await Categoria.findById(cat_id);
            if (!categoria) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Categoría no encontrada.'
                });
            }
    
            // Verificar si el curso asociado existe
            const curso = await Curso.findById(cat_crs_id);
            if (!curso) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El curso especificado no existe.'
                });
            }
    
            // Actualizar los datos de la categoría
            categoria.cat_title = cat_title;
            categoria.cat_subtitle = cat_subtitle;
            categoria.cat_description = cat_description;
            categoria.cat_crs_id = cat_crs_id;
    
            await categoria.save();
    
            return res.json({
                ok: true,
                msg: 'Categoría actualizada exitosamente',
                categoria
            });
        } catch (error) {
            console.error('Error al actualizar la categoría:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al actualizar la categoría.'
            });
        }
    }
    
    // Eliminar una categoría
    async deleteCategoria(req: Request, res: Response): Promise<Response> {
        const { cat_id } = req.params;
    
        try {
            // Verificar si la categoría existe y eliminarla
            const categoria = await Categoria.findByIdAndDelete(cat_id);
            if (!categoria) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Categoría no encontrada.'
                });
            }
    
            return res.json({
                ok: true,
                msg: 'Categoría eliminada exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar la categoría:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al eliminar la categoría.'
            });
        }
    }
    
    // Obtener categorías por curso
    async getCategoriasByCursoId(req: Request, res: Response): Promise<Response> {
        const { crs_id } = req.params;
    
        try {
            const categorias = await Categoria.find({ cat_crs_id: crs_id }).populate('cat_crs_id');
            return res.json({
                ok: true,
                categorias
            });
        } catch (error) {
            console.error('Error al obtener categorías por curso:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener las categorías por curso.'
            });
        }
    }
    
    // Buscar categorías por nombre
    async searchCategorias(req: Request, res: Response): Promise<Response> {
        const { query } = req.params;
    
        try {
            const categorias = await Categoria.find({
                $or: [
                    { cat_title: { $regex: query, $options: 'i' } },
                    { cat_subtitle: { $regex: query, $options: 'i' } },
                    { cat_description: { $regex: query, $options: 'i' } }
                ]
            }).populate('cat_crs_id');
    
            return res.json({
                ok: true,
                categorias
            });
        } catch (error) {
            console.error('Error al buscar categorías:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al buscar categorías.'
            });
        }
    }
   

}