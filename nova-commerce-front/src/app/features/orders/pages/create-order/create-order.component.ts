/**
 * CreateOrderComponent
 *
 * Página para crear una nueva orden
 * En una etapa futura se integrará con Carrito
 * Por ahora es un placeholder que muestra la estructura
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="create-order">
      <div class="create-order__header">
        <h1 class="create-order__title">Crear Orden</h1>
        <p class="create-order__subtitle">Desde tu carrito de compras</p>
      </div>

      <div class="create-order__placeholder">
        <p class="create-order__icon">🛒</p>
        <p class="create-order__text">
          La funcionalidad de crear órdenes se integrará en ETAPA 5
        </p>
        <p class="create-order__detail">
          Esta página funcionará junto con el carrito de compras
        </p>
        <a href="/products" class="create-order__link">
          Volver a Productos
        </a>
      </div>
    </div>
  `,
  styles: `
    .create-order {
      max-width: 600px;
      margin: 0 auto;
      padding: 32px 20px;
    }

    .create-order__header {
      margin-bottom: 32px;
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
      margin: 0;
    }

    .create-order__placeholder {
      text-align: center;
      padding: 60px 20px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 2px dashed #bdc3c7;
    }

    .create-order__icon {
      font-size: 64px;
      margin-bottom: 16px;
    }

    .create-order__text {
      font-size: 18px;
      color: #2c3e50;
      margin: 0 0 8px;
      font-weight: 600;
    }

    .create-order__detail {
      font-size: 14px;
      color: #7f8c8d;
      margin: 0 0 24px;
    }

    .create-order__link {
      display: inline-block;
      padding: 10px 20px;
      background: #27ae60;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      transition: background 0.3s;
    }

    .create-order__link:hover {
      background: #229954;
    }
  `,
})
export class CreateOrderComponent {}
