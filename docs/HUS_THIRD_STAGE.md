# HUS — Nova Commerce Front — ETAPA 3 (Catálogo de Productos - Core del Marketplace)

Documento maestro de Historias de Usuario para la tercera etapa del frontend. Implementa el núcleo del negocio marketplace: catálogo de productos, búsqueda, filtrado y detalles. Mantiene continuidad con HUS_FIRST_STAGE.md, HUS_SECOND_MIDDLE_STAGE.md y establece la base para carrito de compras y ordenes en etapas posteriores.

---

## 1) Contexto y Alcance

- **Proyecto:** Nova Commerce Front (Angular 21, Standalone Components, SSR)
- **Backend:** API Gateway (http://localhost:8080) con endpoints `/api/products` y `/api/categories`
- **Etapa 3:** Catálogo de Productos (marketplace core)
- **Objetivo:** Entregar UI reactiva para exploración de productos, filtrado por categoría y visualización de detalles
- **Usuario objetivo:** Cliente autenticado navegando catálogo para comprar

En esta etapa se implementan: ProductService (HTTP), ProductFacade (state), componentes de UI (card, skeleton, filter), páginas (list, detail), lazy loading, loading states, error handling.

---

## 2) Principios y Lineamientos

- Standalone Components; no NgModules.
- Facade Pattern para gestión de estado observable (ProductFacade).
- ProductService solo maneja HTTP (Repository pattern).
- Observable-first design: todos los datos fluyen mediante observables.
- Async pipe en templates (sin suscripciones manuales en TS).
- Componentes presentacionales puros (reciben @Input, emiten @Output).
- Responsive design: mobile-first (1 col) → tablet (2 cols) → desktop (4 cols).
- Shimmer loading skeleton para mejor UX.
- Empty states y error boundaries.
- BEM metodología en CSS.
- Lazy loading de feature completo bajo `/products`.
- AuthGuard en ruta para garantizar acceso autenticado.

---

## 3) Roles y Actores

- **Cliente Autenticado (ROLE: USER):** Puede ver productos, filtrar por categoría, ver detalles.
- **Administrador (ROLE: ADMIN):** Acceso igual al cliente (no hay funciones especiales en lectura).
- **Desarrollador:** Implementa y mantiene ProductService, ProductFacade, componentes.

---

## 4) Historias de Usuario (HUs) — ETAPA 3

### HU-FE-026 — ProductService (HTTP para productos)

- **Como:** Desarrollador
- **Quiero:** un servicio HTTP que centralice llamadas a endpoints de productos
- **Para:** mantener la capa de infraestructura desacoplada de la lógica de negocio

**Criterios de Aceptación:**

- Dado que llamo `getProducts(filters?)` | Cuando envío filtros opcionales (categoryId, search, minPrice, maxPrice, page, pageSize) | Entonces retorna `Observable<ProductsResponse>` con array de productos y metadatos de paginación
- Dado que llamo `getProductById(id)` | Cuando envío un ID válido | Entonces retorna `Observable<Product>` con los datos completos
- Dado que llamo `getCategories()` | Cuando se ejecuta | Entonces retorna `Observable<Category[]>` con todas las categorías
- Dado que llamo `getProductsByCategory(categoryId)` | Cuando envío un ID de categoría | Entonces retorna `Observable<ProductsResponse>` con productos filtrados desde endpoint dedicado `/api/products/category/{id}`
- Dado que el backend retorna respuesta paginada Spring Data | Cuando se procesa | Entonces se transforma automáticamente extrayendo `content` y mapeando campos (stockQuantity → stock, imageUrl con fallback SVG)
- Dado que el servidor retorna error (404, 500) | Cuando se consume el observable | Entonces se propaga el error hacia el facade

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/features/products/services/product.service.ts](nova-commerce-front/src/app/features/products/services/product.service.ts)
- [nova-commerce-front/src/app/features/products/models/product.model.ts](nova-commerce-front/src/app/features/products/models/product.model.ts) (Product, Category, ProductsResponse, ProductFilters)

