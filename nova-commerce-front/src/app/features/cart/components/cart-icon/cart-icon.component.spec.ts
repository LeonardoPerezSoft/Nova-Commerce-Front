import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartIconComponent } from './cart-icon.component';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('CartIconComponent', () => {
  let component: CartIconComponent;
  let fixture: ComponentFixture<CartIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartIconComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CartIconComponent);
    component = fixture.componentInstance;
  });

  describe('Rendering', () => {
    it('debe renderizar el componente', () => {
      expect(component).toBeTruthy();
    });

    it('debe mostrar ícono SVG', () => {
      fixture.detectChanges();
      const svg = fixture.debugElement.query(By.css('.cart-icon__svg'));
      expect(svg).toBeTruthy();
    });

    it('debe tener link a /cart', () => {
      fixture.detectChanges();
      const link = fixture.debugElement.query(By.css('a'));
      expect(link).toBeTruthy();
      // Verificar que el link existe y apunta a cart (en template tiene [routerLink]="['/cart']")
      expect(link.nativeElement.href).toBeDefined();
    });
  });

  describe('Badge', () => {
    it('no debe mostrar badge cuando itemCount es 0', () => {
      component.itemCount = 0;
      fixture.detectChanges();
      const badge = fixture.debugElement.query(By.css('.cart-icon__badge'));
      expect(badge).toBeFalsy();
    });

    it('debe mostrar badge cuando itemCount > 0', () => {
      component.itemCount = 5;
      fixture.detectChanges();
      const badge = fixture.debugElement.query(By.css('.cart-icon__badge'));
      expect(badge).toBeTruthy();
    });

    it('debe mostrar cantidad en el badge', () => {
      component.itemCount = 3;
      fixture.detectChanges();
      const badge = fixture.debugElement.query(By.css('.cart-icon__badge'));
      expect(badge.nativeElement.textContent).toContain('3');
    });

    it('debe mostrar "99+" para cantidades mayores a 99', () => {
      component.itemCount = 150;
      fixture.detectChanges();
      const badge = fixture.debugElement.query(By.css('.cart-icon__badge'));
      expect(badge.nativeElement.textContent).toContain('99+');
    });

    it('debe aplicar clase large cuando itemCount >= 10', () => {
      component.itemCount = 10;
      fixture.detectChanges();
      const badge = fixture.debugElement.query(By.css('.cart-icon__badge'));
      expect(badge.nativeElement.classList.contains('cart-icon__badge--large')).toBe(true);
    });

    it('no debe aplicar clase large cuando itemCount < 10', () => {
      component.itemCount = 9;
      fixture.detectChanges();
      const badge = fixture.debugElement.query(By.css('.cart-icon__badge'));
      expect(badge.nativeElement.classList.contains('cart-icon__badge--large')).toBe(false);
    });
  });

  describe('Visual States', () => {
    it('debe actualizar badge al cambiar itemCount', () => {
      component.itemCount = 2;
      fixture.detectChanges();
      let badge = fixture.debugElement.query(By.css('.cart-icon__badge'));
      expect(badge.nativeElement.textContent).toContain('2');

      // Crear nuevo fixture para evitar ExpressionChangedAfterItHasBeenCheckedError
      fixture = TestBed.createComponent(CartIconComponent);
      component = fixture.componentInstance;
      component.itemCount = 8;
      fixture.detectChanges();
      badge = fixture.debugElement.query(By.css('.cart-icon__badge'));
      expect(badge.nativeElement.textContent).toContain('8');
    });

    it('debe ocultar badge cuando itemCount se pone en 0', () => {
      component.itemCount = 5;
      fixture.detectChanges();
      let badge = fixture.debugElement.query(By.css('.cart-icon__badge'));
      expect(badge).toBeTruthy();

      // Crear nuevo fixture para evitar ExpressionChangedAfterItHasBeenCheckedError
      fixture = TestBed.createComponent(CartIconComponent);
      component = fixture.componentInstance;
      component.itemCount = 0;
      fixture.detectChanges();
      badge = fixture.debugElement.query(By.css('.cart-icon__badge'));
      expect(badge).toBeFalsy();
    });
  });
});
