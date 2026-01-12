import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminOrderService } from './admin-order.service';
import { APP_CONFIG } from '../../../core/config/app.config';

describe('AdminOrderService', () => {
  let service: AdminOrderService;
  let httpMock: HttpTestingController;
  const base = `${APP_CONFIG.api.baseUrl}/api`;
  const resource = `${base}/orders`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AdminOrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should list orders without filter', () => {
    service.list().subscribe();
    const req = httpMock.expectOne(resource);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should list orders with status filter', () => {
    service.list('PAID').subscribe();
    const req = httpMock.expectOne(`${resource}?status=PAID`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get order by id', () => {
    service.getById(1).subscribe();
    const req = httpMock.expectOne(`${resource}/1`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 1, customerId: 1, items: [], totalBeforeDiscount: 0, discountTotal: 0, totalAfterDiscount: 0, status: 'CREATED', createdAt: '2026-01-01', updatedAt: '2026-01-01' });
  });

  it('should update order status', () => {
    service.updateStatus(1, 'PAID').subscribe();
    const req = httpMock.expectOne(`${resource}/1/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'PAID' });
    req.flush({ id: 1, customerId: 1, items: [], totalBeforeDiscount: 0, discountTotal: 0, totalAfterDiscount: 0, status: 'PAID', createdAt: '2026-01-01', updatedAt: '2026-01-01' });
  });
});
