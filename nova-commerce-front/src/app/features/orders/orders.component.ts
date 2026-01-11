import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * OrdersComponent
 *
 * Placeholder para la feature de Órdenes.
 * En futuras etapas (ETAPA 4), aquí irá:
 * - Historial de órdenes del usuario
 * - Detalle de orden
 * - Estado del pedido
 *
 * Por ahora es solo un placeholder sin funcionalidad.
 */
@Component({
  selector: 'nc-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="nc-placeholder">
      <h1>Mis Órdenes</h1>
      <p>Sección de órdenes - A implementar en ETAPA 4</p>
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
export class OrdersComponent {}
