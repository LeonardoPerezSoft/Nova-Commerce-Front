import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthFacade } from '../services/auth.facade';

/**
 * RoleGuard (Functional Guard - Angular 15+)
 *
 * Responsabilidad: Proteger rutas que requieren roles específicos
 *
 * Uso en rutas:
 * ```typescript
 * {
 *   path: 'admin',
 *   component: AdminComponent,
 *   canActivate: [authGuard, roleGuard],
 *   data: { roles: ['ADMIN'] }
 * }
 * ```
 *
 * O para múltiples roles:
 * ```typescript
 * data: { roles: ['ADMIN', 'MANAGER'] }
 * ```
 *
 * Comportamiento:
 * - Si el usuario tiene el rol requerido → Permite acceso
 * - Si NO tiene el rol → Redirige a /
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);

  // Obtener roles requeridos desde route.data
  const requiredRoles = route.data['roles'] as string[] | undefined;

  // Si no hay roles definidos, permitir acceso
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // Verificar si el usuario tiene al menos uno de los roles requeridos
  if (authFacade.hasAnyRole(requiredRoles)) {
    return true;
  }

  // Si no tiene el rol, redirigir al home
  console.warn(
    `Acceso denegado. Se requiere uno de los roles: ${requiredRoles.join(', ')}`
  );
  router.navigate(['/']);
  return false;
};
