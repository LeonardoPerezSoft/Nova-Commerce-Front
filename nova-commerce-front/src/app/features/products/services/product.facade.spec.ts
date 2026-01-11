/**
 * ProductFacade Tests
 *
 * OBJETIVO:
 * Verificar gestión de estado de productos mediante observables
 *
 * ESTRATEGIA:
 * • Mock ProductService con Vitest
 * • Verificar emisiones de observables (products$, loading$, error$)
 * • Testear flujos completos (success, error, loading states)
 * • Usar firstValueFrom() para async (compatible con Vitest)
 */

import { TestBed } from '@angular/core/testing';
import { ProductFacade } from './product.facade';
import { ProductService } from './product.service';
import { firstValueFrom } from 'rxjs';
import { vi } from 'vitest';
import { of, throwError } from 'rxjs';
import type {
  Product,
  ProductsResponse,
  Category,
} from '../models/product.model';

describe('ProductFacade', () => {
  let facade: ProductFacade;
  let productServiceMock: {
    getProducts: ReturnType<typeof vi.fn>;
    getProductById: ReturnType<typeof vi.fn>;
    getCategories: ReturnType<typeof vi.fn>;
    getProductsByCategory: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    productServiceMock = {
      getProducts: vi.fn(),
      getProductById: vi.fn(),
      getCategories: vi.fn(),
      getProductsByCategory: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ProductFacade,
        { provide: ProductService, useValue: productServiceMock },
      ],
    });

    facade = TestBed.inject(ProductFacade);
  });

  describe('Initial State', () => {
    it('should have empty products array initially', async () => {
      const products = await firstValueFrom(facade.products$);
      expect(products).toEqual([]);
    });

    it('should have no selected product initially', async () => {
      const selectedProduct = await firstValueFrom(facade.selectedProduct$);
      expect(selectedProduct).toBeNull();
    });

    it('should have empty categories array initially', async () => {
      const categories = await firstValueFrom(facade.categories$);
      expect(categories).toEqual([]);
    });

    it('should not be loading initially', async () => {
      const loading = await firstValueFrom(facade.loading$);
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

  describe('loadProducts', () => {
    it('should load products successfully', async () => {
      const mockResponse: ProductsResponse = {
        products: [
          {
            id: '1',
            name: 'Product 1',
            description: 'Description 1',
            price: 100,
            imageUrl: 'http://example.com/image1.jpg',
            categoryId: 'cat1',
            stock: 10,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
        ],
        total: 1,
        page: 1,
        pageSize: 10,
      };

      productServiceMock.getProducts.mockReturnValue(of(mockResponse));

      facade.loadProducts();

      // Esperar a que termine el loading
      await vi.waitFor(async () => {
        const loading = await firstValueFrom(facade.loading$);
        expect(loading).toBe(false);
      });

      const products = await firstValueFrom(facade.products$);
      expect(products).toEqual(mockResponse.products);

      const total = await firstValueFrom(facade.total$);
      expect(total).toBe(1);

      const error = await firstValueFrom(facade.error$);
      expect(error).toBeNull();
    });

    it('should load products with filters', async () => {
      const filters = { categoryId: 'cat1' };
      const mockResponse: ProductsResponse = {
        products: [],
        total: 0,
        page: 1,
        pageSize: 10,
      };

      productServiceMock.getProductsByCategory.mockReturnValue(of(mockResponse));

      facade.loadProducts(filters);

      await vi.waitFor(() => {
        expect(productServiceMock.getProductsByCategory).toHaveBeenCalledWith('cat1');
      });
    });

    it('should handle error when loading products fails', async () => {
      const errorResponse = new Error('Network error');
      productServiceMock.getProducts.mockReturnValue(
        throwError(() => errorResponse)
      );

      facade.loadProducts();

      await vi.waitFor(async () => {
        const loading = await firstValueFrom(facade.loading$);
        expect(loading).toBe(false);
      });

      const products = await firstValueFrom(facade.products$);
      expect(products).toEqual([]);

      const error = await firstValueFrom(facade.error$);
      expect(error).toBe(
        'Error al cargar productos. Por favor, intenta nuevamente.'
      );
    });

    it('should set loading to true while fetching', async () => {
      const mockResponse: ProductsResponse = {
        products: [],
        total: 0,
        page: 1,
        pageSize: 10,
      };

      productServiceMock.getProducts.mockReturnValue(of(mockResponse));

      let loadingStates: boolean[] = [];
      facade.loading$.subscribe((state) => loadingStates.push(state));

      facade.loadProducts();

      await vi.waitFor(() => {
        expect(loadingStates).toContain(true);
        expect(loadingStates).toContain(false);
      });
    });
  });

  describe('loadProductById', () => {
    it('should load product by id successfully', async () => {
      const mockProduct: Product = {
        id: '123',
        name: 'Laptop',
        description: 'High-end laptop',
        price: 1500,
        imageUrl: 'http://example.com/laptop.jpg',
        categoryId: 'electronics',
        stock: 5,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      productServiceMock.getProductById.mockReturnValue(of(mockProduct));

      facade.loadProductById('123');

      await vi.waitFor(async () => {
        const loading = await firstValueFrom(facade.loading$);
        expect(loading).toBe(false);
      });

      const selectedProduct = await firstValueFrom(facade.selectedProduct$);
      expect(selectedProduct).toEqual(mockProduct);

      const error = await firstValueFrom(facade.error$);
      expect(error).toBeNull();
    });

    it('should handle error when product not found', async () => {
      const errorResponse = new Error('Product not found');
      productServiceMock.getProductById.mockReturnValue(
        throwError(() => errorResponse)
      );

      facade.loadProductById('999');

      await vi.waitFor(async () => {
        const loading = await firstValueFrom(facade.loading$);
        expect(loading).toBe(false);
      });

      const selectedProduct = await firstValueFrom(facade.selectedProduct$);
      expect(selectedProduct).toBeNull();

      const error = await firstValueFrom(facade.error$);
      expect(error).toBe('Producto no encontrado.');
    });

    it('should clear previous selected product before loading', async () => {
      const mockProduct: Product = {
        id: '123',
        name: 'Laptop',
        description: 'High-end laptop',
        price: 1500,
        imageUrl: 'http://example.com/laptop.jpg',
        categoryId: 'electronics',
        stock: 5,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      productServiceMock.getProductById.mockReturnValue(of(mockProduct));

      facade.loadProductById('123');

      await vi.waitFor(async () => {
        const loading = await firstValueFrom(facade.loading$);
        expect(loading).toBe(false);
      });

      // Ahora cargar otro producto
      const anotherProduct: Product = { ...mockProduct, id: '456' };
      productServiceMock.getProductById.mockReturnValue(of(anotherProduct));

      facade.loadProductById('456');

      await vi.waitFor(async () => {
        const selectedProduct = await firstValueFrom(facade.selectedProduct$);
        expect(selectedProduct?.id).toBe('456');
      });
    });
  });

  describe('loadCategories', () => {
    it('should load categories successfully', async () => {
      const mockCategories: Category[] = [
        { id: 'cat1', name: 'Electronics' },
        { id: 'cat2', name: 'Books' },
      ];

      productServiceMock.getCategories.mockReturnValue(of(mockCategories));

      facade.loadCategories();

      await vi.waitFor(async () => {
        const categories = await firstValueFrom(facade.categories$);
        expect(categories).toEqual(mockCategories);
      });
    });

    it('should handle error when loading categories fails', async () => {
      const errorResponse = new Error('Network error');
      productServiceMock.getCategories.mockReturnValue(
        throwError(() => errorResponse)
      );

      facade.loadCategories();

      await vi.waitFor(async () => {
        const categories = await firstValueFrom(facade.categories$);
        expect(categories).toEqual([]);
      });
    });
  });

  describe('clearSelectedProduct', () => {
    it('should clear selected product', async () => {
      const mockProduct: Product = {
        id: '123',
        name: 'Laptop',
        description: 'High-end laptop',
        price: 1500,
        imageUrl: 'http://example.com/laptop.jpg',
        categoryId: 'electronics',
        stock: 5,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      productServiceMock.getProductById.mockReturnValue(of(mockProduct));

      facade.loadProductById('123');

      await vi.waitFor(async () => {
        const selectedProduct = await firstValueFrom(facade.selectedProduct$);
        expect(selectedProduct).not.toBeNull();
      });

      facade.clearSelectedProduct();

      const selectedProduct = await firstValueFrom(facade.selectedProduct$);
      expect(selectedProduct).toBeNull();
    });
  });

  describe('clearFilters', () => {
    it('should reload products without filters', async () => {
      const mockResponse: ProductsResponse = {
        products: [],
        total: 0,
        page: 1,
        pageSize: 10,
      };

      productServiceMock.getProducts.mockReturnValue(of(mockResponse));

      facade.clearFilters();

      await vi.waitFor(() => {
        expect(productServiceMock.getProducts).toHaveBeenCalledWith(undefined);
      });
    });
  });
});
