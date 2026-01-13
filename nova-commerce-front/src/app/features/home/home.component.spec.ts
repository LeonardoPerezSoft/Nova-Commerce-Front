/**
 * HomeComponent — Pruebas Unitarias
 *
 * COBERTURA:
 * • Carga de productos públicos al iniciar
 * • Manejo de estados (loading, error, success)
 * • Renderizado de grilla de productos
 * • Manejo de errores en la obtención de datos
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { PublicProductService } from '../products/services/public-product.service';
import { of, throwError } from 'rxjs';
import { Product } from '../products/models/product.model';
import { RouterTestingModule } from '@angular/router/testing';
import { vi } from 'vitest';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let publicProductService: PublicProductService;

  const mockProducts: Product[] = [
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

  beforeEach(async () => {
    const publicProductServiceMock = {
      getPublicProducts: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
      providers: [
        {
          provide: PublicProductService,
          useValue: publicProductServiceMock,
        },
      ],
    }).compileComponents();

    publicProductService = TestBed.inject(PublicProductService);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    vi.mocked(publicProductService.getPublicProducts).mockReturnValue(of([]));
    expect(component).toBeTruthy();
  });

  it('debería cargar productos públicos al iniciar', async () => {
    vi.mocked(publicProductService.getPublicProducts).mockReturnValue(
      of(mockProducts)
    );

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.products.length).toBe(2);
    expect(component.loading).toBe(false);
    expect(component.error).toBeNull();
    expect(publicProductService.getPublicProducts).toHaveBeenCalled();
  });

  it('debería mostrar estado de carga inicialmente', async () => {
    vi.mocked(publicProductService.getPublicProducts).mockReturnValue(
      of(mockProducts)
    );

    expect(component.loading).toBe(true);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.loading).toBe(false);
  });

  it('debería manejar errores en la obtención de productos', async () => {
    const errorMessage = 'Error al cargar productos';
    vi.mocked(publicProductService.getPublicProducts).mockReturnValue(
      throwError(() => new Error(errorMessage))
    );

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.error).toBeTruthy();
    expect(component.loading).toBe(false);
    expect(component.products.length).toBe(0);
  });

  it('debería renderizar hero section', () => {
    vi.mocked(publicProductService.getPublicProducts).mockReturnValue(of([]));

    fixture.detectChanges();

    const hero = fixture.nativeElement.querySelector('.nc-home__hero');
    expect(hero).toBeTruthy();
    expect(hero.textContent).toContain('Bienvenido a NovaCommerce');
  });

  it('debería renderizar grilla de productos cuando hay datos', async () => {
    vi.mocked(publicProductService.getPublicProducts).mockReturnValue(
      of(mockProducts)
    );

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const grid = fixture.nativeElement.querySelector('.nc-home__grid');
    const cards = fixture.nativeElement.querySelectorAll('.nc-product-card');

    expect(grid).toBeTruthy();
    expect(cards.length).toBe(2);
  });

  it('debería mostrar información correcta en cada tarjeta de producto', async () => {
    vi.mocked(publicProductService.getPublicProducts).mockReturnValue(
      of(mockProducts)
    );

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const firstCard = fixture.nativeElement.querySelector('.nc-product-card');
    const title = firstCard.querySelector('.nc-product-card__title');
    const description = firstCard.querySelector(
      '.nc-product-card__description'
    );
    const price = firstCard.querySelector('.nc-product-card__price .amount');

    expect(title.textContent).toContain('Laptop Pro 15');
    expect(description.textContent).toContain('High-performance laptop');
    expect(price.textContent).toContain('1,299.99');
  });

  it('debería mostrar mensaje cuando no hay productos', async () => {
    vi.mocked(publicProductService.getPublicProducts).mockReturnValue(of([]));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const empty = fixture.nativeElement.querySelector('.nc-home__empty');
    expect(empty).toBeTruthy();
    expect(empty.textContent).toContain('No hay productos disponibles');
  });

  it('debería mostrar badge de tipo de producto', async () => {
    vi.mocked(publicProductService.getPublicProducts).mockReturnValue(
      of(mockProducts)
    );

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.nc-product-card');
    const firstType = cards[0].querySelector('.nc-product-card__type');
    const secondType = cards[1].querySelector('.nc-product-card__type');

    expect(firstType.textContent).toContain('PHYSICAL');
    expect(secondType.textContent).toContain('DIGITAL');
  });

  it('debería mostrar estado de carga cuando loading es true', async () => {
    vi.mocked(publicProductService.getPublicProducts).mockReturnValue(
      of(mockProducts)
    );

    fixture.detectChanges();
    // El estado de loading debe ser true inicialmente
    expect(component.loading).toBe(true);

    // Después de que los datos se cargan
    await fixture.whenStable();
    fixture.detectChanges();

    // El estado debe cambiar a false
    expect(component.loading).toBe(false);
  });

  it('debería mostrar mensaje de error cuando hay error', async () => {
    vi.mocked(publicProductService.getPublicProducts).mockReturnValue(
      throwError(() => new Error('Error de conexión'))
    );

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const errorDiv = fixture.nativeElement.querySelector('.nc-home__error');
    expect(errorDiv).toBeTruthy();
    expect(errorDiv.textContent).toContain('No se pudieron cargar');
  });
})
