# HUS — Nova Commerce Front — ETAPA 2 & 2.5 (Autenticación y Contexto de Usuario)

Documento maestro de Historias de Usuario para las etapas 2 y 2.5 del frontend. Mantiene continuidad con HUS_FIRST_STAGE.md y establece la base para features de negocio en etapas posteriores.

---

## 1) Contexto y Alcance

- **Proyecto:** Nova Commerce Front (Angular 21, Standalone Components, SSR)
- **Backend:** API Gateway (http://localhost:8080) con rutas de autenticación
- **Etapa 2:** Autenticación y Autorización (JWT, Guards, Interceptors)
- **Etapa 2.5:** Contexto de Usuario Centralizado (User Context)
- **Objetivo:** Entregar autenticación, autorización basada en roles y contexto de usuario centralizado

---

## 2) Principios y Lineamientos

- Standalone Components; no NgModules.
- Separación de responsabilidades (Facade/Service/Repository layers).
- Token management centralizado en TokenService.
- AuthFacade para orquestar lógica de autenticación.
- UserFacade para abstraer contexto del usuario (ETAPA 2.5).
- Interceptor HTTP para inyectar tokens automáticamente.
- Directiva `hasRole` para visibilidad condicional.
- Código tipado, testable y escalable.
- Observable-first design con RxJS.

---

## 3) Roles y Actores

- **Visitante:** Usuario no autenticado que accede a login.
- **Usuario Autenticado (ROLE: USER):** Puede ver órdenes y productos.
- **Administrador (ROLE: ADMIN):** Acceso total incluyendo panel admin.
- **Desarrollador:** Implementa y mantiene servicios de autenticación.

---

## 4) Historias de Usuario (HUs) — ETAPA 2

### HU-FE-011 — Página de Login

- **Como:** Visitante
- **Quiero:** una página de login donde pueda ingresar email y contraseña
- **Para:** autenticarme en el sistema

**Criterios de Aceptación:**
- Dado que accedo a "/auth/login" | Cuando se renderiza | Entonces veo un formulario con campos de email, contraseña y botón "Iniciar Sesión"
- Dado que ingreso credenciales válidas | Cuando hago click | Entonces se envía request al backend y me redirige a home
- Dado que ingreso credenciales inválidas | Cuando hago click | Entonces veo mensaje de error

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/features/auth/pages/login/login.component.ts](nova-commerce-front/src/app/features/auth/pages/login/login.component.ts)
- [nova-commerce-front/src/app/features/auth/pages/login/login.component.html](nova-commerce-front/src/app/features/auth/pages/login/login.component.html)

**DoD:** Formulario reactivo, validaciones, error handling, 12+ tests.

---

### HU-FE-012 — TokenService (Gestión de Tokens JWT)

- **Como:** Desarrollador
- **Quiero:** un servicio centralizado que gestione tokens JWT
- **Para:** evitar duplicación y facilitar mantenibilidad

**Criterios de Aceptación:**
- Dado que recibo un token | Cuando lo guardo | Entonces TokenService lo persiste en localStorage
- Dado que necesito el token | Cuando consulto TokenService | Entonces obtiene métodos: getAccessToken(), isTokenExpired(), decodeToken(), getRoles()

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/features/auth/services/token.service.ts](nova-commerce-front/src/app/features/auth/services/token.service.ts)

**DoD:** Métodos tipados, 15+ tests, 96% cobertura.

---

### HU-FE-013 — AuthService (Orquestación HTTP)

- **Como:** Desarrollador
- **Quiero:** un servicio para comunicación HTTP con backend
- **Para:** centralizar llamadas a endpoints de autenticación

**Criterios de Aceptación:**
- Dado que llamo login(email, password) | Cuando envío credenciales | Entonces retorna Observable con accessToken
- Dado que llamo logout() | Cuando se ejecuta | Entonces limpia sesión

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/features/auth/services/auth.service.ts](nova-commerce-front/src/app/features/auth/services/auth.service.ts)

