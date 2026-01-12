import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminProductService } from './admin-product.service';
import { APP_CONFIG } from '../../../core/config/app.config';

describe('AdminProductService', () => {
  let service: AdminProductService;
  let httpMock: HttpTestingController;
  const base = `${APP_CONFIG.api.baseUrl}/api`;
  const resource = `${base}/products`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AdminProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should list products', () => {
    service.list().subscribe();
    const req = httpMock.expectOne(resource);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get product by id', () => {
    service.getById(1).subscribe();
    const req = httpMock.expectOne(`${resource}/1`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 1, name: 'Test', price: 1, stockQuantity: 0, status: 'ACTIVE', productType: 'PHYSICAL', categoryId: undefined });
  });

  it('should create product', () => {
    service.create({ name: 'A', price: 10, stockQuantity: 5, description: '', status: 'ACTIVE', productType: 'PHYSICAL', categoryId: undefined }).subscribe();
    const req = httpMock.expectOne(resource);
    expect(req.request.method).toBe('POST');
    req.flush({ id: 1, name: 'A', price: 10, stockQuantity: 5, status: 'ACTIVE', productType: 'PHYSICAL', categoryId: undefined });
  });

  it('should update product', () => {
    service.update(1, { name: 'B', price: 20, stockQuantity: 3, description: '', status: 'ACTIVE', productType: 'PHYSICAL', categoryId: undefined }).subscribe();
    const req = httpMock.expectOne(`${resource}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({ id: 1, name: 'B', price: 20, stockQuantity: 3, status: 'ACTIVE', productType: 'PHYSICAL', categoryId: undefined });
  });

  it('should set active', () => {
    service.setActive(1, 'INACTIVE').subscribe();
    const req = httpMock.expectOne(`${resource}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ status: 'INACTIVE' });
    req.flush({ id: 1, name: 'B', price: 20, stockQuantity: 3, status: 'INACTIVE', productType: 'PHYSICAL', categoryId: undefined });
  });
});
