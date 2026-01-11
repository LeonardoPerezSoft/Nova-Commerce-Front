import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display copyright text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const copyright = compiled.querySelector('.nc-footer__copyright');
    expect(copyright).toBeTruthy();
    expect(copyright?.textContent).toContain('NovaCommerce');
    expect(copyright?.textContent).toContain('Todos los derechos reservados');
  });

  it('should display current year', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const copyright = compiled.querySelector('.nc-footer__copyright');
    const currentYear = new Date().getFullYear();
    expect(copyright?.textContent).toContain(currentYear.toString());
  });

  it('should have footer container', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const footer = compiled.querySelector('.nc-footer');
    expect(footer).toBeTruthy();
  });

  it('should have footer__container class', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const container = compiled.querySelector('.nc-footer__container');
    expect(container).toBeTruthy();
  });
});
