import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header.component';
import { BehaviorSubject, of } from 'rxjs';
import { UserFacade } from '../../../features/auth/facades/user.facade';

// Mock UserFacade simple implementation
const createMockUserFacade = () => {
  const isAuthenticated$ = new BehaviorSubject<boolean>(false);
  const isAdmin$ = new BehaviorSubject<boolean>(false);
  const email$ = new BehaviorSubject<string | null>(null);

  return {
    isAuthenticated$: isAuthenticated$.asObservable(),
    isAdmin$: isAdmin$.asObservable(),
    email$: email$.asObservable(),
    // helpers for tests
    __subjects: { isAuthenticated$, isAdmin$, email$ },
  } as any;
};

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockUserFacade: any;

  beforeEach(async () => {
    mockUserFacade = createMockUserFacade();

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterModule.forRoot([])],
      providers: [{ provide: UserFacade, useValue: mockUserFacade }],
    }).compileComponents();

    // Note: HeaderComponent injects UserFacade by token `UserFacade` via path, but in tests
    // the standalone component gets the injected value by type. The testbed provider above
    // ensures the component receives the mock. Create component instance now.
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
    // Si no está autenticado, Productos y Órdenes no deben mostrarse
    expect(navLinks.length).toBe(0);
  });

  it('should have Products link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    // Simular usuario autenticado
    mockUserFacade.__subjects.isAuthenticated$.next(true);
    fixture.detectChanges();

    const navLinks = Array.from(compiled.querySelectorAll('.nc-header__nav-link'));
    const productsLink = navLinks.find(link => link.textContent?.trim() === 'Productos');
    expect(productsLink).toBeTruthy();
  });

  it('should have Mis Órdenes link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    // Simular usuario autenticado
    mockUserFacade.__subjects.isAuthenticated$.next(true);
    fixture.detectChanges();

    const navLinks = Array.from(compiled.querySelectorAll('.nc-header__nav-link'));
    const ordersLink = navLinks.find(link => link.textContent?.trim() === 'Mis Órdenes');
    expect(ordersLink).toBeTruthy();
  });

  it('should have Admin link (when authenticated with ADMIN role)', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    // Primero comprobar que sin rol admin no aparece
    mockUserFacade.__subjects.isAuthenticated$.next(true);
    mockUserFacade.__subjects.isAdmin$.next(false);
    fixture.detectChanges();
    let navLinks = Array.from(compiled.querySelectorAll('.nc-header__nav-link'));
    let adminLink = navLinks.find(link => link.textContent?.trim() === 'Admin');
    expect(adminLink).toBeFalsy();

    // Ahora simular rol ADMIN
    mockUserFacade.__subjects.isAdmin$.next(true);
    fixture.detectChanges();
    navLinks = Array.from(compiled.querySelectorAll('.nc-header__nav-link'));
    adminLink = navLinks.find(link => link.textContent?.trim() === 'Admin');
    expect(adminLink).toBeTruthy();
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
