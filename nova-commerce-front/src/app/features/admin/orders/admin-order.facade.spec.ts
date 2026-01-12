import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdminOrderFacade } from './admin-order.facade';
import { AdminOrderService } from './admin-order.service';
import { AdminOrder } from './admin-order.model';

const sampleOrder: AdminOrder = {
  id: 1, customerId: 1, items: [], totalBeforeDiscount: 0, discountTotal: 0, totalAfterDiscount: 0, status: 'CREATED', createdAt: '2026-01-01', updatedAt: '2026-01-01'
};

const mockService: Partial<AdminOrderService> = {
  list: () => of([sampleOrder]),
  getById: (id: number) => of({ ...sampleOrder, id }),
  updateStatus: (id: number, status: any) => of({ ...sampleOrder, id, status }),
};

describe('AdminOrderFacade', () => {
  let facade: AdminOrderFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminOrderFacade,
        { provide: AdminOrderService, useValue: mockService },
      ],
    });
    facade = TestBed.inject(AdminOrderFacade);
  });

  it('should load orders', () => {
    facade.loadOrders();
    facade.orders$.subscribe((state: any) => {
      expect(state.orders.length).toBe(1);
      expect(state.loading).toBe(false);
    });
  });

  it('should load order by id', () => {
    facade.loadOrderById(2);
    facade.orders$.subscribe((state: any) => {
      expect(state.selectedOrder?.id).toBe(2);
    });
  });

  it('should update order status', () => {
    facade.loadOrders();
    facade.updateOrderStatus(1, 'PAID');
    facade.orders$.subscribe((state: any) => {
      expect(state.orders[0].status).toBe('PAID');
    });
  });

  it('should handle error', () => {
    const errorService: Partial<AdminOrderService> = {
      list: () => throwError(() => new Error('Network')),
    };
    (facade as any).service = errorService as AdminOrderService;
    facade.loadOrders();
    facade.orders$.subscribe((state: any) => {
      expect(state.loading).toBe(false);
    });
  });
});
