"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaController = void 0;
const categoria_model_1 = __importDefault(require("../models/categoria.model")); // Asegúrate de que el modelo de Categoria está importado correctamente
const curso_model_1 = __importDefault(require("../models/curso.model")); // Modelo de Curso importado para verificar si el curso asociado existe
class CategoriaController {
    constructor() {
    }
    // Crear una nueva categoría
    async createCategoria(req, res) {
        const { cat_title, cat_subtitle, cat_description, cat_crs_id } = req.body;
        try {
            // Verificar si el curso asociado existe
            const curso = await curso_model_1.default.findById(cat_crs_id);
            if (!curso) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El curso especificado no existe.'
                });
            }
            // Crear la nueva categoría
            const nuevaCategoria = new categoria_model_1.default({
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
        }
        catch (error) {
            console.error('Error al crear la categoría:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al crear la categoría.'
            });
        }
    }
    // Obtener una categoría por su ID
    async getCategoriaById(req, res) {
        const { cat_id } = req.params;
        try {
            const categoria = await categoria_model_1.default.findById(cat_id).populate('cat_crs_id');
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
        }
        catch (error) {
            console.error('Error al obtener la categoría:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener la categoría.'
            });
        }
    }
    // Obtener todas las categorías
    async getAllCategorias(req, res) {
        try {
            const categorias = await categoria_model_1.default.find().populate('cat_crs_id');
            return res.json({
                ok: true,
                categorias
            });
        }
        catch (error) {
            console.error('Error al obtener las categorías:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener las categorías.'
            });
        }
    }
    // Actualizar una categoría
    async updateCategoria(req, res) {
        const { cat_id } = req.params;
        const { cat_title, cat_subtitle, cat_description, cat_crs_id } = req.body;
        try {
            // Verificar si la categoría existe
            const categoria = await categoria_model_1.default.findById(cat_id);
            if (!categoria) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Categoría no encontrada.'
                });
            }
            // Verificar si el curso asociado existe
            const curso = await curso_model_1.default.findById(cat_crs_id);
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
        }
        catch (error) {
            console.error('Error al actualizar la categoría:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al actualizar la categoría.'
            });
        }
    }
    // Eliminar una categoría
    async deleteCategoria(req, res) {
        const { cat_id } = req.params;
        try {
            // Verificar si la categoría existe y eliminarla
            const categoria = await categoria_model_1.default.findByIdAndDelete(cat_id);
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
        }
        catch (error) {
            console.error('Error al eliminar la categoría:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al eliminar la categoría.'
            });
        }
    }
    // Obtener categorías por curso
    async getCategoriasByCursoId(req, res) {
        const { crs_id } = req.params;
        try {
            const categorias = await categoria_model_1.default.find({ cat_crs_id: crs_id }).populate('cat_crs_id');
            return res.json({
                ok: true,
                categorias
            });
        }
        catch (error) {
            console.error('Error al obtener categorías por curso:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al obtener las categorías por curso.'
            });
        }
    }
    // Buscar categorías por nombre
    async searchCategorias(req, res) {
        const { query } = req.params;
        try {
            const categorias = await categoria_model_1.default.find({
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
        }
        catch (error) {
            console.error('Error al buscar categorías:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado al buscar categorías.'
            });
        }
    }
}
exports.CategoriaController = CategoriaController;
