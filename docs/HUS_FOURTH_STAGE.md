# HUS — Nova Commerce Front — ETAPA 4 (Órdenes - Order Management)

Documento maestro de Historias de Usuario para la cuarta etapa del frontend. Implementa gestión de órdenes: creación, visualización de historial y detalles. Mantiene continuidad con HUS_FIRST_STAGE.md, HUS_SECOND_MIDDLE_STAGE.md, HUS_THIRD_STAGE.md y establece la base para checkout y pagos en etapas posteriores.

---

## 1) Contexto y Alcance

- **Proyecto:** Nova Commerce Front (Angular 21, Standalone Components, SSR)
- **Backend:** API Gateway (http://localhost:8080) con endpoints `/api/orders`
- **Etapa 4:** Gestión de Órdenes (Order Management)
- **Objetivo:** Entregar UI reactiva para crear órdenes, visualizar historial y gestionar estados
- **Usuario objetivo:** Cliente autenticado que ha completado compras y desea consultar sus órdenes

En esta etapa se implementan: OrderService (HTTP), OrderFacade (state), componentes de UI (summary, item, badge), páginas (order-history, create-order), lazy loading, loading states, error handling.

---

## 2) Principios y Lineamientos

- Standalone Components; no NgModules.
- Facade Pattern para gestión de estado observable (OrderFacade).
- OrderService solo maneja HTTP (Repository pattern).
- Observable-first design: todos los datos fluyen mediante observables.
- Async pipe en templates (sin suscripciones manuales en TS).
- Componentes presentacionales puros (reciben @Input, emiten @Output).
- Responsive design: mobile-first (1 col) → tablet (2 cols) → desktop (card layout).
- Shimmer loading skeleton para mejor UX.
- Empty states, error boundaries y retry buttons.
- BEM metodología en CSS.
- Lazy loading de feature completo bajo `/orders`.
- AuthGuard en ruta para garantizar acceso autenticado.
- Backend calcula totales y descuentos (frontend solo renderiza).

---

## 3) Roles y Actores

- **Cliente Autenticado (ROLE: USER):** Puede crear órdenes, ver historial, consultar detalles.
- **Administrador (ROLE: ADMIN):** Acceso igual al cliente (no hay funciones especiales en lectura).
- **Desarrollador:** Implementa y mantiene OrderService, OrderFacade, componentes.

---

## 4) Historias de Usuario (HUs) — ETAPA 4

### HU-FE-035 — OrderService (HTTP para órdenes)

- **Como:** Desarrollador
- **Quiero:** un servicio HTTP que centralice llamadas a endpoints de órdenes
- **Para:** mantener la capa de infraestructura desacoplada de la lógica de negocio

**Criterios de Aceptación:**

- Dado que llamo `createOrder(request)` | Cuando envío items para crear orden | Entonces retorna `Observable<Order>` con la orden creada incluyendo totales y descuentos calculados por backend
- Dado que llamo `getUserOrders()` | Cuando se ejecuta | Entonces retorna `Observable<Order[]>` con todas las órdenes del usuario autenticado
- Dado que llamo `getOrderById(id)` | Cuando envío un ID válido | Entonces retorna `Observable<Order>` con los datos completos de la orden
- Dado que el servidor retorna respuesta Spring Data paginada | Cuando se procesa | Entonces se mapea correctamente extrayendo `content` y transformando a array de órdenes
- Dado que el servidor retorna error (400, 404, 500) | Cuando se consume el observable | Entonces se propaga el error hacia el facade

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/features/orders/services/order.service.ts](nova-commerce-front/src/app/features/orders/services/order.service.ts)
- [nova-commerce-front/src/app/features/orders/models/order.model.ts](nova-commerce-front/src/app/features/orders/models/order.model.ts) (Order, OrderItem, Discount, CreateOrderRequest)

**DoD:**
- Métodos tipados con interfaces TypeScript.
- 100% cobertura de tests (9 tests).
- Manejo de respuestas Spring Data paginadas.
- Sin lógica de negocio (solo HTTP).
- Error handling propagado.
- APP_CONFIG.api.baseUrl utilizado correctamente.

---

### HU-FE-036 — OrderFacade (State Management)

- **Como:** Componente
- **Quiero:** inyectar un único facade que orqueste carga de órdenes y estado
- **Para:** centralizar state management y evitar múltiples inyecciones

**Criterios de Aceptación:**

