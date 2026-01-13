/**
 * CreateOrderComponent / Order Confirmation
 *
 * Página de confirmación de orden después del checkout
 * Muestra los detalles de la orden creada de forma estética
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderFacade } from '../../services/order.facade';
import { OrderConfirmationComponent } from '../../components/order-confirmation/order-confirmation.component';
import { Observable } from 'rxjs';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [CommonModule, RouterModule, OrderConfirmationComponent],
  template: `
    <div class="create-order">
      <!-- Show confirmation if order was created -->
      <ng-container *ngIf="(order$ | async) as order">
        <app-order-confirmation [order]="order"></app-order-confirmation>
      </ng-container>

      <!-- Show placeholder if no order -->
      <ng-container *ngIf="!(order$ | async)">
        <div class="create-order__header">
          <h1 class="create-order__title">Crear Orden</h1>
          <p class="create-order__subtitle">Desde tu carrito de compras</p>
        </div>

        <div class="create-order__placeholder">
          <p class="create-order__icon">🛒</p>
          <p class="create-order__text">
            Tu orden aparecerá aquí después de completar el checkout
          </p>
          <p class="create-order__detail">
            Navega a tu carrito y haz clic en "Confirmar Compra"
          </p>
          <a href="/cart" class="create-order__link">
            Ir al Carrito
          </a>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .create-order {
      min-height: 100vh;
      padding: 20px;
    }

    .create-order__header {
      max-width: 600px;
      margin: 0 auto;
      padding: 32px 20px;
      text-align: center;
    }

    .create-order__title {
      font-size: 32px;
      font-weight: 700;
      color: #2c3e50;
      margin: 0 0 8px;
    }

    .create-order__subtitle {
      font-size: 16px;
      color: #7f8c8d;
      margin: 0 0 32px;
    }

    .create-order__placeholder {
      max-width: 400px;
      margin: 60px auto;
      padding: 40px 20px;
      text-align: center;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    }

    .create-order__icon {
      font-size: 64px;
      margin: 0 0 16px;
    }

    .create-order__text {
      font-size: 18px;
      font-weight: 600;
      color: #2c3e50;
      margin: 0 0 12px;
    }

    .create-order__detail {
      font-size: 14px;
      color: #7f8c8d;
      margin: 0 0 24px;
    }

    .create-order__detail {
      font-size: 14px;
      color: #7f8c8d;
      margin: 0 0 24px;
    }

    .create-order__link {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .create-order__link:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    @media (max-width: 768px) {
      .create-order__header {
        padding: 24px 16px;
      }

      .create-order__title {
        font-size: 24px;
      }

      .create-order__placeholder {
        margin: 40px 20px;
      }
    }
  `],
})
export class CreateOrderComponent implements OnInit {
  order$!: Observable<Order | null>;

  constructor(private orderFacade: OrderFacade) {}

  ngOnInit(): void {
    this.order$ = this.orderFacade.order$;
  }
}