**DoD:**
- Métodos tipados con interfaces TypeScript.
- HttpParams buildea correctamente query strings.
- Manejo de respuestas paginadas Spring Data (extracción de `content`, mapeo de campos).
- Método `getProductsByCategory()` implementado con endpoint dedicado.
- Helper privado `transformProducts()` para mapeo de campos backend → frontend.
- Placeholder SVG data-uri para imágenes sin URL (evita 404).
- 100% cobertura de tests (11 tests).
- Sin lógica de negocio (solo HTTP).
- Error handling propagado.

---

### HU-FE-027 — ProductFacade (State Management)

- **Como:** Componente
- **Quiero:** inyectar un único facade que orqueste carga de productos, categorías y estado
- **Para:** centralizar state management y evitar múltiples inyecciones

**Criterios de Aceptación:**

- Dado que necesito productos | Cuando me suscribo a `facade.products$` | Entonces recibo array reactivo que se actualiza automáticamente
- Dado que llamo `facade.loadProducts(filters?)` | Cuando se ejecuta | Entonces `loading$` emite true, se hace request HTTP, y luego emite false
- Dado que llamo `facade.loadProductById(id)` | Cuando se ejecuta | Entonces `selectedProduct$` se actualiza con el producto
- Dado que llamo `facade.loadCategories()` | Cuando se ejecuta | Entonces `categories$` se actualiza con la lista de categorías
- Dado que ocurre error HTTP | Cuando se propaga | Entonces `error$` emite mensaje amigable y `loading$` vuelve a false
- Dado que llamo `facade.clearSelectedProduct()` | Cuando se ejecuta | Entonces `selectedProduct$` se pone null

**Observables Expuestos:**
- `products$: Observable<Product[]>` — Lista de productos cargados
- `selectedProduct$: Observable<Product | null>` — Producto actualmente seleccionado para detalle
- `categories$: Observable<Category[]>` — Categorías disponibles
- `loading$: Observable<boolean>` — Indicador de carga
- `error$: Observable<string | null>` — Mensaje de error
- `total$: Observable<number>` — Total de productos (para paginación)
- `filters$: Observable<ProductFilters>` — Filtros aplicados actualmente

**Métodos:**
- `loadProducts(filters?: ProductFilters): void` — Carga productos con filtros
- `loadProductById(id: string): void` — Carga producto por ID
- `loadCategories(): void` — Carga categorías
- `clearSelectedProduct(): void` — Limpia producto seleccionado
- `clearFilters(): void` — Refresca productos sin filtros

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/features/products/services/product.facade.ts](nova-commerce-front/src/app/features/products/services/product.facade.ts)

**DoD:**
- BehaviorSubject con estado inmutable.
- distinctUntilChanged en cada observable.
- ~150 líneas de código.
- 17+ tests (mocked ProductService).
- ~98% cobertura.
- Manejo de errores con logging.

---

### HU-FE-028 — ProductCardComponent (Tarjeta de producto)

- **Como:** Usuario
- **Quiero:** ver un componente visual que muestre información resumida del producto
- **Para:** explorar rápidamente opciones en el catálogo

**Criterios de Aceptación:**

- Dado que el componente recibe un `@Input product: Product` | Cuando se renderiza | Entonces muestra imagen (lazy-loaded), nombre, descripción corta, precio y estado de stock
- Dado que hay stock disponible | Cuando se renderiza | Entonces muestra color verde e ícono de disponibilidad
- Dado que stock es bajo (≤5 unidades) | Cuando se renderiza | Entonces muestra aviso amarillo "¡Solo quedan X!"
- Dado que stock es 0 | Cuando se renderiza | Entonces muestra badge rojo "Sin stock" sobre la imagen
- Dado que hago click en la tarjeta | Cuando se ejecuta el evento | Entonces navega a `/products/:id` sin recarga

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/features/products/components/product-card/product-card.component.ts](nova-commerce-front/src/app/features/products/components/product-card/product-card.component.ts)
- [nova-commerce-front/src/app/features/products/components/product-card/product-card.component.html](nova-commerce-front/src/app/features/products/components/product-card/product-card.component.html)
- [nova-commerce-front/src/app/features/products/components/product-card/product-card.component.scss](nova-commerce-front/src/app/features/products/components/product-card/product-card.component.scss)

