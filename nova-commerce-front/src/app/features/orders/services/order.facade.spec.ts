/**
 * OrderFacade Tests
 *
 * Validar gestión de estado:
 * • Estado inicial
 * • Crear órdenes
 * • Cargar órdenes del usuario
 * • Loading/error states
 * • Limpieza de estado
 */

import { TestBed } from '@angular/core/testing';
import { OrderFacade } from './order.facade';
import { OrderService } from './order.service';
import { UserFacade } from '../../auth/facades/user.facade';
import { firstValueFrom } from 'rxjs';
import { vi } from 'vitest';
import { of, throwError } from 'rxjs';
import type { Order } from '../models/order.model';

describe('OrderFacade', () => {
  let facade: OrderFacade;
  let orderServiceMock: {
    createOrder: ReturnType<typeof vi.fn>;
    getUserOrders: ReturnType<typeof vi.fn>;
    getOrderById: ReturnType<typeof vi.fn>;
  };
  let userFacadeMock: { getCurrentUser: ReturnType<typeof vi.fn> };

  const mockOrder: Order = {
    id: 'ord-1',
    userId: 'user-1',
    items: [
      {
        productId: 'prod-1',
        name: 'Product 1',
        unitPrice: 100,
        quantity: 2,
        subtotal: 200,
      },
    ],
    totalBeforeDiscount: 200,
    totalAfterDiscount: 180,
    discounts: [
      {
        type: 'LOYALTY',
        percentage: 10,
        amount: 20,
      },
    ],
    status: 'CREATED',
    createdAt: '2026-01-11T10:00:00Z',
  };

  beforeEach(() => {
    orderServiceMock = {
      createOrder: vi.fn(),
      getUserOrders: vi.fn(),
      getOrderById: vi.fn(),
    };

    userFacadeMock = {
      getCurrentUser: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        OrderFacade,
        { provide: OrderService, useValue: orderServiceMock },
        { provide: UserFacade, useValue: userFacadeMock },
      ],
    });

    facade = TestBed.inject(OrderFacade);
  });

  describe('Initial State', () => {
    it('should have no selected order initially', async () => {
      const order = await firstValueFrom(facade.order$);
      expect(order).toBeNull();
    });

    it('should have empty orders array initially', async () => {
      const orders = await firstValueFrom(facade.orders$);
      expect(orders).toEqual([]);
    });

    it('should not be loading initially', async () => {
      const loading = await firstValueFrom(facade.isLoading$);
      expect(loading).toBe(false);
    });

    it('should have no error initially', async () => {
      const error = await firstValueFrom(facade.error$);
      expect(error).toBeNull();
    });

    it('should have total 0 initially', async () => {
      const total = await firstValueFrom(facade.total$);
      expect(total).toBe(0);
    });
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      orderServiceMock.createOrder.mockReturnValue(of(mockOrder));

      facade.createOrder(mockOrder.items);

      await vi.waitFor(async () => {
        const loading = await firstValueFrom(facade.isLoading$);
        expect(loading).toBe(false);
      });

      const order = await firstValueFrom(facade.order$);
      expect(order).toEqual(mockOrder);

      const orders = await firstValueFrom(facade.orders$);
      expect(orders).toContain(mockOrder);

      const total = await firstValueFrom(facade.total$);
      expect(total).toBe(1);

      const error = await firstValueFrom(facade.error$);
      expect(error).toBeNull();
    });

    it('should set loading to true while fetching', async () => {
      orderServiceMock.createOrder.mockReturnValue(of(mockOrder));

      let wasLoading = false;
      facade.isLoading$.subscribe((loading) => {
        if (loading) wasLoading = true;
      });

      facade.createOrder(mockOrder.items);

      await vi.waitFor(() => {
        expect(wasLoading).toBe(true);
      });
    });

    it('should handle create order error', async () => {
      const errorResponse = new Error('Network error');
      orderServiceMock.createOrder.mockReturnValue(
        throwError(() => errorResponse)
      );

      facade.createOrder(mockOrder.items);

      await vi.waitFor(async () => {
        const error = await firstValueFrom(facade.error$);
        expect(error).toBeTruthy();
      });

      const loading = await firstValueFrom(facade.isLoading$);
      expect(loading).toBe(false);
    });
  });

  describe('loadUserOrders', () => {
    it('should load user orders successfully', async () => {
      orderServiceMock.getUserOrders.mockReturnValue(of([mockOrder]));

      facade.loadUserOrders();

      await vi.waitFor(async () => {
        const loading = await firstValueFrom(facade.isLoading$);
        expect(loading).toBe(false);
      });

      const orders = await firstValueFrom(facade.orders$);
      expect(orders).toEqual([mockOrder]);

      const total = await firstValueFrom(facade.total$);
      expect(total).toBe(1);

      const error = await firstValueFrom(facade.error$);
      expect(error).toBeNull();
    });

    it('should handle load user orders error', async () => {
      const errorResponse = new Error('Server error');
      orderServiceMock.getUserOrders.mockReturnValue(
        throwError(() => errorResponse)
      );

      facade.loadUserOrders();

      await vi.waitFor(async () => {
        const error = await firstValueFrom(facade.error$);
        expect(error).toBeTruthy();
      });

      const loading = await firstValueFrom(facade.isLoading$);
      expect(loading).toBe(false);
    });
  });

  describe('loadOrderById', () => {
    it('should load order by ID successfully', async () => {
      orderServiceMock.getOrderById.mockReturnValue(of(mockOrder));

      facade.loadOrderById('ord-1');

      await vi.waitFor(async () => {
        const loading = await firstValueFrom(facade.isLoading$);
        expect(loading).toBe(false);
      });

      const order = await firstValueFrom(facade.order$);
      expect(order).toEqual(mockOrder);

      const error = await firstValueFrom(facade.error$);
      expect(error).toBeNull();
    });

    it('should handle load order by ID error', async () => {
      const errorResponse = new Error('Order not found');
      orderServiceMock.getOrderById.mockReturnValue(
        throwError(() => errorResponse)
      );

      facade.loadOrderById('nonexistent');

      await vi.waitFor(async () => {
        const error = await firstValueFrom(facade.error$);
        expect(error).toBeTruthy();
      });
    });
  });

  describe('clearSelectedOrder', () => {
    it('should clear selected order', async () => {
      orderServiceMock.createOrder.mockReturnValue(of(mockOrder));
      facade.createOrder(mockOrder.items);

      await vi.waitFor(async () => {
        const loading = await firstValueFrom(facade.isLoading$);
        expect(loading).toBe(false);
      });

      facade.clearSelectedOrder();

      const order = await firstValueFrom(facade.order$);
      expect(order).toBeNull();

      const error = await firstValueFrom(facade.error$);
      expect(error).toBeNull();
    });
  });

  describe('clearOrders', () => {
    it('should clear all orders', async () => {
      orderServiceMock.getUserOrders.mockReturnValue(of([mockOrder]));
      facade.loadUserOrders();

      await vi.waitFor(async () => {
        const loading = await firstValueFrom(facade.isLoading$);
        expect(loading).toBe(false);
      });

      facade.clearOrders();

      const orders = await firstValueFrom(facade.orders$);
      expect(orders).toEqual([]);

      const total = await firstValueFrom(facade.total$);
      expect(total).toBe(0);

      const error = await firstValueFrom(facade.error$);
      expect(error).toBeNull();
    });
  });
});
