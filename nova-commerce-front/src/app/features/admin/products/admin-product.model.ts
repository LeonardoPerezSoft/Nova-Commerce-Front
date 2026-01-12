export interface AdminProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  productType: string;
  categoryId?: number;
  stockQuantity: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface AdminProductInput {
  name: string;
  description?: string;
  price: number;
  productType?: string;
  categoryId?: number;
  stockQuantity: number;
  status?: 'ACTIVE' | 'INACTIVE';
}