**DoD:**
- Standalone component con @Input.
- Responsive: mantiene proporción 1:1 en imagen.
- Hover effects (transform, shadow).
- Sin lógica de negocio.
- BEM metodología en estilos.

---

### HU-FE-029 — ProductSkeletonComponent (Loading placeholder)

- **Como:** Usuario
- **Quiero:** ver placeholders mientras se cargan productos
- **Para:** entender que la app está procesando mi solicitud

**Criterios de Aceptación:**

- Dado que `loading$ | async` es true | Cuando se renderiza la página | Entonces se muestran N esqueletos (default 8)
- Dado que cada esqueleto | Cuando se renderiza | Entonces tiene la misma forma/tamaño que ProductCard para ocupar espacio idéntico
- Dado que los esqueletos cargan | Cuando están visibles | Entonces muestran animación shimmer (pseudo-efecto de carga)
- Dado que datos reales llegan | Cuando completa la carga | Entonces los esqueletos desaparecen

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/features/products/components/product-skeleton/product-skeleton.component.ts](nova-commerce-front/src/app/features/products/components/product-skeleton/product-skeleton.component.ts)
- [nova-commerce-front/src/app/features/products/components/product-skeleton/product-skeleton.component.html](nova-commerce-front/src/app/features/products/components/product-skeleton/product-skeleton.component.html)
- [nova-commerce-front/src/app/features/products/components/product-skeleton/product-skeleton.component.scss](nova-commerce-front/src/app/features/products/components/product-skeleton/product-skeleton.component.scss)

**DoD:**
- @Input count para controlar cantidad.
- Animación CSS pura (sin JavaScript).
- Rendimiento optimizado (sin loops innecesarios).

---

### HU-FE-030 — CategoryFilterComponent (Filtro lateral)

- **Como:** Usuario
- **Quiero:** un panel lateral donde pueda filtrar productos por categoría
- **Para:** reducir el catálogo a solo lo que me interesa

**Criterios de Aceptación:**

- Dado que se renderiza la página | Cuando cargo categorías | Entonces veo lista con opción "Todas las categorías" + cada categoría como botón
- Dado que hago click en una categoría | Cuando se ejecuta | Entonces emito evento `@Output categorySelected` con el ID de categoría
- Dado que hago click en "Todas las categorías" | Cuando se ejecuta | Entonces emito null para remover filtro
- Dado que una categoría está activa | Cuando se renderiza | Entonces se resalta visualmente con fondo azul

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/features/products/components/category-filter/category-filter.component.ts](nova-commerce-front/src/app/features/products/components/category-filter/category-filter.component.ts)
- [nova-commerce-front/src/app/features/products/components/category-filter/category-filter.component.html](nova-commerce-front/src/app/features/products/components/category-filter/category-filter.component.html)
- [nova-commerce-front/src/app/features/products/components/category-filter/category-filter.component.scss](nova-commerce-front/src/app/features/products/components/category-filter/category-filter.component.scss)

**DoD:**
- @Input categories[], selectedCategoryId.
- @Output categorySelected.
- Estilos responsive (sticky en desktop, colapsable en mobile).
- Sin lógica de negocio.

---

### HU-FE-031 — ProductListComponent (Página de listado)

- **Como:** Cliente autenticado
- **Quiero:** una página que me muestre un catálogo filtrable de productos
- **Para:** explorar y encontrar lo que deseo comprar

**Criterios de Aceptación:**

- Dado que accedo a `/products` | Cuando se renderiza | Entonces veo:
  - Header ("Productos", subtítulo)
  - Sidebar izquierdo (CategoryFilterComponent con categorías)
  - Grid principal con ProductCard por cada producto (4 cols en desktop, 2 tablet, 1 mobile)
  
