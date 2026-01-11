import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { tokenInterceptor } from './features/auth/interceptors/token.interceptor';

/**
 * Configuración global de la aplicación Angular
 *
 * Providers configurados:
 * - Router con todas las rutas
 * - HttpClient con interceptor de tokens
 * - Client Hydration para SSR
 * - Error listeners
 *
 * ETAPA 2: Agregado tokenInterceptor para autenticación automática
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([tokenInterceptor]),
      withFetch() // Para compatibilidad con SSR
    ),
    provideClientHydration(withEventReplay()),
  ],
};
