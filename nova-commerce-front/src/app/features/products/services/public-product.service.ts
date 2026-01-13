/**
 * PublicProductService — Servicio HTTP para productos públicos (sin autenticación)
 *
 * RESPONSABILIDADES:
 * • Comunicación con endpoint público (/api/public/products/home)
 * • Disponible sin necesidad de autenticación
 * • Retorna observables para composición
 *
 * ARQUITECTURA:
 * Capa de infraestructura (Repository pattern)
 * Consumido por HomeComponent y componentes públicos
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { APP_CONFIG } from '../../../core/config/app.config';

@Injectable({
  providedIn: 'root',
})
export class PublicProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${APP_CONFIG.api.baseUrl}/api/public/products/home`;

  /**
   * Obtiene lista de productos públicos para la página de inicio
   * @returns Observable con lista de productos disponibles
   *
   * NOTA: Este endpoint no requiere autenticación
   * Retorna productos destacados para mostrar en el home
   */
  getPublicProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
}
