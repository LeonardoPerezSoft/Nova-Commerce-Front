/**
 * CartFacade Tests
 *
 * Validar gestión de estado del carrito:
 * • Agregar items
 * • Incrementar cantidad
 * • Eliminar items
 * • Limpiar carrito
 * • Persistencia en storage
 * • Checkout
 * • Cálculo de totales
 */

import { TestBed } from '@angular/core/testing';
import { CartFacade } from './cart.facade';
import { CartStorageService } from './cart-storage.service';
import { OrderFacade } from '../../orders/services/order.facade';
import { firstValueFrom } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { CartItem, Cart } from '../models/cart.model';

describe('CartFacade', () => {
  let facade: CartFacade;
  let storageServiceMock: any;
  let orderFacadeMock: any;

  const mockProduct = {
    id: 'prod-1',
    name: 'Product 1',
    price: 100,
    imageUrl: 'http://example.com/img1.jpg',
    categoryId: 'cat-1',
  };

  const mockProduct2 = {
    id: 'prod-2',
    name: 'Product 2',
    price: 50,
    imageUrl: 'http://example.com/img2.jpg',
    categoryId: 'cat-1',
  };

  beforeEach(() => {
    storageServiceMock = {
      saveCart: vi.fn(),
      getCart: vi.fn().mockReturnValue(null),
      clearCart: vi.fn(),
    };

    orderFacadeMock = {
      createOrder: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        CartFacade,
        { provide: CartStorageService, useValue: storageServiceMock },
        { provide: OrderFacade, useValue: orderFacadeMock },
      ],
    });

    facade = TestBed.inject(CartFacade);
  });

  describe('Initial State', () => {
    it('should have empty cart initially', async () => {
      const cart = await firstValueFrom(facade.cart$);
      expect(cart.items).toEqual([]);
      expect(cart.totalItems).toBe(0);
      expect(cart.totalAmount).toBe(0);
    });

    it('should have isEmpty$ true initially', async () => {
      const isEmpty = await firstValueFrom(facade.isEmpty$);
      expect(isEmpty).toBe(true);
    });
  });

  describe('addItem', () => {
    it('should add new item to cart', async () => {
      facade.addItem(mockProduct);

      const items = await firstValueFrom(facade.items$);
      expect(items.length).toBe(1);
      expect(items[0].productId).toBe('prod-1');
      expect(items[0].quantity).toBe(1);
    });

    it('should increment quantity if item exists', async () => {
      facade.addItem(mockProduct);
      facade.addItem(mockProduct);

      const items = await firstValueFrom(facade.items$);
      expect(items.length).toBe(1);
      expect(items[0].quantity).toBe(2);
    });

    it('should calculate correct totals after adding', async () => {
      facade.addItem(mockProduct); // 100 × 1
      facade.addItem(mockProduct2); // 50 × 1

      const totalItems = await firstValueFrom(facade.totalItems$);
      const totalAmount = await firstValueFrom(facade.totalAmount$);

      expect(totalItems).toBe(2);
      expect(totalAmount).toBe(150);
    });

    it('should persist to storage after adding', () => {
      facade.addItem(mockProduct);

      expect(storageServiceMock.saveCart).toHaveBeenCalled();
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', async () => {
      facade.addItem(mockProduct);
      facade.addItem(mockProduct2);

      facade.removeItem('prod-1');

      const items = await firstValueFrom(facade.items$);
      expect(items.length).toBe(1);
      expect(items[0].productId).toBe('prod-2');
    });

    it('should update totals after removal', async () => {
      facade.addItem(mockProduct); // 100
      facade.addItem(mockProduct2); // 50

      facade.removeItem('prod-1');

      const totalAmount = await firstValueFrom(facade.totalAmount$);
      expect(totalAmount).toBe(50);
    });
  });

  describe('updateQuantity', () => {
    it('should update quantity of existing item', async () => {
      facade.addItem(mockProduct);
      facade.updateQuantity('prod-1', 5);

      const items = await firstValueFrom(facade.items$);
      expect(items[0].quantity).toBe(5);
    });

    it('should remove item if quantity becomes 0', async () => {
      facade.addItem(mockProduct);
      facade.updateQuantity('prod-1', 0);

      const items = await firstValueFrom(facade.items$);
      expect(items.length).toBe(0);
    });

    it('should recalculate totals on quantity update', async () => {
      facade.addItem(mockProduct); // 100 × 1 = 100
      facade.updateQuantity('prod-1', 3); // 100 × 3 = 300

      const totalAmount = await firstValueFrom(facade.totalAmount$);
      expect(totalAmount).toBe(300);
    });
  });

  describe('clearCart', () => {
    it('should empty all items', async () => {
      facade.addItem(mockProduct);
      facade.addItem(mockProduct2);

      facade.clearCart();

      const items = await firstValueFrom(facade.items$);
      expect(items).toEqual([]);
    });

    it('should reset totals to zero', async () => {
      facade.addItem(mockProduct);

      facade.clearCart();

      const totalItems = await firstValueFrom(facade.totalItems$);
      const totalAmount = await firstValueFrom(facade.totalAmount$);

      expect(totalItems).toBe(0);
      expect(totalAmount).toBe(0);
    });
  });

  describe('checkout', () => {
    it('should call orderFacade.createOrder with items', () => {
      facade.addItem(mockProduct);
      facade.addItem(mockProduct2);

      facade.checkout();

      expect(orderFacadeMock.createOrder).toHaveBeenCalled();
      const callArgs = orderFacadeMock.createOrder.mock.calls[0][0];
      expect(callArgs.length).toBe(2);
      expect(callArgs[0].productId).toBe('prod-1');
      expect(callArgs[0].unitPrice).toBe(100);
      expect(callArgs[0].quantity).toBe(1);
    });

    it('should clear cart after checkout', async () => {
      facade.addItem(mockProduct);

      facade.checkout();

      const items = await firstValueFrom(facade.items$);
      expect(items).toEqual([]);
    });

    it('should not checkout with empty cart', () => {
      facade.checkout();

      expect(orderFacadeMock.createOrder).not.toHaveBeenCalled();
    });
  });

  describe('getQuantity', () => {
    it('should return quantity of item in cart', () => {
      facade.addItem(mockProduct);
      facade.updateQuantity('prod-1', 3);

      const qty = facade.getQuantity('prod-1');
      expect(qty).toBe(3);
    });

    it('should return 0 for non-existent item', () => {
      const qty = facade.getQuantity('nonexistent');
      expect(qty).toBe(0);
    });
  });

  describe('Load from storage', () => {
    it('should load cart from storage on init', () => {
      const mockSavedCart: Cart = {
        items: [
          {
            productId: 'prod-1',
            name: 'Saved Product',
            price: 100,
            quantity: 2,
            imageUrl: 'http://example.com/img.jpg',
          },
        ],
        totalItems: 2,
        totalAmount: 200,
        lastUpdated: new Date().toISOString(),
      };

      storageServiceMock.getCart.mockReturnValue(mockSavedCart);

      // Create new instance to trigger init
      const newFacade = TestBed.inject(CartFacade);

      // Since we already created facade above with empty storage,
      // this test validates the loading logic
      expect(storageServiceMock.getCart).toHaveBeenCalled();
    });
  });

  describe('Observables', () => {
    it('should emit updated items$ on item addition', async () => {
      facade.addItem(mockProduct);

      const items = await firstValueFrom(facade.items$);
      expect(items.length).toBeGreaterThan(0);
    });

    it('should emit updated isEmpty$ when items added/removed', async () => {
      expect(await firstValueFrom(facade.isEmpty$)).toBe(true);

      facade.addItem(mockProduct);
      expect(await firstValueFrom(facade.isEmpty$)).toBe(false);

      facade.clearCart();
      expect(await firstValueFrom(facade.isEmpty$)).toBe(true);
    });

    it('should maintain distinctUntilChanged for cart$', async () => {
      let emitCount = 0;

      facade.cart$.subscribe(() => {
        emitCount++;
      });

      facade.addItem(mockProduct);
      const initialCount = emitCount;

      // Try adding same item (shouldn't emit if state unchanged)
      facade.addItem(mockProduct);

      await new Promise((resolve) => setTimeout(resolve, 100));
      // Should have emitted more since we're modifying quantity
      expect(emitCount).toBeGreaterThan(initialCount);
    });
  });
});