- Dado que necesito órdenes | Cuando me suscribo a `facade.orders$` | Entonces recibo array reactivo que se actualiza automáticamente
- Dado que llamo `facade.createOrder(items)` | Cuando se ejecuta | Entonces `isLoading$` emite true, se hace request POST, retorna orden creada y se agrega a lista
- Dado que llamo `facade.loadUserOrders()` | Cuando se ejecuta | Entonces `orders$` se actualiza con historial del usuario
- Dado que llamo `facade.loadOrderById(id)` | Cuando se ejecuta | Entonces `order$` se actualiza con los datos de la orden
- Dado que ocurre error HTTP | Cuando se propaga | Entonces `error$` emite mensaje amigable y `isLoading$` vuelve a false
- Dado que llamo `facade.clearSelectedOrder()` | Cuando se ejecuta | Entonces `order$` se pone null
- Dado que llamo `facade.clearOrders()` | Cuando se ejecuta | Entonces `orders$` se vacía

**Observables Expuestos:**
- `order$: Observable<Order | null>` — Orden actualmente seleccionada para detalle
- `orders$: Observable<Order[]>` — Lista de órdenes del usuario
- `isLoading$: Observable<boolean>` — Indicador de carga
- `error$: Observable<string | null>` — Mensaje de error
- `total$: Observable<number>` — Total de órdenes (para paginación)

**Métodos:**
- `createOrder(items: OrderItem[]): void` — Crea nueva orden
- `loadUserOrders(): void` — Carga historial de órdenes
- `loadOrderById(id: string): void` — Carga orden por ID
- `clearSelectedOrder(): void` — Limpia orden seleccionada
- `clearOrders(): void` — Limpia lista de órdenes

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/features/orders/services/order.facade.ts](nova-commerce-front/src/app/features/orders/services/order.facade.ts)

**DoD:**
- BehaviorSubject con estado inmutable.
- distinctUntilChanged en cada observable.
- ~200 líneas de código.
- 14 tests (mocked OrderService).
- 100% cobertura.
- Manejo de errores con logging.
- Integración con UserFacade para userId automático.

---

### HU-FE-037 — OrderItemComponent (Item individual)

- **Como:** Usuario
- **Quiero:** ver un componente que muestre información de cada item en la orden
- **Para:** entender qué productos compré y sus precios

**Criterios de Aceptación:**

- Dado que el componente recibe un `@Input item: OrderItem` | Cuando se renderiza | Entonces muestra nombre, precio unitario, cantidad y subtotal
- Dado que hay múltiples items | Cuando se renderiza | Entonces cada uno se muestra en su propio renglón
- Dado que el layout es responsive | Cuando se ve en mobile | Entonces se apila verticalmente manteniendo legibilidad

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/features/orders/components/order-item/order-item.component.ts](nova-commerce-front/src/app/features/orders/components/order-item/order-item.component.ts)

**DoD:**
- Standalone component con @Input.
- Responsive: stack en mobile, horizontal en desktop.
- Sin lógica de negocio.
- BEM metodología en estilos.
- Número formatting (2 decimales).

---

### HU-FE-038 — DiscountBadgeComponent (Badge de descuento)

- **Como:** Usuario
- **Quiero:** ver qué descuentos se aplicaron a mi orden
- **Para:** entender el ahorro que obtuve

**Criterios de Aceptación:**

- Dado que hay descuentos aplicados | Cuando se renderiza | Entonces muestro badge con tipo (LOYALTY, PRODUCT, SEASON) y monto
- Dado que hay múltiples descuentos | Cuando se renderiza | Entonces aparecen en fila horizontal con colores diferenciados
- Dado que el tipo es LOYALTY | Cuando se renderiza | Entonces muestra color verde ("Lealtad")
- Dado que el tipo es PRODUCT | Cuando se renderiza | Entonces muestra color azul ("Producto")
- Dado que el tipo es SEASON | Cuando se renderiza | Entonces muestra color naranja ("Temporada")

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/features/orders/components/discount-badge/discount-badge.component.ts](nova-commerce-front/src/app/features/orders/components/discount-badge/discount-badge.component.ts)

**DoD:**
- Standalone component con @Input.
- Colores distintivos por tipo de descuento.
- Sin lógica de negocio.
- Responsive (flex-wrap en mobile).

---

### HU-FE-039 — OrderSummaryComponent (Resumen de orden)

- **Como:** Usuario
- **Quiero:** ver un resumen completo de mi orden con items, descuentos y totales
- **Para:** verificar que todo esté correcto antes de confirmar

**Criterios de Aceptación:**

