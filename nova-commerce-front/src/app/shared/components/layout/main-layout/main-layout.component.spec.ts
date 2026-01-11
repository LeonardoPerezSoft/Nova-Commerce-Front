import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MainLayoutComponent,
        HeaderComponent,
        FooterComponent,
        RouterModule.forRoot([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('nc-header');
    expect(header).toBeTruthy();
  });

  it('should render footer component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const footer = compiled.querySelector('nc-footer');
    expect(footer).toBeTruthy();
  });

  it('should render router-outlet in main section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const main = compiled.querySelector('.nc-layout__main');
    expect(main).toBeTruthy();
    const routerOutlet = main?.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });

  it('should have layout container with correct class', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const layout = compiled.querySelector('.nc-layout');
    expect(layout).toBeTruthy();
  });

  it('should have main content area', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const main = compiled.querySelector('.nc-layout__main');
    expect(main).toBeTruthy();
  });

  it('should structure header, main, and footer in correct order', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const layout = compiled.querySelector('.nc-layout');
    const children = Array.from(layout?.children || []);

    expect(children[0].tagName.toLowerCase()).toBe('nc-header');
    expect(children[1].classList.contains('nc-layout__main')).toBe(true);
    expect(children[2].tagName.toLowerCase()).toBe('nc-footer');
  });
});
