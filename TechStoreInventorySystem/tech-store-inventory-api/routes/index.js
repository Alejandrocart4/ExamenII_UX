const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Tech Store Inventory API',
    message: 'API REST del sistema de gestion de inventario'
  });
});

module.exports = router;
