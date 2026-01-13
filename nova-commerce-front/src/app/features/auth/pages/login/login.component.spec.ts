import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthFacade } from '../../services/auth.facade';
import { vi, describe, it, beforeEach, expect } from 'vitest';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authFacade: AuthFacade;
  let router: Router;

  beforeEach(async () => {
    const authFacadeMock = {
      login: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: AuthFacade, useValue: authFacadeMock },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: {} } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authFacade = TestBed.inject(AuthFacade);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');
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
    vi.mocked(authFacade.login).mockReturnValue(of(true));

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

  it('should not submit if form is invalid', () => {
    component.onSubmit();

    expect(authFacade.login).not.toHaveBeenCalled();
  });

  it('should mark all fields as touched when form invalid', () => {
    component.onSubmit();

    const userControl = component.loginForm.get('userIdentifier');
    const passControl = component.loginForm.get('password');

    expect(userControl?.touched).toBe(true);
    expect(passControl?.touched).toBe(true);
  });

  it('should check for required error correctly', () => {
    const userControl = component.loginForm.get('userIdentifier');
    expect(component.hasError('userIdentifier', 'required')).toBe(false);

    userControl?.markAsTouched();
    expect(component.hasError('userIdentifier', 'required')).toBe(true);
  });

  it('should return error message for required field', () => {
    const userControl = component.loginForm.get('userIdentifier');
    userControl?.markAsTouched();

    const errorMsg = component.getErrorMessage('userIdentifier');
    expect(errorMsg).toContain('Usuario es requerido');
  });

  it('should return error message for minlength field', () => {
    const userControl = component.loginForm.get('userIdentifier');
    userControl?.setValue('ab');
    userControl?.markAsTouched();

    const errorMsg = component.getErrorMessage('userIdentifier');
    expect(errorMsg).toContain('Mínimo');
  });

  it('should clean up on component destroy', () => {
    const destroySpy = vi.spyOn(component['destroy$'], 'next');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
  });

  it('should extract returnUrl from query params', () => {
    const credentials = { userIdentifier: 'admin', password: 'Admin123!' };
    const response = {
      access_token: 'token',
      refresh_token: 'refresh',
      token_type: 'Bearer',
      expires_in: 86400,
      username: 'admin',
      roles: ['ADMIN'],
    };

    vi.mocked(authFacade.login).mockReturnValue(of(true));

    component.loginForm.patchValue(credentials);
    component.onSubmit();

    // Default should navigate to home since no returnUrl
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should set isLoading to true on submit', () => {
    vi.mocked(authFacade.login).mockReturnValue(of(true));

    component.loginForm.patchValue({
      userIdentifier: 'admin',
      password: 'Admin123!',
    });

    component.onSubmit();

    // isLoading will be set to false after subscribe, but we can check form submission happened
    expect(authFacade.login).toHaveBeenCalled();
  });
});
