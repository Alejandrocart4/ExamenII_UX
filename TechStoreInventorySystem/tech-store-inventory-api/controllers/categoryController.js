const db = require('../models');

const { Category, Product } = db;

function normalizeName(value) {
  return String(value || '').trim();
}

async function getCategories(req, res) {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']],
      include: [
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'name', 'price', 'stock', 'categoryId']
        }
      ]
    });

    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener las categorias',
      error: error.message
    });
  }
}

async function createCategory(req, res) {
  try {
    const name = normalizeName(req.body.name);

    if (!name) {
      return res.status(400).json({ message: 'name es requerido' });
    }

    const existingCategory = await Category.findOne({ where: { name } });

    if (existingCategory) {
      return res.status(409).json({ message: 'Ya existe una categoria con ese nombre' });
    }

    const category = await Category.create({ name });

    return res.status(201).json(category);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al crear la categoria',
      error: error.message
    });
  }
}

module.exports = {
  getCategories,
  createCategory
};
