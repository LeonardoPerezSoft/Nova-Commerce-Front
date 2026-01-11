/**
 * Cart Models
 *
 * Define interfaces para carrito de compras
 * CartItem: producto en el carrito con cantidad
 * Cart: estado del carrito
 */

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  categoryId?: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  lastUpdated: string;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}
