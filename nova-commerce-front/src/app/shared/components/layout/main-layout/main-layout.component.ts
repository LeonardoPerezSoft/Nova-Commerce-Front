import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';

/**
 * MainLayoutComponent
 *
 * Componente de layout principal de la aplicación.
 * Actúa como contenedor para Header, Footer y router-outlet.
 *
 * Estructura visual:
 * - Header (sticky)
 * - Contenido dinámico (router-outlet)
 * - Footer
 *
 * Responsabilidades:
 * - Proporcionar estructura base de la app
 * - Incluir header y footer
 * - Renderizar rutas hijas
 *
 * Notas:
 * - Es un componente standalone
 * - No tiene lógica de negocio
 * - Usa flexbox para layout vertical
 * - El footer queda al final gracias a min-height
 */
@Component({
  selector: 'nc-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {}