**DoD:** HTTP calls tipadas, error handling, 4+ tests, 100% cobertura.

---

### HU-FE-014 — AuthFacade (Orquestación de Autenticación)

- **Como:** Componente
- **Quiero:** inyectar un único facade que orqueste login/logout
- **Para:** evitar múltiples inyecciones de servicios

**Criterios de Aceptación:**
- Dado que inyecto AuthFacade | Cuando accedo a authState$ | Entonces recibo Observable con estado de autenticación
- Dado que hago login | Cuando se ejecuta | Entonces authState$ emite cambios automáticamente

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/features/auth/services/auth.facade.ts](nova-commerce-front/src/app/features/auth/services/auth.facade.ts)

**DoD:** BehaviorSubject para estado, distinctUntilChanged, auto-inicialización localStorage, 18+ tests.

---

### HU-FE-015 — AuthGuard (Protección de Rutas)

- **Como:** Sistema
- **Quiero:** que rutas protegidas solo sean accesibles autenticado
- **Para:** evitar acceso no autorizado

**Criterios de Aceptación:**
- Dado que soy no autenticado | Cuando navego a "/orders" | Entonces me redirige a "/auth/login"
- Dado que soy autenticado | Cuando navego a "/orders" | Entonces se me permite acceder

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/features/auth/guards/auth.guard.ts](nova-commerce-front/src/app/features/auth/guards/auth.guard.ts)

**DoD:** Guard funcional, redirige correctamente, 2+ tests, 100% cobertura.

---

### HU-FE-016 — RoleGuard (Protección por Rol)

- **Como:** Sistema
- **Quiero:** que solo ADMIN pueda acceder a "/admin"
- **Para:** asegurar autorización granular

**Criterios de Aceptación:**
- Dado que soy USER | Cuando intento "/admin" | Entonces me redirige a "/"
- Dado que soy ADMIN | Cuando intento "/admin" | Entonces se me permite

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/features/auth/guards/role.guard.ts](nova-commerce-front/src/app/features/auth/guards/role.guard.ts)

**DoD:** Valida roles en route data, 4+ tests, 100% cobertura.

---

### HU-FE-017 — Directiva hasRole (Visibilidad Condicional)

- **Como:** Componente
- **Quiero:** ocultar/mostrar elementos basado en rol del usuario
- **Para:** dar UX diferenciada según permisos

**Criterios de Aceptación:**
- Dado que soy USER | Cuando veo header | Entonces link Admin está oculto
- Dado que soy ADMIN | Cuando veo header | Entonces link Admin es visible

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/features/auth/directives/has-role.directive.ts](nova-commerce-front/src/app/features/auth/directives/has-role.directive.ts)
- Sintaxis: `<div *hasRole="'ADMIN'">...</div>`

**DoD:** Structural directive, 5+ tests, 90.47% cobertura.

---

### HU-FE-018 — Token Interceptor (Inyección Automática)

- **Como:** Sistema
- **Quiero:** que cada request HTTP incluya JWT en Authorization header
- **Para:** autenticar requests automáticamente

**Criterios de Aceptación:**
- Dado que tengo token válido | Cuando hago GET a /api | Entonces se agrega `Authorization: Bearer <token>`
- Dado que no tengo token | Cuando hago GET a /api | Entonces no se agrega header

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/features/auth/interceptors/token.interceptor.ts](nova-commerce-front/src/app/features/auth/interceptors/token.interceptor.ts)

**DoD:** Interceptor registrado en root, maneja 401, 4+ tests, 90% cobertura.

---

### HU-FE-019 — Header Dinámico (UI Consciente de Sesión)

- **Como:** Usuario Autenticado
- **Quiero:** que el header muestre mi email y botón logout
- **Para:** confirmar que estoy logueado

