const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: Gestion de categorias del inventario
 *   - name: Products
 *     description: Gestion de productos tecnologicos
 *
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: d78f4fe8-8acb-4e0b-98ea-fb7658f87b78
 *         name:
 *           type: string
 *           example: Laptops
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CategoryCreate:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Monitores
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Obtener categorias
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorias con sus productos
 *       500:
 *         description: Error interno del servidor
 */
router.get('/categories', categoryController.getCategories);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Crear una categoria
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryCreate'
 *     responses:
 *       201:
 *         description: Categoria creada
 *       400:
 *         description: Datos invalidos
 *       409:
 *         description: Categoria duplicada
 */
router.post('/categories', categoryController.createCategory);

module.exports = router;
