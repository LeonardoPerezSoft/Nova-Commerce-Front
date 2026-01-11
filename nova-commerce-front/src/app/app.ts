import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Root Component
 *
 * Componente raíz de la aplicación.
 * Solo renderiza el router-outlet para cargar las rutas definidas en app.routes.ts
 *
 * La estructura real (header, footer, layout) está en MainLayoutComponent
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
