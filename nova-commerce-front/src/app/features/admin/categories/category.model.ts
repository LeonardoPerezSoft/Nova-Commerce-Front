export interface Category {
  id: number;
  name: string;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface CategoryResponse {
  content: Category[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