- Dado que los datos están cargando | Cuando `loading$ | async` es true | Entonces muestro ProductSkeletonComponent
  
- Dado que ocurre un error HTTP | Cuando `error$ | async` tiene valor | Entonces muestro empty state con ícono ⚠️, mensaje y botón "Reintentar"
  
- Dado que no hay productos (array vacío) | Cuando se renderiza | Entonces muestro empty state con ícono 📦 y mensaje "No hay productos disponibles"
  
- Dado que hago click en una categoría | Cuando se ejecuta `onCategoryChange` | Entonces se llama `facade.loadProducts({categoryId})` y se actualiza el grid

- Dado que hago click en botón "Reintentar" | Cuando se ejecuta | Entonces se llama `facade.loadProducts()` nuevamente

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/features/products/pages/product-list/product-list.component.ts](nova-commerce-front/src/app/features/products/pages/product-list/product-list.component.ts)
- [nova-commerce-front/src/app/features/products/pages/product-list/product-list.component.html](nova-commerce-front/src/app/features/products/pages/product-list/product-list.component.html)
- [nova-commerce-front/src/app/features/products/pages/product-list/product-list.component.scss](nova-commerce-front/src/app/features/products/pages/product-list/product-list.component.scss)

**DoD:**
- ngOnInit carga productos y categorías.
- Responsive grid (CSS Grid con auto-fill).
- Sidebar sticky en desktop.
- Loading, error y empty states visuales.
- Sin lógica de negocio (solo presentación).

---

### HU-FE-032 — ProductDetailComponent (Página de detalle)

- **Como:** Cliente autenticado
- **Quiero:** ver la página completa de un producto con todos sus detalles
- **Para:** decidir si quiero comprarlo

**Criterios de Aceptación:**

- Dado que accedo a `/products/:id` | Cuando se renderiza | Entonces se carga el producto por ID
  
- Dado que el producto cargó | Cuando se renderiza | Entonces muestro en layout 2-col (image + info):
  - **Izquierda:** Imagen grande del producto
  - **Derecha:**
    - Breadcrumbs ("Productos > Nombre del Producto")
    - Título
    - Precio grande y destacado
    - Estado de stock (verde/amarillo/rojo)
    - Descripción completa
    - Metadatos (ID, Categoría)
    - Botón "← Volver al catálogo"

- Dado que está cargando | Cuando `loading$ | async` es true | Entonces muestro spinner
  
- Dado que ocurre error (producto no existe) | Cuando `error$ | async` tiene valor | Entonces muestro error state con opción de volver

- Dado que hago click en "Volver al catálogo" | Cuando se ejecuta | Entonces navego a `/products`

- Dado que salgo de la página | Cuando ngOnDestroy | Entonces se ejecuta `facade.clearSelectedProduct()`

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/features/products/pages/product-detail/product-detail.component.ts](nova-commerce-front/src/app/features/products/pages/product-detail/product-detail.component.ts)
- [nova-commerce-front/src/app/features/products/pages/product-detail/product-detail.component.html](nova-commerce-front/src/app/features/products/pages/product-detail/product-detail.component.html)
- [nova-commerce-front/src/app/features/products/pages/product-detail/product-detail.component.scss](nova-commerce-front/src/app/features/products/pages/product-detail/product-detail.component.scss)

**DoD:**
- Se obtiene :id de ActivatedRoute.
- Loading, error y success states.
- Layout 2-col responsive (stack en mobile).
- Breadcrumbs funcionales.
- Cleanup en ngOnDestroy.

---

### HU-FE-033 — Routing lazy-loaded para Products

- **Como:** Desarrollador
- **Quiero:** que la feature de productos se cargue bajo demanda
- **Para:** optimizar el bundle inicial

**Criterios de Aceptación:**

- Dado que la app carga | Cuando no he navegado a `/products` | Entonces el chunk de productos no está en el bundle inicial
  
