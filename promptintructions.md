🧠 Enfoque General para el Frontend de Nova Commerce
🎯 Objetivo

Construir un Frontend Web de E-commerce estilo Amazon / Mercado Libre, pero:
limpio
mantenible
escalable
alineado con Clean Architecture
consumiendo solo el API Gateway
Nada de “componentes dios”.

🧱 Arquitectura Frontend Propuesta (Angular)

Vamos a aplicar Clean Architecture adaptada a Frontend, que es totalmente válido.
Capas 
UI (Components / Pages)
↓
Application (Use Cases / Facades)
↓
Domain (Models + Rules simples)
↓
Infrastructure (HTTP / API / Adapters)

📁 Estructura Base del Proyecto

src/
├── app/
│   ├── core/                        # Infraestructura global
│   │   ├── auth/
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.guard.ts
│   │   │   └── token.interceptor.ts
│   │   ├── layout/
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   └── main-layout.component.ts
│   │   └── config/
│   │       └── app.config.ts
│   │
│   ├── shared/                     # Reutilizable
│   │   ├── components/
│   │   ├── pipes/
│   │   ├── directives/
│   │   └── ui/
│   │
│   ├── features/                   # Dominios del negocio
│   │   ├── auth/
│   │   ├── products/
│   │   ├── customers/
│   │   ├── orders/
│   │   └── users/
│   │
│   ├── app.routes.ts
│   └── app.component.ts
│
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── main.ts


🎨 Diseño UI (Mockup mental)

No vamos a dibujar Figma aún, pero sí definir pantallas claras.

🖥️ MVP UI (Estilo Amazon / Mercado Libre)
🏠 Home

Header fijo (logo + buscador + login)
Grid de productos
Filtro por categoría

📦 Product Detail
Imagen
Precio
Categoría

Botón “Agregar al carrito”

🛒 Cart / Order
Lista de productos
Totales
Descuentos aplicados (fidelidad, temporada, tipo)

🔐 Auth
Login simple
Manejo de sesión con JWT

🔹 Etapa 0 (Transversal) — Seguridad y Roles (desde el día 1)

Esta etapa no es visual, es estructural.
Aquí se define:
Modelo UserSession
Modelo Role
Mapeo de permisos
Guards por rol
Directivas de visibilidad

Resultado:
El frontend entiende quién es quién
No hay if (role === 'ADMIN') tirados por ahí

🔹 Etapa 1 — Base del Frontend (Infraestructura)

✔ Angular Standalone
✔ Routing base
✔ Layout (header/footer)
✔ Environment + baseUrl
✔ Layout consciente de sesión
Header cambia según rol
Menú dinámico

📌 Aquí ya existe AuthContext, aunque no haya login aún.

🔹 Etapa 2 — Autenticación + Autorización
Aquí sí entramos a jugar en serio.
Incluye:
Login page
AuthService
TokenInterceptor
AuthGuard (logueado)
RoleGuard (por rol)
Persistencia de sesión
Ejemplo real:
/admin/** → solo ADMIN
/orders/** → USER y ADMIN
/shop/** → CUSTOMER

💡 El token JWT que ya tienes contiene roles, así que el frontend solo los interpreta.

🔹 Etapa 3 — Dominio ADMIN (Backoffice)
Esto NO es lo mismo que la tienda.
Features:
Gestión de usuarios
Gestión de roles
Gestión de productos
Gestión de categorías

📁 Features:

🔹 Etapa 0 (Transversal) — Seguridad y Roles (desde el día 1)

Esta etapa no es visual, es estructural.

Aquí se define:

Modelo UserSession

Modelo Role

Mapeo de permisos

Guards por rol

Directivas de visibilidad

Resultado:

El frontend entiende quién es quién

No hay if (role === 'ADMIN') tirados por ahí

🔹 Etapa 1 — Base del Frontend (Infraestructura)

✔ Angular Standalone
✔ Routing base
✔ Layout (header/footer)
✔ Environment + baseUrl
✔ Layout consciente de sesión

Header cambia según rol

Menú dinámico

📌 Aquí ya existe AuthContext, aunque no haya login aún.

🔹 Etapa 2 — Autenticación + Autorización

Aquí sí entramos a jugar en serio.

Incluye:

Login page

AuthService

TokenInterceptor

AuthGuard (logueado)

RoleGuard (por rol)

Persistencia de sesión

Ejemplo real:

/admin/** → solo ADMIN

/orders/** → USER y ADMIN

/shop/** → CUSTOMER

💡 El token JWT que ya tienes contiene roles, así que el frontend solo los interpreta.

🔹 Etapa 3 — Dominio ADMIN (Backoffice)

Esto NO es lo mismo que la tienda.

📁 Features:


Gestión de usuarios
Gestión de roles
Gestión de productos
Gestión de categorías

🔐 Protegido con RoleGuard: ADMIN

🔹 Etapa 4 — Dominio CUSTOMER (Tienda)
Features:

Home pública
Catálogo de productos
Detalle producto
Carrito
Crear orden

📁 Features:

features/
└── shop/
    ├── catalog/
    ├── product-detail/
    ├── cart/
    └── checkout/


🔹 Etapa 5 — Dominio USER (Operativo / Interno)
Este rol suele olvidarse… hasta que el negocio crece.
Features:
Ver órdenes
Procesar pedidos
Atención cliente
Cambios de estado

📁 Features:

features/
└── operations/
    ├── orders/
    └── customers/


🧠 Cómo se controla esto técnicamente (sin caos)
🔐 RoleGuard
canActivate(route: ActivatedRouteSnapshot) {
  const allowedRoles = route.data['roles'] as Role[];
  return this.authFacade.hasAnyRole(allowedRoles);
}


🎯 Routing limpio
{
  path: 'admin',
  canActivate: [AuthGuard, RoleGuard],
  data: { roles: ['ADMIN'] },
  loadChildren: () => import('./features/admin/admin.routes')
}


👁️ Directiva de visibilidad
<button *hasRole="'ADMIN'">Eliminar producto</button>

Nada de lógica en componentes. Punto.

🧱 Estructura FINAL (con roles claros)
features/
├── auth/
├── admin/
├── shop/
├── operations/
├── products/   (si es compartido)
├── orders/


🧠 Reglas de Oro (igual que backend)
Díselo explícitamente a Copilot:
❌ No lógica de negocio en componentes
❌ No servicios gigantes
❌ No HTTP directo desde UI
✅ Use cases en capa application
✅ Modelos tipados
✅ Componentes pequeños