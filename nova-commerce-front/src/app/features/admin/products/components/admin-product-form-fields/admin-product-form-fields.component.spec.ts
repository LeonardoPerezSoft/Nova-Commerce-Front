import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminProductFormFieldsComponent } from './admin-product-form-fields.component';
import { CategoryService } from '../../../categories/category.service';
import { of } from 'rxjs';

describe('AdminProductFormFieldsComponent', () => {
  let fixture: ComponentFixture<AdminProductFormFieldsComponent>;
  let component: AdminProductFormFieldsComponent;
  let mockCategoryService: any;

  beforeEach(async () => {
    mockCategoryService = {
      list: vi.fn().mockReturnValue(of([
        { id: 1, name: 'Electronics', status: 'ACTIVE' },
        { id: 2, name: 'Books', status: 'ACTIVE' }
      ]))
    };

    await TestBed.configureTestingModule({
      imports: [AdminProductFormFieldsComponent],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductFormFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    expect(mockCategoryService.list).toHaveBeenCalled();
    expect(component.categories.length).toBe(2);
    expect(component.loadingCategories).toBe(false);
  });

  it('should initialize with default model', () => {
    expect(component.model.name).toBe('');
    expect(component.model.status).toBe('ACTIVE');
    expect(component.model.productType).toBe('PHYSICAL');
  });

  it('should emit model change on emitChange', () => {
    const spy = vi.fn();
    component.modelChange.subscribe(spy);

    component.emitChange();

    expect(spy).toHaveBeenCalledWith(component.model);
  });

  it('should render all form fields', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const inputs = compiled.querySelectorAll('.form-input');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('should render name input', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const nameInput = compiled.querySelector('input[placeholder="Nombre del producto"]');
    expect(nameInput).toBeTruthy();
  });

  it('should render description textarea', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const descriptionTextarea = compiled.querySelector('textarea[placeholder="Descripción del producto"]');
    expect(descriptionTextarea).toBeTruthy();
  });

  it('should render price input', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const priceInput = compiled.querySelector('input[type="number"][step="0.01"]');
    expect(priceInput).toBeTruthy();
  });

it('should render category select with options', async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const categorySelect = compiled.querySelector('select');
    const options = categorySelect?.querySelectorAll('option');

    expect(options).toBeTruthy();
    expect(options!.length).toBeGreaterThan(0);
  });

  it('should show loading state while categories are loading', () => {
    // Reset component to re-create with loading state
    TestBed.resetTestingModule();

    // Create a new mock that returns a delayed observable
    const delayedMockService = {
      list: vi.fn().mockReturnValue(new Promise(resolve => setTimeout(() => resolve([]), 1000)))
    };

    TestBed.configureTestingModule({
      imports: [AdminProductFormFieldsComponent],
      providers: [
        { provide: CategoryService, useValue: delayedMockService }
      ]
    }).compileComponents();

    const newFixture = TestBed.createComponent(AdminProductFormFieldsComponent);
    const newComponent = newFixture.componentInstance;

    // Don't call detectChanges yet - categories are still loading
    expect(newComponent.loadingCategories).toBe(true);
  });

  it('should render product type select', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const selects = compiled.querySelectorAll('select');
    const productTypeSelect = Array.from(selects).find(select =>
      select.innerHTML.includes('Físico') || select.innerHTML.includes('Digital')
    );
    expect(productTypeSelect).toBeTruthy();
  });

  it('should render status select', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const selects = compiled.querySelectorAll('select');
    const statusSelect = Array.from(selects).find(select =>
      select.innerHTML.includes('Activo') || select.innerHTML.includes('Inactivo')
    );
    expect(statusSelect).toBeTruthy();
  });
});