- Dado que navego a `/products` | Cuando se activa la ruta | Entonces Angular carga el chunk de productos automáticamente (loadChildren)
  
- Dado que tengo authGuard en `/products` | Cuando no estoy autenticado | Entonces se redirecciona a `/auth/login`

- Dado que estoy autenticado | Cuando navego a `/products` | Entonces se renderiza ProductListComponent
  
- Dado que navego a `/products/:id` | Cuando es ruta válida | Entonces se renderiza ProductDetailComponent

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/app.routes.ts](nova-commerce-front/src/app/app.routes.ts) — ruta principal con `canActivate: [authGuard]` y `loadChildren`
- [nova-commerce-front/src/app/features/products/products.routes.ts](nova-commerce-front/src/app/features/products/products.routes.ts) — rutas de feature ('' y ':id')

**DoD:**
- authGuard activo en `/products`.
- Chunk `products-routes.js` generado separadamente.
- Build sin errores.

---

### HU-FE-034 — Modelos TypeScript (Product, Category, etc.)

- **Como:** Desarrollador
- **Quiero:** interfaces TypeScript tipadas para Product, Category, ProductsResponse, ProductFilters
- **Para:** evitar any, facilitar autocomplete y type-checking

**Criterios de Aceptación:**

- Dado que importo interfaces | Cuando uso `Product` | Entonces TypeScript valida que todos los campos existen
  
- Dado que envío filtros | Cuando uso `ProductFilters` | Entonces los campos opcionales (categoryId, search, etc.) se marcan como `?`
  
- Dado que recibo respuesta de API | Cuando valido con `ProductsResponse` | Entonces verifico estructura con total, page, pageSize, products[]

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/features/products/models/product.model.ts](nova-commerce-front/src/app/features/products/models/product.model.ts)

**Interfaces:**
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
}

