/**
 * CartStorageService Tests
 *
 * Validar persistencia en sessionStorage:
 * • saveCart() guarda correctamente
 * • getCart() recupera correctamente
 * • clearCart() limpia correctamente
 * • Error handling
 */

import { TestBed } from '@angular/core/testing';
import { CartStorageService } from './cart-storage.service';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Cart } from '../models/cart.model';

describe('CartStorageService', () => {
  let service: CartStorageService;
  let sessionStorageSpy: any;

  const mockCart: Cart = {
    items: [
      {
        productId: 'prod-1',
        name: 'Product 1',
        price: 100,
        quantity: 2,
        imageUrl: 'http://example.com/img1.jpg',
        categoryId: 'cat-1',
      },
    ],
    totalItems: 2,
    totalAmount: 200,
    lastUpdated: new Date().toISOString(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartStorageService],
    });

    service = TestBed.inject(CartStorageService);

    // Setup sessionStorage mock
    sessionStorageSpy = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageSpy,
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('saveCart', () => {
    it('should save cart to sessionStorage', () => {
      service.saveCart(mockCart);

      expect(sessionStorageSpy.setItem).toHaveBeenCalledWith(
        'nova_commerce_cart',
        JSON.stringify(mockCart)
      );
    });

    it('should handle error when saving cart', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      sessionStorageSpy.setItem.mockImplementation(() => {
        throw new Error('Storage full');
      });

      service.saveCart(mockCart);

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getCart', () => {
    it('should retrieve cart from sessionStorage', () => {
      sessionStorageSpy.getItem.mockReturnValue(JSON.stringify(mockCart));

      const result = service.getCart();

      expect(result).toEqual(mockCart);
      expect(sessionStorageSpy.getItem).toHaveBeenCalledWith(
        'nova_commerce_cart'
      );
    });

    it('should return null when cart does not exist', () => {
      sessionStorageSpy.getItem.mockReturnValue(null);

      const result = service.getCart();

      expect(result).toBeNull();
    });

    it('should handle error when retrieving cart', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      sessionStorageSpy.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = service.getCart();

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('should handle malformed JSON', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      sessionStorageSpy.getItem.mockReturnValue('invalid json');

      const result = service.getCart();

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('clearCart', () => {
    it('should clear cart from sessionStorage', () => {
      service.clearCart();

      expect(sessionStorageSpy.removeItem).toHaveBeenCalledWith(
        'nova_commerce_cart'
      );
    });

    it('should handle error when clearing cart', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      sessionStorageSpy.removeItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      service.clearCart();

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });
});
