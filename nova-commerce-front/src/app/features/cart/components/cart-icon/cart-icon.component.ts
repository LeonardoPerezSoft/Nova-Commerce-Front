/**
 * CartIconComponent
 *
 * Ícono de carrito para Header
 * Muestra badge con cantidad de items
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-icon',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a [routerLink]="['/cart']" class="cart-icon">
      <svg
        class="cart-icon__svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>

      <span
        *ngIf="itemCount > 0"
        class="cart-icon__badge"
        [class.cart-icon__badge--large]="itemCount >= 10"
      >
        {{ itemCount > 99 ? '99+' : itemCount }}
      </span>
    </a>
  `,
  styles: `
    .cart-icon {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #2c3e50;
      cursor: pointer;
      padding: 8px;
      border-radius: 4px;
      transition: all 0.3s;
      text-decoration: none;
    }

    .cart-icon:hover {
      background: #ecf0f1;
    }

    .cart-icon__svg {
      width: 24px;
      height: 24px;
    }

    .cart-icon__badge {
      position: absolute;
      top: 0;
      right: 0;
      background: #e74c3c;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      line-height: 1;
    }

    .cart-icon__badge--large {
      font-size: 10px;
      width: 24px;
      height: 24px;
    }

    @media (max-width: 768px) {
      .cart-icon {
        padding: 4px;
      }

      .cart-icon__svg {
        width: 20px;
        height: 20px;
      }
    }
  `,
})
export class CartIconComponent {
  @Input() itemCount: number = 0;
}