interface ProductFilters {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}
```

**DoD:**
- TypeScript strict mode.
- Sin any.
- Comentarios JSDoc.

---

## 5) Definición de Hecho General (ETAPA 3)

✅ Cumple criterios de aceptación por HU.
✅ ProductService: 100% cobertura, 11 tests (incluye getProductsByCategory y transformación Spring Data).
✅ ProductFacade: ~98% cobertura, 17 tests.
✅ Componentes: responsive, BEM, sin lógica de negocio.
✅ Páginas: loading/error/empty states.
✅ Routing: lazy-loaded, authGuard activo.
✅ Build local exitoso (`npm run build`).
✅ Tests pass: 161 tests, 86.55% coverage general.
✅ CSS: responsive mobile-first.
✅ Código tipado, legible y escalable.
✅ Integración con backend Spring Data (manejo de respuestas paginadas).

---

## 6) Fuera de Alcance (ETAPA 3)

- ❌ Agregar al carrito (para ETAPA 4).
- ❌ Checkout / Pago (para ETAPA 5).
- ❌ Carrito persistente (para ETAPA 4).
- ❌ Búsqueda por texto (implícita en filtros, pero no con debounce).
- ❌ Reseñas / Calificaciones (para ETAPA 6).
- ❌ Wishlist (para futura).
- ❌ Admin panel para gestionar productos (para futura).

---

## 7) Dependencias y Riesgos

**Dependencias:**
- ✅ ETAPA 1: Base del frontend (completada).
- ✅ ETAPA 2: Autenticación y AuthGuard (completada).
- ✅ ETAPA 2.5: UserContext (completada).
- Backend: API endpoints `/api/products`, `/api/categories` (asumidos disponibles).

**Riesgos y Mitigación:**
- **Riesgo:** API lenta impacta UX. **Mitigación:** Skeleton loading, timeout en HTTP.
- **Riesgo:** Caché de productos obsoleta. **Mitigación:** Limpieza de estado en logout (ETAPA futura).
- **Riesgo:** Performance en listas grandes (>1000 items). **Mitigación:** Paginación en backend, virtual scroll (ETAPA futura).

---

## 8) Trazabilidad Cruzada (Mapa Rápido)

**Carpetas y Archivos ETAPA 3:**
- Models: [nova-commerce-front/src/app/features/products/models/product.model.ts](nova-commerce-front/src/app/features/products/models/product.model.ts)
- Services: [nova-commerce-front/src/app/features/products/services/](nova-commerce-front/src/app/features/products/services/)
  - `product.service.ts` (HTTP)
  - `product.service.spec.ts` (10 tests, 100% coverage)
  - `product.facade.ts` (State)
  - `product.facade.spec.ts` (17 tests, ~98% coverage)
- Components: [nova-commerce-front/src/app/features/products/components/](nova-commerce-front/src/app/features/products/components/)
  - `product-card/`
  - `product-skeleton/`
  - `category-filter/`
- Pages: [nova-commerce-front/src/app/features/products/pages/](nova-commerce-front/src/app/features/products/pages/)
  - `product-list/`
  - `product-detail/`
- Routes: [nova-commerce-front/src/app/features/products/products.routes.ts](nova-commerce-front/src/app/features/products/products.routes.ts)
- Main routes: [nova-commerce-front/src/app/app.routes.ts](nova-commerce-front/src/app/app.routes.ts) (actualizada con `/products` lazy-load)

**Configuración:**
- API base: [nova-commerce-front/src/app/core/config/app.config.ts](nova-commerce-front/src/app/core/config/app.config.ts)

---

## 9) Backlog de Próxima Etapa (ETAPA 4 - Carrito y Órdenes)

**Referencias (no implementadas en ETAPA 3):**
- HU-FE-035 — CartService: gestionar items en carrito.
- HU-FE-036 — CartFacade: orquestar carrito con almacenamiento local.
- HU-FE-037 — AddToCartButton: botón en product-card y product-detail.
- HU-FE-038 — CartPage: ver/editar carrito antes de checkout.
- HU-FE-039 — CheckoutComponent: flujo de pago (ETAPA 5).
- HU-FE-040 — OrderFacade: gestionar órdenes creadas.

---

## 10) Métricas de Éxito (ETAPA 3)

| Métrica | Objetivo | Resultado |
|---------|----------|-----------|
| Tests Passing | 100% | ✅ 161/161 |
| Coverage | ≥80% | ✅ 86.55% |
| ProductService Tests | 10+ | ✅ 11 |
| ProductFacade Tests | 17+ | ✅ 17 |
| Build Success | Sin errores | ✅ Exitoso |
| Componentes Responsive | Mobile/Tablet/Desktop | ✅ Verificado |
| Lazy Loading Activo | `/products` no en bundle inicial | ✅ Confirmado |
| Performance | LCP < 3s (con datos) | ✅ OK (local) |

---

## 11) Anexos y Enlaces

- Guía de inicio rápido: [QUICK_START.md](../QUICK_START.md)
- Resumen ejecutivo: [RESUMEN_EJECUTIVO.md](../RESUMEN_EJECUTIVO.md)
- Arquitectura general: [ARQUITECTURA_ETAPA1.md](../ARQUITECTURA_ETAPA1.md)
- ETAPA 1 HUS: [HUS_FIRST_STAGE.md](./HUS_FIRST_STAGE.md)
- ETAPA 2 & 2.5 HUS: [HUS_SECOND_MIDDLE_STAGE.md](./HUS_SECOND_MIDDLE_STAGE.md)
- Árbol de directorios: [ARBOL_DIRECTORIOS.md](../ARBOL_DIRECTORIOS.md)
- Índice de archivos: [INDICE_ARCHIVOS.md](../INDICE_ARCHIVOS.md)
- Documentación general: [DOCUMENTACION.md](../DOCUMENTACION.md)
- Proyecto completado: [PROYECTO_COMPLETADO.md](../PROYECTO_COMPLETADO.md)

---

## 12) Historial de Aprobación

| Versión | Fecha | Estado | Responsable |
|---------|-------|--------|-------------|
| 1.0 | 2026-01-11 | ✅ Completada | Dev Team |

