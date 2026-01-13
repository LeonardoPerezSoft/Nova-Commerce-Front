import { Injectable } from '@angular/core';
import { JwtPayload } from '../models/auth.models';

/**
 * TokenService
 *
 * Responsabilidad ÚNICA: Gestión de tokens en localStorage
 *
 * Responsabilidades:
 * - Guardar access_token y refresh_token
 * - Leer tokens desde storage
 * - Limpiar tokens (logout)
 * - Decodificar JWT y extraer roles/username
 *
 * NO responsable de:
 * - Hacer llamadas HTTP
 * - Navegación
 * - Lógica de negocio
 */
@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'nc_access_token';
  private readonly REFRESH_TOKEN_KEY = 'nc_refresh_token';
  private readonly USERNAME_KEY = 'nc_username';
  private readonly ROLES_KEY = 'nc_roles';
  private readonly CUSTOMER_ID_KEY = 'nc_customer_id';

  /**
   * Guarda los tokens y metadatos en localStorage
   */
  setTokens(
    accessToken: string,
    refreshToken: string,
    username: string,
    roles: string[]
  ): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(this.USERNAME_KEY, username);
    localStorage.setItem(this.ROLES_KEY, JSON.stringify(roles));
    // Extraer customerId del token si está disponible
    const payload = this.decodeToken(accessToken);
    if (payload?.customerId) {
      localStorage.setItem(this.CUSTOMER_ID_KEY, payload.customerId.toString());
    }
  }

  /**
   * Obtiene el access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Obtiene el refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Obtiene el username almacenado
   */
  getUsername(): string | null {
    return localStorage.getItem(this.USERNAME_KEY);
  }

  /**
   * Obtiene los roles almacenados
   */
  getRoles(): string[] {
    const rolesJson = localStorage.getItem(this.ROLES_KEY);
    if (!rolesJson) return [];

    try {
      return JSON.parse(rolesJson) as string[];
    } catch {
      return [];
    }
  }

  /**
   * Limpia todos los tokens y datos de sesión
   */
  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USERNAME_KEY);
    localStorage.removeItem(this.ROLES_KEY);
  }

  /**
   * Verifica si existe un token válido
   */
  hasValidToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    return !this.isTokenExpired(token);
  }

  /**
   * Decodifica el JWT y extrae el payload
   */
  decodeToken(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = parts[1];
      const decoded = atob(payload);
      return JSON.parse(decoded) as JwtPayload;
    } catch {
      return null;
    }
  }

  /**
   * Verifica si el token está expirado
   */
  isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return true;

    const expirationDate = new Date(payload.exp * 1000);
    const now = new Date();

    return now >= expirationDate;
  }

  /**
   * Extrae roles del token JWT
   */
  extractRolesFromToken(token: string): string[] {
    const payload = this.decodeToken(token);
    if (!payload || !payload.authorities) return [];

    // El backend devuelve authorities como string separado por comas
    return payload.authorities.split(',').filter((role) => role.trim() !== '');
  }

  /**
   * Extrae username del token JWT
   */
  extractUsernameFromToken(token: string): string | null {
    const payload = this.decodeToken(token);
    return payload?.sub || null;
  }

  /**
   * Obtiene el customer ID almacenado
   */
  getCustomerId(): number | null {
    const customerId = localStorage.getItem(this.CUSTOMER_ID_KEY);
    return customerId ? parseInt(customerId, 10) : null;
  }

  /**
   * Extrae customer ID del token JWT
   */
  extractCustomerIdFromToken(token: string): number | null {
    const payload = this.decodeToken(token);
    return payload?.customerId || null;
  }
}
