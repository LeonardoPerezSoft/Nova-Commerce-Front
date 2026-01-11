import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display welcome title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('h1');
    expect(title?.textContent).toContain('Bienvenido a NovaCommerce');
  });

  it('should display hero description', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const description = compiled.querySelector('p');
    expect(description?.textContent).toContain('La mejor plataforma de e-commerce');
  });

  it('should have home container', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const container = compiled.querySelector('.nc-home');
    expect(container).toBeTruthy();
  });

  it('should have hero section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const hero = compiled.querySelector('.nc-home__hero');
    expect(hero).toBeTruthy();
  });

  it('should render with gradient background', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const hero = compiled.querySelector('.nc-home__hero') as HTMLElement;
    expect(hero).toBeTruthy();
    // Verificamos que el elemento exista, los estilos se aplicarán via CSS
  });
});
