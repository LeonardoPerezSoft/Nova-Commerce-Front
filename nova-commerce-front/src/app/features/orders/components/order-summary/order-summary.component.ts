/**
 * OrderSummaryComponent
 *
 * Muestra resumen de orden:
 * • Listado de items
 * • Totales
 * • Descuentos aplicados
 *
 * Componente presentacional (sin lógica)
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Order } from '../../models/order.model';
import { OrderItemComponent } from '../order-item/order-item.component';
import { DiscountBadgeComponent } from '../discount-badge/discount-badge.component';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, OrderItemComponent, DiscountBadgeComponent],
  template: `
    <div class="order-summary">
      <div class="order-summary__header">
        <h2 class="order-summary__title">Resumen de la Orden</h2>
        <span class="order-summary__id" *ngIf="order">ID: {{ order.id }}</span>
      </div>

      <div class="order-summary__items" *ngIf="order">
        <app-order-item *ngFor="let item of order.items" [item]="item">
        </app-order-item>
      </div>

      <div class="order-summary__divider"></div>

      <div class="order-summary__discounts" *ngIf="order && order.discounts.length > 0">
        <h3 class="order-summary__section-title">Descuentos Aplicados</h3>
        <div class="order-summary__discount-list">
          <app-discount-badge
            *ngFor="let discount of order.discounts"
            [discount]="discount"
          ></app-discount-badge>
        </div>
      </div>

      <div class="order-summary__totals" *ngIf="order">
        <div class="order-summary__total-row">
          <span class="order-summary__label">Subtotal:</span>
          <span class="order-summary__value"
            >\${{ order.totalBeforeDiscount | number: '1.2-2' }}</span
          >
        </div>

        <div class="order-summary__total-row" *ngIf="order.discounts.length > 0">
          <span class="order-summary__label">Ahorro:</span>
          <span class="order-summary__value discount"
            >-\${{
              order.totalBeforeDiscount - order.totalAfterDiscount
                | number: '1.2-2'
            }}</span
          >
        </div>

        <div class="order-summary__total-row order-summary__total-row--final">
          <span class="order-summary__label">Total:</span>
          <span class="order-summary__value total"
            >\${{ order.totalAfterDiscount | number: '1.2-2' }}</span
          >
        </div>
      </div>
    </div>
  `,
  styles: `
    .order-summary {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .order-summary__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .order-summary__title {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .order-summary__id {
      font-size: 12px;
      color: #999;
      font-family: monospace;
    }

    .order-summary__items {
      margin-bottom: 20px;
    }

    .order-summary__divider {
      height: 1px;
      background: #e0e0e0;
      margin: 20px 0;
    }

    .order-summary__section-title {
      font-size: 14px;
      font-weight: 600;
      color: #666;
      margin: 0 0 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .order-summary__discount-list {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }

    .order-summary__totals {
      background: #f9f9f9;
      padding: 16px;
      border-radius: 6px;
    }

    .order-summary__total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .order-summary__total-row--final {
      padding-top: 8px;
      border-top: 2px solid #ddd;
      margin-bottom: 0;
    }

    .order-summary__label {
      color: #666;
      font-weight: 500;
    }

    .order-summary__value {
      color: #333;
      font-weight: 600;
    }

    .order-summary__value.discount {
      color: #27ae60;
    }

    .order-summary__value.total {
      color: #2c3e50;
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .order-summary {
        padding: 16px;
      }

      .order-summary__title {
        font-size: 18px;
      }

      .order-summary__totals {
        padding: 12px;
      }
    }
  `,
})
export class OrderSummaryComponent {
  @Input() order: any;
}
