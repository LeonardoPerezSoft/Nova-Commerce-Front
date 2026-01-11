# HUS — Nova Commerce Front — ETAPA 1 (Base del Frontend)

Documento maestro de Historias de Usuario para la primera etapa del frontend (base arquitectónica). Mantiene el mismo espíritu y criterios que el documento HUS del Order-Service: claridad de alcance, criterios de aceptación verificables, trazabilidad técnica, Definición de Hecho y preparación para etapas siguientes.

---

## 1) Contexto y Alcance

- Proyecto: Nova Commerce Front (Angular 21, Standalone Components, SSR)
- Backend: Microservicios detrás de API Gateway (http://localhost:8080)
- Etapa actual: ETAPA 1 — Base del Frontend (sin lógica de negocio)
- Objetivo: Entregar estructura de UI y routing lista para escalar en próximas etapas (auth, roles, features).

En esta etapa NO se implementan: autenticación, guards, interceptors, servicios HTTP, estado global, lógica de negocio.

---

## 2) Principios y Lineamientos (heredados de Clean Architecture)

- Standalone Components; no NgModules.
- Separación de responsabilidades (UI / Application / Domain / Infrastructure).
- Componentes presentacionales (sin lógica de negocio).
- Rutas lazy-loaded por feature.
- Configuración centralizada.
- Preparado para SSR.
- Código tipado, testable y escalable.

---

## 3) Roles y Actores (en esta etapa)

- Visitante: Usuario no autenticado que navega la aplicación.
- Roles futuros (referencia, no implementados): ADMIN, USER, CUSTOMER.

---

## 4) Historias de Usuario (HUs)

A continuación se listan HUs que reflejan EXACTAMENTE lo entregado en ETAPA 1.

### HU-FE-001 — Header de navegación global
- Como Visitante
- Quiero ver un encabezado con el logo y navegación principal
- Para moverme rápidamente entre secciones clave del sitio

Criterios de aceptación (Gherkin):
- Dado que ingreso a la app
  Cuando la página carga
  Entonces veo el header sticky con el logo "NovaCommerce" y los enlaces "Productos", "Mis Órdenes" y "Admin"
- Dado que hago click en cada enlace
  Cuando se navega a la ruta correspondiente
  Entonces el enlace activo se resalta visualmente

Trazabilidad técnica:
- Header: [nova-commerce-front/src/app/shared/components/header/header.component.ts](nova-commerce-front/src/app/shared/components/header/header.component.ts)
- Template: [nova-commerce-front/src/app/shared/components/header/header.component.html](nova-commerce-front/src/app/shared/components/header/header.component.html)
- Estilos: [nova-commerce-front/src/app/shared/components/header/header.component.scss](nova-commerce-front/src/app/shared/components/header/header.component.scss)

Definición de Hecho (DoD):
- Renderiza en desktop y mobile (responsive).
- Enlaces navegan sin recarga (Angular Router).
- No hay lógica de negocio en el componente.
- Sin errores de consola.

---

### HU-FE-002 — Footer informativo
- Como Visitante
- Quiero ver un pie de página con copyright
- Para entender la autoría y derechos del sitio

Criterios de aceptación:
- Dado que ingreso a cualquier ruta
  Cuando se renderiza la página
  Entonces veo un footer con el texto "© {año} NovaCommerce. Todos los derechos reservados."

Trazabilidad técnica:
- Footer: [nova-commerce-front/src/app/shared/components/footer/footer.component.ts](nova-commerce-front/src/app/shared/components/footer/footer.component.ts)
- Template: [nova-commerce-front/src/app/shared/components/footer/footer.component.html](nova-commerce-front/src/app/shared/components/footer/footer.component.html)
- Estilos: [nova-commerce-front/src/app/shared/components/footer/footer.component.scss](nova-commerce-front/src/app/shared/components/footer/footer.component.scss)

DoD:
- Renderiza consistente en todas las rutas.
- Año actual dinámico.
- Sin lógica de negocio.

---

### HU-FE-003 — Layout raíz con contenido dinámico
- Como Visitante
- Quiero que el sitio tenga un layout consistente con Header, contenido y Footer
- Para tener una experiencia uniforme al navegar

Criterios de aceptación:
- Dado el layout principal
  Cuando navego entre secciones
  Entonces el header y footer permanecen, y solo cambia el contenido central (router-outlet)

Trazabilidad técnica:
- Main Layout: [nova-commerce-front/src/app/shared/components/layout/main-layout/main-layout.component.ts](nova-commerce-front/src/app/shared/components/layout/main-layout/main-layout.component.ts)
- Template: [nova-commerce-front/src/app/shared/components/layout/main-layout/main-layout.component.html](nova-commerce-front/src/app/shared/components/layout/main-layout/main-layout.component.html)
- Estilos: [nova-commerce-front/src/app/shared/components/layout/main-layout/main-layout.component.scss](nova-commerce-front/src/app/shared/components/layout/main-layout/main-layout.component.scss)

DoD:
- Footer al final (min-height: 100vh; flex column).
- Header sticky.
- Sin lógica de negocio.

---

### HU-FE-004 — Página de inicio (Home)
- Como Visitante
- Quiero ver una página de inicio que me dé contexto
- Para entender rápidamente que estoy en NovaCommerce

Criterios de aceptación:
- Dado que accedo a la ruta raíz "/"
  Cuando la app carga
  Entonces se renderiza la Home con un hero visual con título y descripción

Trazabilidad técnica:
- Home: [nova-commerce-front/src/app/features/home/home.component.ts](nova-commerce-front/src/app/features/home/home.component.ts)

DoD:
- Renderiza como ruta por defecto.
- Sin lógica de negocio.

---

### HU-FE-005 — Rutas por feature con Lazy Loading
- Como Visitante
- Quiero poder navegar a Productos, Órdenes y Admin
- Para explorar áreas principales del sistema

Criterios de aceptación:
- Dado que hago click en "Productos"
  Cuando se navega a "/products"
  Entonces se carga perezosamente la ruta y veo un placeholder de Productos
- Dado que hago click en "Mis Órdenes"
  Cuando se navega a "/orders"
  Entonces se carga perezosamente la ruta y veo un placeholder de Órdenes
- Dado que hago click en "Admin"
  Cuando se navega a "/admin"
  Entonces se carga perezosamente la ruta y veo un placeholder de Admin

Trazabilidad técnica:
- Rutas raíz: [nova-commerce-front/src/app/app.routes.ts](nova-commerce-front/src/app/app.routes.ts)
- Productos: [nova-commerce-front/src/app/features/products/products.routes.ts](nova-commerce-front/src/app/features/products/products.routes.ts)
- Órdenes: [nova-commerce-front/src/app/features/orders/orders.routes.ts](nova-commerce-front/src/app/features/orders/orders.routes.ts)
- Admin: [nova-commerce-front/src/app/features/admin/admin.routes.ts](nova-commerce-front/src/app/features/admin/admin.routes.ts)

DoD:
- Carga perezosa efectiva (chunks generados al build).
- Navegación sin full reload.
- Placeholders claros y responsivos.

---

### HU-FE-006 — Placeholders de features
- Como Visitante
- Quiero ver pantallas placeholder en Productos, Órdenes y Admin
- Para confirmar la estructura de navegación sin lógica implementada aún

Criterios de aceptación:
- Dado que navego a cada una de las rutas de feature
  Cuando se renderiza el contenido
  Entonces veo un mensaje claro indicando que la funcionalidad será implementada en etapas posteriores

Trazabilidad técnica:
- Productos: [nova-commerce-front/src/app/features/products/products.component.ts](nova-commerce-front/src/app/features/products/products.component.ts)
- Órdenes: [nova-commerce-front/src/app/features/orders/orders.component.ts](nova-commerce-front/src/app/features/orders/orders.component.ts)
- Admin: [nova-commerce-front/src/app/features/admin/admin.component.ts](nova-commerce-front/src/app/features/admin/admin.component.ts)

DoD:
- Mensajes de placeholder visibles.
- Sin llamadas HTTP, sin lógica de negocio.

---

### HU-FE-007 — Configuración centralizada de la aplicación
- Como Desarrollador
- Quiero tener un archivo de configuración centralizado
- Para evitar hardcodeos y facilitar mantenibilidad

Criterios de aceptación:
- Dado el archivo de configuración
  Cuando necesito la baseUrl y rutas nominales
  Entonces puedo consultar un único lugar para modificarlas

Trazabilidad técnica:
- App Config: [nova-commerce-front/src/app/core/config/app.config.ts](nova-commerce-front/src/app/core/config/app.config.ts)

DoD:
- Sin duplicación de constantes.
- Documentado y tipado.

---

### HU-FE-008 — Estilos globales y responsive
- Como Visitante
- Quiero una experiencia visual consistente y usable
- Para usar la app en desktop y mobile cómodamente

Criterios de aceptación:
- Dado que navego la app en diferentes tamaños de pantalla
  Cuando cambio el ancho del viewport
  Entonces el header, layout y placeholders se adaptan (mobile-first)

Trazabilidad técnica:
- Global styles: [nova-commerce-front/src/app/app.scss](nova-commerce-front/src/app/app.scss)
- Estilos de componentes: ver archivos *.scss de cada componente.

DoD:
- Media queries aplicadas.
- Sin overflow visual crítico.

---

### HU-FE-009 — App Root minimalista para enrutar
- Como Desarrollador
- Quiero que el componente raíz solo contenga el router-outlet
- Para delegar la estructura al MainLayout y mantener el root simple

Criterios de aceptación:
- Dado el componente raíz
  Cuando se genera la app
  Entonces el root template contiene únicamente el router-outlet y no incluye UI de negocio

Trazabilidad técnica:
- Root Component: [nova-commerce-front/src/app/app.ts](nova-commerce-front/src/app/app.ts)
- Root Template: [nova-commerce-front/src/app/app.html](nova-commerce-front/src/app/app.html)

DoD:
- Root sin lógica de negocio.
- Sin estilos innecesarios.

---

### HU-FE-010 — Preparación para SSR y build
- Como Operación/Dev
- Quiero que la base compile en modo browser y server
- Para habilitar SSR y despliegues consistentes

Criterios de aceptación:
- Dado el proyecto
  Cuando ejecuto el build
  Entonces genera bundles de browser y server sin errores

Trazabilidad técnica (verificación por build existente en entorno):
- Angular config y scripts en [nova-commerce-front/package.json](nova-commerce-front/package.json)

DoD:
- `npm run build` exitoso.
- Sin errores de compilación ni de tipado.

---

## 5) Definición de Hecho (general de la etapa)
- Cumple criterios de aceptación por HU.
- Sin lógica de negocio en componentes.
- Navegación SPA sin recargas.
- Lazy loading operativo en features.
- Estilos responsive verificados.
- Build local sin errores (browser y server).
- Código tipado y legible.

---

## 6) Fuera de Alcance (ETAPA 1)
- Autenticación/Autorización (JWT, guards, roles).
- Interceptor de tokens.
- Servicios HTTP y orquestación de casos de uso.
- Estado global.
- UI avanzada (formularios, tablas, carritos, etc.).

---

## 7) Dependencias y Riesgos
- Dependencia futura del API Gateway para datos reales.
- Riesgo de acoplamiento si se introducen hardcodeos (mitigado con configuración centralizada).
- Riesgo de introducir lógica de negocio en UI (mitigado con lineamientos y revisiones).

---

## 8) Trazabilidad cruzada (mapa rápido)
- Routing principal: [nova-commerce-front/src/app/app.routes.ts](nova-commerce-front/src/app/app.routes.ts)
- Layout: [nova-commerce-front/src/app/shared/components/layout/main-layout/](nova-commerce-front/src/app/shared/components/layout/main-layout/)
- Header: [nova-commerce-front/src/app/shared/components/header/](nova-commerce-front/src/app/shared/components/header/)
- Footer: [nova-commerce-front/src/app/shared/components/footer/](nova-commerce-front/src/app/shared/components/footer/)
- Features: [nova-commerce-front/src/app/features/](nova-commerce-front/src/app/features/)
- Config: [nova-commerce-front/src/app/core/config/app.config.ts](nova-commerce-front/src/app/core/config/app.config.ts)

---

## 9) Backlog de Próxima Etapa (referencia)
- HU-FE-011 — Iniciar sesión con JWT.
- HU-FE-012 — Persistencia de sesión (TokenService).
- HU-FE-013 — Interceptor de token (Authorization: Bearer <token>).
- HU-FE-014 — AuthGuard (bloquear rutas si no hay sesión).
- HU-FE-015 — RoleGuard (validar `data.roles`).
- HU-FE-016 — Directiva `hasRole` para visibilidad por permisos.
- HU-FE-017 — UI consciente de sesión (header dinámico).

---

## 10) Anexos y Enlaces
- Guía rápida: [QUICK_START.md](../QUICK_START.md)
- Resumen ejecutivo: [RESUMEN_EJECUTIVO.md](../RESUMEN_EJECUTIVO.md)
- Arquitectura (detalle): [ARQUITECTURA_ETAPA1.md](../ARQUITECTURA_ETAPA1.md)
- Árbol de directorios: [ARBOL_DIRECTORIOS.md](../ARBOL_DIRECTORIOS.md)
- Índice de archivos: [INDICE_ARCHIVOS.md](../INDICE_ARCHIVOS.md)
