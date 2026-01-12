# HUS — Nova Commerce Front — ETAPA 6 (Panel de Administración)

Documento maestro de Historias de Usuario para la sexta etapa del frontend (Panel de Administración). Mantiene el mismo espíritu y criterios que documentos HUS previos: claridad de alcance, criterios de aceptación verificables, trazabilidad técnica, Definición de Hecho y preparación para evoluciones futuras.

---

## 1) Contexto y Alcance

- Proyecto: Nova Commerce Front (Angular 21, Standalone Components, SSR)
- Backend: Microservicios detrás de API Gateway (http://localhost:8080)
- Etapa actual: ETAPA 6 — Panel de Administración (CRUD de Productos y Órdenes)
- Objetivo: Entregar una interfaz administrativa segura y completa para gestionar productos y órdenes con autenticación y control de roles.

En esta etapa SÍ se implementan: 
- Autenticación y autorización (role-based access control)
- Gestión completa de Productos (CRUD)
- Gestión de Órdenes (lectura y actualización de estado)
- Panel lateral de navegación administrativa
- Validación de formularios
- Estados de carga y mensajes de error

---

## 2) Principios y Lineamientos (heredados de Clean Architecture)

- Standalone Components; no NgModules.
- Separación de responsabilidades (Presentational / Container / Facade / Service).
- Patrón Facade para estado y lógica de negocio.
- BehaviorSubject para estado observable y reactivo.
- Rutas lazy-loaded y protegidas con guards.
- Configuración centralizada de API.
- Código tipado, testable y escalable.
- 300+ tests automatizados con cobertura >82%.
- Interfaz moderna con gradientes, iconos y animaciones.

---

## 3) Roles y Actores

- **Administrador (ADMIN)**: Usuario autenticado con rol de administrador que puede ver y gestionar el panel administrativo.
- **Usuario Autenticado (USER)**: No tiene acceso al panel administrativo.
- **Visitante**: Usuario sin autenticación; se redirige al login para acceder a admin.

---

## 4) Historias de Usuario (HUs)

A continuación se listan HUs que reflejan EXACTAMENTE lo entregado en ETAPA 6.

### HU-FE-066 — Acceso al Panel de Administración con Autenticación
- Como Administrador
- Quiero acceder a un panel administrativo seguro protegido por autenticación y rol
- Para gestionar los productos y órdenes de la plataforma de forma centralizada

Criterios de aceptación:
- Dado que soy un usuario sin autenticación
  Cuando intento acceder a "/admin"
  Entonces soy redirigido a "/login"
- Dado que soy un usuario autenticado con rol "USER"
  Cuando intento acceder a "/admin"
  Entonces veo un mensaje "Acceso denegado" y no puedo entrar
- Dado que soy un Administrador autenticado
  Cuando accedo a "/admin"
  Entonces veo el panel administrativo completo con sidebar y opciones de navegación

Trazabilidad técnica:
- Auth Guard: [src/app/features/auth/guards/auth.guard.ts](src/app/features/auth/guards/auth.guard.ts)
- Role Guard: [src/app/features/auth/guards/role.guard.ts](src/app/features/auth/guards/role.guard.ts)
- Admin Routes: [src/app/features/admin/admin.routes.ts](src/app/features/admin/admin.routes.ts)
- Has-Role Directive: [src/app/features/auth/directives/has-role.directive.ts](src/app/features/auth/directives/has-role.directive.ts)

Definición de Hecho (DoD):
- Protección en rutas y componentes.
- Guards ejecutados antes de renderizar componente.
- Redirección automática a login si no autenticado.
- Mensaje de acceso denegado si rol insuficiente.
- 4+ tests de guards pasando.

---

### HU-FE-067 — Layout del Panel Administrativo con Sidebar
- Como Administrador
- Quiero ver un layout administrativo con sidebar de navegación
- Para acceder fácilmente a diferentes secciones de administración

Criterios de aceptación:
- Dado que accedo al panel admin
  Cuando la página carga
  Entonces veo un layout con sidebar izquierdo y área de contenido principal
- Dado que navego por diferentes secciones admin
  Cuando hago click en un enlace del sidebar
  Entonces la sección se marca como activa visualmente
- Dado que veo el sidebar
  Cuando está cargada la página
  Entonces veo opciones como "Productos" y "Órdenes" con iconos visuales

Trazabilidad técnica:
- Admin Layout: [src/app/features/admin/admin-layout.component.ts](src/app/features/admin/admin-layout.component.ts)
- Template: [src/app/features/admin/admin-layout.component.html](src/app/features/admin/admin-layout.component.html)
- Estilos: [src/app/features/admin/admin-layout.component.scss](src/app/features/admin/admin-layout.component.scss)

DoD:
- Sidebar responsive (colapsa en mobile).
- Enlaces de navegación funcionales.
- Estilos modernos con gradientes y animaciones.
- Sin errores de consola.
- 1+ test pasando.

---

### HU-FE-068 — Listar Productos en Panel Administrativo
- Como Administrador
- Quiero ver una tabla con todos los productos del sistema
- Para revisar inventario, precios y estados de forma centralizada

Criterios de aceptación:
- Dado que accedo a "/admin/products"
  Cuando la página carga
  Entonces veo una tabla con columnas: Imagen, Nombre, Descripción, Precio, Stock, Categoría, Estado, Acciones
- Dado que la tabla está cargando datos
  Cuando hago esperar
  Entonces veo un spinner/loader visual
- Dado que la tabla tiene productos
  Cuando se renderiza
  Entonces cada fila muestra los datos del producto correctamente formateados

Trazabilidad técnica:
- Product List Component: [src/app/features/admin/products/pages/admin-product-list/admin-product-list.component.ts](src/app/features/admin/products/pages/admin-product-list/admin-product-list.component.ts)
- Product Table Component: [src/app/features/admin/products/components/admin-product-table/admin-product-table.component.ts](src/app/features/admin/products/components/admin-product-table/admin-product-table.component.ts)
- Admin Product Facade: [src/app/features/admin/products/admin-product.facade.ts](src/app/features/admin/products/admin-product.facade.ts)
- Admin Product Service: [src/app/features/admin/products/admin-product.service.ts](src/app/features/admin/products/admin-product.service.ts)

DoD:
- Tabla renderiza con datos del API.
- Spinner visible durante carga.
- Columnas centradas y alineadas correctamente.
- Responsive en mobile (tabla scrolleable).
- 6+ tests pasando (facade + service).

---

### HU-FE-069 — Crear Nuevo Producto
- Como Administrador
- Quiero crear un nuevo producto completando un formulario
- Para añadir nuevos artículos al catálogo de la tienda

Criterios de aceptación:
- Dado que estoy en "/admin/products"
  Cuando hago click en botón "Nuevo Producto"
  Entonces se navega a "/admin/products/new" con un formulario vacío
- Dado que completo el formulario con:
  - Nombre, Descripción, Precio, Stock, Categoría (dropdown), Tipo de Producto (Físico/Digital), Estado (Activo/Inactivo)
  Cuando hago click en "Crear"
  Entonces se envía POST a API y se redirige a "/admin/products" con éxito
- Dado que hay un error al crear
  Cuando el servidor responde con error
  Entonces veo un mensaje de error sin perder los datos del formulario

Trazabilidad técnica:
- Product Form Component: [src/app/features/admin/products/pages/admin-product-form/admin-product-form.component.ts](src/app/features/admin/products/pages/admin-product-form/admin-product-form.component.ts)
- Form Fields Component: [src/app/features/admin/products/components/admin-product-form-fields/admin-product-form-fields.component.ts](src/app/features/admin/products/components/admin-product-form-fields/admin-product-form-fields.component.ts)
- Category Service: [src/app/features/admin/categories/category.service.ts](src/app/features/admin/categories/category.service.ts)

DoD:
- Formulario valida campos requeridos.
- Categorías se cargan dinámicamente con dropdown.
- Estados de carga (loading spinner) visible.
- Redirección automática post-creación.
- 3+ tests pasando.

---

### HU-FE-070 — Editar Producto Existente
- Como Administrador
- Quiero editar los detalles de un producto existente
- Para actualizar inventario, precios o descripción sin crear duplicados

Criterios de aceptación:
- Dado que estoy en la tabla de productos
  Cuando hago click en ícono de editar (lápiz) en una fila
  Entonces se navega a "/admin/products/{id}" con el formulario pre-llenado
- Dado que modifico campos del producto
  Cuando hago click en "Actualizar"
  Entonces se envía PUT a API y se redirige a "/admin/products" con confirmación
- Dado que el formulario está en modo edición
  Cuando la página carga
  Entonces el título dice "Editar Producto" en vez de "Nuevo Producto"

Trazabilidad técnica:
- Product Form Component: [src/app/features/admin/products/pages/admin-product-form/admin-product-form.component.ts](src/app/features/admin/products/pages/admin-product-form/admin-product-form.component.ts)
- Admin Product Facade: [src/app/features/admin/products/admin-product.facade.ts](src/app/features/admin/products/admin-product.facade.ts)

DoD:
- Detección automática de modo edición via ruta ({id}).
- Precarga de datos del producto desde API.
- Validación de formulario en modo edición.
- Mensaje de éxito post-actualización.
- Sin errores de consola.

---

### HU-FE-071 — Eliminar Producto
- Como Administrador
- Quiero eliminar un producto del sistema
- Para mantener limpio el catálogo de artículos discontinuados

Criterios de aceptación:
- Dado que estoy viendo la tabla de productos
  Cuando hago click en ícono de eliminar (papelera) en una fila
  Entonces se muestra un diálogo de confirmación con el nombre del producto
- Dado que confirmo la eliminación
  Cuando hago click en "Sí, eliminar"
  Entonces se envía DELETE a API y la fila desaparece de la tabla
- Dado que cancelo la eliminación
  Cuando hago click en "Cancelar"
  Entonces el diálogo se cierra sin hacer cambios

Trazabilidad técnica:
- Product Table Component: [src/app/features/admin/products/components/admin-product-table/admin-product-table.component.ts](src/app/features/admin/products/components/admin-product-table/admin-product-table.component.ts)
- Admin Product Facade: [src/app/features/admin/products/admin-product.facade.ts](src/app/features/admin/products/admin-product.facade.ts)

DoD:
- Diálogo de confirmación nativo o custom.
- Elimina correctamente via API DELETE.
- Tabla se actualiza sin recarga completa.
- Manejo de errores visualmente.
- 1+ test pasando.

---

### HU-FE-072 — Gestionar Categorías de Productos
- Como Administrador
- Quiero seleccionar categorías predefinidas al crear/editar productos
- Para organizar el catálogo en secciones lógicas

Criterios de aceptación:
- Dado que estoy en el formulario de producto
  Cuando hago click en dropdown de Categoría
  Entonces veo una lista de categorías cargadas desde el API
- Dado que las categorías se están cargando
  Cuando el usuario hace click en el dropdown
  Entonces veo un spinner "⏳ Cargando categorías..."
- Dado que selecciono una categoría
  Cuando cambio de categoría
  Entonces el formulario actualiza el valor de categoryId

Trazabilidad técnica:
- Category Service: [src/app/features/admin/categories/category.service.ts](src/app/features/admin/categories/category.service.ts)
- Category Model: [src/app/features/admin/categories/category.model.ts](src/app/features/admin/categories/category.model.ts)
- Form Fields Component: [src/app/features/admin/products/components/admin-product-form-fields/admin-product-form-fields.component.ts](src/app/features/admin/products/components/admin-product-form-fields/admin-product-form-fields.component.ts)

DoD:
- GET /api/categories retorna lista paginada.
- Spinner visible durante carga de categorías.
- Dropdown deshabilitado mientras carga.
- Sin errores de consola.
- 5+ tests de CategoryService pasando.

---

### HU-FE-073 — Listar Órdenes en Panel Administrativo
- Como Administrador
- Quiero ver todas las órdenes del sistema con sus detalles
- Para monitorear el estado de ventas y entregas

Criterios de aceptación:
- Dado que accedo a "/admin/orders"
  Cuando la página carga
  Entonces veo una tabla/lista con columnas: ID, Usuario, Total, Estado, Fecha, Acciones
- Dado que hay muchas órdenes
  Cuando se renderiza la tabla
  Entonces veo paginación o scroll infinito para grandes volúmenes
- Dado que la tabla está cargando
  Cuando hago esperar
  Entonces veo un spinner visual

Trazabilidad técnica:
- Order List Component: [src/app/features/admin/orders/pages/admin-order-list/admin-order-list.component.ts](src/app/features/admin/orders/pages/admin-order-list/admin-order-list.component.ts)
- Admin Order Facade: [src/app/features/admin/orders/admin-order.facade.ts](src/app/features/admin/orders/admin-order.facade.ts)
- Admin Order Service: [src/app/features/admin/orders/admin-order.service.ts](src/app/features/admin/orders/admin-order.service.ts)

DoD:
- Tabla carga datos del API GET /api/orders.
- Columnas alineadas y datos formateados correctamente.
- Spinner visible durante carga.
- Responsive en mobile.
- 8+ tests pasando (facade + service + component).

---

### HU-FE-074 — Ver Detalles de Orden
- Como Administrador
- Quiero ver detalles completos de una orden (items, precios, cliente, estado)
- Para verificar información de venta y facilitar atención al cliente

Criterios de aceptación:
- Dado que estoy viendo la tabla de órdenes
  Cuando hago click en una orden
  Entonces se abre un panel de detalles o se navega a una página de detalles
- Dado que veo los detalles
  Cuando la página carga
  Entonces veo: items comprados, cantidades, precios unitarios, subtotal, descuentos, total final, datos del cliente, fecha y estado

Trazabilidad técnica:
- Order Detail Component: [src/app/features/orders/components/order-detail/order-detail.component.ts](src/app/features/orders/components/order-detail/order-detail.component.ts) (reutilizado)
- Admin Order Facade: [src/app/features/admin/orders/admin-order.facade.ts](src/app/features/admin/orders/admin-order.facade.ts)

DoD:
- Detalles renderizados correctamente.
- Datos formateados (moneda, fecha, etc).
- Sin errores de consola.
- Responsive en mobile.

---

### HU-FE-075 — Actualizar Estado de Orden
- Como Administrador
- Quiero cambiar el estado de una orden (ej: PENDIENTE → ENVIADA → ENTREGADA)
- Para mantener el sistema sincronizado con el estado real de la entrega

Criterios de aceptación:
- Dado que estoy viendo los detalles de una orden
  Cuando hago click en dropdown de Estado
  Entonces veo opciones: PENDIENTE, PROCESANDO, ENVIADA, ENTREGADA, CANCELADA
- Dado que selecciono un nuevo estado
  Cuando hago click en "Guardar"
  Entonces se envía PATCH a /api/orders/{id}/status y se actualiza el estado
- Dado que hay un error al actualizar
  Cuando el servidor responde con error
  Entonces veo un mensaje de error sin perder el estado anterior

Trazabilidad técnica:
- Admin Order Service: [src/app/features/admin/orders/admin-order.service.ts](src/app/features/admin/orders/admin-order.service.ts)
- Admin Order Facade: [src/app/features/admin/orders/admin-order.facade.ts](src/app/features/admin/orders/admin-order.facade.ts)

DoD:
- Estado se actualiza via PATCH /api/orders/{id}/status.
- Dropdown muestra estados válidos.
- Confirmación visual post-actualización.
- Manejo de errores robusto.
- 4+ tests pasando.

---

### HU-FE-076 — Interfaz Moderna y Responsiva del Admin Panel
- Como Administrador
- Quiero usar un panel administrativo moderno, rápido y visualmente atractivo
- Para tener una experiencia profesional y eficiente al gestionar la plataforma

Criterios de aceptación:
- Dado que accedo al panel admin
  Cuando la página carga
  Entonces veo colores en gradientes (púrpura/violeta), iconos modelos (Material/Emoji) y animaciones suaves
- Dado que redimensiono la ventana
  Cuando el layout se adapta
  Entonces todos los elementos se reorganizan correctamente (responsive design)
- Dado que me desplazo por tablas y formularios
  Cuando interactúo
  Entonces hay retroalimentación visual (hover, active, focus) clara y accesible

Trazabilidad técnica:
- Admin Layout SCSS: [src/app/features/admin/admin-layout.component.scss](src/app/features/admin/admin-layout.component.scss)
- Product Table SCSS: [src/app/features/admin/products/components/admin-product-table/admin-product-table.component.scss](src/app/features/admin/products/components/admin-product-table/admin-product-table.component.scss)
- Form Fields SCSS: [src/app/features/admin/products/components/admin-product-form-fields/admin-product-form-fields.component.scss](src/app/features/admin/products/components/admin-product-form-fields/admin-product-form-fields.component.scss)

DoD:
- Gradientes aplicados en sidebar y botones.
- Iconos visibles y consistentes.
- Transiciones suaves (250-350ms).
- Mobile-first responsive design (320px+).
- Pasa WCAG 2.1 AA accessibility checks.

---

### HU-FE-077 — Tests Automatizados para Panel Admin (300+ Tests)
- Como Desarrollador
- Quiero tener tests automatizados que verifiquen funcionalidad del admin panel
- Para garantizar calidad, regresar bugs y facilitar refactoring con confianza

Criterios de aceptación:
- Dado que ejecuto `npm run test`
  Cuando los tests corren
  Entonces todos los tests pasan sin errores (300+)
- Dado que ejecuto `npm run test:coverage`
  Cuando se genera el reporte
  Entonces la cobertura es ≥82% en líneas y funciones
- Dado que creo un componente nuevo
  Cuando escribo tests para él
  Entonces sigo patrón AAA (Arrange-Act-Assert) con BehaviorSubject para estado observable

Trazabilidad técnica:
- Test Files:
  - [src/app/features/admin/products/admin-product.facade.spec.ts](src/app/features/admin/products/admin-product.facade.spec.ts)
  - [src/app/features/admin/products/admin-product.service.spec.ts](src/app/features/admin/products/admin-product.service.spec.ts)
  - [src/app/features/admin/categories/category.service.spec.ts](src/app/features/admin/categories/category.service.spec.ts)
  - [src/app/features/admin/products/components/admin-product-form-fields/admin-product-form-fields.component.spec.ts](src/app/features/admin/products/components/admin-product-form-fields/admin-product-form-fields.component.spec.ts)
  - Y 32+ más...

DoD:
- 100% de componentes y servicios tienen tests.
- Cobertura ≥82%.
- Tests pasan en CI/CD.
- No hay warnings o errores en ejecución de tests.
- Tiempo total de tests <20s.

---

## 5) Historias Completadas vs Pendientes

### ✅ Completadas en ETAPA 6:
- HU-FE-066: Acceso autenticado y autorizado ✅
- HU-FE-067: Layout con sidebar administrativo ✅
- HU-FE-068: Listar productos en tabla ✅
- HU-FE-069: Crear nuevo producto ✅
- HU-FE-070: Editar producto ✅
- HU-FE-071: Eliminar producto ✅
- HU-FE-072: Gestión de categorías ✅
- HU-FE-073: Listar órdenes ✅
- HU-FE-074: Ver detalles de orden ✅
- HU-FE-075: Actualizar estado de orden ✅
- HU-FE-076: Interfaz moderna y responsiva ✅
- HU-FE-077: 300+ tests con ≥82% cobertura ✅

### 🔄 Pendientes para ETAPA 7+:
- Reportes y analytics administrativos
- Gestión de usuarios y roles
- Auditoría de cambios
- Bulk actions en tablas
- Filtros avanzados de búsqueda
- Exportación de datos (CSV, PDF)
- Notificaciones en tiempo real
- Dashboard con KPIs

---

## 6) Métricas de Éxito (ETAPA 6)

| Métrica | Objetivo | Alcanzado |
|---------|----------|-----------|
| Tests Automatizados | 270+ | ✅ 300 |
| Cobertura de Código | ≥82% | ✅ 82.79% |
| Funcionalidades Admin | 100% | ✅ Completo (CRUD + órdenes) |
| Componentes Nuevos | 8+ | ✅ 13 (Admin Layout, Form, List, etc) |
| Servicios/Facades | 6+ | ✅ 8 (Products, Orders, Categories, + facades) |
| Responsividad | Mobile + Desktop | ✅ Responsive design completo |
| Seguridad | Guards + Roles | ✅ Auth + Role Guards implementados |
| UI/UX | Moderno con gradientes | ✅ Gradientes, iconos, animaciones |

---

## 7) Definición de Hecho General (ETAPA 6)

✅ Todas las 12 historias de usuario están completamente implementadas.
✅ 300 tests automatizados pasan sin errores.
✅ Cobertura de código ≥82%.
✅ Panel administrativo protegido con autenticación y control de roles.
✅ CRUD completo de productos con validación y estados de carga.
✅ Gestión de órdenes con visualización de detalles y actualización de estado.
✅ Categorías dinámicas desde API.
✅ Interfaz moderna con gradientes, iconos y animaciones suaves.
✅ Responsive design en mobile y desktop.
✅ Sin errores TypeScript o de consola.
✅ Código limpio, tipado y escalable.
✅ Documentación completa (HUS_SIXTH_STAGE.md).

---

## 8) Próximos Pasos (ETAPA 7)

1. **Reportes Administrativos**: Ventas, inventario, estadísticas de clientes.
2. **Gestión de Usuarios**: Admin panel para crear/editar usuarios del sistema.
3. **Auditoría**: Log de cambios realizados por administradores.
4. **Filtros Avanzados**: Búsqueda y filtrado complejo en tablas.
5. **Bulk Actions**: Seleccionar múltiples productos/órdenes para acciones en masa.
6. **Exportación de Datos**: CSV, PDF de reportes y listados.
7. **Notificaciones**: Push notifications en tiempo real para estado de órdenes.
8. **Dashboard**: KPI cards con métricas clave (ventas hoy, órdenes pendientes, etc).

---

**Fecha de Entrega**: 12 de enero de 2026  
**Autor**: Nova Commerce Dev Team  
**Versión**: 1.0
