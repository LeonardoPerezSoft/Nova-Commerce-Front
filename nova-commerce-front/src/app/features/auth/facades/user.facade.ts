/**
 * UserFacade — Contexto centralizado del usuario autenticado
 *
 * RESPONSABILIDADES:
 * • Construir el User a partir del JWT (usando TokenService)
 * • Exponer el estado del usuario vía observables reactivos
 * • Sincronizarse automáticamente con cambios de autenticación
 * • Limpiar estado en logout
 *
 * ARQUITECTURA:
 * No tiene dependencias directas de componentes UI
 * Es independiente de vistas/rutas
 * Puede ser usado desde cualquier lugar de la app
 *
 * FLUJO:
 * 1. Usuario hace login (AuthFacade guarda tokens)
 * 2. UserFacade detecta cambio (via AuthFacade.authState$)
 * 3. UserFacade decodifica JWT → crea User
 * 4. Emite user$ para que componentes se actualicen
 * 5. En logout, limpia estado
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged, map } from 'rxjs';
import { TokenService } from '../services/token.service';
import { AuthFacade } from '../services/auth.facade';
import { User, UserContext } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserFacade {
  /**
   * Estado interno del contexto de usuario
   * Inicializado con estado vacío
   */
  private readonly userContextSubject = new BehaviorSubject<UserContext>({
    user: null,
    isAuthenticated: false,
    lastUpdated: Date.now(),
  });

  /**
   * Observable del estado completo del usuario
   * (user + flags + metadata)
   */
  public readonly userContext$ = this.userContextSubject.asObservable();

  /**
   * Observable del usuario actual (null si no autenticado)
   * Emite solo cuando el usuario cambia
   */
  public readonly user$: Observable<User | null> = this.userContext$.pipe(
    map((ctx) => ctx.user),
    distinctUntilChanged()
  );

  /**
   * Observable de flag de autenticación
   * true si hay usuario, false si logout/token expirado
   */
  public readonly isAuthenticated$: Observable<boolean> = this.userContext$.pipe(
    map((ctx) => ctx.isAuthenticated),
    distinctUntilChanged()
  );

  /**
   * Observable para mostrar email del usuario
   * null si no autenticado
   */
  public readonly email$: Observable<string | null> = this.user$.pipe(
    map((user) => user?.email ?? null),
    distinctUntilChanged()
  );

  /**
   * Observable para mostrar si es admin
   * true solo si tiene rol ADMIN
   */
  public readonly isAdmin$: Observable<boolean> = this.user$.pipe(
    map((user) => user?.roles?.includes('ADMIN') ?? false),
    distinctUntilChanged()
  );

  constructor(
    private readonly tokenService: TokenService,
    private readonly authFacade: AuthFacade
  ) {
    this.initializeUserContext();
    this.subscribeToAuthChanges();
  }

  /**
   * Inicializa el contexto del usuario desde tokens existentes en localStorage
   * Útil para cuando el usuario recarga la página
   */
  private initializeUserContext(): void {
    const token = this.tokenService.getAccessToken();

    if (token && !this.tokenService.isTokenExpired(token)) {
      const username = this.tokenService.getUsername();
      const roles = this.tokenService.getRoles();

      if (username) {
        this.updateUserContext({
          id: username, // El backend no devuelve ID, usamos username como identificador
          email: username,
          roles,
        });
      }
    }
  }

  /**
   * Se suscribe a cambios de autenticación desde AuthFacade
   * Cuando el usuario hace login/logout, actualiza el contexto
   */
  private subscribeToAuthChanges(): void {
    this.authFacade.authState$.subscribe((authState) => {
      if (authState.isAuthenticated && authState.username) {
        // Usuario ha hecho login - crear su contexto
        this.updateUserContext({
          id: authState.username,
          email: authState.username,
          roles: authState.roles || [],
        });
      } else {
        // Usuario ha hecho logout - limpiar contexto
        this.clearUserContext();
      }
    });
  }

  /**
   * Actualiza el estado interno del usuario
   * @param user - Datos del usuario (id, email, roles)
   */
  private updateUserContext(user: User): void {
    this.userContextSubject.next({
      user,
      isAuthenticated: true,
      lastUpdated: Date.now(),
    });
  }

  /**
   * Limpia el estado del usuario (logout)
   * Useful en logout y al expirar sesión
   */
  private clearUserContext(): void {
    this.userContextSubject.next({
      user: null,
      isAuthenticated: false,
      lastUpdated: Date.now(),
    });
  }

  /**
   * Obtiene el usuario actual (síncrono)
   * Devuelve null si no está autenticado
   *
   * ⚠️ Use observables (user$) cuando sea posible
   * Este método es útil solo para verificaciones síncronas
   */
  public getCurrentUser(): User | null {
    return this.userContextSubject.value.user;
  }

  /**
   * Verifica si el usuario está autenticado (síncrono)
   *
   * ⚠️ Use isAuthenticated$ observable cuando sea posible
   * Este método es útil solo para verificaciones síncronas
   */
  public isAuthenticated(): boolean {
    return this.userContextSubject.value.isAuthenticated;
  }

  /**
   * Verifica si el usuario actual tiene un rol específico
   * @param role - Rol a verificar (ej: 'ADMIN')
   * @returns true si el usuario tiene el rol
   */
  public hasRole(role: string): boolean {
    return this.getCurrentUser()?.roles?.includes(role) ?? false;
  }

  /**
   * Verifica si el usuario tiene ALGUNO de los roles especificados
   * @param roles - Array de roles a verificar
   * @returns true si tiene al menos un rol
   */
  public hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getCurrentUser()?.roles ?? [];
    return roles.some((role) => userRoles.includes(role));
  }

  /**
   * Verifica si el usuario tiene TODOS los roles especificados
   * @param roles - Array de roles a verificar
   * @returns true si tiene todos los roles (false si array vacío)
   */
  public hasAllRoles(roles: string[]): boolean {
    if (roles.length === 0) return false;
    const userRoles = this.getCurrentUser()?.roles ?? [];
    return roles.every((role) => userRoles.includes(role));
  }

  /**
   * Obtiene los roles del usuario actual
   * @returns Array de roles, o array vacío si no autenticado
   */
  public getRoles(): string[] {
    return this.getCurrentUser()?.roles ?? [];
  }

  /**
   * Observable que emite true si el usuario tiene un rol específico
   * Útil para uso en templates con async pipe
   * @param role - Rol a verificar
   */
  public hasRole$(role: string): Observable<boolean> {
    return this.user$.pipe(
      map((user) => user?.roles?.includes(role) ?? false),
      distinctUntilChanged()
    );
  }

  /**
   * Observable que emite true si el usuario tiene ALGUNO de los roles
   * @param roles - Array de roles a verificar
   */
  public hasAnyRole$(roles: string[]): Observable<boolean> {
    return this.user$.pipe(
      map((user) => {
        const userRoles = user?.roles ?? [];
        return roles.some((role) => userRoles.includes(role));
      }),
      distinctUntilChanged()
    );
  }
}
