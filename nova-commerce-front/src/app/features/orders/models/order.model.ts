/**
 * Order Models
 *
 * Define interfaces para órdenes, items y descuentos
 * Alineadas con backend Spring Boot
 */

export interface OrderItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Discount {
  type: 'LOYALTY' | 'PRODUCT' | 'SEASON';
  percentage: number;
  amount: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  discounts: Discount[];
  status: 'CREATED' | 'PAID' | 'SHIPPED' | 'COMPLETED';
  createdAt: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  pageSize: number;
}
