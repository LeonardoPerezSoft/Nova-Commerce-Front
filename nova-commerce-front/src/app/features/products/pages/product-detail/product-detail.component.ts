/**
 * ProductDetailComponent — Detalle de producto
 *
 * RESPONSABILIDADES:
 * • Mostrar información completa del producto
 * • Cargar producto por ID desde ruta
 * • Gestionar loading y error states
 * • Botón de navegación de regreso
 *
 * ARQUITECTURA:
 * • Standalone component
 * • Consume ProductFacade únicamente
 * • ActivatedRoute para obtener :id de la URL
 * • Observable-first con async pipe
 *
 * FLUJO:
 * 1. ngOnInit → obtener :id de la ruta
 * 2. facade.loadProductById(id)
 * 3. Template suscribe a selectedProduct$, loading$
 * 4. Muestra detalle o error
 */

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductFacade } from '../../services/product.facade';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  /**
   * Servicios inyectados con inject()
   */
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productFacade = inject(ProductFacade);

  /**
   * Observable del producto seleccionado (del facade)
   */
  product$ = this.productFacade.selectedProduct$;

  /**
   * Observable de loading state (del facade)
   */
  loading$ = this.productFacade.loading$;

  /**
   * Observable de errores (del facade)
   */
  error$ = this.productFacade.error$;

  constructor() {}

  ngOnInit(): void {
    // Obtener ID del producto desde la ruta
    const productId = this.route.snapshot.paramMap.get('id');

    if (productId) {
      this.productFacade.loadProductById(productId);
    } else {
      // Si no hay ID, redirigir al listado
      this.router.navigate(['/products']);
    }
  }

  ngOnDestroy(): void {
    // Limpiar producto seleccionado al salir
    this.productFacade.clearSelectedProduct();
  }

  /**
   * Navega de regreso al listado
   */
  goBack(): void {
    this.router.navigate(['/products']);
  }
}
