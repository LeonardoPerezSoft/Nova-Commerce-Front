import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminProductTableComponent } from './admin-product-table.component';
import { AdminProductFacade } from '../../admin-product.facade';
import { ActivatedRoute } from '@angular/router';
import { provideRouter } from '@angular/router';

describe('AdminProductTableComponent', () => {
  let fixture: ComponentFixture<AdminProductTableComponent>;
  let component: AdminProductTableComponent;

  const mockFacade = {
    deleteProduct: vi.fn()
  };

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [AdminProductTableComponent],
      providers: [
        { provide: AdminProductFacade, useValue: mockFacade },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductTableComponent);
    component = fixture.componentInstance;
    component.products = [
      { id: 1, name: 'A', price: 10, stockQuantity: 5, status: 'ACTIVE', productType: 'PHYSICAL', categoryId: undefined },
      { id: 2, name: 'B', price: 20, stockQuantity: 3, status: 'INACTIVE', productType: 'DIGITAL', categoryId: undefined },
    ];
    fixture.detectChanges();
  });

  it('should render table rows', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });
});
