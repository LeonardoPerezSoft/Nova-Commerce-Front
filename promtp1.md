Actúa como un arquitecto frontend senior especializado en Angular moderno.

Necesito implementar la ETAPA 0 del frontend para Nova Commerce, enfocada únicamente en:
- Seguridad
- Manejo de sesión
- Roles y permisos

Condiciones obligatorias:
- Angular 17+
- Standalone Components (NO NgModules)
- Arquitectura limpia
- Código desacoplado, escalable y testeable
- Alineado con backend basado en JWT
- Nada de UI todavía
- Nada de lógica de negocio en componentes

========================
📁 ESTRUCTURA A CREAR
========================
src/app/
├── core/
│   ├── auth/
│   │   ├── models/
│   │   │   ├── role.model.ts
│   │   │   └── user-session.model.ts
│   │   ├── auth.facade.ts
│   │   └── token.service.ts
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── role.guard.ts
│   └── interceptors/
│       └── token.interceptor.ts
│
├── shared/
│   └── directives/
│       └── has-role.directive.ts
│
└── app.config.ts

========================
🔐 REQUISITOS FUNCIONALES
========================

1️⃣ Roles del sistema
- ADMIN
- USER
- CUSTOMER

2️⃣ Modelo de sesión
Debe representar:
- username
- roles
- accessToken
- refreshToken (opcional)
- expiresAt (timestamp)

3️⃣ AuthFacade
Debe:
- Mantener la sesión del usuario en memoria
- Exponer:
  - isAuthenticated()
  - hasRole(role)
  - hasAnyRole(roles[])
  - token (getter)
- NO acceder directamente a localStorage

4️⃣ TokenService
- Encargado exclusivamente de:
  - Guardar sesión
  - Recuperar sesión
  - Limpiar sesión
- Usar localStorage
- Totalmente desacoplado del AuthFacade

5️⃣ TokenInterceptor
- Adjuntar automáticamente el header:
  Authorization: Bearer <token>
- Solo si hay sesión activa

6️⃣ Guards
- AuthGuard:
  - Bloquea rutas si no hay sesión
- RoleGuard:
  - Valida roles recibidos vía route.data.roles

7️⃣ Directiva hasRole
- Permite mostrar/ocultar elementos del DOM según rol
- Uso esperado:
  <button *hasRole="'ADMIN'">Eliminar</button>

========================
🧪 CALIDAD
========================
- Tipado estricto
- Single Responsibility
- Sin hardcodeos
- Código documentado brevemente
- Preparado para tests unitarios

========================
🎯 RESULTADO ESPERADO
========================
El frontend debe quedar listo para:
- Integrar login real en la siguiente etapa
- Proteger rutas por rol
- Mostrar UI basada en permisos
- Escalar sin refactors futuros

Genera todos los archivos necesarios con su contenido completo.