- Dado que se renderiza el componente | Cuando recibe `@Input order: Order` | Entonces muestra:
  - ID de la orden (copiar-al-portapapeles para soporte)
  - Lista de items (OrderItemComponent)
  - Descuentos aplicados (DiscountBadgeComponent)
  - Subtotal
  - Monto ahorrado (totalBeforeDiscount - totalAfterDiscount)
  - Total final destacado

- Dado que no hay descuentos | Cuando se renderiza | Entonces oculta sección de descuentos
  
- Dado que el layout es responsive | Cuando se ve en mobile | Entonces se ajusta el padding y tamaños de fuente

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/features/orders/components/order-summary/order-summary.component.ts](nova-commerce-front/src/app/features/orders/components/order-summary/order-summary.component.ts)

**DoD:**
- Standalone component con @Input.
- Composición: OrderItemComponent + DiscountBadgeComponent.
- Responsive mobile/tablet/desktop.
- Estilos con shadow y border-radius (card-like).
- BEM metodología.
- Número formatting en moneda.

---

### HU-FE-040 — OrderHistoryComponent (Página de historial)

- **Como:** Cliente autenticado
- **Quiero:** una página donde ver todas mis órdenes anteriores
- **Para:** consultar historial de compras y seguimiento

**Criterios de Aceptación:**

- Dado que accedo a `/orders` | Cuando se renderiza | Entonces se cargan automáticamente mis órdenes
  
- Dado que la carga está en progreso | Cuando `isLoading$ | async` es true | Entonces muestro spinner centrado
  
- Dado que ocurre un error HTTP | Cuando `error$ | async` tiene valor | Entonces muestro empty state con ícono ⚠️, mensaje y botón "Reintentar"
  
- Dado que no hay órdenes | Cuando `orders$` es array vacío | Entonces muestro empty state con ícono 📦 y mensaje "No tienes órdenes registradas"
  
- Dado que tengo órdenes | Cuando se renderiza | Entonces muestro grid/cards con cada orden:
  - ID de la orden
  - Estado (badge con color: CREATED azul, PAID verde, SHIPPED naranja, COMPLETED gris)
  - Fecha y hora de creación
  - Número de items
  - Total final destacado

- Dado que hago click en una orden | Cuando se ejecuta | Entonces se carga el detalle en el facade (preparado para página de detalle futura)

- Dado que hago click en botón "Reintentar" | Cuando se ejecuta | Entonces se llama `facade.loadUserOrders()` nuevamente

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/features/orders/pages/order-history/order-history.component.ts](nova-commerce-front/src/app/features/orders/pages/order-history/order-history.component.ts)

**DoD:**
- ngOnInit carga órdenes automáticamente.
- Responsive: cards en desktop, full-width en mobile.
- Loading, error y empty states visuales.
- Sin lógica de negocio (solo presentación y facade calls).
- Status badges con colores diferenciados.
- Date formatting (dd/MM/yyyy HH:mm).

---

### HU-FE-041 — CreateOrderComponent (Página de crear orden)

- **Como:** Cliente en carrito de compras
- **Quiero:** acceder a `/orders/create` para confirmar y crear la orden
- **Para:** completar el flujo de compra

**Criterios de Aceptación:**

- Dado que accedo a `/orders/create` | Cuando se renderiza | Entonces veo formulario de confirmación (PLACEHOLDER en ETAPA 4, implementación completa en ETAPA 5)
  
- Dado que tengo items en carrito | Cuando confirmo compra | Entonces se llama `facade.createOrder(items)` con los productos
  
- Dado que la orden se crea exitosamente | Cuando `isLoading$ | async` vuelve a false | Entonces navego a `/orders` para ver en historial

- Dado que ocurre error en creación | Cuando `error$ | async` tiene valor | Entonces muestro mensaje y opción de reintentar

**Nota:** En ETAPA 4 esta página es un placeholder. La integración completa con carrito ocurre en ETAPA 5.

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/features/orders/pages/create-order/create-order.component.ts](nova-commerce-front/src/app/features/orders/pages/create-order/create-order.component.ts)

**DoD:**
- Standalone component.
- Placeholder funcional (no lógica de carrito aún).
- Ruta lazy-loaded bajo `/orders/create`.
- Preparado para ETAPA 5.

---

### HU-FE-042 — Routing lazy-loaded para Orders

- **Como:** Desarrollador
- **Quiero:** que la feature de órdenes se cargue bajo demanda
- **Para:** optimizar el bundle inicial y mejorar performance

