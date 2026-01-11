import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartSummaryComponent } from './cart-summary.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('CartSummaryComponent', () => {
  let component: CartSummaryComponent;
  let fixture: ComponentFixture<CartSummaryComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartSummaryComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  describe('Display', () => {
    it('debe renderizar el componente', () => {
      expect(component).toBeTruthy();
    });

    it('debe mostrar el título del resumen', () => {
      fixture.detectChanges();
      const title = debugElement.query(By.css('.cart-summary__title'));
      expect(title.nativeElement.textContent).toContain('Resumen del Carrito');
    });

    it('debe mostrar total de items', () => {
      component.totalItems = 5;
      fixture.detectChanges();
      const value = debugElement.query(By.css('.cart-summary__row .cart-summary__value'));
      expect(value.nativeElement.textContent).toContain('5');
    });

    it('debe mostrar el total con formato de moneda', () => {
      component.totalAmount = 99.99;
      fixture.detectChanges();
      const values = debugElement.queryAll(By.css('.cart-summary__value'));
      expect(values[1].nativeElement.textContent).toContain('99.99');
    });
  });

  describe('Botón Checkout', () => {
    it('debe mostrar botón "Confirmar Compra"', () => {
      fixture.detectChanges();
      const btn = debugElement.query(By.css('.cart-summary__btn-checkout'));
      expect(btn.nativeElement.textContent).toContain('Confirmar Compra');
    });

    it('debe emitir evento checkout cuando se hace clic', () => {
      fixture.detectChanges();
      const spy = vi.spyOn(component.checkout, 'emit');
      const btn = debugElement.query(By.css('.cart-summary__btn-checkout'));
      btn.nativeElement.click();
      expect(spy).toHaveBeenCalled();
    });

    it('debe deshabilitar botón cuando isLoading es true', () => {
      component.isLoading = true;
      fixture.detectChanges();
      const btn = debugElement.query(By.css('.cart-summary__btn-checkout'));
      expect(btn.nativeElement.disabled).toBe(true);
    });

    it('debe mostrar "Procesando..." cuando isLoading es true', () => {
      component.isLoading = true;
      fixture.detectChanges();
      const btn = debugElement.query(By.css('.cart-summary__btn-checkout'));
      expect(btn.nativeElement.textContent).toContain('Procesando...');
    });

    it('debe estar habilitado cuando isLoading es false', () => {
      component.isLoading = false;
      fixture.detectChanges();
      const btn = debugElement.query(By.css('.cart-summary__btn-checkout'));
      expect(btn.nativeElement.disabled).toBe(false);
    });
  });

  describe('Formato de Moneda', () => {
    it('debe formatear montos grandes correctamente', () => {
      component.totalAmount = 1234.56;
      fixture.detectChanges();
      const values = debugElement.queryAll(By.css('.cart-summary__value'));
      expect(values[1].nativeElement.textContent).toContain('1,234.56');
    });

    it('debe mostrar dos decimales', () => {
      component.totalAmount = 10;
      fixture.detectChanges();
      const values = debugElement.queryAll(By.css('.cart-summary__value'));
      expect(values[1].nativeElement.textContent).toContain('10.00');
    });
  });

  describe('Nota Informativa', () => {
    it('debe mostrar nota sobre descuentos', () => {
      fixture.detectChanges();
      const note = debugElement.query(By.css('.cart-summary__note'));
      expect(note.nativeElement.textContent).toContain('descuentos');
    });
  });
});
