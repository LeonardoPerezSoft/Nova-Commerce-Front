/**
 * ProductService Tests
 *
 * OBJETIVO:
 * Verificar que ProductService realiza correctamente las llamadas HTTP
 * y construye los query params según los filtros
 *
 * ESTRATEGIA:
 * • HttpTestingController para interceptar requests
 * • Verificar URLs, métodos HTTP y parámetros
 * • No mockear el servicio (testear implementación real)
 */

import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductService } from './product.service';
import { APP_CONFIG } from '../../../core/config/app.config';
import {
  Product,
  ProductsResponse,
  Category,
} from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const baseUrl = APP_CONFIG.api.baseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verificar que no haya requests pendientes
    httpMock.verify();
  });

  describe('getProducts', () => {
    it('should fetch products without filters', () => {
      const mockResponse: ProductsResponse = {
        products: [
          {
            id: '1',
            name: 'Producto 1',
            description: 'Descripción 1',
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

      service.getProducts().subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(response.products.length).toBe(1);
      });

      const req = httpMock.expectOne(`${baseUrl}/api/products`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.keys().length).toBe(0); // Sin filtros
      req.flush(mockResponse);
    });

    it('should fetch products with categoryId filter', () => {
      const mockResponse: ProductsResponse = {
        products: [],
        total: 0,
        page: 1,
        pageSize: 10,
      };

      service.getProducts({ categoryId: 'cat1' }).subscribe();

      const req = httpMock.expectOne(
        (request) => request.url === `${baseUrl}/api/products`
      );
      expect(req.request.params.get('categoryId')).toBe('cat1');
      req.flush(mockResponse);
    });

    it('should fetch products with search filter', () => {
      const mockResponse: ProductsResponse = {
        products: [],
        total: 0,
        page: 1,
        pageSize: 10,
      };

      service.getProducts({ search: 'laptop' }).subscribe();

      const req = httpMock.expectOne(
        (request) => request.url === `${baseUrl}/api/products`
      );
      expect(req.request.params.get('search')).toBe('laptop');
      req.flush(mockResponse);
    });

    it('should fetch products with price range filters', () => {
      const mockResponse: ProductsResponse = {
        products: [],
        total: 0,
        page: 1,
        pageSize: 10,
      };

      service.getProducts({ minPrice: 100, maxPrice: 500 }).subscribe();

      const req = httpMock.expectOne(
        (request) => request.url === `${baseUrl}/api/products`
      );
      expect(req.request.params.get('minPrice')).toBe('100');
      expect(req.request.params.get('maxPrice')).toBe('500');
      req.flush(mockResponse);
    });

    it('should fetch products with pagination parameters', () => {
      const mockResponse: ProductsResponse = {
        products: [],
        total: 0,
        page: 2,
        pageSize: 20,
      };

      service.getProducts({ page: 2, pageSize: 20 }).subscribe();

      const req = httpMock.expectOne(
        (request) => request.url === `${baseUrl}/api/products`
      );
      expect(req.request.params.get('page')).toBe('2');
      expect(req.request.params.get('pageSize')).toBe('20');
      req.flush(mockResponse);
    });

    it('should fetch products with multiple filters', () => {
      const mockResponse: ProductsResponse = {
        products: [],
        total: 0,
        page: 1,
        pageSize: 10,
      };

      service
        .getProducts({
          categoryId: 'cat1',
          search: 'laptop',
          minPrice: 100,
          maxPrice: 500,
          page: 1,
          pageSize: 10,
        })
        .subscribe();

      const req = httpMock.expectOne(
        (request) => request.url === `${baseUrl}/api/products`
      );
      expect(req.request.params.get('categoryId')).toBe('cat1');
      expect(req.request.params.get('search')).toBe('laptop');
      expect(req.request.params.get('minPrice')).toBe('100');
      expect(req.request.params.get('maxPrice')).toBe('500');
      expect(req.request.params.get('page')).toBe('1');
      expect(req.request.params.get('pageSize')).toBe('10');
      req.flush(mockResponse);
    });
  });

  describe('getProductById', () => {
    it('should fetch product by id', () => {
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

      service.getProductById('123').subscribe((product) => {
        expect(product).toEqual(mockProduct);
        expect(product.id).toBe('123');
      });

      const req = httpMock.expectOne(`${baseUrl}/api/products/123`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });

    it('should handle 404 error when product not found', () => {
      const errorMessage = 'Product not found';

      service.getProductById('999').subscribe({
        next: () => {
          throw new Error('Should have failed with 404 error');
        },
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/api/products/999`);
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getCategories', () => {
    it('should fetch all categories from paginated response', () => {
      const mockCategories: Category[] = [
        { id: 'cat1', name: 'Electronics', description: 'Electronic devices' },
        { id: 'cat2', name: 'Books', description: 'All kinds of books' },
      ];

      const mockPaginatedResponse = {
        content: mockCategories,
        pageable: { pageNumber: 0, pageSize: 20 },
        totalElements: 2,
        totalPages: 1,
        last: true,
        first: true,
      };

      service.getCategories().subscribe((categories) => {
        expect(categories).toEqual(mockCategories);
        expect(categories.length).toBe(2);
      });

      const req = httpMock.expectOne(`${baseUrl}/api/categories`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });

    it('should fetch categories as direct array', () => {
      const mockCategories: Category[] = [
        { id: 'cat1', name: 'Electronics', description: 'Electronic devices' },
      ];

      service.getCategories().subscribe((categories) => {
        expect(categories).toEqual(mockCategories);
      });

      const req = httpMock.expectOne(`${baseUrl}/api/categories`);
      req.flush(mockCategories);
    });

    it('should return empty array when no categories available', () => {
      const mockPaginatedResponse = {
        content: [],
        pageable: { pageNumber: 0, pageSize: 20 },
        totalElements: 0,
        totalPages: 0,
        last: true,
        first: true,
      };

      service.getCategories().subscribe((categories) => {
        expect(categories).toEqual([]);
        expect(categories.length).toBe(0);
      });

      const req = httpMock.expectOne(`${baseUrl}/api/categories`);
      req.flush(mockPaginatedResponse);
    });
  });
});
