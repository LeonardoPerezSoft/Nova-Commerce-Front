🧩 ETAPA 5 — Carrito de Compras (Shopping Cart)

🎯 Objetivo real
Introducir un estado intermedio entre Productos y Órdenes:

El usuario selecciona productos → los gestiona en un carrito → confirma → se crea la orden.
El carrito:
❌ NO crea órdenes
❌ NO calcula descuentos
❌ NO conoce reglas de negocio complejas
✅ Solo gestiona intención de compra
🧠 Principios clave (no negociables)

Single Source of Truth → CartFacade
Persistencia ligera → sessionStorage
Observable-first
Sin lógica en componentes

Backend sigue mandando (frontend no “inventa” totales)

🏗️ Arquitectura propuesta
features/cart/
├── models/
│   ├── cart-item.model.ts
│   └── cart.model.ts
│
├── services/
│   └── cart.storage.service.ts     # sessionStorage abstraction
│
├── facade/
│   └── cart.facade.ts              # Estado y orquestación
│
├── components/
│   ├── cart-item/
│   ├── cart-summary/
│   └── cart-icon/                  # badge en el header
│
├── pages/
│   └── cart-page/
│
└── cart.routes.ts

📦 Modelos
CartItem
productId
name
price
quantity
imageUrl
subtotal (derivado, no persistido)

Cart
items[]
totalItems
totalAmount (solo UI)

🧠 CartFacade (el corazón)
Responsabilidades:
addItem(product)
removeItem(productId)
updateQuantity(productId, qty)
clearCart()
getItems()
getTotalItems()
getTotalAmount()
checkout() → delega a OrderFacade.createOrder()

📌 Importante:
checkout() NO calcula descuentos
solo arma el CreateOrderRequest.

🧩 Integraciones clave
🔹 Products

Botón Agregar al carrito
No sabe nada del estado global

🔹 Header
Ícono carrito
Badge con total de ítems

🔹 Orders
Cart → OrderFacade → Backend

🧪 Testing (obligatorio)
Cobertura esperada:
CartFacade → 100%
CartStorageService → 100%
Componentes → estados básicos
Casos clave:
Agregar mismo producto incrementa cantidad
Eliminar ítem
Persistencia al refrescar
Vaciar carrito al checkout exitoso

🧠 UX esperada (tipo Amazon / MercadoLibre)
Carrito siempre accesible
Cantidades editables
Subtotales visibles
CTA claro: “Confirmar compra”
Loading y disabled states

Nada de pantallas crudas.