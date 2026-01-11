# GitHub Actions CI/CD - Nova Commerce Front

## 📋 Descripción

Pipeline de Integración Continua para el frontend de Nova Commerce, implementado con GitHub Actions.

## 🚀 Características

- ✅ **Build automático** en push y pull requests
- ✅ **Tests unitarios** con Vitest
- ✅ **Verificación de cobertura** (mínimo 80%)
- ✅ **Compilación TypeScript** (validación de tipos)
- ✅ **Build de producción**
- ✅ **Artefactos** con retención de 30 días
- ✅ **Cache de dependencias** para builds más rápidos

## 🔧 Configuración

### Estructura de archivos

```
.github/
└── workflows/
    └── ci.yml          # Pipeline principal de CI
```

### Triggers

El pipeline se ejecuta automáticamente en:

- **Push** a las ramas `develop` y `main`
- **Pull Requests** hacia `develop` y `main`
- **Manual** desde la UI de GitHub (workflow_dispatch)

### Exclusiones

El pipeline NO se ejecuta cuando solo se modifican:
- Archivos markdown (`**.md`)
- Carpeta `docs/`
- `.gitignore`
- `LICENSE`

## 📊 Jobs del Pipeline

### 1. Build & Test

| Step | Descripción | Comando |
|------|-------------|---------|
| Checkout | Clona el repositorio | `actions/checkout@v4` |
| Setup Node.js | Instala Node.js 20.x LTS | `actions/setup-node@v4` |
| Install | Instalación limpia de deps | `npm ci` |
| Lint | Validación TypeScript | `tsc --noEmit` |
| Test | Tests con cobertura | `npm run test:coverage` |
| Coverage | Verifica umbral >= 80% | Script bash |
| Build | Build de producción | `npm run build` |
| Upload Coverage | Sube reporte de cobertura | `actions/upload-artifact@v4` |
| Upload Build | Sube dist/ como artefacto | `actions/upload-artifact@v4` |

### 2. CI Summary

Job que genera un resumen ejecutivo del pipeline.

## 🧪 Testing Local

Antes de hacer push, puedes verificar que todo pase localmente:

```bash
# Navegar al proyecto
cd nova-commerce-front

# Linting
npm run lint

# Tests con cobertura
npm run test:coverage

# Build de producción
npm run build -- --configuration production
```

## 📦 Artefactos

El pipeline genera dos tipos de artefactos:

### Coverage Report
- **Nombre**: `coverage-report-{SHA}`
- **Contenido**: `coverage/`
- **Retención**: 30 días
- **Condición**: Siempre (incluso si tests fallan)

### Build Artifacts
- **Nombre**: `build-artifacts-{SHA}`
- **Contenido**: `dist/`
- **Retención**: 30 días
- **Condición**: Solo si todos los pasos anteriores pasan

## 📈 Métricas de Coverage

El pipeline verifica que la cobertura de código sea >= 80%:

```bash
# Extrae porcentaje de coverage/coverage-summary.json
# Si es < 80%, el pipeline falla
```

### Cómo ver el reporte de cobertura

1. Ve a la pestaña **Actions** en GitHub
2. Selecciona el workflow ejecutado
3. Descarga el artefacto `coverage-report-{SHA}`
4. Abre `index.html` en tu navegador

## 🔍 Troubleshooting

### ❌ "Coverage below 80%"
**Solución**: Agrega más tests o revisa `vitest.config.ts` para ajustar umbrales.

### ❌ "TypeScript errors"
**Solución**: Ejecuta `tsc --noEmit` localmente y corrige errores de tipado.

### ❌ "npm ci failed"
**Solución**: Asegúrate de que `package-lock.json` esté actualizado:
```bash
npm install
git add package-lock.json
git commit -m "chore: update package-lock.json"
```

### ⚠️ "Slow builds"
El pipeline usa cache de npm automáticamente. Si persiste:
- Revisa que `cache-dependency-path` esté correcto en `ci.yml`
- Considera usar `npm ci --prefer-offline`

## 🔐 Permisos

El workflow usa permisos mínimos (least privilege):
- `contents: read` - Leer código del repo
- `pull-requests: read` - Leer información de PRs

Si necesitas comentar en PRs con coverage, agrega:
```yaml
permissions:
  pull-requests: write
```

## 🚀 Mejoras Futuras

- [ ] Agregar ESLint real (en lugar de solo TypeScript check)
- [ ] Comentar coverage automáticamente en PRs
- [ ] Agregar análisis de bundle size
- [ ] Matriz de testing con múltiples versiones de Node.js
- [ ] Integración con SonarQube/CodeCov
- [ ] Deploy automático a staging/production

## 📚 Referencias

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [actions/setup-node](https://github.com/actions/setup-node)
- [actions/upload-artifact](https://github.com/actions/upload-artifact)
- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Vitest Coverage](https://vitest.dev/guide/coverage)

---

**Última actualización**: 11 de enero de 2026
**Versión**: 1.0.0
