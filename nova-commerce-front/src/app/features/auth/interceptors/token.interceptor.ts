import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { AuthFacade } from '../services/auth.facade';
import { catchError, throwError } from 'rxjs';

/**
 * TokenInterceptor (Functional Interceptor - Angular 15+)
 *
 * Responsabilidades:
 * - Agregar automáticamente el header Authorization: Bearer <token>
 * - Excluir endpoints públicos (/auth/login, /auth/refresh)
 * - Manejar errores 401 (token expirado) y cerrar sesión
 *
 * Se ejecuta en TODAS las peticiones HTTP salvo las excluidas
 */
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authFacade = inject(AuthFacade);

  // URLs que NO deben llevar token
  const excludedUrls = ['/api/auth/login', '/api/auth/refresh'];

  // Verificar si la URL actual está en la lista de exclusión
  const isExcluded = excludedUrls.some((url) => req.url.includes(url));

  // Si está excluida, continuar sin modificar
  if (isExcluded) {
    return next(req);
  }

  // Obtener el access token
  const token = tokenService.getAccessToken();

  // Si no hay token, continuar sin modificar
  if (!token) {
    return next(req);
  }

  // Clonar la request y agregar el header Authorization
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Continuar con la request modificada y manejar errores
  return next(clonedRequest).pipe(
    catchError((error) => {
      // Si es 401 Unauthorized, cerrar sesión
      if (error.status === 401) {
        console.warn('Token inválido o expirado. Cerrando sesión...');
        authFacade.logout();
      }

      // Si es 403 Forbidden, el usuario no tiene permisos
      if (error.status === 403) {
        console.warn('Acceso denegado. Permisos insuficientes.');
      }

      return throwError(() => error);
    })
  );
};
