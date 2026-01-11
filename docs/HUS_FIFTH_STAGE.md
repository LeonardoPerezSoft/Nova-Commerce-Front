# HUS — Nova Commerce Front — ETAPA 5 (Carrito de Compras)

Documento maestro de Historias de Usuario para la quinta etapa del frontend (carrito de compras). Mantiene el mismo espíritu y criterios que los documentos HUS anteriores: claridad de alcance, criterios de aceptación verificables, trazabilidad técnica, Definición de Hecho y preparación para etapas siguientes.

---

## 1) Contexto y Alcance

- Proyecto: Nova Commerce Front (Angular 21, Standalone Components, SSR)
- Backend: Microservicios detrás de API Gateway (http://localhost:8080)
- Etapa actual: ETAPA 5 — Carrito de Compras
- Objetivo: Implementar funcionalidad completa de carrito de compras con persistencia en sessionStorage, integración con productos y órdenes, y UI responsiva.

En esta etapa SE implementan: Gestión de carrito (agregar, modificar, eliminar items), persistencia local, componentes UI de carrito, integración con ProductCard y Header, página dedicada de carrito, y checkout delegation hacia OrderFacade.

---

## 2) Principios y Lineamientos

- **Patrón Facade**: CartFacade como única fuente de verdad para el estado del carrito.
- **Observable-first**: RxJS BehaviorSubject con operadores (distinctUntilChanged).
- **Persistencia ligera**: sessionStorage para carrito temporal (se limpia al cerrar navegador).
- **Zero business logic en componentes**: Toda lógica reside en CartFacade.
- **Responsive design**: Mobile-first con layouts adaptativos.
- **Lazy loading**: Rutas de carrito cargadas bajo demanda.
- **Testing exhaustivo**: 69 nuevos tests con cobertura del 100% en facades y servicios.

---

## 3) Roles y Actores

- **Usuario Autenticado (USER)**: Usuario con sesión activa que puede gestionar su carrito y realizar checkout.
- **Visitante**: Usuario no autenticado que no tiene acceso al carrito (protegido por authGuard).

---

## 4) Arquitectura de ETAPA 5

### Modelos
- **CartItem**: Interface para items en el carrito (productId, name, price, quantity, imageUrl, categoryId).
- **Cart**: Interface para estado completo del carrito (items[], totalItems, totalAmount, lastUpdated).
- **CartState**: Type-safe state interface para gestión interna.

### Servicios
- **CartStorageService**: Abstracción de sessionStorage para persistencia (saveCart, getCart, clearCart).
- **CartFacade**: Orquestador de estado del carrito (~250 líneas):
  - Observables: cart$, items$, totalItems$, totalAmount$, isEmpty$
  - Métodos: addItem, removeItem, updateQuantity, clearCart, checkout, getQuantity

### Componentes
- **CartItemComponent**: Renderiza item individual con controles de cantidad.
- **CartSummaryComponent**: Muestra totales y botón de checkout.
- **CartIconComponent**: Icono de carrito con badge para el header.
- **CartPageComponent**: Página completa del carrito con lista de items y estado vacío.

### Rutas
- **/cart**: Ruta lazy-loaded protegida por authGuard.

---

## 5) Historias de Usuario (HUs)

### HU-FE-044 — Agregar producto al carrito desde catálogo
- **Como** Usuario Autenticado
- **Quiero** agregar productos al carrito desde el catálogo
- **Para** acumular items que deseo comprar

**Criterios de aceptación (Gherkin):**
```gherkin
Dado que estoy viendo el catálogo de productos
Cuando hago click en el botón "Agregar al carrito" de un producto
Entonces el producto se agrega al carrito con cantidad = 1
Y veo un feedback visual de "Agregando..."
Y el contador del icono del carrito se incrementa en 1

Dado que un producto ya está en el carrito
Cuando vuelvo a agregar el mismo producto
Entonces la cantidad del item se incrementa en 1
Y el total del carrito se actualiza
```

**Trazabilidad técnica:**
- Facade: [nova-commerce-front/src/app/features/cart/services/cart.facade.ts](nova-commerce-front/src/app/features/cart/services/cart.facade.ts) (método `addItem`)
- Tests: [nova-commerce-front/src/app/features/cart/services/cart.facade.spec.ts](nova-commerce-front/src/app/features/cart/services/cart.facade.spec.ts) (22 tests)
- Integración: ProductCardComponent con botón de agregar al carrito

**Definición de Hecho (DoD):**
- Método `addItem()` incrementa cantidad si el producto existe.
- Crea nuevo CartItem si el producto no existe.
- Actualiza `totalItems` y `totalAmount`.
- Persiste en sessionStorage automáticamente.
- Tests pasando: ✅ 4 tests específicos de addItem.
- Sin errores de consola.

---

### HU-FE-045 — Visualizar ícono de carrito con contador en header
- **Como** Usuario Autenticado
- **Quiero** ver un icono de carrito con el número de items en el header
- **Para** saber cuántos productos tengo sin tener que ir a la página del carrito

**Criterios de aceptación:**
```gherkin
Dado que estoy autenticado
Cuando el header se renderiza
Entonces veo el icono del carrito de compras

Dado que tengo 0 items en el carrito
Cuando se renderiza el icono
Entonces NO veo ningún badge numérico

Dado que tengo N items en el carrito (N > 0)
Cuando se renderiza el icono
Entonces veo un badge circular con el número N

Dado que tengo más de 99 items
Cuando se renderiza el icono
Entonces el badge muestra "99+"

Dado que el badge muestra 10 o más items
Cuando se renderiza
Entonces el badge aumenta de tamaño para mejor visibilidad
```

**Trazabilidad técnica:**
- Componente: [nova-commerce-front/src/app/features/cart/components/cart-icon/cart-icon.component.ts](nova-commerce-front/src/app/features/cart/components/cart-icon/cart-icon.component.ts)
- Template: [nova-commerce-front/src/app/features/cart/components/cart-icon/cart-icon.component.html](nova-commerce-front/src/app/features/cart/components/cart-icon/cart-icon.component.html)
- Estilos: [nova-commerce-front/src/app/features/cart/components/cart-icon/cart-icon.component.scss](nova-commerce-front/src/app/features/cart/components/cart-icon/cart-icon.component.scss)
- Tests: [nova-commerce-front/src/app/features/cart/components/cart-icon/cart-icon.component.spec.ts](nova-commerce-front/src/app/features/cart/components/cart-icon/cart-icon.component.spec.ts) (11 tests)
- Integración: HeaderComponent con CartIconComponent

**DoD:**
- Badge oculto cuando itemCount = 0.
- Badge visible cuando itemCount > 0.
- Muestra "99+" cuando itemCount > 99.
- Clase `large-badge` aplicada cuando itemCount >= 10.
- RouterLink funcional a /cart.
- Tests pasando: ✅ 11/11 tests.
- Responsive en mobile y desktop.

---

### HU-FE-046 — Navegar a la página del carrito
- **Como** Usuario Autenticado
- **Quiero** hacer click en el icono del carrito
- **Para** ver el detalle de todos los items que he agregado

**Criterios de aceptación:**
```gherkin
Dado que estoy autenticado
Cuando hago click en el icono del carrito en el header
Entonces navego a la ruta /cart
Y veo la página del carrito con todos mis items

Dado que intento acceder a /cart sin estar autenticado
Cuando navego a la URL directamente
Entonces soy redirigido al login (authGuard activo)
```

**Trazabilidad técnica:**
- Routing: [nova-commerce-front/src/app/features/cart/cart.routes.ts](nova-commerce-front/src/app/features/cart/cart.routes.ts)
- Root routes: [nova-commerce-front/src/app/app.routes.ts](nova-commerce-front/src/app/app.routes.ts) (ruta /cart con authGuard)
- Guard: authGuard ya implementado en ETAPA 2

**DoD:**
- Ruta /cart lazy-loaded.
- authGuard aplicado correctamente.
- Navegación SPA sin recarga.
- Redirección a login si no autenticado.

---

### HU-FE-047 — Ver lista de items en el carrito
- **Como** Usuario Autenticado
- **Quiero** ver todos los items de mi carrito con sus detalles
- **Para** revisar qué productos voy a comprar

**Criterios de aceptación:**
```gherkin
Dado que tengo items en el carrito
Cuando accedo a /cart
Entonces veo una lista con todos los items
Y cada item muestra: imagen, nombre, precio unitario, cantidad, y subtotal

Dado que el carrito está vacío
Cuando accedo a /cart
Entonces veo un mensaje "Tu carrito está vacío"
Y veo un icono visual de carrito vacío
Y veo un botón/link "Ver Productos" para ir al catálogo
```

**Trazabilidad técnica:**
- Página: [nova-commerce-front/src/app/features/cart/pages/cart-page/cart-page.component.ts](nova-commerce-front/src/app/features/cart/pages/cart-page/cart-page.component.ts)
- Template: [nova-commerce-front/src/app/features/cart/pages/cart-page/cart-page.component.html](nova-commerce-front/src/app/features/cart/pages/cart-page/cart-page.component.html)
- Tests: [nova-commerce-front/src/app/features/cart/pages/cart-page/cart-page.component.spec.ts](nova-commerce-front/src/app/features/cart/pages/cart-page/cart-page.component.spec.ts) (16 tests)
- Item Component: [nova-commerce-front/src/app/features/cart/components/cart-item/cart-item.component.ts](nova-commerce-front/src/app/features/cart/components/cart-item/cart-item.component.ts)

**DoD:**
- Lista de items renderizada correctamente.
- Estado vacío con mensaje, icono y link funcional.
- CartItemComponent renderiza cada producto.
- Tests pasando: ✅ 16/16 tests.
- Responsive: grid 5 columnas en desktop, 2 columnas en mobile.

---

### HU-FE-048 — Incrementar cantidad de un item en el carrito
- **Como** Usuario Autenticado
- **Quiero** aumentar la cantidad de un producto directamente desde el carrito
- **Para** comprar más unidades sin tener que volver al catálogo

**Criterios de aceptación:**
```gherkin
Dado que tengo un item con cantidad = N en el carrito
Cuando hago click en el botón "+" (incrementar)
Entonces la cantidad del item cambia a N+1
Y el subtotal del item se actualiza a (N+1) × precio
Y el total del carrito se recalcula
Y los cambios se persisten en sessionStorage
```

**Trazabilidad técnica:**
- Facade: [nova-commerce-front/src/app/features/cart/services/cart.facade.ts](nova-commerce-front/src/app/features/cart/services/cart.facade.ts) (método `updateQuantity`)
- Tests: Tests de `updateQuantity` en cart.facade.spec.ts
- UI: Botón "+" en CartItemComponent

**DoD:**
- Método `updateQuantity(productId, newQty)` actualiza correctamente.
- Recalcula totalItems y totalAmount.
- Persiste cambios automáticamente.
- Tests pasando: ✅ 3 tests específicos.
- UI responsive con botones claros.

---

### HU-FE-049 — Decrementar cantidad de un item en el carrito
- **Como** Usuario Autenticado
- **Quiero** reducir la cantidad de un producto
- **Para** comprar menos unidades de lo que inicialmente agregué

**Criterios de aceptación:**
```gherkin
Dado que tengo un item con cantidad = N (N > 1) en el carrito
Cuando hago click en el botón "−" (decrementar)
Entonces la cantidad del item cambia a N-1
Y el subtotal del item se actualiza a (N-1) × precio
Y el total del carrito se recalcula

Dado que tengo un item con cantidad = 1
Cuando hago click en el botón "−"
Entonces el item se elimina del carrito (cantidad 0 = eliminación)
```

**Trazabilidad técnica:**
- Facade: [nova-commerce-front/src/app/features/cart/services/cart.facade.ts](nova-commerce-front/src/app/features/cart/services/cart.facade.ts) (método `updateQuantity`)
- Tests: Tests de `updateQuantity` con qty = 0 en cart.facade.spec.ts
- UI: Botón "−" en CartItemComponent

**DoD:**
- Decrementar funciona correctamente.
- Cantidad 0 elimina el item del array.
- Totales se recalculan.
- Tests pasando: ✅ Test específico de remoción por qty = 0.

---

### HU-FE-050 — Eliminar item del carrito
- **Como** Usuario Autenticado
- **Quiero** eliminar completamente un producto del carrito
- **Para** quitarlo si cambié de opinión

**Criterios de aceptación:**
```gherkin
Dado que tengo un item en el carrito
Cuando hago click en el botón "Eliminar" (ícono de basurero)
Entonces el item se remueve completamente del array
Y el total del carrito se actualiza
Y si era el último item, veo el estado vacío
```

**Trazabilidad técnica:**
- Facade: [nova-commerce-front/src/app/features/cart/services/cart.facade.ts](nova-commerce-front/src/app/features/cart/services/cart.facade.ts) (método `removeItem`)
- Tests: Tests de `removeItem` en cart.facade.spec.ts
- UI: Botón de eliminar en CartItemComponent

**DoD:**
- Método `removeItem(productId)` elimina el item.
- Recalcula totalItems y totalAmount.
- Tests pasando: ✅ 2 tests específicos de removeItem.
- Icono de eliminar visible y accesible.

---

### HU-FE-051 — Ver resumen del carrito con totales
- **Como** Usuario Autenticado
- **Quiero** ver un resumen con el total de items y el monto total
- **Para** saber cuánto voy a pagar antes de confirmar

**Criterios de aceptación:**
```gherkin
Dado que tengo items en el carrito
Cuando veo la página del carrito
Entonces veo un panel lateral (desktop) o sección inferior (mobile) con:
  - Total de items (cantidad de productos)
  - Subtotal (suma de precio × cantidad)
  - Total (igual al subtotal, backend aplicará descuentos)
  - Nota: "Los descuentos se aplicarán al confirmar la compra"
  - Botón "Confirmar Compra"
```

**Trazabilidad técnica:**
- Componente: [nova-commerce-front/src/app/features/cart/components/cart-summary/cart-summary.component.ts](nova-commerce-front/src/app/features/cart/components/cart-summary/cart-summary.component.ts)
- Template: [nova-commerce-front/src/app/features/cart/components/cart-summary/cart-summary.component.html](nova-commerce-front/src/app/features/cart/components/cart-summary/cart-summary.component.html)
- Tests: [nova-commerce-front/src/app/features/cart/components/cart-summary/cart-summary.component.spec.ts](nova-commerce-front/src/app/features/cart/components/cart-summary/cart-summary.component.spec.ts) (12 tests)

**DoD:**
- Muestra totalItems$ del facade.
- Muestra totalAmount$ del facade.
- Nota de descuentos visible.
- Sticky en desktop (position: sticky).
- Tests pasando: ✅ 12/12 tests.
- Formato de moneda correcto.

---

### HU-FE-052 — Confirmar compra (checkout)
- **Como** Usuario Autenticado
- **Quiero** hacer click en "Confirmar Compra"
- **Para** procesar mi pedido y crear una orden en el backend

**Criterios de aceptación:**
```gherkin
Dado que tengo items en el carrito
Cuando hago click en "Confirmar Compra"
Entonces el CartFacade llama a OrderFacade.createOrder(items)
Y el botón muestra "Procesando..." durante la petición
Y el botón queda deshabilitado durante el proceso

Dado que la orden se crea exitosamente
Cuando el backend responde OK
Entonces el carrito se vacía automáticamente
Y veo un mensaje de éxito (delegado a OrderFacade)

Dado que hay un error al crear la orden
Cuando el backend responde con error
Entonces veo un mensaje de error (delegado a OrderFacade)
Y el carrito NO se vacía
```

**Trazabilidad técnica:**
- Facade: [nova-commerce-front/src/app/features/cart/services/cart.facade.ts](nova-commerce-front/src/app/features/cart/services/cart.facade.ts) (método `checkout`)
- Tests: Tests de `checkout` en cart.facade.spec.ts
- UI: Botón en CartSummaryComponent
- Integración: OrderFacade (ya implementado en ETAPA 4)

**DoD:**
- Método `checkout()` delega a OrderFacade.
- Carrito se vacía solo si orden se crea exitosamente.
- Loading state visible durante petición.
- Tests pasando: ✅ 3 tests específicos de checkout.
- No hay lógica de descuentos en frontend (backend calcula).

---

### HU-FE-053 — Persistir carrito en sessionStorage
- **Como** Usuario Autenticado
- **Quiero** que mi carrito se mantenga si recargo la página
- **Para** no perder mi selección durante mi sesión

**Criterios de aceptación:**
```gherkin
Dado que tengo items en el carrito
Cuando recargo la página (F5)
Entonces veo los mismos items con las mismas cantidades

Dado que cierro el navegador
Cuando vuelvo a abrir el sitio
Entonces el carrito está vacío (sessionStorage se limpia)

Dado que abro una nueva pestaña del sitio
Cuando navego a /cart
Entonces veo un carrito vacío (sessionStorage es independiente por pestaña)
```

**Trazabilidad técnica:**
- Service: [nova-commerce-front/src/app/features/cart/services/cart-storage.service.ts](nova-commerce-front/src/app/features/cart/services/cart-storage.service.ts)
- Tests: [nova-commerce-front/src/app/features/cart/services/cart-storage.service.spec.ts](nova-commerce-front/src/app/features/cart/services/cart-storage.service.spec.ts) (8 tests)
- Facade: CartFacade carga desde storage en constructor

**DoD:**
- CartStorageService abstrae sessionStorage.
- Métodos: saveCart(), getCart(), clearCart().
- Error handling con try-catch y console.error.
- Tests pasando: ✅ 8/8 tests (incluyendo manejo de errores).
- Storage key: 'nova-commerce-cart'.

---

### HU-FE-054 — Vaciar todo el carrito
- **Como** Usuario Autenticado
- **Quiero** poder vaciar todo el carrito de una sola vez
- **Para** empezar de cero si cambio de opinión

**Criterios de aceptación:**
```gherkin
Dado que tengo items en el carrito
Cuando llamo al método clearCart() (usado internamente o desde UI futura)
Entonces todos los items se eliminan
Y totalItems = 0
Y totalAmount = 0
Y sessionStorage se limpia
```

**Trazabilidad técnica:**
- Facade: [nova-commerce-front/src/app/features/cart/services/cart.facade.ts](nova-commerce-front/src/app/features/cart/services/cart.facade.ts) (método `clearCart`)
- Tests: Tests de `clearCart` en cart.facade.spec.ts

**DoD:**
- Método `clearCart()` resetea estado completo.
- Observable isEmpty$ emite true.
- Tests pasando: ✅ 2 tests específicos.
- Se ejecuta automáticamente después de checkout exitoso.

---

### HU-FE-055 — Consultar cantidad de un producto en el carrito
- **Como** Desarrollador
- **Quiero** poder consultar la cantidad de un producto específico en el carrito
- **Para** mostrar indicadores en la UI (ej: "Ya tienes 3 en el carrito")

**Criterios de aceptación:**
```gherkin
Dado que tengo un producto con ID = "prod-1" y cantidad = 5
Cuando llamo a getQuantity("prod-1")
Entonces obtengo 5

Dado que NO tengo un producto con ID = "prod-2" en el carrito
Cuando llamo a getQuantity("prod-2")
Entonces obtengo 0
```

**Trazabilidad técnica:**
- Facade: [nova-commerce-front/src/app/features/cart/services/cart.facade.ts](nova-commerce-front/src/app/features/cart/services/cart.facade.ts) (método `getQuantity`)
- Tests: Test de `getQuantity` en cart.facade.spec.ts

**DoD:**
- Método `getQuantity(productId): number` retorna cantidad.
- Retorna 0 si producto no existe.
- Tests pasando: ✅ 1 test específico.

---

### HU-FE-056 — Observables reactivos para estado del carrito
- **Como** Desarrollador
- **Quiero** suscribirme a observables del estado del carrito
- **Para** actualizar la UI automáticamente cuando cambie el carrito

**Criterios de aceptación:**
```gherkin
Dado que me suscribo a cart$
Cuando el carrito cambia (agregar/eliminar/actualizar)
Entonces recibo el nuevo estado completo

Dado que me suscribo a items$
Cuando se modifica el array de items
Entonces recibo el nuevo array

Dado que me suscribo a totalItems$
Cuando cambia la cantidad total
Entonces recibo el nuevo valor

Dado que me suscribo a totalAmount$
Cuando cambia el monto total
Entonces recibo el nuevo valor

Dado que me suscribo a isEmpty$
Cuando el carrito pasa de vacío a lleno (o viceversa)
Entonces recibo true/false según corresponda

Dado que el estado NO cambia
Cuando se ejecuta una operación que no modifica el estado
Entonces NO se emiten valores duplicados (distinctUntilChanged)
```

**Trazabilidad técnica:**
- Facade: [nova-commerce-front/src/app/features/cart/services/cart.facade.ts](nova-commerce-front/src/app/features/cart/services/cart.facade.ts)
- Tests: Tests de Observables en cart.facade.spec.ts

**DoD:**
- Todos los observables públicos son ReadOnly (asObservable()).
- Se usa distinctUntilChanged para evitar emisiones duplicadas.
- Tests pasando: ✅ 3 tests específicos de observables.
- Comparadores personalizados para objetos complejos.

---

## 6) Integración con Features Existentes

### Integración con ProductCard
- **HU relacionada:** HU-FE-044
- **Cambio:** Agregado botón "Agregar al carrito" en ProductCardComponent
- **Comportamiento:**
  - Botón deshabilitado si stock === 0
  - Muestra "Agregando..." durante operación
  - Ejecuta `cartFacade.addItem(product)`

### Integración con Header
- **HU relacionada:** HU-FE-045
- **Cambio:** Agregado `<app-cart-icon>` en HeaderComponent
- **Comportamiento:**
  - Se muestra solo si usuario autenticado
  - Badge se actualiza reactivamente desde cartFacade.totalItems$

### Integración con OrderFacade
- **HU relacionada:** HU-FE-052
- **Cambio:** CartFacade delega checkout a OrderFacade
- **Comportamiento:**
  - Transforma CartItem[] a OrderItemDTO[]
  - Llama OrderFacade.createOrder()
  - Limpia carrito solo si respuesta exitosa

---

## 7) Definición de Hecho (general de la etapa)

- ✅ Todos los criterios de aceptación por HU cumplidos
- ✅ 69 nuevos tests implementados (253 tests totales en el proyecto)
- ✅ 253/253 tests pasando (100% pass rate)
- ✅ Cobertura de código: 89.81% (superior al objetivo del 85%)
  - CartFacade: 97.01% statements
  - CartStorageService: 100% statements
  - CartSummaryComponent: 100% statements
  - CartIconComponent: 100% statements
  - CartPageComponent: 90% statements
- ✅ Zero errores de compilación TypeScript (strict mode)
- ✅ Zero errores de consola en runtime
- ✅ Lazy loading operativo para ruta /cart
- ✅ authGuard aplicado correctamente
- ✅ Responsive design verificado (mobile y desktop)
- ✅ Persistencia en sessionStorage funcional
- ✅ Integración con Header completada
- ✅ Integración con ProductCard completada
- ✅ Checkout delegation a OrderFacade operativo
- ✅ Bundle size impacto: +~10KB (aceptable)
- ✅ Código legible, tipado y mantenible

---

## 8) Métricas y Resultados

### Tests
- **Total tests del proyecto:** 253
- **Tests nuevos de ETAPA 5:** 69
- **Pass rate:** 100% (253/253 passing)
- **Duración de ejecución:** ~18.7 segundos
- **Distribución de tests por archivo:**
  - cart.facade.spec.ts: 22 tests
  - cart-page.component.spec.ts: 16 tests
  - cart-summary.component.spec.ts: 12 tests
  - cart-icon.component.spec.ts: 11 tests
  - cart-storage.service.spec.ts: 8 tests

### Cobertura de Código (v8)
```
-------------------------------------------|---------|----------|---------|---------|
File                                       | % Stmts | % Branch | % Funcs | % Lines |
-------------------------------------------|---------|----------|---------|---------|
All files                                  |   89.81 |    85.29 |   90.57 |   89.72 |
cart/services/cart.facade.ts               |   97.01 |    80.95 |   95.65 |   96.55 |
cart/services/cart-storage.service.ts      |     100 |      100 |     100 |     100 |
cart/components/cart-summary/              |     100 |      100 |     100 |     100 |
cart/components/cart-icon/                 |     100 |      100 |     100 |     100 |
cart/pages/cart-page/                      |      90 |    85.71 |   66.66 |   97.67 |
-------------------------------------------|---------|----------|---------|---------|
```

### Build
- **Bundle total:** 257.46 kB
- **Build time:** 9.488 segundos
- **Tiempo de transform:** 9.02 segundos
- **Sin errores de compilación**

---

## 9) Fuera de Alcance (ETAPA 5)

- ❌ Aplicación de descuentos en frontend (delegado a backend)
- ❌ Validación de stock en tiempo real contra backend
- ❌ Carrito compartido entre dispositivos (solo sessionStorage local)
- ❌ Guardar carritos para más tarde (localStorage)
- ❌ Wishlist / Lista de deseos
- ❌ Comparador de productos
- ❌ Cupones de descuento en frontend
- ❌ Cálculo de impuestos (delegado a backend)
- ❌ Cálculo de envío (delegado a backend)
- ❌ Múltiples carritos por usuario
- ❌ Carrito para usuarios no autenticados (requiere authGuard)

---

## 10) Dependencias y Riesgos

### Dependencias
- ✅ **OrderFacade**: Necesario para checkout (implementado en ETAPA 4)
- ✅ **AuthGuard**: Necesario para proteger /cart (implementado en ETAPA 2)
- ✅ **ProductFacade**: Para obtener información de productos (ETAPA 3)
- ✅ **SessionStorage API**: Disponible en todos los navegadores modernos

### Riesgos Mitigados
- ✅ **Pérdida de carrito al cerrar navegador**: Documentado como comportamiento esperado (sessionStorage vs localStorage)
- ✅ **Sincronización entre pestañas**: sessionStorage es independiente por pestaña (by design)
- ✅ **Validación de stock**: Se realiza en backend durante createOrder
- ✅ **Carrito de usuarios no autenticados**: Bloqueado por authGuard (decisión de negocio)

---

## 11) Trazabilidad Cruzada (mapa rápido)

### Modelos
- [nova-commerce-front/src/app/features/cart/models/cart.model.ts](nova-commerce-front/src/app/features/cart/models/cart.model.ts)

### Servicios
- [nova-commerce-front/src/app/features/cart/services/cart.facade.ts](nova-commerce-front/src/app/features/cart/services/cart.facade.ts) (~250 líneas)
- [nova-commerce-front/src/app/features/cart/services/cart.facade.spec.ts](nova-commerce-front/src/app/features/cart/services/cart.facade.spec.ts) (22 tests)
- [nova-commerce-front/src/app/features/cart/services/cart-storage.service.ts](nova-commerce-front/src/app/features/cart/services/cart-storage.service.ts)
- [nova-commerce-front/src/app/features/cart/services/cart-storage.service.spec.ts](nova-commerce-front/src/app/features/cart/services/cart-storage.service.spec.ts) (8 tests)

### Componentes
- **CartItemComponent:**
  - [nova-commerce-front/src/app/features/cart/components/cart-item/cart-item.component.ts](nova-commerce-front/src/app/features/cart/components/cart-item/cart-item.component.ts)
  - [nova-commerce-front/src/app/features/cart/components/cart-item/cart-item.component.html](nova-commerce-front/src/app/features/cart/components/cart-item/cart-item.component.html)
  - [nova-commerce-front/src/app/features/cart/components/cart-item/cart-item.component.scss](nova-commerce-front/src/app/features/cart/components/cart-item/cart-item.component.scss)

- **CartSummaryComponent:**
  - [nova-commerce-front/src/app/features/cart/components/cart-summary/cart-summary.component.ts](nova-commerce-front/src/app/features/cart/components/cart-summary/cart-summary.component.ts)
  - [nova-commerce-front/src/app/features/cart/components/cart-summary/cart-summary.component.html](nova-commerce-front/src/app/features/cart/components/cart-summary/cart-summary.component.html)
  - [nova-commerce-front/src/app/features/cart/components/cart-summary/cart-summary.component.scss](nova-commerce-front/src/app/features/cart/components/cart-summary/cart-summary.component.scss)
  - [nova-commerce-front/src/app/features/cart/components/cart-summary/cart-summary.component.spec.ts](nova-commerce-front/src/app/features/cart/components/cart-summary/cart-summary.component.spec.ts) (12 tests)

- **CartIconComponent:**
  - [nova-commerce-front/src/app/features/cart/components/cart-icon/cart-icon.component.ts](nova-commerce-front/src/app/features/cart/components/cart-icon/cart-icon.component.ts)
  - [nova-commerce-front/src/app/features/cart/components/cart-icon/cart-icon.component.html](nova-commerce-front/src/app/features/cart/components/cart-icon/cart-icon.component.html)
  - [nova-commerce-front/src/app/features/cart/components/cart-icon/cart-icon.component.scss](nova-commerce-front/src/app/features/cart/components/cart-icon/cart-icon.component.scss)
  - [nova-commerce-front/src/app/features/cart/components/cart-icon/cart-icon.component.spec.ts](nova-commerce-front/src/app/features/cart/components/cart-icon/cart-icon.component.spec.ts) (11 tests)

### Páginas
- **CartPageComponent:**
  - [nova-commerce-front/src/app/features/cart/pages/cart-page/cart-page.component.ts](nova-commerce-front/src/app/features/cart/pages/cart-page/cart-page.component.ts)
  - [nova-commerce-front/src/app/features/cart/pages/cart-page/cart-page.component.html](nova-commerce-front/src/app/features/cart/pages/cart-page/cart-page.component.html)
  - [nova-commerce-front/src/app/features/cart/pages/cart-page/cart-page.component.scss](nova-commerce-front/src/app/features/cart/pages/cart-page/cart-page.component.scss)
  - [nova-commerce-front/src/app/features/cart/pages/cart-page/cart-page.component.spec.ts](nova-commerce-front/src/app/features/cart/pages/cart-page/cart-page.component.spec.ts) (16 tests)

### Routing
- [nova-commerce-front/src/app/features/cart/cart.routes.ts](nova-commerce-front/src/app/features/cart/cart.routes.ts)
- [nova-commerce-front/src/app/app.routes.ts](nova-commerce-front/src/app/app.routes.ts) (ruta /cart agregada)

### Integraciones
- [nova-commerce-front/src/app/shared/components/header/header.component.ts](nova-commerce-front/src/app/shared/components/header/header.component.ts) (CartIconComponent integrado)
- ProductCardComponent (botón "Agregar al carrito" integrado)

---

## 12) Backlog de Próxima Etapa (referencia)

### ETAPA 6 — Mejoras UX y Optimizaciones (sugerencias)
- **HU-FE-057**: Implementar animaciones de transición al agregar items
- **HU-FE-058**: Notificaciones toast para acciones de carrito
- **HU-FE-059**: Validación de stock en tiempo real
- **HU-FE-060**: Indicador visual de "últimas unidades disponibles"
- **HU-FE-061**: Sugerencias de productos relacionados en el carrito
- **HU-FE-062**: Guardar carrito en localStorage para persistencia entre sesiones
- **HU-FE-063**: Exportar carrito a PDF o compartir por email
- **HU-FE-064**: Implementar Wishlist/Lista de deseos
- **HU-FE-065**: Carrito para usuarios no autenticados (guest checkout)

---

## 13) Patrones de Diseño Implementados

### Facade Pattern
- **CartFacade** actúa como punto único de entrada para toda la lógica de carrito
- Encapsula complejidad de gestión de estado, persistencia y observables
- Simplifica el uso desde componentes (inyección simple)

### Observable Pattern (RxJS)
- **BehaviorSubject** para estado interno mutable
- **Observables derivados** (cart$, items$, totalItems$, totalAmount$, isEmpty$)
- **distinctUntilChanged** para optimizar emisiones
- **Comparadores personalizados** para comparación profunda de objetos

### Repository Pattern (ligero)
- **CartStorageService** abstrae detalles de sessionStorage
- Permite futuro cambio a localStorage, IndexedDB o backend sin modificar facade

### Dependency Injection
- **inject()** function para inyección de dependencias
- Evita problemas de inicialización de propiedades
- Compatible con TypeScript strict mode

---

## 14) Decisiones Técnicas Documentadas

### sessionStorage vs localStorage
- **Decisión:** Usar sessionStorage
- **Razón:** Carrito es temporal por naturaleza, se limpia al cerrar navegador
- **Beneficio:** Evita carritos obsoletos, mejor UX para sesiones nuevas
- **Desventaja:** No persiste entre sesiones (mitigado por simplicidad)

### Cálculo de Totales en Frontend
- **Decisión:** Frontend solo calcula suma simple (precio × cantidad)
- **Razón:** Backend es responsable de descuentos, impuestos, promociones
- **Beneficio:** Evita duplicación de lógica de negocio
- **Implementación:** Nota visible: "Los descuentos se aplicarán al confirmar la compra"

### Carrito Requiere Autenticación
- **Decisión:** Proteger /cart con authGuard
- **Razón:** Simplifica gestión de estado, evita carritos anónimos
- **Beneficio:** Menos complejidad, mejor trazabilidad de órdenes
- **Desventaja:** No soporta guest checkout (fuera de alcance)

### Lazy Loading de Ruta Cart
- **Decisión:** Cargar cart.routes.ts bajo demanda
- **Razón:** Optimizar bundle inicial
- **Beneficio:** Mejor performance de carga inicial
- **Trade-off:** Pequeño delay al primera navegación a /cart (aceptable)

---

## 15) Anexos y Enlaces

### Documentación del Proyecto
- Guía rápida: [../QUICK_START.md](../QUICK_START.md)
- Resumen ejecutivo: [../RESUMEN_EJECUTIVO.md](../RESUMEN_EJECUTIVO.md)
- Árbol de directorios: [../ARBOL_DIRECTORIOS.md](../ARBOL_DIRECTORIOS.md)
- Índice de archivos: [../INDICE_ARCHIVOS.md](../INDICE_ARCHIVOS.md)

### HUS de Etapas Anteriores
- ETAPA 1 — Base del Frontend: [HUS_FIRST_STAGE.md](HUS_FIRST_STAGE.md)
- ETAPA 2 — Autenticación (no documentado aún)
- ETAPA 3 — Productos (no documentado aún)
- ETAPA 4 — Órdenes (no documentado aún)

### Documentación Técnica Adicional
- API Gateway: http://localhost:8080
- Backend Order-Service: ../README-order-service.md

---

## 16) Glosario de Términos

- **CartItem**: Objeto que representa un producto en el carrito con cantidad
- **Cart**: Estado completo del carrito (items + totales calculados)
- **CartFacade**: Servicio orquestador de toda la lógica de carrito
- **CartStorageService**: Servicio de persistencia en sessionStorage
- **sessionStorage**: API del navegador para almacenamiento temporal (se limpia al cerrar pestaña)
- **localStorage**: API del navegador para almacenamiento permanente (NO usado)
- **Checkout**: Proceso de confirmar compra y crear orden en backend
- **authGuard**: Guard de Angular que protege rutas para usuarios autenticados
- **Lazy Loading**: Carga diferida de módulos/rutas para optimizar bundle
- **BehaviorSubject**: Observable de RxJS que mantiene último valor emitido
- **distinctUntilChanged**: Operador RxJS que evita emisiones duplicadas
- **DoD**: Definition of Done (Definición de Hecho)

---

**Fecha de creación:** 11 de enero de 2026  
**Versión:** 1.0  
**Estado:** ✅ COMPLETADO (253/253 tests passing, 89.81% coverage)  
**Próxima etapa:** Por definir (sugerencias en sección 12)
