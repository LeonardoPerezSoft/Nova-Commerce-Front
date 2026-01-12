import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminProductFormComponent } from './admin-product-form.component';
import { AdminProductFacade } from '../../admin-product.facade';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CategoryService } from '../../../categories/category.service';

describe('AdminProductFormComponent', () => {
  let fixture: ComponentFixture<AdminProductFormComponent>;
  let component: AdminProductFormComponent;

  beforeEach(async () => {
    const stateSubject = new BehaviorSubject({
      products: [],
      selectedProduct: null,
      loading: false,
      filter: {}
    });

    const mockFacade = {
      loadProductById: vi.fn(),
      createProduct: vi.fn(),
      updateProduct: vi.fn(),
      state$: stateSubject.asObservable(),
      products$: stateSubject.asObservable()
    };

    const mockCategoryService = {
      list: vi.fn().mockReturnValue(new BehaviorSubject([
        { id: 1, name: 'Category 1', status: 'ACTIVE' },
        { id: 2, name: 'Category 2', status: 'ACTIVE' }
      ]).asObservable())
    };

    await TestBed.configureTestingModule({
      imports: [AdminProductFormComponent],
      providers: [
        { provide: AdminProductFacade, useValue: mockFacade },
        { provide: CategoryService, useValue: mockCategoryService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: vi.fn().mockReturnValue(null)
              }
            }
          }
        },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default model', () => {
    expect(component.model).toBeDefined();
    expect(component.model.name).toBe('');
    expect(component.model.status).toBe('ACTIVE');
    expect(component.model.productType).toBe('PHYSICAL');
  });

  it('should set isEdit to false when no id param', () => {
    expect(component.isEdit).toBe(false);
  });
});

