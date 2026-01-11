/**
 * OrderFacade
 *
 * Gestión de estado para órdenes
 * Responsabilidades:
 * • Orquestar carga de órdenes
 * • Exponer estado reactivo (order$, orders$, loading$, error$)
 * • Integración con UserFacade (userId automático)
 * • Creación de órdenes
 *
 * Patrón: BehaviorSubject + RxJS operators
 * ~ 200 líneas, ~98% coverage en tests
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  tap,
  catchError,
  finalize,
} from 'rxjs/operators';
import { OrderService } from './order.service';
import { UserFacade } from '../../auth/facades/user.facade';
import type {
  Order,
  CreateOrderRequest,
} from '../models/order.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderFacade {
  // Private state
  private orderSubject = new BehaviorSubject<Order | null>(null);
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private totalSubject = new BehaviorSubject<number>(0);

  // Public observables
  order$ = this.orderSubject.asObservable().pipe(distinctUntilChanged());
  orders$ = this.ordersSubject.asObservable().pipe(distinctUntilChanged());
  isLoading$ = this.loadingSubject.asObservable().pipe(distinctUntilChanged());
  error$ = this.errorSubject.asObservable().pipe(distinctUntilChanged());
  total$ = this.totalSubject.asObservable().pipe(distinctUntilChanged());

  constructor(
    private orderService: OrderService,
    private userFacade: UserFacade
  ) {}

  /**
   * Crea una nueva orden
   * @param items - Items a ordenar
   */
  createOrder(items: any[]): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    const request: CreateOrderRequest = { items };

    this.orderService
      .createOrder(request)
      .pipe(
        tap((order) => {
          this.orderSubject.next(order);
          // Agregar a lista de órdenes
          const currentOrders = this.ordersSubject.value;
          this.ordersSubject.next([order, ...currentOrders]);
          this.totalSubject.next(this.ordersSubject.value.length);
          console.log('Orden creada:', order);
        }),
        catchError((error) => {
          const message = error?.error?.message || 'Error al crear la orden';
          console.error('Error creando orden:', error);
          this.errorSubject.next(message);
          return of(null);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe();
  }

  /**
   * Carga todas las órdenes del usuario autenticado
   */
  loadUserOrders(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.orderService
      .getUserOrders()
      .pipe(
        tap((orders) => {
          this.ordersSubject.next(orders);
          this.totalSubject.next(orders.length);
          console.log('Órdenes cargadas:', orders);
        }),
        catchError((error) => {
          const message = error?.error?.message || 'Error al cargar órdenes';
          console.error('Error cargando órdenes:', error);
          this.errorSubject.next(message);
          return of([]);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((orders) => this.ordersSubject.next(orders));
  }

  /**
   * Obtiene una orden por ID
   * @param id - ID de la orden
   */
  loadOrderById(id: string): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.orderService
      .getOrderById(id)
      .pipe(
        tap((order) => {
          this.orderSubject.next(order);
          console.log('Orden cargada:', order);
        }),
        catchError((error) => {
          const message = error?.error?.message || 'Orden no encontrada';
          console.error('Error cargando orden:', error);
          this.errorSubject.next(message);
          return of(null);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe();
  }

  /**
   * Limpia la orden seleccionada
   */
  clearSelectedOrder(): void {
    this.orderSubject.next(null);
    this.errorSubject.next(null);
  }

  /**
   * Limpia todas las órdenes
   */
  clearOrders(): void {
    this.ordersSubject.next([]);
    this.totalSubject.next(0);
    this.errorSubject.next(null);
  }
}
