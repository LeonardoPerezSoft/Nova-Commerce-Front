import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { tokenInterceptor } from './features/auth/interceptors/token.interceptor';

/**
 * Configuración global de la aplicación Angular
 *
 * Providers configurados:
 * - Router con todas las rutas
 * - HttpClient con interceptor de tokens
 * - Fetch para requests HTTP
 * - Error listeners
 *
 * NOTA: SSR/Hydration deshabilitado para desarrollo local
 * ETAPA 2: Agregado tokenInterceptor para autenticación automática
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([tokenInterceptor]),
      withFetch()
    ),
  ],
};
