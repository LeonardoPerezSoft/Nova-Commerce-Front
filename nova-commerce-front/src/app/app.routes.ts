import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/components/layout/main-layout/main-layout.component';

/**
 * Rutas principales de la aplicación
 *
 * Estructura:
 * - Ruta raíz: MainLayoutComponent (contenedor con Header, Footer, router-outlet)
 * - Rutas hijas lazy-loaded:
 *   - / → HomeComponent
 *   - /products → ProductsComponent
 *   - /orders → OrdersComponent
 *   - /admin → AdminComponent
 *
 * TODO ETAPA 2:
 * - Agregar AuthGuard en rutas protegidas
 * - Agregar RoleGuard en /admin
 * - Agregar lazy loading de AuthModule
 */

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./features/products/products.routes').then(
            (m) => m.PRODUCTS_ROUTES
          ),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./features/orders/orders.routes').then(
            (m) => m.ORDERS_ROUTES
          ),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./features/admin/admin.routes').then(
            (m) => m.ADMIN_ROUTES
          ),
      },
    ],
  },
];
