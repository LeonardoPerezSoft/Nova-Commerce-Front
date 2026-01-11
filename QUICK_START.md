# ⚡ QUICK START GUIDE - Nova Commerce Front ETAPA 1

## 🚀 5 Minutos para Empezar

### 1️⃣ Verificar Instalación
```bash
# Ir a la carpeta del proyecto
cd nova-commerce-front

# Verificar que npm está instalado
npm --version  # Debe ser v10.x
```

### 2️⃣ Instalar Dependencias (primera vez)
```bash
npm install

# Esperado: "up to date, audited 516 packages"
```

### 3️⃣ Iniciar Servidor de Desarrollo
```bash
npm start

# O alternativamente:
ng serve --open

# Abre automáticamente en http://localhost:4200
```

### 4️⃣ Navegar por la Aplicación
```
Homepage:   http://localhost:4200/
Productos:  http://localhost:4200/products
Órdenes:    http://localhost:4200/orders
Admin:      http://localhost:4200/admin
```

### 5️⃣ Verificar Compilación
```bash
# En otra terminal:
npm run build

# Esperado: "Application bundle generation complete"
```

---

## 📁 Estructura Rápida

```
src/app/
├── core/config/app.config.ts        ← Configuración global
├── shared/components/
│   ├── header/                      ← Logo + Navegación
│   ├── footer/                      ← Copyright
│   └── layout/main-layout/          ← Contenedor principal
├── features/
│   ├── home/                        ← / (Home)
│   ├── products/                    ← /products
│   ├── orders/                      ← /orders
│   └── admin/                       ← /admin
├── app.routes.ts                    ← Rutas principales
├── app.component.ts                 ← Root component
├── app.html                         ← Root template
└── app.scss                         ← Estilos globales
```

---

## 🎯 Tareas Comunes

### Agregar una nueva ruta
```typescript
// 1. Crear el componente
ng generate component features/my-feature/my-component --standalone

// 2. Actualizar app.routes.ts
{
  path: 'my-feature',
  loadChildren: () =>
    import('./features/my-feature/my-feature.routes').then(
      (m) => m.MY_FEATURE_ROUTES
    ),
}

// 3. Crear my-feature.routes.ts
export const MY_FEATURE_ROUTES: Routes = [
  {
    path: '',
    component: MyComponent,
  },
];
```

### Modificar estilos globales
```scss
// Ir a: src/app/app.scss
// Agregar estilos globales aquí

// O en componentes, usar BEM:
.my-component {
  &__item {
    // estilos
  }
  
  &--active {
    // variación
  }
}
```

### Cambiar configuración global
```typescript
// Ir a: src/app/core/config/app.config.ts
export const APP_CONFIG = {
  api: {
    baseUrl: 'http://localhost:8080',  // ← Cambiar aquí
  },
};
```

---

## 🧪 Testing

### Ejecutar tests
```bash
npm test

# Tests con coverage
ng test --code-coverage
```

---

## 🔧 Troubleshooting Rápido

### ❌ "Port 4200 is already in use"
```bash
ng serve --port 4201  # Usar otro puerto
```

### ❌ "Module not found"
```bash
npm install
rm -rf node_modules dist
npm install
```

### ❌ Error de SCSS
```bash
npm install -D sass
```

### ❌ Error de TypeScript
```bash
# Verificar imports
# Verificar tipado en app.config.ts
# Ejecutar: ng build
```

---

## 📚 Documentación Completa

Para más detalles consulta:
- [ARQUITECTURA_ETAPA1.md](ARQUITECTURA_ETAPA1.md) - Arquitectura detallada
- [README.md](nova-commerce-front/README.md) - Guía completa
- [ARBOL_DIRECTORIOS.md](ARBOL_DIRECTORIOS.md) - Estructura del proyecto

---

## 🎨 Vista de la App

```
┌──────────────────────────────────────────┐
│ NovaCommerce │ Productos Órdenes Admin [Login]
├──────────────────────────────────────────┤
│                                          │
│   Bienvenido a NovaCommerce              │
│   La mejor plataforma de e-commerce      │
│                                          │
├──────────────────────────────────────────┤
│ © 2026 NovaCommerce. Derechos reservados │
└──────────────────────────────────────────┘
```

---

## ✅ Checklist de Inicio

- [ ] `cd nova-commerce-front`
- [ ] `npm install` (primera vez)
- [ ] `npm start`
- [ ] Abrir http://localhost:4200
- [ ] Navegar por las rutas
- [ ] Verificar header y footer
- [ ] Probar responsive (F12)
- [ ] Listo! ✅

---

## 🚀 Próximos Pasos

### ETAPA 2 (Próxima)
- Autenticación JWT
- Guards por rol
- Directivas de visibilidad
- Login page

### Para Hoy
```bash
npm start
# Explorar la app!
```

---

## 📊 Stack Usado

- Angular 21
- TypeScript 5.9
- SCSS
- RxJS
- Express (SSR)

---

## 💡 Tips

### Usar RouterLink en templates
```html
<a routerLink="/" routerLinkActive="active">Home</a>
```

### Usar routerLink.active para estilos
```html
<a routerLink="/products" routerLinkActive="nc-header__nav-link--active">
  Productos
</a>
```

### Agregar variables de entorno
```typescript
// src/environments/environment.ts
export const environment = {
  apiUrl: 'http://localhost:8080'
};

// En app.config.ts
import { environment } from '../../environments/environment';
```

---

## 🆘 Ayuda

```bash
# Ver version de Angular
ng version

# Ver comandos disponibles
ng help

# Ver errores de compilación
npm run build

# Limpiar cache y reinstalar
rm -rf node_modules dist package-lock.json
npm install
```

---

**⏱️ Tiempo estimado: 5-10 minutos**
**🟢 Estado: Listo para usar**
**📅 Actualizado: 10 de enero de 2026**