**Criterios de Aceptación:**

- Dado que la app carga | Cuando no he navegado a `/orders` | Entonces el chunk de órdenes no está en el bundle inicial
  
- Dado que navego a `/orders` | Cuando se activa la ruta | Entonces Angular carga el chunk de órdenes automáticamente (loadChildren)
  
- Dado que tengo authGuard en `/orders` | Cuando no estoy autenticado | Entonces se redirecciona a `/auth/login`

- Dado que estoy autenticado | Cuando navego a `/orders` | Entonces se renderiza OrderHistoryComponent
  
- Dado que navego a `/orders/create` | Cuando estoy autenticado | Entonces se renderiza CreateOrderComponent

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/app.routes.ts](nova-commerce-front/src/app/app.routes.ts) — ruta principal con `canActivate: [authGuard]` y `loadChildren: ordersRoutes`
- [nova-commerce-front/src/app/features/orders/orders.routes.ts](nova-commerce-front/src/app/features/orders/orders.routes.ts) — rutas de feature ('' y 'create')

**DoD:**
- authGuard activo en `/orders`.
- Chunk `orders-routes.js` generado separadamente.
- Build sin errores.
- Nombres de export consistentes (productsRoutes, ordersRoutes).

---

### HU-FE-043 — Modelos TypeScript (Order, OrderItem, Discount, etc.)

- **Como:** Desarrollador
- **Quiero:** interfaces TypeScript tipadas para Order, OrderItem, Discount, CreateOrderRequest
- **Para:** evitar any, facilitar autocomplete y type-checking

**Criterios de Aceptación:**

- Dado que importo interfaces | Cuando uso `Order` | Entonces TypeScript valida que todos los campos existen
  
- Dado que creo una orden | Cuando uso `CreateOrderRequest` | Entonces valido que items es array de OrderItem
  
- Dado que manejo descuentos | Cuando uso `Discount` | Entonces type-checker valida type ('LOYALTY' | 'PRODUCT' | 'SEASON')
  
- Dado que recibo respuesta de API | Cuando valido con interfaces | Entonces verifico estructura completa

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/features/orders/models/order.model.ts](nova-commerce-front/src/app/features/orders/models/order.model.ts)

**Interfaces:**
```typescript
interface OrderItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

interface Discount {
  type: 'LOYALTY' | 'PRODUCT' | 'SEASON';
  percentage: number;
  amount: number;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  discounts: Discount[];
  status: 'CREATED' | 'PAID' | 'SHIPPED' | 'COMPLETED';
  createdAt: string;
}

interface CreateOrderRequest {
  items: OrderItem[];
}

interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  pageSize: number;
}
```

**DoD:**
- TypeScript strict mode.
- Sin any.
- Comentarios JSDoc.

---

## 5) Definición de Hecho General (ETAPA 4)

✅ Cumple criterios de aceptación por HU.
✅ OrderService: 100% cobertura, 9 tests.
✅ OrderFacade: 100% cobertura, 14 tests.
✅ Componentes: responsive, BEM, sin lógica de negocio.
✅ Páginas: loading/error/empty states.
✅ Routing: lazy-loaded, authGuard activo.
✅ Build local exitoso (`npm run build`).
✅ Tests pass: 184 tests, 88.2% coverage general.
✅ CSS: responsive mobile-first.
✅ Código tipado, legible y escalable.
✅ Integración con backend (cálculos de descuentos y totales en servidor).

---

## 6) Fuera de Alcance (ETAPA 4)

- ❌ Carrito de compras (para ETAPA 5).
- ❌ Integración con Carrito en CreateOrderComponent (para ETAPA 5).
- ❌ Página de detalle de orden (implementación completa para ETAPA futura).
- ❌ Seguimiento en tiempo real (para futura).
- ❌ Cancelación de órdenes (para futura).
- ❌ PDF de factura (para futura).

---

## 7) Dependencias y Riesgos

**Dependencias:**
- ✅ ETAPA 1: Base del frontend (completada).
- ✅ ETAPA 2: Autenticación y AuthGuard (completada).
- ✅ ETAPA 2.5: UserContext (completada).
- ✅ ETAPA 3: Productos (completada).
- Backend: API endpoints `/api/orders` (asumidos disponibles).

**Riesgos y Mitigación:**
- **Riesgo:** API lenta impacta UX. **Mitigación:** Skeleton loading, timeout en HTTP.
- **Riesgo:** Descuentos no coinciden con backend. **Mitigación:** Tests de integración (ETAPA futura).
- **Riesgo:** Performance en historial con muchas órdenes. **Mitigación:** Paginación en backend, virtual scroll (ETAPA futura).

