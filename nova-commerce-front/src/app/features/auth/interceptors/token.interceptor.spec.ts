import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './token.interceptor';
import { TokenService } from '../services/token.service';
import { AuthFacade } from '../services/auth.facade';
import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest';

describe('tokenInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let tokenService: TokenService;
  let authFacade: AuthFacade;

  beforeEach(() => {
    const tokenServiceMock = {
      getAccessToken: vi.fn(),
    };
    const authFacadeMock = {
      logout: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([tokenInterceptor])),
        provideHttpClientTesting(),
        { provide: TokenService, useValue: tokenServiceMock },
        { provide: AuthFacade, useValue: authFacadeMock },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    tokenService = TestBed.inject(TokenService);
    authFacade = TestBed.inject(AuthFacade);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header when token exists', () => {
    vi.mocked(tokenService.getAccessToken).mockReturnValue('test-token');

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush({});
  });

  it('should NOT add Authorization header for login endpoint', () => {
    vi.mocked(tokenService.getAccessToken).mockReturnValue('test-token');

    httpClient.post('/api/auth/login', {}).subscribe();

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should NOT add Authorization header for refresh endpoint', () => {
    vi.mocked(tokenService.getAccessToken).mockReturnValue('test-token');

    httpClient.post('/api/auth/refresh', {}).subscribe();

    const req = httpMock.expectOne('/api/auth/refresh');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should call logout on 401 error', () => {
    vi.mocked(tokenService.getAccessToken).mockReturnValue('test-token');

    httpClient.get('/api/test').subscribe({
      error: () => {
        expect(authFacade.logout).toHaveBeenCalled();
      },
    });

    const req = httpMock.expectOne('/api/test');
    req.flush({}, { status: 401, statusText: 'Unauthorized' });
  });
});
