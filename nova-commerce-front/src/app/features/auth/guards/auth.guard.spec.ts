import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthFacade } from '../services/auth.facade';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { vi, describe, it, beforeEach, expect } from 'vitest';

describe('authGuard', () => {
  let authFacade: AuthFacade;
  let router: Router;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    const authFacadeMock = {
      isAuthenticated: vi.fn(),
    };
    const routerMock = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthFacade, useValue: authFacadeMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    authFacade = TestBed.inject(AuthFacade);
    router = TestBed.inject(Router);

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/admin' } as RouterStateSnapshot;
  });

  it('should allow access when user is authenticated', () => {
    vi.mocked(authFacade.isAuthenticated).mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login when user is NOT authenticated', () => {
    vi.mocked(authFacade.isAuthenticated).mockReturnValue(false);

    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], {
      queryParams: { returnUrl: '/admin' },
    });
  });
});
