import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthFacade } from '../services/auth.facade';

describe('roleGuard', () => {
  let authFacade: jasmine.SpyObj<AuthFacade>;
  let router: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    const authFacadeSpy = jasmine.createSpyObj('AuthFacade', ['hasAnyRole']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthFacade, useValue: authFacadeSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    authFacade = TestBed.inject(AuthFacade) as jasmine.SpyObj<AuthFacade>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    mockRoute = { data: {} } as ActivatedRouteSnapshot;
    mockState = { url: '/admin' } as RouterStateSnapshot;
  });

  it('should allow access when user has required role', () => {
    mockRoute.data = { roles: ['ADMIN'] };
    authFacade.hasAnyRole.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => roleGuard(mockRoute, mockState));

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should deny access when user does NOT have required role', () => {
    mockRoute.data = { roles: ['ADMIN'] };
    authFacade.hasAnyRole.and.returnValue(false);

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
    authFacade.hasAnyRole.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => roleGuard(mockRoute, mockState));

    expect(result).toBe(true);
    expect(authFacade.hasAnyRole).toHaveBeenCalledWith(['ADMIN', 'MANAGER']);
  });
});