**Criterios de Aceptación:**
- Dado que NO estoy autenticado | Cuando cargo | Entonces header muestra "Iniciar Sesión"
- Dado que estoy autenticado | Cuando cargo | Entonces header muestra email y "Cerrar Sesión"

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/shared/components/header/header.component.ts](nova-commerce-front/src/app/shared/components/header/header.component.ts)

**DoD:** Template reactivo, 3+ tests.

---

### HU-FE-020 — User Model (Interfaces Tipadas)

- **Como:** Sistema
- **Quiero:** interfases tipadas para usuario autenticado
- **Para:** evitar any types y mejorar type safety

**Criterios de Aceptación:**
- Dado User interface | Cuando se define | Entonces incluye: id, email, roles
- Dado UserContext interface | Entonces incluye: user, isAuthenticated, lastUpdated

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/features/auth/models/user.model.ts](nova-commerce-front/src/app/features/auth/models/user.model.ts)

**DoD:** Interfases documentadas, reutilizables.

---

## 5) Historias de Usuario (HUs) — ETAPA 2.5

### HU-FE-021 — UserFacade (Contexto Centralizado del Usuario)

- **Como:** Componente
- **Quiero:** acceder a información del usuario sin tocar tokens JWT
- **Para:** mantener componentes limpios y desacoplados

**Criterios de Aceptación:**
- Dado que estoy autenticado | Cuando consulto UserFacade.user$ | Entonces recibo Observable con {id, email, roles}
- Dado que quiero verificar si soy admin | Cuando consulto UserFacade.isAdmin$ | Entonces recibo Observable<boolean>
- Dado que recargo la página | Cuando se inicializa | Entonces lee token de localStorage y restaura contexto

**Observables Disponibles:**
- `userContext$` — estado completo
- `user$` — usuario actual
- `isAuthenticated$` — flag autenticación
- `email$` — email usuario
- `isAdmin$` — flag si es admin

**Métodos Síncronos:**
- `getCurrentUser()` → User | null
- `isAuthenticated()` → boolean
- `hasRole(role)` → boolean
- `getRoles()` → string[]

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/features/auth/facades/user.facade.ts](nova-commerce-front/src/app/features/auth/facades/user.facade.ts)

**DoD:** 30+ tests, auto-inicialización localStorage, auto-sync con AuthFacade.

---

### HU-FE-022 — Observables de UserFacade para Templates

- **Como:** Template
- **Quiero:** usar async pipe con observables de UserFacade
- **Para:** evitar suscripciones manuales

**Criterios de Aceptación:**
- Dado UserFacade.email$ | Cuando async pipe | Entonces recibo email del usuario
- Dado cambios de sesión | Cuando emiten | Entonces template se actualiza automáticamente

**Trazabilidad Técnica:**
- [nova-commerce-front/src/app/shared/components/header/header.component.html](nova-commerce-front/src/app/shared/components/header/header.component.html)

**DoD:** Header usa `userFacade.email$ | async` y `userFacade.isAdmin$ | async`, sin memory leaks.

---

### HU-FE-023 — Métodos Síncronos de UserFacade

- **Como:** Guard/Servicio
- **Quiero:** métodos síncronos en UserFacade para verificaciones rápidas
- **Para:** usar en guards sin suscribirse a observables

**Criterios de Aceptación:**
- Dado UserFacade.hasRole(role) | Cuando llamo | Entonces retorna boolean sin delay
- Dado UserFacade.getCurrentUser() | Cuando llamo | Entonces retorna User | null

**DoD:** 6 métodos síncronos, tests validando acceso.

---

### HU-FE-024 — Métodos Observable de UserFacade

- **Como:** Template/Componente
- **Quiero:** observables que verifiquen roles específicos
- **Para:** usar en templates con async pipe

**Criterios de Aceptación:**
- Dado UserFacade.hasRole$(role) | Cuando suscribo | Entonces recibo Observable<boolean>
- Dado cambio de rol | Cuando emite | Entonces se actualiza automáticamente

