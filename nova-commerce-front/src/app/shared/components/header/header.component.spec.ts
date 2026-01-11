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

  it('should display the brand name "NovaCommerce"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const brandElement = compiled.querySelector('.nc-header__brand');
    expect(brandElement?.textContent).toBe('NovaCommerce');
  });

  it('should render navigation links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const navLinks = compiled.querySelectorAll('.nc-header__nav-link');
    expect(navLinks.length).toBe(3);
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

  it('should have Admin link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const navLinks = Array.from(compiled.querySelectorAll('.nc-header__nav-link'));
    const adminLink = navLinks.find(link => link.textContent?.trim() === 'Admin');
    expect(adminLink).toBeTruthy();
  });

  it('should render login button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const loginButton = compiled.querySelector('.nc-header__login-btn');
    expect(loginButton).toBeTruthy();
    expect(loginButton?.textContent?.trim()).toBe('Login');
  });

  it('should have sticky header class', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('.nc-header');
    expect(header).toBeTruthy();
  });
});
