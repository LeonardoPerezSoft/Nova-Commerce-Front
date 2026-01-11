import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthFacade } from '../services/auth.facade';
import { vi, describe, it, beforeEach, expect } from 'vitest';

describe('roleGuard', () => {
  let authFacade: AuthFacade;
  let router: Router;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    const authFacadeMock = {
      hasAnyRole: vi.fn(),
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

    mockRoute = { data: {} } as ActivatedRouteSnapshot;
    mockState = { url: '/admin' } as RouterStateSnapshot;
  });

  it('should allow access when user has required role', () => {
    mockRoute.data = { roles: ['ADMIN'] };
    vi.mocked(authFacade.hasAnyRole).mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() => roleGuard(mockRoute, mockState));

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should deny access when user does NOT have required role', () => {
    mockRoute.data = { roles: ['ADMIN'] };
    vi.mocked(authFacade.hasAnyRole).mockReturnValue(false);

    const result = TestBed.runInInjectionContext(() => roleGuard(mockRoute, mockState));

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should allow access when no roles are specified', () => {
    mockRoute.data = {};

    const result = TestBed.runInInjectionContext(() => roleGuard(mockRoute, mockState));

    expect(result).toBe(true);
  });

  it('should check for ANY role when multiple roles are specified', () => {
    mockRoute.data = { roles: ['ADMIN', 'MANAGER'] };
    vi.mocked(authFacade.hasAnyRole).mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() => roleGuard(mockRoute, mockState));

    expect(result).toBe(true);
    expect(authFacade.hasAnyRole).toHaveBeenCalledWith(['ADMIN', 'MANAGER']);
  });
});
