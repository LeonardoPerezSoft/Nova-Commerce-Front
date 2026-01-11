/**
 * ProductCardComponent — Tarjeta de producto para grid
 *
 * RESPONSABILIDADES:
 * • Mostrar información básica del producto
 * • Navegación al detalle
 * • Diseño responsive tipo marketplace
 *
 * ENTRADA:
 * @Input product: Product
 *
 * ARQUITECTURA:
 * Standalone component (sin NgModules)
 * Solo presentación, sin lógica de negocio
 * BEM para estilos
 */

import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  /**
   * Producto a mostrar en la tarjeta
   */
  product = input.required<Product>();
}
