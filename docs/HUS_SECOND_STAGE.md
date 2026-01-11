# HUS — Nova Commerce Front — ETAPA 2 (Autenticación & Seguridad)

Documento maestro de Historias de Usuario para la segunda etapa del frontend (autenticación, autorización y seguridad). Mantiene el mismo espíritu y criterios que el documento HUS de la Etapa 1: claridad de alcance, criterios de aceptación verificables, trazabilidad técnica, Definición de Hecho y preparación para etapas siguientes.

---

## 1) Contexto y Alcance

- Proyecto: Nova Commerce Front (Angular 21, Standalone Components, SSR)
- Backend: Microservicios detrás de API Gateway (http://localhost:8080)
- Etapa actual: ETAPA 2 — Autenticación & Seguridad
- Objetivo: Implementar autenticación robusta con JWT, protección de rutas por roles, y gestión centralizada de sesión.

En esta etapa SE implementan: autenticación con JWT, guards (auth y role), interceptor de tokens, servicios de autenticación, gestión de sesión, directiva de roles, y página de login.

---

## 2) Principios y Lineamientos

- **Facade Pattern**: AuthFacade como único punto de acceso para lógica de autenticación
- **Single Responsibility**: Cada servicio tiene una responsabilidad específica
- **Security First**: Tokens JWT manejados de forma segura en localStorage
- **Stateless Frontend**: No estado global; autenticación basada en tokens
- **Separation of Concerns**: UI separada de lógica de autenticación
- **Clean Architecture**: Respeto estricto a capas y responsabilidades
- **Código tipado y testable**

---

## 3) Roles y Actores

- **Visitante**: Usuario no autenticado que puede acceder a rutas públicas
- **Usuario Autenticado**: Usuario con sesión activa que puede acceder a rutas protegidas
- **Admin**: Usuario con rol ADMIN que puede acceder a rutas administrativas
- **Roles futuros**: CUSTOMER, USER (preparado para escalar)

---

## 4) Historias de Usuario (HUs)

A continuación se listan HUs que reflejan EXACTAMENTE lo entregado en ETAPA 2.

### HU-FE-011 — Inicio de sesión con JWT
- Como Usuario
- Quiero iniciar sesión con mi nombre de usuario y contraseña
- Para obtener un token JWT que me permita acceder a funcionalidades protegidas

Criterios de aceptación (Gherkin):
- Dado que estoy en la página de login "/auth/login"
  Cuando ingreso credenciales válidas (userIdentifier y password)
  Y hago click en "Iniciar Sesión"
  Entonces se envía una petición POST a http://localhost:8080/api/auth/login
  Y recibo un access_token, refresh_token, username y roles
  Y soy redirigido a la página de inicio "/"

- Dado que ingreso credenciales inválidas
  Cuando hago click en "Iniciar Sesión"
  Entonces veo un mensaje de error claro
  Y permanezco en la página de login

- Dado que el formulario tiene campos vacíos
  Cuando intento enviar el formulario
  Entonces veo validaciones en tiempo real
  Y el botón está deshabilitado hasta que el formulario sea válido

Trazabilidad técnica:
- Login Page: [nova-commerce-front/src/app/features/auth/pages/login/login.component.ts](nova-commerce-front/src/app/features/auth/pages/login/login.component.ts)
- Template: [nova-commerce-front/src/app/features/auth/pages/login/login.component.html](nova-commerce-front/src/app/features/auth/pages/login/login.component.html)
- Estilos: [nova-commerce-front/src/app/features/auth/pages/login/login.component.scss](nova-commerce-front/src/app/features/auth/pages/login/login.component.scss)
- AuthFacade: [nova-commerce-front/src/app/features/auth/services/auth.facade.ts](nova-commerce-front/src/app/features/auth/services/auth.facade.ts)

Definición de Hecho (DoD):
- Formulario reactivo con validaciones
- Feedback visual de carga y errores
- Redirección automática post-login
- Manejo de returnUrl para redirigir a la página original
- Responsive en desktop y mobile
- Sin errores de consola

---

### HU-FE-012 — Persistencia de sesión con TokenService
- Como Usuario autenticado
- Quiero que mi sesión persista al recargar la página
- Para no tener que iniciar sesión en cada recarga

Criterios de aceptación:
- Dado que he iniciado sesión exitosamente
  Cuando recargo la página
  Entonces mi sesión permanece activa
  Y puedo acceder a las rutas protegidas sin volver a autenticarme

- Dado que cierro sesión
  Cuando recargo la página
  Entonces no tengo sesión activa
  Y soy redirigido a login si intento acceder a rutas protegidas

Trazabilidad técnica:
- TokenService: [nova-commerce-front/src/app/features/auth/services/token.service.ts](nova-commerce-front/src/app/features/auth/services/token.service.ts)
- AuthFacade: [nova-commerce-front/src/app/features/auth/services/auth.facade.ts](nova-commerce-front/src/app/features/auth/services/auth.facade.ts)

DoD:
- Tokens almacenados en localStorage
- Decodificación JWT para extraer roles y username
- Métodos para obtener, guardar y eliminar tokens
- Validación de existencia de tokens
- Sin duplicación de lógica de storage

---

### HU-FE-013 — Interceptor de tokens HTTP
- Como Desarrollador
- Quiero adjuntar automáticamente el token JWT en todas las peticiones HTTP
- Para no tener que agregarlo manualmente en cada llamada

Criterios de aceptación:
- Dado que estoy autenticado
  Cuando se realiza cualquier petición HTTP (excepto /auth/login y /auth/refresh)
  Entonces el header "Authorization: Bearer <token>" se adjunta automáticamente

- Dado que NO estoy autenticado
  Cuando se realiza una petición HTTP
  Entonces NO se adjunta el header Authorization

- Dado que recibo un error 401 (Unauthorized)
  Cuando el token ha expirado
  Entonces se intenta renovar el token con refresh_token
  Y si falla, se cierra sesión y redirijo a login

Trazabilidad técnica:
- TokenInterceptor: [nova-commerce-front/src/app/features/auth/interceptors/token.interceptor.ts](nova-commerce-front/src/app/features/auth/interceptors/token.interceptor.ts)
- App Config: [nova-commerce-front/src/app/app.config.ts](nova-commerce-front/src/app/app.config.ts)

DoD:
- Interceptor configurado globalmente
- Exclusión correcta de endpoints de auth
- Manejo de errores 401/403
- Sin modificación manual de headers en servicios

---

### HU-FE-014 — Protección de rutas con AuthGuard
- Como Usuario no autenticado
- Quiero ser redirigido a login si intento acceder a rutas protegidas
- Para entender que necesito autenticarme primero

Criterios de aceptación:
- Dado que NO estoy autenticado
  Cuando intento acceder a /products, /orders o /admin
  Entonces soy redirigido a /auth/login
  Y la URL original se guarda como returnUrl

- Dado que estoy autenticado
  Cuando accedo a /products, /orders o /admin
  Entonces se me permite el acceso sin redirección

- Dado que inicio sesión después de ser redirigido
  Cuando el login es exitoso
  Entonces soy redirigido a la URL original (returnUrl)

Trazabilidad técnica:
- AuthGuard: [nova-commerce-front/src/app/features/auth/guards/auth.guard.ts](nova-commerce-front/src/app/features/auth/guards/auth.guard.ts)
- Routes: [nova-commerce-front/src/app/app.routes.ts](nova-commerce-front/src/app/app.routes.ts)
- AuthFacade: [nova-commerce-front/src/app/features/auth/services/auth.facade.ts](nova-commerce-front/src/app/features/auth/services/auth.facade.ts)

DoD:
- Guard funcional (CanActivateFn)
- Aplicado en rutas protegidas
- Manejo correcto de returnUrl
- Sin errores de navegación

---

### HU-FE-015 — Protección de rutas por roles con RoleGuard
- Como Usuario autenticado sin permisos de ADMIN
- Quiero ser bloqueado si intento acceder a rutas administrativas
- Para mantener la seguridad del sistema

Criterios de aceptación:
- Dado que estoy autenticado como USER o CUSTOMER
  Cuando intento acceder a /admin
  Entonces se me bloquea el acceso
  Y soy redirigido al home con un mensaje de "Acceso denegado"

- Dado que estoy autenticado como ADMIN
  Cuando accedo a /admin
  Entonces se me permite el acceso

- Dado que una ruta requiere múltiples roles posibles
  Cuando intento acceder y tengo al menos uno de esos roles
  Entonces se me permite el acceso

Trazabilidad técnica:
- RoleGuard: [nova-commerce-front/src/app/features/auth/guards/role.guard.ts](nova-commerce-front/src/app/features/auth/guards/role.guard.ts)
- Routes: [nova-commerce-front/src/app/app.routes.ts](nova-commerce-front/src/app/app.routes.ts)
- AuthFacade: [nova-commerce-front/src/app/features/auth/services/auth.facade.ts](nova-commerce-front/src/app/features/auth/services/auth.facade.ts)

DoD:
- Guard funcional (CanActivateFn)
- Validación de roles desde route.data
- Integración con AuthFacade.hasRole()
- Feedback claro al usuario

---

### HU-FE-016 — Directiva hasRole para UI condicional
- Como Desarrollador
- Quiero mostrar/ocultar elementos de UI según el rol del usuario
- Para crear interfaces dinámicas y seguras

Criterios de aceptación:
- Dado que un elemento tiene `*hasRole="'ADMIN'"`
  Cuando el usuario tiene rol ADMIN
  Entonces el elemento se muestra

- Dado que un elemento tiene `*hasRole="'ADMIN'"`
  Cuando el usuario NO tiene rol ADMIN
  Entonces el elemento se oculta del DOM

- Dado que un elemento tiene `*hasRole="['ADMIN', 'MANAGER']"`
  Cuando el usuario tiene al menos uno de esos roles
  Entonces el elemento se muestra

Trazabilidad técnica:
- HasRoleDirective: [nova-commerce-front/src/app/features/auth/directives/has-role.directive.ts](nova-commerce-front/src/app/features/auth/directives/has-role.directive.ts)
- AuthFacade: [nova-commerce-front/src/app/features/auth/services/auth.facade.ts](nova-commerce-front/src/app/features/auth/services/auth.facade.ts)

DoD:
- Directiva estructural standalone
- Soporta un rol (string) o múltiples roles (array)
- Integrada con AuthFacade
- Elimina elementos del DOM (no solo los oculta)

---

### HU-FE-017 — UI del Header consciente de sesión
- Como Usuario
- Quiero ver opciones diferentes en el header según mi estado de autenticación
- Para navegar fácilmente entre funcionalidades según mis permisos

Criterios de aceptación:
- Dado que NO estoy autenticado
  Cuando veo el header
  Entonces veo solo enlaces públicos y un botón "Iniciar Sesión"

- Dado que estoy autenticado
  Cuando veo el header
  Entonces veo enlaces a "Productos", "Mis Órdenes"
  Y si soy ADMIN, veo enlace a "Admin"
  Y veo un botón "Cerrar Sesión" con mi nombre de usuario

- Dado que hago click en "Cerrar Sesión"
  Cuando confirmo la acción
  Entonces se eliminan los tokens
  Y soy redirigido a la página de inicio
  Y el header vuelve al estado no autenticado

Trazabilidad técnica:
- Header: [nova-commerce-front/src/app/shared/components/header/header.component.ts](nova-commerce-front/src/app/shared/components/header/header.component.ts)
- Template: [nova-commerce-front/src/app/shared/components/header/header.component.html](nova-commerce-front/src/app/shared/components/header/header.component.html)
- AuthFacade: [nova-commerce-front/src/app/features/auth/services/auth.facade.ts](nova-commerce-front/src/app/features/auth/services/auth.facade.ts)

DoD:
- Header reactivo al estado de autenticación
- Uso de *hasRole para enlaces condicionales
- Botón de logout funcional
- Muestra username del usuario autenticado

---

### HU-FE-018 — Servicio AuthService para HTTP
- Como Desarrollador
- Quiero un servicio dedicado exclusivamente a llamadas HTTP de autenticación
- Para mantener la lógica HTTP separada de la orquestación

Criterios de aceptación:
- Dado el servicio AuthService
  Cuando se llama a login(credentials)
  Entonces se ejecuta POST a /api/auth/login y retorna LoginResponse

- Dado el servicio AuthService
  Cuando se llama a refreshToken(token)
  Entonces se ejecuta POST a /api/auth/refresh y retorna RefreshTokenResponse

- Dado el servicio AuthService
  Cuando se llama a validateToken(token)
  Entonces se ejecuta GET a /api/auth/validate y retorna ValidateTokenResponse

Trazabilidad técnica:
- AuthService: [nova-commerce-front/src/app/features/auth/services/auth.service.ts](nova-commerce-front/src/app/features/auth/services/auth.service.ts)
- Models: [nova-commerce-front/src/app/features/auth/models/auth.models.ts](nova-commerce-front/src/app/features/auth/models/auth.models.ts)

DoD:
- Solo responsabilidad HTTP
- NO maneja storage ni navegación
- Usa modelos tipados
- Retorna Observables

---

### HU-FE-019 — AuthFacade como orquestador central
- Como Desarrollador
- Quiero un único punto de acceso a toda la lógica de autenticación
- Para evitar acoplamiento entre componentes y servicios

Criterios de aceptación:
- Dado el AuthFacade
  Cuando los componentes necesitan autenticarse
  Entonces llaman a authFacade.login() que orquesta AuthService + TokenService + Router

- Dado el AuthFacade
  Cuando los guards necesitan validar autenticación
  Entonces llaman a authFacade.isAuthenticated()

- Dado el AuthFacade
  Cuando se necesita validar roles
  Entonces llaman a authFacade.hasRole(role)

- Dado el AuthFacade
  Cuando se necesita información de usuario
  Entonces se puede suscribir a authFacade.authState$

Trazabilidad técnica:
- AuthFacade: [nova-commerce-front/src/app/features/auth/services/auth.facade.ts](nova-commerce-front/src/app/features/auth/services/auth.facade.ts)

DoD:
- Orquesta AuthService, TokenService y Router
- Expone métodos simples y claros
- Maneja estado reactivo con BehaviorSubject
- Es el ÚNICO punto de acceso para UI

---

### HU-FE-020 — Modelos tipados de autenticación
- Como Desarrollador
- Quiero tipos estrictos para todas las estructuras de autenticación
- Para evitar errores en tiempo de compilación y tener mejor IntelliSense

Criterios de aceptación:
- Dado los modelos de auth
  Cuando se definen interfaces
  Entonces están disponibles: LoginCredentials, LoginResponse, RefreshTokenRequest, RefreshTokenResponse, ValidateTokenResponse, AuthState, UserSession, DecodedToken

- Dado que uso estos tipos en el código
  Cuando cometo un error de tipado
  Entonces TypeScript me alerta en tiempo de compilación

Trazabilidad técnica:
- Models: [nova-commerce-front/src/app/features/auth/models/auth.models.ts](nova-commerce-front/src/app/features/auth/models/auth.models.ts)

DoD:
- Todas las interfaces exportadas
- Documentación inline con comentarios
- Usadas consistentemente en todo el módulo auth

---

### HU-FE-021 — Rutas de autenticación
- Como Usuario
- Quiero acceder a la página de login mediante una ruta dedicada
- Para iniciar sesión de manera intuitiva

Criterios de aceptación:
- Dado que navego a /auth/login
  Cuando la ruta se carga
  Entonces se carga perezosamente el módulo de auth
  Y veo la página de login

- Dado que intento acceder a /auth sin subruta
  Cuando navego a /auth
  Entonces soy redirigido a /auth/login

Trazabilidad técnica:
- Auth Routes: [nova-commerce-front/src/app/features/auth/auth.routes.ts](nova-commerce-front/src/app/features/auth/auth.routes.ts)
- App Routes: [nova-commerce-front/src/app/app.routes.ts](nova-commerce-front/src/app/app.routes.ts)

DoD:
- Lazy loading configurado
- Redirección por defecto a login
- Sin errores de navegación

---

### HU-FE-022 — Refresh de token automático
- Como Usuario autenticado
- Quiero que mi sesión se renueve automáticamente cuando el token expira
- Para no ser desconectado abruptamente durante mi uso del sistema

Criterios de aceptación:
- Dado que mi access_token ha expirado
  Cuando realizo una acción que requiere autenticación
  Entonces el sistema intenta renovar el token usando refresh_token
  Y si tiene éxito, continúa con la operación

- Dado que mi refresh_token también expiró
  Cuando el sistema intenta renovar
  Entonces se cierra la sesión automáticamente
  Y soy redirigido a login

Trazabilidad técnica:
- AuthFacade: [nova-commerce-front/src/app/features/auth/services/auth.facade.ts](nova-commerce-front/src/app/features/auth/services/auth.facade.ts)
- TokenInterceptor: [nova-commerce-front/src/app/features/auth/interceptors/token.interceptor.ts](nova-commerce-front/src/app/features/auth/interceptors/token.interceptor.ts)

DoD:
- Método refreshToken() implementado
- Manejo de errores 401
- Experiencia de usuario sin interrupciones

---

## 5) Definición de Hecho (general de la etapa)
- Cumple criterios de aceptación por HU
- Facade Pattern correctamente implementado
- Guards protegiendo rutas según especificación
- Interceptor adjuntando tokens automáticamente
- Tokens persistidos en localStorage
- UI reactiva al estado de autenticación
- Formulario de login con validaciones
- Manejo de errores HTTP y de validación
- Tests unitarios para servicios críticos
- Build sin errores de compilación ni tipado
- Responsive en desktop y mobile
- Sin duplicación de lógica
- Código documentado con comentarios inline

---

## 6) Fuera de Alcance (ETAPA 2)
- Registro de nuevos usuarios
- Recuperación de contraseña
- Cambio de contraseña
- Perfil de usuario
- Multi-factor authentication (MFA)
- OAuth / Login social
- Gestión de permisos granulares (más allá de roles)
- Funcionalidad real de Productos, Órdenes y Admin (solo protección)

---

## 7) Dependencias y Riesgos
- **Dependencia crítica**: Backend API Gateway debe estar disponible en http://localhost:8080
- **Dependencia**: Endpoints /api/auth/login, /api/auth/refresh, /api/auth/validate deben estar operativos
- **Riesgo**: Tokens almacenados en localStorage son vulnerables a XSS (mitigado con buenas prácticas de seguridad)
- **Riesgo**: Refresh token sin rotación (puede implementarse en futuras etapas)
- **Riesgo**: Usuario cierra tab antes de logout (tokens quedan en localStorage - comportamiento esperado)

---

## 8) Trazabilidad cruzada (mapa rápido)

### Servicios Core
- AuthService: [nova-commerce-front/src/app/features/auth/services/auth.service.ts](nova-commerce-front/src/app/features/auth/services/auth.service.ts)
- TokenService: [nova-commerce-front/src/app/features/auth/services/token.service.ts](nova-commerce-front/src/app/features/auth/services/token.service.ts)
- AuthFacade: [nova-commerce-front/src/app/features/auth/services/auth.facade.ts](nova-commerce-front/src/app/features/auth/services/auth.facade.ts)

### Guards & Interceptors
- AuthGuard: [nova-commerce-front/src/app/features/auth/guards/auth.guard.ts](nova-commerce-front/src/app/features/auth/guards/auth.guard.ts)
- RoleGuard: [nova-commerce-front/src/app/features/auth/guards/role.guard.ts](nova-commerce-front/src/app/features/auth/guards/role.guard.ts)
- TokenInterceptor: [nova-commerce-front/src/app/features/auth/interceptors/token.interceptor.ts](nova-commerce-front/src/app/features/auth/interceptors/token.interceptor.ts)

### UI Components
- Login Page: [nova-commerce-front/src/app/features/auth/pages/login/](nova-commerce-front/src/app/features/auth/pages/login/)
- Header (updated): [nova-commerce-front/src/app/shared/components/header/](nova-commerce-front/src/app/shared/components/header/)

### Directivas & Models
- HasRoleDirective: [nova-commerce-front/src/app/features/auth/directives/has-role.directive.ts](nova-commerce-front/src/app/features/auth/directives/has-role.directive.ts)
- Auth Models: [nova-commerce-front/src/app/features/auth/models/auth.models.ts](nova-commerce-front/src/app/features/auth/models/auth.models.ts)

### Routing
- Auth Routes: [nova-commerce-front/src/app/features/auth/auth.routes.ts](nova-commerce-front/src/app/features/auth/auth.routes.ts)
- App Routes (updated): [nova-commerce-front/src/app/app.routes.ts](nova-commerce-front/src/app/app.routes.ts)

### Configuration
- App Config (updated): [nova-commerce-front/src/app/app.config.ts](nova-commerce-front/src/app/app.config.ts)

---

## 9) Backlog de Próxima Etapa (referencia)

### ETAPA 3: Productos (Product Management)
- HU-FE-023 — Listar productos con paginación
- HU-FE-024 — Buscar y filtrar productos
- HU-FE-025 — Ver detalle de producto
- HU-FE-026 — Crear producto (ADMIN)
- HU-FE-027 — Editar producto (ADMIN)
- HU-FE-028 — Eliminar producto (ADMIN)
- HU-FE-029 — Subir imágenes de producto
- HU-FE-030 — Gestión de stock

### ETAPA 4: Órdenes (Order Management)
- HU-FE-031 — Ver mis órdenes
- HU-FE-032 — Ver detalle de orden
- HU-FE-033 — Crear orden (Checkout)
- HU-FE-034 — Cancelar orden
- HU-FE-035 — Seguimiento de estado de orden
- HU-FE-036 — Historial de órdenes

### ETAPA 5: Admin Dashboard
- HU-FE-037 — Dashboard con métricas
- HU-FE-038 — Gestión de usuarios
- HU-FE-039 — Gestión de roles y permisos
- HU-FE-040 — Reportes y analíticas
- HU-FE-041 — Configuración del sistema

---

## 10) Anexos y Enlaces
- Guía rápida: [QUICK_START.md](../QUICK_START.md)
- Resumen ejecutivo: [RESUMEN_EJECUTIVO.md](../RESUMEN_EJECUTIVO.md)
- HUs Etapa 1: [HUS_FIRST_STAGE.md](HUS_FIRST_STAGE.md)
- Documentación general: [DOCUMENTACION.md](../DOCUMENTACION.md)
- Árbol de directorios: [ARBOL_DIRECTORIOS.md](../ARBOL_DIRECTORIOS.md)
- Índice de archivos: [INDICE_ARCHIVOS.md](../INDICE_ARCHIVOS.md)

---

## 11) Verificación de Implementación

### Checklist de funcionalidades implementadas:
- ✅ AuthService con métodos login, refresh, validate
- ✅ TokenService para gestión de tokens en localStorage
- ✅ AuthFacade como orquestador único
- ✅ TokenInterceptor adjuntando Bearer token automáticamente
- ✅ AuthGuard protegiendo rutas autenticadas
- ✅ RoleGuard validando acceso por roles
- ✅ HasRoleDirective para UI condicional
- ✅ LoginComponent con formulario reactivo
- ✅ Modelos tipados (LoginCredentials, LoginResponse, etc.)
- ✅ Rutas de auth con lazy loading
- ✅ Header consciente de sesión
- ✅ Refresh token automático
- ✅ Manejo de errores 401/403
- ✅ Validaciones de formulario
- ✅ Feedback visual (loading, errores)
- ✅ ReturnUrl después de login
- ✅ Responsive design

### Endpoints del backend utilizados:
- `POST /api/auth/login` - Autenticación de usuario
- `POST /api/auth/refresh` - Renovación de token
- `GET /api/auth/validate` - Validación de token

### Flujo completo de autenticación:
1. Usuario navega a ruta protegida → AuthGuard redirige a /auth/login
2. Usuario ingresa credenciales → LoginComponent llama a AuthFacade.login()
3. AuthFacade orquesta AuthService.login() → Obtiene tokens del backend
4. TokenService guarda tokens en localStorage
5. AuthFacade actualiza authState$ con usuario autenticado
6. Usuario es redirigido a returnUrl o home
7. Peticiones HTTP subsiguientes incluyen automáticamente Bearer token (TokenInterceptor)
8. RoleGuard valida acceso a rutas según roles
9. Header muestra opciones según estado de autenticación
10. Al expirar token, se intenta refresh automático
11. Logout elimina tokens y resetea estado

---

**Fin del documento HUS_SECOND_STAGE.md**
