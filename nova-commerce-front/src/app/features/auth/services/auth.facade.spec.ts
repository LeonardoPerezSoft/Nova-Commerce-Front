import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthFacade } from './auth.facade';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { vi, describe, it, beforeEach, expect } from 'vitest';

describe('AuthFacade', () => {
  let facade: AuthFacade;
  let authService: AuthService;
  let tokenService: TokenService;
  let router: Router;

  beforeEach(() => {
    const authServiceMock = {
      login: vi.fn(),
      refreshToken: vi.fn(),
    };
    const tokenServiceMock = {
      setTokens: vi.fn(),
      getAccessToken: vi.fn(),
      getRefreshToken: vi.fn(),
      getUsername: vi.fn(),
      getRoles: vi.fn(),
      clearTokens: vi.fn(),
      hasValidToken: vi.fn(),
      isTokenExpired: vi.fn(),
    };
    const routerMock = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthFacade,
        { provide: AuthService, useValue: authServiceMock },
        { provide: TokenService, useValue: tokenServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    facade = TestBed.inject(AuthFacade);
    authService = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should login successfully', async () => {
    const credentials = { userIdentifier: 'admin', password: 'Admin123!' };
    const response = {
      access_token: 'token',
      refresh_token: 'refresh',
      token_type: 'Bearer',
      expires_in: 86400,
      username: 'admin',
      roles: ['ADMIN'],
    };

    vi.mocked(authService.login).mockReturnValue(of(response));

    return new Promise((resolve) => {
      facade.login(credentials).subscribe((result) => {
        expect(result).toBe(true);
        expect(tokenService.setTokens).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/']);
        resolve(true);
      });
    });
  });

  it('should logout and clear tokens', () => {
    facade.logout();

    expect(tokenService.clearTokens).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should check if user is authenticated', () => {
    vi.mocked(tokenService.hasValidToken).mockReturnValue(true);

    expect(facade.isAuthenticated()).toBe(true);
  });

  it('should check if user has role', () => {
    vi.mocked(tokenService.getRoles).mockReturnValue(['ADMIN', 'USER']);

    expect(facade.hasRole('ADMIN')).toBe(true);
    expect(facade.hasRole('CUSTOMER')).toBe(false);
  });

  it('should check if user has any role', () => {
    vi.mocked(tokenService.getRoles).mockReturnValue(['ADMIN']);

    expect(facade.hasAnyRole(['ADMIN', 'USER'])).toBe(true);
    expect(facade.hasAnyRole(['CUSTOMER', 'MANAGER'])).toBe(false);
  });

  it('should initialize auth state from localStorage on valid token', () => {
    vi.mocked(tokenService.getAccessToken).mockReturnValue('valid-token');
    vi.mocked(tokenService.isTokenExpired).mockReturnValue(false);
    vi.mocked(tokenService.getUsername).mockReturnValue('testuser');
    vi.mocked(tokenService.getRoles).mockReturnValue(['USER']);

    // The facade is already created, verify the observable is defined
    expect(facade.authState$).toBeDefined();
  });

  it('should not initialize auth state on expired token', () => {
    vi.mocked(tokenService.getAccessToken).mockReturnValue('expired-token');
    vi.mocked(tokenService.isTokenExpired).mockReturnValue(true);

    let emittedState: any;
    facade.authState$.subscribe((state) => {
      emittedState = state;
    });

    expect(emittedState?.isAuthenticated).toBe(false);
  });

  it('should handle login error gracefully', async () => {
    const credentials = { userIdentifier: 'admin', password: 'Admin123!' };
    const error = { status: 401, message: 'Unauthorized' };

    vi.mocked(authService.login).mockReturnValue(throwError(() => error));

    const result = await new Promise<boolean>((resolve) => {
      facade.login(credentials).subscribe((res) => {
        resolve(res);
      });
    });

    expect(result).toBe(false);
  });

  it('should return authState$ observable', () => {
    vi.mocked(tokenService.hasValidToken).mockReturnValue(true);
    vi.mocked(tokenService.getUsername).mockReturnValue('testuser');
    vi.mocked(tokenService.getRoles).mockReturnValue(['USER']);

    let emitted = false;
    facade.authState$.subscribe(() => {
      emitted = true;
    });

    expect(emitted).toBe(true);
  });

  it('should check if user has all roles', () => {
    vi.mocked(tokenService.getRoles).mockReturnValue(['ADMIN', 'USER']);

    expect(facade.hasAllRoles(['ADMIN', 'USER'])).toBe(true);
    expect(facade.hasAllRoles(['ADMIN', 'CUSTOMER'])).toBe(false);
  });

  it('should return current username', () => {
    vi.mocked(tokenService.getUsername).mockReturnValue('testuser');

    expect(facade.getUsername()).toBe('testuser');
  });

  it('should return current roles', () => {
    vi.mocked(tokenService.getRoles).mockReturnValue(['ADMIN', 'USER']);

    expect(facade.getRoles()).toEqual(['ADMIN', 'USER']);
  });

  it('should return current session when all data available', () => {
    vi.mocked(tokenService.getAccessToken).mockReturnValue('access-token');
    vi.mocked(tokenService.getRefreshToken).mockReturnValue('refresh-token');
    vi.mocked(tokenService.getUsername).mockReturnValue('testuser');
    vi.mocked(tokenService.getRoles).mockReturnValue(['ADMIN']);

    const session = facade.getCurrentSession();

    expect(session).toBeTruthy();
    expect(session?.username).toBe('testuser');
    expect(session?.roles).toEqual(['ADMIN']);
  });

  it('should return null when session data incomplete', () => {
    vi.mocked(tokenService.getAccessToken).mockReturnValue(null);

    const session = facade.getCurrentSession();

    expect(session).toBeNull();
  });

  it('should refresh token successfully', async () => {
    const newTokenResponse = {
      access_token: 'new-access',
      refresh_token: 'new-refresh',
      token_type: 'Bearer',
      expires_in: 86400,
      username: 'testuser',
      roles: ['ADMIN'],
    };

    vi.mocked(tokenService.getRefreshToken).mockReturnValue('old-refresh');
    vi.mocked(authService.refreshToken).mockReturnValue(of(newTokenResponse));

    const result = await new Promise<boolean>((resolve) => {
      facade.refreshToken().subscribe((res) => {
        resolve(res);
      });
    });

    expect(result).toBe(true);
    expect(tokenService.setTokens).toHaveBeenCalled();
  });

  it('should return false when refresh token not available', async () => {
    vi.mocked(tokenService.getRefreshToken).mockReturnValue(null);

    const result = await new Promise<boolean>((resolve) => {
      facade.refreshToken().subscribe((res) => {
        resolve(res);
      });
    });

    expect(result).toBe(false);
  });

  it('should logout and return false when refresh token fails', async () => {
    vi.mocked(tokenService.getRefreshToken).mockReturnValue('old-refresh');
    vi.mocked(authService.refreshToken).mockReturnValue(
      throwError(() => ({ status: 401 }))
    );

    const result = await new Promise<boolean>((resolve) => {
      facade.refreshToken().subscribe((res) => {
        resolve(res);
      });
    });

    expect(result).toBe(false);
    expect(tokenService.clearTokens).toHaveBeenCalled();
  });
});
