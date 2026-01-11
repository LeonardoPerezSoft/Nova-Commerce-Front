import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthFacade } from '../../../features/auth/services/auth.facade';
import { HasRoleDirective } from '../../../features/auth/directives/has-role.directive';

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
 * - Mostrar username cuando está autenticado
 * - Adaptar navegación según roles
 */
@Component({
  selector: 'nc-header',
  standalone: true,
  imports: [CommonModule, RouterModule, HasRoleDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(public authFacade: AuthFacade) {}

  /**
   * Maneja el click en el botón de logout
   */
  onLogout(): void {
    this.authFacade.logout();
  }
}
