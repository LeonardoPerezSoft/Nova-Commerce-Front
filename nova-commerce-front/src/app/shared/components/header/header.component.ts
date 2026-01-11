import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthFacade } from '../../../features/auth/services/auth.facade';
import { UserFacade } from '../../../features/auth/facades/user.facade';

/**
 * HeaderComponent
 *
 * Componente de cabecera principal de la aplicación.
 * Incluye logo, navegación y autenticación.
 *
 * Responsabilidades:
 * - Mostrar logo de NovaCommerce
 * - Mostrar enlaces de navegación
 * - Mostrar estado de autenticación (login/logout)
 * - Mostrar email del usuario cuando está autenticado
 * - Adaptar navegación según roles
 *
 * CONSUMER DE:
 * • UserFacade - Para obtener información del usuario (email, roles)
 * • AuthFacade - Para lógica de logout
 */
@Component({
  selector: 'nc-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(
    public authFacade: AuthFacade,
    public userFacade: UserFacade
  ) {}

  /**
   * Maneja el click en el botón de logout
   */
  onLogout(): void {
    this.authFacade.logout();
  }
}
