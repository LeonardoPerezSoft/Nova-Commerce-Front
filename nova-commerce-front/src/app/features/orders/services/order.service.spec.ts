/**
 * OrderService Tests
 *
 * Validar capa HTTP de órdenes:
 * • createOrder() envía POST con items
 * • getUserOrders() maneja respuestas Spring Data
 * • getOrderById() obtiene orden por ID
 * • Error handling propagado
 */

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { OrderService } from './order.service';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { APP_CONFIG } from '../../../core/config/app.config';
import type { Order, CreateOrderRequest } from '../models/order.model';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  const apiUrl = `${APP_CONFIG.api.baseUrl}/api/orders`;

  const mockOrder: Order = {
    id: 'ord-1',
    userId: 'user-1',
    items: [
      {
        productId: 'prod-1',
        name: 'Product 1',
        unitPrice: 100,
        quantity: 2,
        subtotal: 200,
      },
    ],
    totalBeforeDiscount: 200,
    totalAfterDiscount: 180,
    discounts: [
      {
        type: 'LOYALTY',
        percentage: 10,
        amount: 20,
      },
    ],
    status: 'CREATED',
    createdAt: '2026-01-11T10:00:00Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService],
    });

    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('createOrder', () => {
    it('should create order with POST request', () => {
      const request: CreateOrderRequest = {
        items: mockOrder.items,
      };

      service.createOrder(request).subscribe((result) => {
        expect(result).toEqual(mockOrder);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockOrder);
    });

    it('should handle createOrder error', () => {
      const request: CreateOrderRequest = {
        items: mockOrder.items,
      };

      service.createOrder(request).subscribe(
        () => {
          throw new Error('should not succeed');
        },
        (error) => {
          expect(error.status).toBe(400);
        }
      );

      const req = httpMock.expectOne(apiUrl);
      req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getUserOrders', () => {
    it('should get user orders from array response', () => {
      service.getUserOrders().subscribe((result) => {
        expect(result).toEqual([mockOrder]);
        expect(result.length).toBe(1);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush([mockOrder]);
    });

    it('should get user orders from Spring Data paginated response', () => {
      const springDataResponse = {
        content: [mockOrder],
        pageable: { pageNumber: 0, pageSize: 20 },
        totalElements: 1,
      };

      service.getUserOrders().subscribe((result) => {
        expect(result).toEqual([mockOrder]);
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(springDataResponse);
    });

    it('should get user orders from custom orders response', () => {
      const customResponse = {
        orders: [mockOrder],
        total: 1,
        page: 1,
        pageSize: 20,
      };

      service.getUserOrders().subscribe((result) => {
        expect(result).toEqual([mockOrder]);
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(customResponse);
    });

    it('should return empty array on unexpected response format', () => {
      service.getUserOrders().subscribe((result) => {
        expect(result).toEqual([]);
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush({ unexpected: 'format' });
    });

    it('should handle getUserOrders error', () => {
      service.getUserOrders().subscribe(
        () => {
          throw new Error('should not succeed');
        },
        (error) => {
          expect(error.status).toBe(500);
        }
      );

      const req = httpMock.expectOne(apiUrl);
      req.flush('Server error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getOrderById', () => {
    it('should get order by ID', () => {
      const orderId = 'ord-1';

      service.getOrderById(orderId).subscribe((result) => {
        expect(result).toEqual(mockOrder);
      });

      const req = httpMock.expectOne(`${apiUrl}/${orderId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockOrder);
    });

    it('should handle getOrderById 404 error', () => {
      const orderId = 'nonexistent';

      service.getOrderById(orderId).subscribe(
        () => {
          throw new Error('should not succeed');
        },
        (error) => {
          expect(error.status).toBe(404);
        }
      );

      const req = httpMock.expectOne(`${apiUrl}/${orderId}`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });
});
