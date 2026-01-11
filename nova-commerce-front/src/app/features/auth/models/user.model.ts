/**
 * Modelo de dominio: Usuario autenticado
 * Representa el contexto del usuario en la aplicación
 * NO incluye tokens - eso es responsabilidad de TokenService
 * Solo datos públicos del usuario
 */

export interface User {
  /**
   * Identificador único del usuario
   */
  id: string;

  /**
   * Email o identificador de inicio de sesión
   */
  email: string;

  /**
   * Array de roles del usuario (ej: ['ADMIN', 'USER'])
   */
  roles: string[];
}

/**
 * Estado del contexto de usuario
 * Centraliza la información del usuario autenticado
 */
export interface UserContext {
  /**
   * Usuario autenticado (null si no está autenticado)
   */
  user: User | null;

  /**
   * Flag de autenticación
   */
  isAuthenticated: boolean;

  /**
   * Timestamp de la última actualización
   */
  lastUpdated: number;
}
