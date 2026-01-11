import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthFacade } from '../services/auth.facade';

/**
 * AuthGuard (Functional Guard - Angular 15+)
 *
 * Responsabilidad: Proteger rutas que requieren autenticación
 *
 * Uso:
 * ```typescript
 * {
 *   path: 'admin',
 *   component: AdminComponent,
 *   canActivate: [authGuard]
 * }
 * ```
 *
 * Comportamiento:
 * - Si el usuario está autenticado → Permite acceso
 * - Si NO está autenticado → Redirige a /auth/login
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);

  if (authFacade.isAuthenticated()) {
    return true;
  }

  // Guardar la URL original para redirigir después del login
  const returnUrl = state.url;
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl },
  });

  return false;
};
