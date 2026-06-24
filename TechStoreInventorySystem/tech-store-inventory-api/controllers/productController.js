const db = require('../models');

const { Product, Category } = db;

function normalizeString(value) {
  return String(value || '').trim();
}

function validatePrice(value) {
  const parsed = Number(value);

  if (Number.isNaN(parsed) || parsed < 0) {
    return { message: 'price debe ser un numero mayor o igual a 0' };
  }

  return { value: parsed.toFixed(2) };
}

function validateStock(value) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 0) {
    return { message: 'stock debe ser un numero entero mayor o igual a 0' };
  }

  return { value: parsed };
}

async function getProducts(req, res) {
  try {
    const where = {};

    if (req.query.categoryId) {
      const category = await Category.findByPk(req.query.categoryId);

      if (!category) {
        return res.status(404).json({ message: 'La categoria enviada en categoryId no existe' });
      }

      where.categoryId = req.query.categoryId;
    }

    const products = await Product.findAll({
      where,
      order: [['name', 'ASC']],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ]
    });

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener los productos',
      error: error.message
    });
  }
}

async function createProduct(req, res) {
  try {
    const name = normalizeString(req.body.name);

    if (!name) {
      return res.status(400).json({ message: 'name es requerido' });
    }

    const price = validatePrice(req.body.price);
    if (price.message) {
      return res.status(400).json({ message: price.message });
    }

    const stock = validateStock(req.body.stock);
    if (stock.message) {
      return res.status(400).json({ message: stock.message });
    }

    if (!req.body.categoryId) {
      return res.status(400).json({ message: 'categoryId es requerido' });
    }

    const category = await Category.findByPk(req.body.categoryId);

    if (!category) {
      return res.status(404).json({ message: 'La categoria indicada no existe' });
    }

    const product = await Product.create({
      name,
      price: price.value,
      stock: stock.value,
      categoryId: category.id
    });

    const createdProduct = await Product.findByPk(product.id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ]
    });

    return res.status(201).json(createdProduct);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al crear el producto',
      error: error.message
    });
  }
}

module.exports = {
  getProducts,
  createProduct
};
