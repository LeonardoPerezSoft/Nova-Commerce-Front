/**
 * CartStorageService
 *
 * Abstracción de sessionStorage para carrito
 * Responsabilidades:
 * • Guardar carrito en sessionStorage
 * • Recuperar carrito
 * • Limpiar carrito
 *
 * Nota: SessionStorage persiste mientras la pestaña está abierta
 * Al cerrar, se limpia automáticamente (UX deseada para carrito)
 */

import { Injectable } from '@angular/core';
import type { Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartStorageService {
  private readonly STORAGE_KEY = 'nova_commerce_cart';

  /**
   * Guarda el carrito en sessionStorage
   */
  saveCart(cart: Cart): void {
    try {
      const serialized = JSON.stringify(cart);
      sessionStorage.setItem(this.STORAGE_KEY, serialized);
    } catch (error) {
      console.error('Error guardando carrito en sessionStorage:', error);
    }
  }

  /**
   * Recupera el carrito de sessionStorage
   */
  getCart(): Cart | null {
    try {
      const serialized = sessionStorage.getItem(this.STORAGE_KEY);
      if (!serialized) return null;
      return JSON.parse(serialized) as Cart;
    } catch (error) {
      console.error('Error recuperando carrito de sessionStorage:', error);
      return null;
    }
  }

  /**
   * Limpia el carrito de sessionStorage
   */
  clearCart(): void {
    try {
      sessionStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error limpiando carrito de sessionStorage:', error);
    }
  }
}
