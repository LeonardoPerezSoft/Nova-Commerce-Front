import { Routes } from '@angular/router';

/**
 * Rutas del módulo de autenticación
 * Todas las rutas relacionadas con auth (login, registro futuro, etc.)
 */
export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
