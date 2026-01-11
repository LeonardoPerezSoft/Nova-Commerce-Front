import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * HeaderComponent
 *
 * Componente de cabecera principal de la aplicación.
 * Incluye logo, navegación y botón de login.
 *
 * Responsabilidades:
 * - Mostrar logo
 * - Mostrar enlaces de navegación
 * - Mostrar botón de login
 *
 * TODO ETAPA 2:
 * - Integrar AuthFacade para mostrar usuario logueado
 * - Mostrar rol del usuario
 * - Dropdown de menú según rol
 */
@Component({
  selector: 'nc-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
