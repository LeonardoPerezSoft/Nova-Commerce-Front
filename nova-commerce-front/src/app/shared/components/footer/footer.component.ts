import { Component } from '@angular/core';

/**
 * FooterComponent
 *
 * Componente de pie de página principal de la aplicación.
 * Muestra información de copyright y links simples.
 *
 * Responsabilidades:
 * - Mostrar copyright
 * - Mostrar links de información
 *
 * Es un componente puramente presentacional sin lógica de negocio.
 */
@Component({
  selector: 'nc-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  protected readonly currentYear = new Date().getFullYear();
}
