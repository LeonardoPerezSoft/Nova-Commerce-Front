import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * AdminComponent
 *
 * Placeholder para la feature de Administración.
 * En futuras etapas (ETAPA 3), aquí irá:
 * - Gestión de usuarios
 * - Gestión de productos
 * - Gestión de categorías
 * - Dashboard
 *
 * Por ahora es solo un placeholder sin funcionalidad.
 */
@Component({
  selector: 'nc-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="nc-placeholder">
      <h1>Administración</h1>
      <p>Sección de administración - A implementar en ETAPA 3</p>
    </div>
  `,
  styles: [`
    .nc-placeholder {
      padding: 2rem;
      text-align: center;
      background-color: #f3f4f6;
      border-radius: 0.5rem;
      min-height: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      h1 {
        color: #1f2937;
        margin-bottom: 1rem;
      }

      p {
        color: #6b7280;
        font-size: 1.1rem;
      }
    }
  `]
})
export class AdminComponent {}