**DoD:** 3 métodos observable, reactividad con async pipe.

---

### HU-FE-025 — Auto-sincronización UserFacade-AuthFacade

- **Como:** Sistema
- **Quiero:** que UserFacade reaccione automáticamente a cambios de AuthFacade
- **Para:** mantener contexto sincronizado

**Criterios de Aceptación:**
- Dado que ocurre login en AuthFacade | Cuando emite | Entonces UserFacade actualiza user$
- Dado que ocurre logout | Entonces UserFacade limpia user$ a null

**DoD:** Auto-sincronización sin intervención, sin memory leaks.

---

## 6) Definición de Hecho General (ETAPA 2 & 2.5)

- ✅ Cumple criterios de aceptación por HU
- ✅ Login/logout funcional con JWT
- ✅ Guards protegen rutas y verifican roles
- ✅ Interceptor agrega tokens a requests
- ✅ Directiva hasRole controla visibilidad
- ✅ Header dinámico según autenticación
- ✅ UserFacade contexto centralizado
- ✅ Observables reactivos con async pipe
- ✅ Persistencia sesión en localStorage
- ✅ 130+ tests pasando
- ✅ Cobertura ≥87.91%
- ✅ Sin memory leaks

---

## 7) Fuera de Alcance

- OAuth2/OIDC externo
- Refresh token automático
- 2FA (autenticación de dos factores)
- Lógica de órdenes/productos
- Estado global Redux/NgRx

---

## 8) Dependencias y Riesgos

| Riesgo | Mitigación |
|--------|-----------|
| Token expirado en sesión activa | TokenInterceptor detecta 401, redirige |
| XSS via JWT en localStorage | Angular sanitizer + CSP headers |
| JWT decodificación en múltiples componentes | TokenService centraliza, UserFacade abstraes |
| Guards saltados | Tests exhaustivos, code review |

---

## 9) Trazabilidad Cruzada

**Autenticación:**
- [nova-commerce-front/src/app/features/auth/auth.routes.ts](nova-commerce-front/src/app/features/auth/auth.routes.ts)
- [nova-commerce-front/src/app/features/auth/services/](nova-commerce-front/src/app/features/auth/services/)
- [nova-commerce-front/src/app/features/auth/guards/](nova-commerce-front/src/app/features/auth/guards/)
- [nova-commerce-front/src/app/features/auth/interceptors/](nova-commerce-front/src/app/features/auth/interceptors/)

**Contexto de Usuario:**
- [nova-commerce-front/src/app/features/auth/facades/user.facade.ts](nova-commerce-front/src/app/features/auth/facades/user.facade.ts)
- [nova-commerce-front/src/app/features/auth/models/user.model.ts](nova-commerce-front/src/app/features/auth/models/user.model.ts)

---

## 10) Backlog de ETAPA 3

- HU-FE-026 — Listar productos con paginación
- HU-FE-027 — Filtro de productos por categoría
- HU-FE-028 — Carrito de compras (estado global)
- HU-FE-029 — Checkout y órdenes
- HU-FE-030 — Historial de órdenes
- HU-FE-031 — Detalle de orden
- HU-FE-032 — Panel admin: usuarios
- HU-FE-033 — Panel admin: órdenes globales

---

## 11) Anexos y Enlaces

- [QUICK_START.md](../QUICK_START.md)
- [RESUMEN_EJECUTIVO.md](../RESUMEN_EJECUTIVO.md)
- [ETAPA_2_5_RESUMEN_EJECUTIVO.md](../ETAPA_2_5_RESUMEN_EJECUTIVO.md)
- [ARQUITECTURA_ETAPA_2_5_DETALLADA.md](../ARQUITECTURA_ETAPA_2_5_DETALLADA.md)

---

**Versión:** 2.0 (ETAPA 2 & 2.5)  
**Estado:** ✅ COMPLETADO  
**Última actualización:** 11 de enero de 2026
