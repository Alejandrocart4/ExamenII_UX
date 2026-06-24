const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 12ccf59c-34f7-40bb-8331-70b9de470c4a
 *         name:
 *           type: string
 *           example: Laptop Lenovo ThinkPad
 *         price:
 *           type: string
 *           example: "899.99"
 *         stock:
 *           type: integer
 *           example: 6
 *         categoryId:
 *           type: string
 *           format: uuid
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ProductCreate:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - stock
 *         - categoryId
 *       properties:
 *         name:
 *           type: string
 *           example: Mouse Logitech MX Master 3S
 *         price:
 *           type: number
 *           example: 129.99
 *         stock:
 *           type: integer
 *           example: 15
 *         categoryId:
 *           type: string
 *           format: uuid
 *           example: d78f4fe8-8acb-4e0b-98ea-fb7658f87b78
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener productos
 *     description: Retorna la lista de productos incluyendo la informacion de su categoria. Permite filtrar por categoryId.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID de la categoria para filtrar productos
 *     responses:
 *       200:
 *         description: Lista de productos obtenida correctamente
 *       404:
 *         description: La categoria enviada no existe
 *       500:
 *         description: Error interno del servidor
 */
router.get('/products', productController.getProducts);

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Crear un producto
 *     description: Permite la creacion de un nuevo producto vinculado a una categoria existente.
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreate'
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 *       400:
 *         description: Datos invalidos
 *       404:
 *         description: La categoria indicada no existe
 *       500:
 *         description: Error interno del servidor
 */
router.post('/product', productController.createProduct);

module.exports = router;
