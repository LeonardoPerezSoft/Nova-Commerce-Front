/**
 * DiscountBadgeComponent
 *
 * Badge que muestra descuentos aplicados
 * Tipos: LOYALTY, PRODUCT, SEASON
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Discount } from '../../models/order.model';

@Component({
  selector: 'app-discount-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="discount-badge"
      [ngClass]="'discount-badge--' + (discount.type | lowercase)"
      *ngIf="discount"
    >
      <span class="discount-badge__label">{{ getLabel(discount.type) }}</span>
      <span class="discount-badge__value">-\${{ discount.amount | number: '1.2-2' }}</span>
    </div>
  `,
  styles: `
    .discount-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .discount-badge__label {
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .discount-badge__value {
      font-weight: 700;
    }

    .discount-badge--loyalty {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .discount-badge--product {
      background: #e3f2fd;
      color: #1565c0;
    }

    .discount-badge--season {
      background: #fff3e0;
      color: #e65100;
    }

    @media (max-width: 480px) {
      .discount-badge {
        padding: 4px 8px;
        font-size: 11px;
      }
    }
  `,
})
export class DiscountBadgeComponent {
  @Input() discount: Discount | null = null;

  getLabel(type: string): string {
    const labels: Record<string, string> = {
      LOYALTY: 'Lealtad',
      PRODUCT: 'Producto',
      SEASON: 'Temporada',
    };
    return labels[type] || type;
  }
}
