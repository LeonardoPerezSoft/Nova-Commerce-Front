/**
 * OrderHistoryComponent
 *
 * Página que muestra historial de órdenes del usuario
 * Carga órdenes al inicializar
 * Muestra estado, fecha, totales
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderFacade } from '../../services/order.facade';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="order-history">
      <div class="order-history__header">
        <h1 class="order-history__title">Historial de Órdenes</h1>
        <p class="order-history__subtitle">Consulta tus órdenes anteriores</p>
      </div>

      <!-- Loading State -->
      <div class="order-history__loading" *ngIf="(facade.isLoading$ | async)">
        <div class="spinner"></div>
        <p>Cargando órdenes...</p>
      </div>

      <!-- Error State -->
      <div class="order-history__error" *ngIf="(facade.error$ | async) as error">
        <p>⚠️ {{ error }}</p>
        <button (click)="onRetry()" class="order-history__retry-btn">
          Reintentar
        </button>
      </div>

      <!-- Empty State -->
      <div class="order-history__empty" *ngIf="!(facade.isLoading$ | async) && (facade.orders$ | async)?.length === 0">
        <p class="order-history__empty-icon">📦</p>
        <p class="order-history__empty-text">No tienes órdenes registradas</p>
        <a href="/products" class="order-history__empty-link">
          Ir a Productos
        </a>
      </div>

      <!-- Orders List -->
      <div class="order-history__list">
        <div
          class="order-history__card"
          *ngFor="let order of (facade.orders$ | async)"
          (click)="onSelectOrder(order)"
        >
          <div class="order-history__card-header">
            <span class="order-history__order-id">Orden #{{ order.id }}</span>
            <span
              class="order-history__status"
              [ngClass]="'order-history__status--' + (order.status | lowercase)"
            >
              {{ getStatusLabel(order.status) }}
            </span>
          </div>

          <div class="order-history__card-date">
            {{ order.createdAt | date: 'dd/MM/yyyy HH:mm' }}
          </div>

          <div class="order-history__card-items">
            <span class="order-history__item-count"
              >{{ order.items.length }} artículos</span
            >
          </div>

          <div class="order-history__card-footer">
            <span class="order-history__total-label">Total:</span>
            <span class="order-history__total-value">
              \${{ order.totalAfterDiscount | number: '1.2-2' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Pagination Info -->
      <div class="order-history__info" *ngIf="(facade.total$ | async) as total">
        <p>Total de órdenes: {{ total }}</p>
      </div>
    </div>
  `,
  styles: `
    .order-history {
      max-width: 1000px;
      margin: 0 auto;
      padding: 32px 20px;
    }

    .order-history__header {
      margin-bottom: 32px;
      text-align: center;
    }

    .order-history__title {
      font-size: 32px;
      font-weight: 700;
      color: #2c3e50;
      margin: 0 0 8px;
    }

    .order-history__subtitle {
      font-size: 16px;
      color: #7f8c8d;
      margin: 0;
    }

    .order-history__loading,
    .order-history__error {
      text-align: center;
      padding: 40px 20px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .order-history__error {
      background: #ffebee;
      color: #c62828;
    }

    .order-history__retry-btn {
      margin-top: 16px;
      padding: 10px 20px;
      background: #2196f3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }

    .order-history__retry-btn:hover {
      background: #1976d2;
    }

    .spinner {
      display: inline-block;
      width: 40px;
      height: 40px;
      border: 4px solid #f0f0f0;
      border-top-color: #2196f3;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .order-history__empty {
      text-align: center;
      padding: 60px 20px;
    }

    .order-history__empty-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }

    .order-history__empty-text {
      font-size: 18px;
      color: #7f8c8d;
      margin-bottom: 24px;
    }

    .order-history__empty-link {
      display: inline-block;
      padding: 10px 20px;
      background: #27ae60;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      transition: background 0.3s;
    }

    .order-history__empty-link:hover {
      background: #229954;
    }

    .order-history__list {
      display: grid;
      gap: 16px;
      margin-bottom: 32px;
    }

    .order-history__card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
      cursor: pointer;
      transition: box-shadow 0.3s, transform 0.3s;
    }

    .order-history__card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .order-history__card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .order-history__order-id {
      font-weight: 600;
      color: #2c3e50;
    }

    .order-history__status {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .order-history__status--created {
      background: #e3f2fd;
      color: #1565c0;
    }

    .order-history__status--paid {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .order-history__status--shipped {
      background: #fff3e0;
      color: #e65100;
    }

    .order-history__status--completed {
      background: #e0f2f1;
      color: #00695c;
    }

    .order-history__card-date {
      font-size: 13px;
      color: #7f8c8d;
      margin-bottom: 8px;
    }

    .order-history__card-items {
      font-size: 13px;
      color: #666;
      margin-bottom: 12px;
    }

    .order-history__card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid #f0f0f0;
    }

    .order-history__total-label {
      color: #7f8c8d;
      font-size: 14px;
    }

    .order-history__total-value {
      font-weight: 700;
      color: #2c3e50;
      font-size: 16px;
    }

    .order-history__info {
      text-align: center;
      font-size: 13px;
      color: #7f8c8d;
    }

    @media (max-width: 768px) {
      .order-history {
        padding: 20px;
      }

      .order-history__title {
        font-size: 24px;
      }

      .order-history__card {
        padding: 12px;
      }
    }
  `,
})
export class OrderHistoryComponent implements OnInit {
  constructor(public facade: OrderFacade) {}

  ngOnInit(): void {
    this.facade.loadUserOrders();
  }

  onRetry(): void {
    this.facade.loadUserOrders();
  }

  onSelectOrder(order: any): void {
    this.facade.loadOrderById(order.id);
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      CREATED: 'Creada',
      PAID: 'Pagada',
      SHIPPED: 'Enviada',
      COMPLETED: 'Completada',
    };
    return labels[status] || status;
  }
}
