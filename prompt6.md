🧩 ETAPA 6 — ADMIN PANEL (Gestión y Control)
🎯 Objetivo de la etapa

Incorporar un Panel Administrativo real, seguro y funcional que permita:
Gestionar productos
Gestionar órdenes
Validar roles y permisos
Detectar ajustes de negocio necesarios antes de escalar (muy buena intuición la tuya)
Esta etapa no es solo UI, es control del sistema.

🧠 Principios que vamos a mantener (no negociables)

Los mismos que ya vienes usando (y que Copilot debe respetar):
✅ Clean Architecture
✅ Facade Pattern
✅ Standalone Components
✅ Lazy Loading
✅ RoleGuard + hasRole
✅ Zero lógica de negocio en componentes
✅ Observable-first
✅ Tests unitarios obligatorios
✅ Coverage ≥ 85%
✅ Backend manda (frontend no “inventa” reglas)

🧱 Alcance funcional de ETAPA 6
🔐 Seguridad

Acceso solo ADMIN
Protección por:
AuthGuard
RoleGuard
*hasRole="'ADMIN'"

📦 ADMIN — Productos

Funciones mínimas:
Listar productos (tabla)
Crear producto
Editar producto
Activar / desactivar producto

Ver stock

❗ No duplicamos ProductFacade
Creamos AdminProductFacade (separación clara de contextos)

📦 ADMIN — Órdenes

Funciones mínimas:
Listar todas las órdenes (no solo las del usuario)
Filtrar por estado
Cambiar estado:
CREATED → PAID
PAID → SHIPPED
SHIPPED → COMPLETED

Ver detalle de orden

👉 Aquí es donde validamos reglas reales del backend

🗂️ Estructura esperada (alto nivel)
features/admin/
├── products/
│   ├── admin-product.model.ts
│   ├── admin-product.service.ts
│   ├── admin-product.facade.ts
│   ├── pages/
│   │   ├── admin-product-list/
│   │   ├── admin-product-form/
│   └── components/
│       ├── admin-product-table/
│       └── admin-product-form-fields/
│
├── orders/_untracked-chunk.mjs:2581 ERROR RuntimeError: NG0900: Error trying to diff '[object Object]'. Only arrays and iterables are allowed
    at DefaultIterableDiffer.diff (core.mjs:1050:13)
    at _NgForOf.ngDoCheck (_common_module-chunk.mjs:1639:36)
    at callHookInternal (_debug_node-chunk.mjs:555:10)
    at callHook (_debug_node-chunk.mjs:573:5)
    at callHooks (_debug_node-chunk.mjs:544:9)
    at executeCheckHooks (_debug_node-chunk.mjs:508:3)
    at refreshView (_debug_node-chunk.mjs:5511:11)
    at detectChangesInView (_debug_node-chunk.mjs:5644:5)
    at detectChangesInViewIfAttached (_debug_node-chunk.mjs:5627:3)
    at detectChangesInComponent (_debug_node-chunk.mjs:5618:5)
│   ├── admin-order.model.ts
│   ├── admin-order.service.ts
│   ├── admin-order.facade.ts
│   ├── pages/
│   │   ├── admin-order-list/
│   │   └── admin-order-detail/
│
├── admin.routes.ts
└── admin-layout.component.ts

🧪 Testing esperado (importante para el taller)

Facades: ≥ 95%
Services: 100%
Guards/roles: cubiertos
Components: tests básicos (render, inputs, outputs)