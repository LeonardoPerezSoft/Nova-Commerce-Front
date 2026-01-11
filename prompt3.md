git 🧩 ETAPA 3 — Productos (Core del Negocio)
🎯 Objetivo de la etapa

Construir el flujo completo de productos con una arquitectura limpia, reutilizable y escalable:

Listado de productos (catálogo)
Detalle de producto
Categorías
Preparar el terreno para carrito / órdenes
UX tipo marketplace moderno

Sin mezclar lógica, sin hacks, sin repetir errores clásicos.

🏗️ Decisiones de Arquitectura (importantes)
1️⃣ Product ≠ API DTO

No vamos a “escupir” lo que venga del backend.
➡️ Creamos modelo de dominio Product
➡️ El backend puede cambiar, el frontend no llora.

2️⃣ Facade Pattern (igual que Auth y User)
Nada de componentes llamando HTTP directo.
Component → ProductFacade → ProductService → API

Motivo:
caching futuro
filtros
paginación
mockeo fácil
tests simples

3️⃣ UI pensada como Marketplace

Desde ya:
cards reutilizables
loading skeletons
empty states
responsive real
Nada de tablas aburridas.

📦 Estructura propuesta
features/products/
├── models/
│   ├── product.model.ts
│   └── category.model.ts
│
├── services/
│   ├── product.service.ts
│   └── product.facade.ts
│
├── pages/
│   ├── product-list/
│   │   ├── product-list.component.ts
│   │   ├── product-list.component.html
│   │   └── product-list.component.scss
│   │
│   └── product-detail/
│       ├── product-detail.component.ts
│       ├── product-detail.component.html
│       └── product-detail.component.scss
│
├── components/
│   ├── product-card/
│   ├── product-skeleton/
│   └── category-filter/
│
└── products.routes.ts

🧠 Modelo de Dominio (ejemplo base)
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'USD' | 'COP';
  imageUrl: string;
  category: Category;
  stock: number;
  active: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

🔌 Endpoints esperados (Gateway)
GET /api/products
GET /api/products/{id}
GET /api/categories



GET /api/products:

Body:
None

response:

{
    "content": [
        {
            "id": 1,
            "name": "Laptop Pro 15",
            "description": "High-performance laptop with 15-inch display",
            "price": 1299.99,
            "productType": "PHYSICAL",
            "categoryId": 1,
            "stockQuantity": 50,
            "status": "ACTIVE"
        },
        {
            "id": 2,
            "name": "Wireless Mouse",
            "description": "Ergonomic wireless mouse with USB receiver",
            "price": 29.99,
            "productType": "PHYSICAL",
            "categoryId": 1,
            "stockQuantity": 200,
            "status": "ACTIVE"
        },
        {
            "id": 3,
            "name": "Premium T-Shirt",
            "description": "100% cotton premium quality t-shirt",
            "price": 24.99,
            "productType": "PHYSICAL",
            "categoryId": 2,
            "stockQuantity": 150,
            "status": "ACTIVE"
        },
        {
            "id": 4,
            "name": "E-Book: Java Programming",
            "description": "Comprehensive guide to Java programming",
            "price": 19.99,
            "productType": "DIGITAL",
            "categoryId": 3,
            "stockQuantity": 9999,
            "status": "ACTIVE"
        },
        {
            "id": 6,
            "name": "Porshe Scale  1/24",
            "description": "Vehicle Porshe 911 a escala ",
            "price": 2.00,
            "productType": "PHYSICAL",
            "categoryId": 5,
            "stockQuantity": 23,
            "status": "ACTIVE"
        },
        {
            "id": 7,
            "name": "Porshe Scale  1/24",
            "description": "Vehicle Porshe 911 a escala ",
            "price": 2.00,
            "productType": "PHYSICAL",
            "categoryId": 5,
            "stockQuantity": 23,
            "status": "ACTIVE"
        },
        {
            "id": 8,
            "name": "Porshe Scale  1/24",
            "description": "Vehicle Porshe 911 a escala ",
            "price": 2.00,
            "productType": "PHYSICAL",
            "categoryId": 5,
            "stockQuantity": 23,
            "status": "ACTIVE"
        }
    ],
    "pageable": {
        "pageNumber": 0,
        "pageSize": 20,
        "sort": {
            "empty": false,
            "sorted": true,
            "unsorted": false
        },
        "offset": 0,
        "paged": true,
        "unpaged": false
    },
    "last": true,
    "totalElements": 7,
    "totalPages": 1,
    "first": true,
    "size": 20,
    "number": 0,
    "sort": {
        "empty": false,
        "sorted": true,
        "unsorted": false
    },
    "numberOfElements": 7,
    "empty": false
}



GET /api/products/{id}

body
none
response:

{
    "id": 3,
    "name": "Premium T-Shirt",
    "description": "100% cotton premium quality t-shirt",
    "price": 24.99,
    "productType": "PHYSICAL",
    "categoryId": 2,
    "stockQuantity": 150,
    "status": "ACTIVE"
}


Si no existe el producto:
{
    "timestamp": "2026-01-11T12:56:16.8949375",
    "status": 404,
    "error": "Not Found",
    "message": "Product not found with ID: 5",
    "validationErrors": null
}


GET /api/categories:

Body
none
responde:


{
    "content": [
        {
            "id": 1,
            "name": "Electronics",
            "description": "Electronic devices and accessories",
            "status": "ACTIVE"
        },
        {
            "id": 2,
            "name": "Clothing",
            "description": "Apparel and fashion items",
            "status": "ACTIVE"
        },
        {
            "id": 3,
            "name": "Books",
            "description": "Physical and digital books",
            "status": "ACTIVE"
        },
        {
            "id": 4,
            "name": "Home & Garden",
            "description": "Home improvement and gardening products",
            "status": "ACTIVE"
        },
        {
            "id": 5,
            "name": "Toys",
            "description": "Toys for childrens",
            "status": "ACTIVE"
        }
    ],
    "pageable": {
        "pageNumber": 0,
        "pageSize": 20,
        "sort": {
            "empty": false,
            "sorted": true,
            "unsorted": false
        },
        "offset": 0,
        "paged": true,
        "unpaged": false
    },
    "last": true,
    "totalElements": 5,
    "totalPages": 1,
    "first": true,
    "size": 20,
    "number": 0,
    "sort": {
        "empty": false,
        "sorted": true,
        "unsorted": false
    },
    "numberOfElements": 5,
    "empty": false
}


(backend ya lo tienes, frontend solo consume)

🧪 Testing (sin exagerar, pero bien)
Facade: lógica de negocio → tests
Service: HTTP → mock
Componentes: rendering + estados básicos
No snapshot testing inútil.

🎨 UX mínima esperada
Grid tipo marketplace
Cards con:
imagen
nombre
precio
botón “Ver detalle”
Skeleton mientras carga
Mensaje cuando no hay productos