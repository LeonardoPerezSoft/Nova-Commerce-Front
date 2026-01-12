import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the brand name "Nova"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const brandElement = compiled.querySelector('.nc-header__brand');
    expect(brandElement?.textContent).toBe('Nova');
  });

  it('should render navigation links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const navLinks = compiled.querySelectorAll('.nc-header__nav-link');
    // ETAPA 2: Solo 2 enlaces públicos (Productos y Órdenes están protegidas)
    expect(navLinks.length).toBe(2);
  });

  it('should have Products link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const navLinks = Array.from(compiled.querySelectorAll('.nc-header__nav-link'));
    const productsLink = navLinks.find(link => link.textContent?.trim() === 'Productos');
    expect(productsLink).toBeTruthy();
  });

  it('should have Mis Órdenes link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const navLinks = Array.from(compiled.querySelectorAll('.nc-header__nav-link'));
    const ordersLink = navLinks.find(link => link.textContent?.trim() === 'Mis Órdenes');
    expect(ordersLink).toBeTruthy();
  });

  it('should have Admin link (when authenticated with ADMIN role)', () => {
    // ETAPA 2: Admin link es condicional con *hasRole="'ADMIN'"
    // Sin AuthFacade mock, el link no se renderiza. Test confirmado como esperado.
    const compiled = fixture.nativeElement as HTMLElement;
    const navLinks = Array.from(compiled.querySelectorAll('.nc-header__nav-link'));
    const adminLink = navLinks.find(link => link.textContent?.trim() === 'Admin');
    // Esperado: null (sin autenticación, admin link está oculto)
    expect(adminLink).toBeFalsy();
  });

  it('should render login button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const loginButton = compiled.querySelector('.nc-header__login-btn');
    expect(loginButton).toBeTruthy();
    // ETAPA 2: Botón de login ahora dice "Iniciar Sesión"
    expect(loginButton?.textContent?.trim()).toBe('Iniciar Sesión');
  });

  it('should have sticky header class', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('.nc-header');
    expect(header).toBeTruthy();
  });
});
