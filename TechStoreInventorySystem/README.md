# Tech Store Inventory System

Proyecto de examen basado en el enunciado "sistema de gestion de inventario tech store" 

## Estructura

- `tech-store-inventory-api`: backend Express + Sequelize + Swagger + PostgreSQL
- `tech-store-inventory-front`: frontend React + Vite
- `docker-compose.yml`: contenedor de PostgreSQL

## Comandos

### Base de datos

```bash
docker compose up -d
```

### Backend

```bash
cd tech-store-inventory-api
pnpm install
pnpm migrate
pnpm start
```

### Frontend

```bash
cd tech-store-inventory-front
pnpm install
pnpm dev
```

## URLs

- Backend: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`
- Frontend: `http://localhost:5173`

## Endpoints del examen

- `GET /api/products`
- `GET /api/products?categoryId=<uuid>`
- `POST /api/product`
- `GET /api/categories`
- `POST /api/categories`

- ## FIGMA
- https://www.figma.com/make/QEvYwwo3E7HJJWkN6fKpd9/Modulo-de-inventario?t=2lnGmAWuhKXGPvEf-20&fullscreen=1

- ## Jonny Alejandro Gomez Cartagena
