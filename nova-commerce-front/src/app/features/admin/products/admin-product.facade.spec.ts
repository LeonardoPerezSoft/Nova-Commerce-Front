import { AdminProductFacade } from './admin-product.facade';
import { AdminProductService } from './admin-product.service';
import { of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';

const mockService: Partial<AdminProductService> = {
  list: () => of([{ id: 1, name: 'A', price: 10, stockQuantity: 5, status: 'ACTIVE', productType: 'PHYSICAL', categoryId: undefined }]),
  getById: (id: number) => of({ id, name: 'A', price: 10, stockQuantity: 5, status: 'ACTIVE', productType: 'PHYSICAL', categoryId: undefined }),
  create: (input: any) => of({ id: 2, name: input.name, price: input.price, stockQuantity: input.stockQuantity, status: input.status, productType: input.productType, categoryId: input.categoryId }),
  update: (id: number, input: any) => of({ id, name: input.name, price: input.price, stockQuantity: input.stockQuantity, status: input.status, productType: input.productType, categoryId: input.categoryId }),
  setActive: (id: number, status: 'ACTIVE' | 'INACTIVE') => of({ id, name: 'A', price: 10, stockQuantity: 5, status, productType: 'PHYSICAL', categoryId: undefined }),
};

describe('AdminProductFacade', () => {
  let facade: AdminProductFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminProductFacade,
        { provide: AdminProductService, useValue: mockService },
      ],
    });
    facade = TestBed.inject(AdminProductFacade);
  });

  it('should load products', () => {
    facade.loadProducts();
    facade.products$.subscribe((state: any) => {
      expect(state.products.length).toBe(1);
      expect(state.loading).toBe(false);
    });
  });

  it('should handle load product by id', () => {
    facade.loadProductById(1);
    facade.products$.subscribe((state: any) => {
      expect(state.selectedProduct?.id).toBe(1);
    });
  });

  it('should create product and add to state', () => {
    facade.createProduct({ name: 'B', price: 20, stockQuantity: 2, description: '', status: 'ACTIVE', productType: 'PHYSICAL', categoryId: undefined });
    facade.products$.subscribe((state: any) => {
      expect(state.products[0].id).toBe(2);
    });
  });

  it('should update product in state', () => {
    // preload
    facade.loadProducts();
    facade.updateProduct(1, { name: 'C', price: 30, stockQuantity: 1, description: '', status: 'ACTIVE', productType: 'PHYSICAL', categoryId: undefined });
    facade.products$.subscribe((state: any) => {
      expect(state.products[0].name).toBe('C');
    });
  });

  it('should set active', () => {
    // preload
    facade.loadProducts();
    facade.setActive(1, 'INACTIVE');
    facade.products$.subscribe((state: any) => {
      expect(state.products[0].status).toBe('INACTIVE');
    });
  });

  it('should handle errors gracefully', () => {
    const errorService: Partial<AdminProductService> = {
      list: () => throwError(() => new Error('Network error')),
    };
    (facade as any).service = errorService as AdminProductService;
    facade.loadProducts();
    facade.products$.subscribe((state: any) => {
      expect(state.loading).toBe(false);
    });
  });
});
