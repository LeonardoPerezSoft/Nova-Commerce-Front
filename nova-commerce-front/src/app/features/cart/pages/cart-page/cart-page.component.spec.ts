import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartPageComponent } from './cart-page.component';
import { CartFacade } from '../../services/cart.facade';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { CartItem } from '../../models/cart.model';
import { vi } from 'vitest';

describe('CartPageComponent', () => {
  let component: CartPageComponent;
  let fixture: ComponentFixture<CartPageComponent>;
  let cartFacadeMock: any;

  const mockItem: CartItem = {
    productId: '1',
    name: 'Test Product',
    price: 29.99,
    quantity: 2,
    imageUrl: 'http://example.com/image.jpg',
    categoryId: 'cat1',
  };

  beforeEach(async () => {
    cartFacadeMock = {
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      checkout: vi.fn(),
      getQuantity: vi.fn(),
      getCurrentCart: vi.fn(),
      items$: of([mockItem]),
      totalItems$: of(2),
      totalAmount$: of(59.98),
      isEmpty$: of(false),
      cart$: of({
        items: [mockItem],
        totalItems: 2,
        totalAmount: 59.98,
        lastUpdated: new Date().toISOString(),
      }),
    };

    await TestBed.configureTestingModule({
      imports: [CartPageComponent, RouterTestingModule],
      providers: [{ provide: CartFacade, useValue: cartFacadeMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(CartPageComponent);
    component = fixture.componentInstance;
  });

  describe('Rendering', () => {
    it('debe renderizar el componente', () => {
      expect(component).toBeTruthy();
    });

    it('debe mostrar título', () => {
      fixture.detectChanges();
      const title = fixture.debugElement.query(By.css('.cart-page__title'));
      expect(title.nativeElement.textContent).toContain('Carrito de Compras');
    });
  });

  describe('Empty State', () => {
    beforeEach(() => {
      // Recrear mocks para estado vacío
      cartFacadeMock.isEmpty$ = of(true);
      cartFacadeMock.items$ = of([]);
      // Recrear fixture con nuevos mocks
      fixture = TestBed.createComponent(CartPageComponent);
      component = fixture.componentInstance;
    });

    it('debe mostrar mensaje vacío cuando el carrito está vacío', () => {
      fixture.detectChanges();
      const empty = fixture.debugElement.query(By.css('.cart-page__empty'));
      expect(empty).toBeTruthy();
    });

    it('debe mostrar ícono en estado vacío', () => {
      fixture.detectChanges();
      const icon = fixture.debugElement.query(By.css('.cart-page__empty-icon'));
      expect(icon).toBeTruthy();
    });

    it('debe mostrar link a productos en estado vacío', () => {
      fixture.detectChanges();
      const link = fixture.debugElement.query(By.css('.cart-page__empty-btn'));
      expect(link).toBeTruthy();
      // Verificar que el link existe y apunta a products (en template tiene [routerLink]="['/products']")
      expect(link.nativeElement.textContent).toContain('Ver Productos');
    });
  });

  describe('Cart Content', () => {
    it('debe mostrar items cuando el carrito tiene contenido', () => {
      fixture.detectChanges();
      const items = fixture.debugElement.query(By.css('.cart-page__items'));
      expect(items).toBeTruthy();
    });

    it('debe mostrar resumen cuando el carrito tiene contenido', () => {
      fixture.detectChanges();
      const summary = fixture.debugElement.query(By.css('app-cart-summary'));
      expect(summary).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    it('debe actualizar cantidad cuando se emite quantityChanged', () => {
      fixture.detectChanges();
      component.onQuantityChanged('1', 5);
      expect(cartFacadeMock.updateQuantity).toHaveBeenCalledWith('1', 5);
    });

    it('debe remover item cuando se emite removed', () => {
      fixture.detectChanges();
      component.onRemoveItem('1');
      expect(cartFacadeMock.removeItem).toHaveBeenCalledWith('1');
    });

    it('debe hacer checkout cuando se emite evento', () => {
      fixture.detectChanges();
      component.onCheckout();
      expect(cartFacadeMock.checkout).toHaveBeenCalled();
    });

    it('debe mostrar isCheckoutLoading durante checkout', async () => {
      fixture.detectChanges();
      expect(component.isCheckoutLoading).toBe(false);
      component.onCheckout();
      expect(component.isCheckoutLoading).toBe(true);

      await new Promise((resolve) => setTimeout(resolve, 600));
      expect(component.isCheckoutLoading).toBe(false);
    });
  });

  describe('Observable Integration', () => {
    it('debe vincular items$ del facade', () => {
      component.items$.subscribe((items) => {
        expect(items).toEqual([mockItem]);
      });
    });

    it('debe vincular totalItems$ del facade', () => {
      component.totalItems$.subscribe((total) => {
        expect(total).toBe(2);
      });
    });

    it('debe vincular totalAmount$ del facade', () => {
      component.totalAmount$.subscribe((amount) => {
        expect(amount).toBe(59.98);
      });
    });

    it('debe vincular isEmpty$ del facade', () => {
      component.isEmpty$.subscribe((isEmpty) => {
        expect(isEmpty).toBe(false);
      });
    });
  });

  describe('Error Handling', () => {
    it('debe manejar errores durante checkout', () => {
      cartFacadeMock.checkout = vi.fn().mockImplementation(() => {
        throw new Error('Checkout failed');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      fixture.detectChanges();
      component.onCheckout();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error during checkout:',
        expect.any(Error)
      );
      expect(component.isCheckoutLoading).toBe(false);
      consoleSpy.mockRestore();
    });
  });
});
