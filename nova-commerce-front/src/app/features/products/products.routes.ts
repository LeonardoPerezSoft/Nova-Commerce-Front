/**
 * Products Feature Routes
 *
 * RUTAS:
 * /products → ProductListComponent (listado con filtros)
 * /products/:id → ProductDetailComponent (detalle del producto)
 *
 * ARQUITECTURA:
 * • Lazy loading (cargado bajo demanda desde app.routes.ts)
 * • Standalone components (no NgModules)
 * • Sin guards (acceso público, ya protegido en app.routes.ts)
 *
 * IMPORTACIÓN EN app.routes.ts:
 * {
 *   path: 'products',
 *   canActivate: [authGuard],
 *   loadChildren: () => import('./features/products/products.routes').then(m => m.PRODUCTS_ROUTES)
 * }
 */

import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/product-list/product-list.component').then(
        (m) => m.ProductListComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      ),
  },
];
