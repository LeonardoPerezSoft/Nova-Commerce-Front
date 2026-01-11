import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthFacade } from './auth.facade';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

describe('AuthFacade', () => {
  let facade: AuthFacade;
  let authService: jasmine.SpyObj<AuthService>;
  let tokenService: jasmine.SpyObj<TokenService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'refreshToken']);
    const tokenServiceSpy = jasmine.createSpyObj('TokenService', [
      'setTokens',
      'getAccessToken',
      'getRefreshToken',
      'getUsername',
      'getRoles',
      'clearTokens',
      'hasValidToken',
      'isTokenExpired',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthFacade,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: TokenService, useValue: tokenServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    facade = TestBed.inject(AuthFacade);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should login successfully', (done) => {
    const credentials = { userIdentifier: 'admin', password: 'Admin123!' };
    const response = {
      access_token: 'token',
      refresh_token: 'refresh',
      token_type: 'Bearer',
      expires_in: 86400,
      username: 'admin',
      roles: ['ADMIN'],
    };

    authService.login.and.returnValue(of(response));

    facade.login(credentials).subscribe((result) => {
      expect(result).toBe(true);
      expect(tokenService.setTokens).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      done();
    });
  });

  it('should logout and clear tokens', () => {
    facade.logout();

    expect(tokenService.clearTokens).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should check if user is authenticated', () => {
    tokenService.hasValidToken.and.returnValue(true);

    expect(facade.isAuthenticated()).toBe(true);
  });

  it('should check if user has role', () => {
    tokenService.getRoles.and.returnValue(['ADMIN', 'USER']);

    expect(facade.hasRole('ADMIN')).toBe(true);
    expect(facade.hasRole('CUSTOMER')).toBe(false);
  });

  it('should check if user has any role', () => {
    tokenService.getRoles.and.returnValue(['ADMIN']);

    expect(facade.hasAnyRole(['ADMIN', 'USER'])).toBe(true);
    expect(facade.hasAnyRole(['CUSTOMER', 'MANAGER'])).toBe(false);
  });
});
