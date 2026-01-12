export type AdminOrderStatus = 'CREATED' | 'PAID' | 'SHIPPED' | 'COMPLETED';

export interface AdminOrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
  productType?: string;
}

export interface AdminOrder {
  id: number;
  customerId: number;
  status: AdminOrderStatus;
  totalBeforeDiscount: number;
  discountTotal: number;
  totalAfterDiscount: number;
  createdAt: string;
  updatedAt: string;
  items: AdminOrderItem[];
}
