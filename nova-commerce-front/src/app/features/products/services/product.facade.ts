/**
 * ProductFacade — Orquestador de estado de productos
 *
 * RESPONSABILIDADES:
 * • Gestionar estado de productos, categorías y producto seleccionado
 * • Orquestar llamadas a ProductService
 * • Exponer observables reactivos para componentes
 * • Manejar loading y errores de forma centralizada
 *
 * ARQUITECTURA:
 * Facade Pattern (como AuthFacade y UserFacade)
 * Componentes SOLO inyectan este facade
 * BehaviorSubject + observables públicos
 *
 * FLUJO:
 * 1. Componente llama loadProducts()
 * 2. Facade marca loading = true
 * 3. Facade llama ProductService
 * 4. Facade emite productos$ con resultados
 * 5. Componente se actualiza automáticamente (async pipe)
 */

import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize, map, of, tap } from 'rxjs';
import { Product, ProductsResponse, ProductFilters, Category } from '../models/product.model';
import { ProductService } from './product.service';

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  categories: Category[];
  filters: ProductFilters;
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  categories: [],
  filters: {},
  total: 0,
  loading: false,
  error: null,
};

@Injectable({
  providedIn: 'root',
})
export class ProductFacade {
  /**
   * Estado interno del módulo de productos
   */
  private readonly stateSubject = new BehaviorSubject<ProductState>(initialState);

  /**
   * Observable del estado completo (privado, solo para composición interna)
   */
  private readonly state$ = this.stateSubject.asObservable();

  /**
   * Observable de productos cargados
   */
  public readonly products$: Observable<Product[]> = this.state$.pipe(
    map((state) => state.products)
  );

  /**
   * Observable del producto seleccionado (para detalle)
   */
  public readonly selectedProduct$: Observable<Product | null> = this.state$.pipe(
    map((state) => state.selectedProduct)
  );

  /**
   * Observable de categorías disponibles
   */
  public readonly categories$: Observable<Category[]> = this.state$.pipe(
    map((state) => state.categories)
  );

  /**
   * Observable de loading state
   */
  public readonly loading$: Observable<boolean> = this.state$.pipe(
    map((state) => state.loading)
  );

  /**
   * Observable de errores
   */
  public readonly error$: Observable<string | null> = this.state$.pipe(
    map((state) => state.error)
  );

  /**
   * Observable del total de productos (para paginación)
   */
  public readonly total$: Observable<number> = this.state$.pipe(
    map((state) => state.total)
  );

  /**
   * Observable de filtros actuales
   */
  public readonly filters$: Observable<ProductFilters> = this.state$.pipe(
    map((state) => state.filters)
  );

  constructor(private readonly productService: ProductService) {}

  /**
   * Carga productos con filtros opcionales
   * @param filters - Filtros de búsqueda
   */
  loadProducts(filters?: ProductFilters): void {
    this.updateState({ loading: true, error: null, filters: filters || {} });

    // Si hay un categoryId, usa endpoint específico de categoría
    const request = filters?.categoryId
      ? this.productService.getProductsByCategory(filters.categoryId)
      : this.productService.getProducts(filters);

    request
      .pipe(
        tap((response: ProductsResponse) => {
          this.updateState({
            products: response.products,
            total: response.total,
            loading: false,
          });
        }),
        catchError((error) => {
          console.error('Error cargando productos:', error);
          this.updateState({
            products: [],
            total: 0,
            loading: false,
            error: 'Error al cargar productos. Por favor, intenta nuevamente.',
          });
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Carga un producto específico por ID
   * @param id - ID del producto
   */
  loadProductById(id: string): void {
    this.updateState({ loading: true, error: null, selectedProduct: null });

    this.productService
      .getProductById(id)
      .pipe(
        tap((product: Product) => {
          this.updateState({
            selectedProduct: product,
            loading: false,
          });
        }),
        catchError((error) => {
          console.error('Error cargando producto:', error);
          this.updateState({
            selectedProduct: null,
            loading: false,
            error: 'Producto no encontrado.',
          });
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Carga las categorías disponibles
   */
  loadCategories(): void {
    this.productService
      .getCategories()
      .pipe(
        tap((categories: Category[]) => {
          this.updateState({ categories });
        }),
        catchError((error) => {
          console.error('Error cargando categorías:', error);
          this.updateState({ categories: [] });
          return of([]);
        })
      )
      .subscribe();
  }

  /**
   * Limpia el producto seleccionado
   */
  clearSelectedProduct(): void {
    this.updateState({ selectedProduct: null });
  }

  /**
   * Limpia los filtros y recarga productos
   */
  clearFilters(): void {
    this.loadProducts();
  }

  /**
   * Actualiza el estado interno de forma inmutable
   */
  private updateState(partialState: Partial<ProductState>): void {
    this.stateSubject.next({
      ...this.stateSubject.value,
      ...partialState,
    });
  }
}
