import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin.component';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display placeholder title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('h1');
    expect(title?.textContent).toBe('Administración');
  });

  it('should display placeholder message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const message = compiled.querySelector('p');
    expect(message?.textContent).toContain('Sección de administración');
    expect(message?.textContent).toContain('ETAPA 3');
  });

  it('should have placeholder container', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const placeholder = compiled.querySelector('.nc-placeholder');
    expect(placeholder).toBeTruthy();
  });

  it('should be a standalone component', () => {
    expect(component).toBeTruthy();
  });
});
