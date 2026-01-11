import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './token.interceptor';
import { TokenService } from '../services/token.service';
import { AuthFacade } from '../services/auth.facade';

describe('tokenInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let tokenService: jasmine.SpyObj<TokenService>;
  let authFacade: jasmine.SpyObj<AuthFacade>;

  beforeEach(() => {
    const tokenServiceSpy = jasmine.createSpyObj('TokenService', ['getAccessToken']);
    const authFacadeSpy = jasmine.createSpyObj('AuthFacade', ['logout']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([tokenInterceptor])),
        provideHttpClientTesting(),
        { provide: TokenService, useValue: tokenServiceSpy },
        { provide: AuthFacade, useValue: authFacadeSpy },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    authFacade = TestBed.inject(AuthFacade) as jasmine.SpyObj<AuthFacade>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header when token exists', () => {
    tokenService.getAccessToken.and.returnValue('test-token');

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush({});
  });

  it('should NOT add Authorization header for login endpoint', () => {
    tokenService.getAccessToken.and.returnValue('test-token');

    httpClient.post('/api/auth/login', {}).subscribe();

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should NOT add Authorization header for refresh endpoint', () => {
    tokenService.getAccessToken.and.returnValue('test-token');

    httpClient.post('/api/auth/refresh', {}).subscribe();

    const req = httpMock.expectOne('/api/auth/refresh');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should call logout on 401 error', () => {
    tokenService.getAccessToken.and.returnValue('test-token');

    httpClient.get('/api/test').subscribe({
      error: () => {
        expect(authFacade.logout).toHaveBeenCalled();
      },
    });

    const req = httpMock.expectOne('/api/test');
    req.flush({}, { status: 401, statusText: 'Unauthorized' });
  });
});
