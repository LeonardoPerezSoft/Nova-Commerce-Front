/**
 * Modelos de datos para el módulo de autenticación
 * Tipado estricto para todas las estructuras de auth
 */

/**
 * Credenciales de inicio de sesión
 */
export interface LoginCredentials {
  userIdentifier: string;
  password: string;
}

/**
 * Respuesta del backend al login exitoso
 */
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  username: string;
  roles: string[];
}

/**
 * Request para refresh token
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Respuesta del backend al refresh token
 */
export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  username: string;
  roles: string[];
}

/**
 * Respuesta de validación de token
 */
export interface TokenValidationResponse {
  valid: boolean;
  username: string;
  authorities: string;
}

/**
 * Información de sesión del usuario actual
 */
export interface UserSession {
  username: string;
  roles: string[];
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Payload decodificado del JWT
 */
export interface JwtPayload {
  sub: string; // username
  authorities: string; // comma-separated roles
  customerId?: number; // customer ID from backend
  iat: number; // issued at
  exp: number; // expiration
}

/**
 * Roles disponibles en el sistema
 * Extensible para futuros roles
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  USER = 'USER',
}

/**
 * Estado de autenticación
 */
export interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  roles: string[];
}
