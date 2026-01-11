/**
 * ProductService — Servicio HTTP para productos
 *
 * RESPONSABILIDADES:
 * • Comunicación con API Gateway (/api/products)
 * • Sin lógica de negocio
 * • Retorna observables para composición
 *
 * ARQUITECTURA:
 * Capa de infraestructura (Repository pattern)
 * Consumido únicamente por ProductFacade
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, ProductsResponse, ProductFilters, Category } from '../models/product.model';
import { APP_CONFIG } from '../../../core/config/app.config';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${APP_CONFIG.api.baseUrl}/api/products`;
  private readonly categoriesUrl = `${APP_CONFIG.api.baseUrl}/api/categories`;

  /**
   * Obtiene lista de productos con filtros opcionales
   * @param filters - Filtros de búsqueda (categoría, precio, paginación)
   * @returns Observable con respuesta paginada de productos
   *
   * NOTA: Maneja ambas respuestas:
   * - Spring Data paginada: { content: [...], totalElements, pageable, ... }
   * - Respuesta directa: { products: [...], total, page, pageSize }
   */
  getProducts(filters?: ProductFilters): Observable<ProductsResponse> {
    let params = new HttpParams();

    if (filters?.categoryId) {
      params = params.set('categoryId', filters.categoryId);
    }
    if (filters?.search) {
      params = params.set('search', filters.search);
    }
    if (filters?.minPrice !== undefined) {
      params = params.set('minPrice', filters.minPrice.toString());
    }
    if (filters?.maxPrice !== undefined) {
      params = params.set('maxPrice', filters.maxPrice.toString());
    }
    if (filters?.page !== undefined) {
      params = params.set('page', filters.page.toString());
    }
    if (filters?.pageSize !== undefined) {
      params = params.set('pageSize', filters.pageSize.toString());
    }

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map((response) => {
        // Si ya tiene el formato ProductsResponse, retórnalo
        if (response?.products && Array.isArray(response.products)) {
          return response as ProductsResponse;
        }
        // Si es respuesta paginada Spring Data, transforma a ProductsResponse
        if (response?.content && Array.isArray(response.content)) {
          return {
            products: this.transformProducts(response.content),
            total: response.totalElements || response.content.length,
            page: (response.pageable?.pageNumber || 0) + 1,
            pageSize: response.pageable?.pageSize || response.size || 20,
          };
        }
        // Fallback seguro
        console.warn('Respuesta de productos inesperada:', response);
        return {
          products: [],
          total: 0,
          page: 1,
          pageSize: 20,
        };
      })
    );
  }

  /**
   * Obtiene un producto por su ID
   * @param id - ID del producto
   * @returns Observable con el producto
   */
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene todas las categorías disponibles
   * @returns Observable con array de categorías
   *
   * NOTA: El backend retorna respuesta paginada Spring Data:
   * { content: Category[], pageable: {...}, totalElements: N, ... }
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<any>(this.categoriesUrl).pipe(
      map((response) => {
        // Si la respuesta es un array directo, retórnalo
        if (Array.isArray(response)) {
          return response as Category[];
        }
        // Si es respuesta paginada Spring Data, extrae 'content'
        if (response?.content && Array.isArray(response.content)) {
          return response.content as Category[];
        }
        // Si es un objeto con propiedad 'categories' o 'data', extrae el array
        if (response?.categories && Array.isArray(response.categories)) {
          return response.categories;
        }
        if (response?.data && Array.isArray(response.data)) {
          return response.data;
        }
        // Si nada funciona, retorna array vacío
        console.warn(
          'Respuesta de categorías inesperada:',
          response
        );
        return [];
      })
    );
  }

  /**
   * Obtiene productos de una categoría específica
   * @param categoryId - ID de la categoría
   * @returns Observable con respuesta paginada de productos
   *
   * USA RUTA: GET /api/products/category/{categoryId}
   * Retorna: Spring Data paginada con 'content' como array de productos
   */
  getProductsByCategory(categoryId: string): Observable<ProductsResponse> {
    return this.http.get<any>(`${this.apiUrl}/category/${categoryId}`).pipe(
      map((response) => {
        // Si es respuesta paginada Spring Data, transforma a ProductsResponse
        if (response?.content && Array.isArray(response.content)) {
          return {
            products: this.transformProducts(response.content),
            total: response.totalElements || response.content.length,
            page: (response.pageable?.pageNumber || 0) + 1,
            pageSize: response.pageable?.pageSize || response.size || 20,
          };
        }
        // Fallback
        console.warn('Respuesta de productos por categoría inesperada:', response);
        return {
          products: [],
          total: 0,
          page: 1,
          pageSize: 20,
        };
      })
    );
  }

  /**
   * Transforma productos del backend al modelo interno
   * Mapea campos como: stockQuantity -> stock, status se ignora, etc.
   */
  private transformProducts(rawProducts: any[]): Product[] {
    return rawProducts.map((product) => ({
      id: String(product.id),
      name: product.name,
      description: product.description,
      price: product.price,
      // Usa imageUrl del backend, o placeholder SVG si no existe
      imageUrl:
        product.imageUrl ||
        'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-family=%22sans-serif%22 font-size=%2218%22%3ENo Image%3C/text%3E%3C/svg%3E',
      categoryId: String(product.categoryId),
      stock: product.stockQuantity || 0,
      createdAt: product.createdDate || new Date().toISOString(),
      updatedAt: product.lastModifiedDate || new Date().toISOString(),
    }));
  }
}
