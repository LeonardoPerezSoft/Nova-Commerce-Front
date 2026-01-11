# Nova Commerce Front - ETAPA 1 (Base del Frontend)

## 🚀 Inicio Rápido

### Requisitos Previos
- **Node.js**: v20.x o superior
- **npm**: v10.x o superior
- **Angular CLI**: v21.0.5

### Instalación

```bash
cd nova-commerce-front
npm install
```

### Desarrollo

```bash
# Servidor de desarrollo
npm start

# O con Angular CLI
ng serve --open
```

La aplicación estará disponible en: **http://localhost:4200**

### Build

```bash
# Build de desarrollo
npm run build

# Build optimizado para producción
ng build --configuration production

# Build con SSR
ng build --ssr
```

### Server SSR

```bash
npm run serve:ssr:nova-commerce-front
```

---

## 📂 Estructura del Proyecto

```
nova-commerce-front/
├── src/
│   ├── app/
│   │   ├── core/                    # Infraestructura transversal
│   │   │   └── config/
│   │   │       └── app.config.ts
│   │   ├── shared/                  # Componentes reutilizables
│   │   │   └── components/
│   │   │       ├── header/
│   │   │       ├── footer/
│   │   │       └── layout/
│   │   ├── features/                # Dominios de negocio
│   │   │   ├── home/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   └── admin/
│   │   ├── app.routes.ts            # Rutas principales
│   │   ├── app.component.ts         # Root component
│   │   └── app.scss                 # Estilos globales
│   ├── main.ts                      # Entry point
│   ├── index.html
│   └── styles.scss
├── angular.json                     # Config de Angular
├── tsconfig.json                    # Config de TypeScript
├── package.json
└── README.md
```

---

## 🛣️ Rutas Disponibles

| Ruta | Componente | Estado |
|------|-----------|--------|
| `/` | HomeComponent | ✅ Implementado |
| `/products` | ProductsComponent | 🔄 Placeholder |
| `/orders` | OrdersComponent | 🔄 Placeholder |
| `/admin` | AdminComponent | 🔄 Placeholder |

---

## 🎨 Componentes Principales

### MainLayoutComponent
**Ubicación**: `src/app/shared/components/layout/main-layout/`

Contenedor principal que incluye:
- Header (navegación sticky)
- Main content (router-outlet)
- Footer (copyright)

### HeaderComponent
**Ubicación**: `src/app/shared/components/header/`

Incluye:
- Logo "NovaCommerce"
- Enlaces de navegación
- Botón Login (placeholder para ETAPA 2)

### FooterComponent
**Ubicación**: `src/app/shared/components/footer/`

Muestra copyright con año dinámico

---

## 🔧 Configuración Global

**Ubicación**: `src/app/core/config/app.config.ts`

```typescript
export const APP_CONFIG = {
  api: {
    baseUrl: 'http://localhost:8080',
    timeout: 30000,
    apiGateway: '/api/v1',
  },
  routes: {
    home: '/',
    products: '/products',
    orders: '/orders',
    admin: '/admin',
    login: '/auth/login',
  },
};
```

Actualiza aquí valores globales como URLs de API, rutas, etc.

---

## 📋 Características Implementadas

✅ **Standalone Components** - Sin NgModules
✅ **Clean Architecture** - Separación de capas clara
✅ **Routing Modular** - Lazy loading automático
✅ **Responsive Design** - Mobile-first
✅ **SCSS Modules** - Estilos escalables
✅ **TypeScript Strict** - Tipado fuerte
✅ **SSR Habilitado** - Server-Side Rendering listo

---

## 📦 Stack Tecnológico

- **Angular**: 21.0.0
- **TypeScript**: 5.9.2
- **SCSS**: Styling
- **RxJS**: 7.8.0
- **Express**: SSR support
- **Vitest**: Testing (configurado)

---

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
ng test --code-coverage
```

---

## 🚧 Próximos Pasos (ETAPA 2)

### A Implementar
- [ ] Autenticación JWT
- [ ] Guards (AuthGuard, RoleGuard)
- [ ] Interceptor de tokens
- [ ] Directivas de visibilidad por rol
- [ ] Servicios HTTP
- [ ] Manejo de sesión

---

## 📖 Documentación Completa

Para información detallada sobre la arquitectura y diseño de la ETAPA 1, consulta:

📄 **[ARQUITECTURA_ETAPA1.md](../ARQUITECTURA_ETAPA1.md)**

---

## 🐛 Troubleshooting

### Error: "Module not found"
```bash
npm install
ng build --watch
```

### Puerto 4200 en uso
```bash
ng serve --port 4201
```

### Problemas con SCSS
```bash
npm install -D sass
```

---

## 📞 Soporte

Para reportar issues o sugerencias, crear un issue en el repositorio.

---

## 📄 Licencia

Proyecto propietario Nova Commerce © 2026

---

**Estado**: 🟢 Listo para ETAPA 2
**Última actualización**: 10 de enero de 2026