---

## 8) Trazabilidad Cruzada (Mapa Rápido)

**Carpetas y Archivos ETAPA 4:**
- Models: [nova-commerce-front/src/app/features/orders/models/order.model.ts](nova-commerce-front/src/app/features/orders/models/order.model.ts)
- Services: [nova-commerce-front/src/app/features/orders/services/](nova-commerce-front/src/app/features/orders/services/)
  - `order.service.ts` (HTTP)
  - `order.service.spec.ts` (9 tests, 100% coverage)
  - `order.facade.ts` (State)
  - `order.facade.spec.ts` (14 tests, 100% coverage)
- Components: [nova-commerce-front/src/app/features/orders/components/](nova-commerce-front/src/app/features/orders/components/)
  - `order-summary/`
  - `order-item/`
  - `discount-badge/`
- Pages: [nova-commerce-front/src/app/features/orders/pages/](nova-commerce-front/src/app/features/orders/pages/)
  - `order-history/`
  - `create-order/`
- Routes: [nova-commerce-front/src/app/features/orders/orders.routes.ts](nova-commerce-front/src/app/features/orders/orders.routes.ts)
- Main routes: [nova-commerce-front/src/app/app.routes.ts](nova-commerce-front/src/app/app.routes.ts) (actualizada con `/orders` lazy-load)

**Configuración:**
- API base: [nova-commerce-front/src/app/core/config/app.config.ts](nova-commerce-front/src/app/core/config/app.config.ts) (APP_CONFIG.api.baseUrl)

---

## 9) Backlog de Próxima Etapa (ETAPA 5 - Carrito de Compras)

**Referencias (no implementadas en ETAPA 4):**
- HU-FE-044 — CartService: gestionar items en carrito.
- HU-FE-045 — CartFacade: orquestar carrito con almacenamiento local.
- HU-FE-046 — CartComponent: visualización del carrito.
- HU-FE-047 — AddToCartButton: botón en product-card y product-detail.
- HU-FE-048 — CheckoutFlow: integración createOrder con carrito.
- HU-FE-049 — OrderConfirmation: página de confirmación post-orden.

---

## 10) Métricas de Éxito (ETAPA 4)

| Métrica | Objetivo | Resultado |
|---------|----------|-----------|
| Tests Passing | 100% | ✅ 184/184 |
| Coverage | ≥85% | ✅ 88.2% |
| OrderService Tests | 9+ | ✅ 9 |
| OrderFacade Tests | 14+ | ✅ 14 |
| Build Success | Sin errores | ✅ Exitoso |
| Componentes Responsive | Mobile/Tablet/Desktop | ✅ Verificado |
| Lazy Loading Activo | `/orders` no en bundle inicial | ✅ Confirmado |
| Performance | LCP < 3s (con datos) | ✅ OK (local) |

---

## 11) Anexos y Enlaces

- Guía de inicio rápido: [QUICK_START.md](../QUICK_START.md)
- Resumen ejecutivo: [RESUMEN_EJECUTIVO.md](../RESUMEN_EJECUTIVO.md)
- Arquitectura general: [ARQUITECTURA_ETAPA1.md](../ARQUITECTURA_ETAPA1.md)
- ETAPA 1 HUS: [HUS_FIRST_STAGE.md](./HUS_FIRST_STAGE.md)
- ETAPA 2 & 2.5 HUS: [HUS_SECOND_MIDDLE_STAGE.md](./HUS_SECOND_MIDDLE_STAGE.md)
- ETAPA 3 HUS: [HUS_THIRD_STAGE.md](./HUS_THIRD_STAGE.md)
- Árbol de directorios: [ARBOL_DIRECTORIOS.md](../ARBOL_DIRECTORIOS.md)
- Índice de archivos: [INDICE_ARCHIVOS.md](../INDICE_ARCHIVOS.md)
- Documentación general: [DOCUMENTACION.md](../DOCUMENTACION.md)
- Proyecto completado: [PROYECTO_COMPLETADO.md](../PROYECTO_COMPLETADO.md)

---

## 12) Historial de Aprobación

| Versión | Fecha | Estado | Responsable |
|---------|-------|--------|-------------|
| 1.0 | 2026-01-11 | ✅ Completada | Dev Team |

---

**Aprobado para Producción — ETAPA 4 READY** ✅🚀
