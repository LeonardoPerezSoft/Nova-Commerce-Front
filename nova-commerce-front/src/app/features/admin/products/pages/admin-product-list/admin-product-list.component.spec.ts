import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminProductListComponent } from './admin-product-list.component';
import { AdminProductFacade } from '../../admin-product.facade';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('AdminProductListComponent', () => {
  let fixture: ComponentFixture<AdminProductListComponent>;
  let component: AdminProductListComponent;
  let mockFacade: any;

  beforeEach(async () => {
    mockFacade = {
      state$: of({
        products: [
          { id: 1, name: 'Product 1', price: 10, stockQuantity: 5, status: 'ACTIVE', productType: 'PHYSICAL', categoryId: 1 },
          { id: 2, name: 'Product 2', price: 20, stockQuantity: 3, status: 'INACTIVE', productType: 'DIGITAL', categoryId: 2 }
        ],
        selectedProduct: null,
        loading: false,
        filter: {}
      }),
      loadProducts: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AdminProductListComponent],
      providers: [
        { provide: AdminProductFacade, useValue: mockFacade },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(mockFacade.loadProducts).toHaveBeenCalled();
  });

  it('should render page title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('.admin-page__title');
    expect(title?.textContent).toContain('Gestión de Productos');
  });

  it('should render new product button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('a[routerLink="/admin/products/new"]');
    expect(button).toBeTruthy();
    expect(button?.textContent).toContain('Nuevo Producto');
  });

  it('should pass products to table component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const table = compiled.querySelector('app-admin-product-table');
    expect(table).toBeTruthy();
  });
});
