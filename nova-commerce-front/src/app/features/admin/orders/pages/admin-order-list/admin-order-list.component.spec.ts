import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminOrderListComponent } from './admin-order-list.component';
import { AdminOrderFacade } from '../../admin-order.facade';
import { of } from 'rxjs';

describe('AdminOrderListComponent', () => {
  let fixture: ComponentFixture<AdminOrderListComponent>;

  const facadeStub = {
    orders$: of({ orders: [], loading: false }),
    loadOrders: () => {},
  } as unknown as AdminOrderFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOrderListComponent],
      providers: [{ provide: AdminOrderFacade, useValue: facadeStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminOrderListComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
