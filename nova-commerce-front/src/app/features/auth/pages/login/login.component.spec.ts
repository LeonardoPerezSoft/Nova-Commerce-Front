import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthFacade } from '../../services/auth.facade';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authFacade: jasmine.SpyObj<AuthFacade>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authFacadeSpy = jasmine.createSpyObj('AuthFacade', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthFacade, useValue: authFacadeSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: {} } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authFacade = TestBed.inject(AuthFacade) as jasmine.SpyObj<AuthFacade>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.loginForm.get('userIdentifier')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const userControl = component.loginForm.get('userIdentifier');
    const passControl = component.loginForm.get('password');

    expect(userControl?.hasError('required')).toBe(true);
    expect(passControl?.hasError('required')).toBe(true);
  });

  it('should call authFacade.login on valid submit', () => {
    authFacade.login.and.returnValue(of(true));

    component.loginForm.patchValue({
      userIdentifier: 'admin',
      password: 'Admin123!',
    });

    component.onSubmit();

    expect(authFacade.login).toHaveBeenCalledWith({
      userIdentifier: 'admin',
      password: 'Admin123!',
    });
  });

  it('should show error message on login failure', () => {
    authFacade.login.and.returnValue(
      throwError(() => ({ status: 401, message: 'Unauthorized' }))
    );

    component.loginForm.patchValue({
      userIdentifier: 'wrong',
      password: 'wrong',
    });

    component.onSubmit();

    expect(component.errorMessage).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    component.onSubmit();

    expect(authFacade.login).not.toHaveBeenCalled();
  });
});
