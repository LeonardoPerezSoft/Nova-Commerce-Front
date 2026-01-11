/**
 * OrderItemComponent
 *
 * Renderiza un item dentro de la orden
 * Muestra: nombre, precio unitario, cantidad, subtotal
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { OrderItem } from '../../models/order.model';

@Component({
  selector: 'app-order-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="order-item" *ngIf="item">
      <div class="order-item__name">{{ item.name }}</div>
      <div class="order-item__details">
        <span class="order-item__detail">
          \${{ item.unitPrice | number: '1.2-2' }}
        </span>
        <span class="order-item__detail">×</span>
        <span class="order-item__detail">{{ item.quantity }}</span>
        <span class="order-item__detail">=</span>
        <span class="order-item__subtotal"
          >\${{ item.subtotal | number: '1.2-2' }}</span
        >
      </div>
    </div>
  `,
  styles: `
    .order-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .order-item__name {
      font-weight: 500;
      color: #333;
      flex: 1;
    }

    .order-item__details {
      display: flex;
      gap: 8px;
      align-items: center;
      font-size: 13px;
      color: #666;
    }

    .order-item__detail {
      white-space: nowrap;
    }

    .order-item__subtotal {
      font-weight: 600;
      color: #2c3e50;
    }

    @media (max-width: 480px) {
      .order-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
      }

      .order-item__details {
        width: 100%;
        justify-content: flex-end;
      }
    }
  `,
})
export class OrderItemComponent {
  @Input() item: OrderItem | null = null;
}
