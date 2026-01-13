/**
 * PublicProductService — Pruebas Unitarias
 *
 * COBERTURA:
 * • Obtención de productos públicos
 * • Manejo de errores HTTP
 * • Construcción correcta de URL
 */

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PublicProductService } from './public-product.service';
import { APP_CONFIG } from '../../../core/config/app.config';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('PublicProductService', () => {
  let service: PublicProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PublicProductService],
    });
    service = TestBed.inject(PublicProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener productos públicos', () => {
    const mockProducts = [
      {
        id: '1',
        name: 'Laptop Pro 15',
        description: 'High-performance laptop',
        price: 1299.99,
        productType: 'PHYSICAL',
      },
      {
        id: '4',
        name: 'E-Book: Java Programming',
        description: 'Comprehensive guide',
        price: 19.99,
        productType: 'DIGITAL',
      },
    ];

    service.getPublicProducts().subscribe((products) => {
      expect(products.length).toBe(2);
      expect(products[0].name).toBe('Laptop Pro 15');
      expect(products[1].productType).toBe('DIGITAL');
    });

    const req = httpMock.expectOne(
      `${APP_CONFIG.api.baseUrl}/api/public/products/home`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('debería manejar errores en la obtención de productos', async () => {
    const errorMessage = 'Error 404: No encontrado';

    let errorOccurred = false;

    service.getPublicProducts().subscribe(
      () => {
        throw new Error('debería haber fallado');
      },
      (error: any) => {
        errorOccurred = true;
        expect(error.status).toBe(404);
      }
    );

    const req = httpMock.expectOne(
      `${APP_CONFIG.api.baseUrl}/api/public/products/home`
    );
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });

    expect(errorOccurred).toBe(true);
  });

  it('debería construir la URL correctamente', () => {
    service.getPublicProducts().subscribe();

    const req = httpMock.expectOne(
      `${APP_CONFIG.api.baseUrl}/api/public/products/home`
    );
    expect(req.request.url).toBe(
      `${APP_CONFIG.api.baseUrl}/api/public/products/home`
    );
    req.flush([]);
  });
});
