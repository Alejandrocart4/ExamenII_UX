const swaggerJsdoc = require('swagger-jsdoc');

const port = process.env.PORT || 3000;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tech Store Inventory API',
      version: '1.0.0',
      description: 'API REST para el sistema de gestion de inventario Tech Store.'
    },
    servers: [
      {
        url: `http://localhost:${port}`
      }
    ]
  },
  apis: [`${__dirname}/../routes/*.js`]
};

module.exports = swaggerJsdoc(options);
