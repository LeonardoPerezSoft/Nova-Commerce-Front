import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and retrieve tokens', () => {
    const accessToken = 'test-access-token';
    const refreshToken = 'test-refresh-token';
    const username = 'testuser';
    const roles = ['ADMIN', 'USER'];

    service.setTokens(accessToken, refreshToken, username, roles);

    expect(service.getAccessToken()).toBe(accessToken);
    expect(service.getRefreshToken()).toBe(refreshToken);
    expect(service.getUsername()).toBe(username);
    expect(service.getRoles()).toEqual(roles);
  });

  it('should clear all tokens', () => {
    service.setTokens('token1', 'token2', 'user', ['ADMIN']);
    service.clearTokens();

    expect(service.getAccessToken()).toBeNull();
    expect(service.getRefreshToken()).toBeNull();
    expect(service.getUsername()).toBeNull();
    expect(service.getRoles()).toEqual([]);
  });

  it('should return empty array when no roles stored', () => {
    expect(service.getRoles()).toEqual([]);
  });

  it('should decode JWT token correctly', () => {
    // Token de prueba válido (no verificar firma, solo estructura)
    const token =
      'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGhvcml0aWVzIjoiUk9MRV9BRE1JTiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxOTAwMDAwMDAwfQ.test';

    const payload = service.decodeToken(token);

    expect(payload).toBeTruthy();
    expect(payload?.sub).toBe('admin');
    expect(payload?.authorities).toBe('ROLE_ADMIN');
  });

  it('should extract username from token', () => {
    const token =
      'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGhvcml0aWVzIjoiUk9MRV9BRE1JTiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxOTAwMDAwMDAwfQ.test';

    const username = service.extractUsernameFromToken(token);
    expect(username).toBe('admin');
  });

  it('should extract roles from token', () => {
    const token =
      'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGhvcml0aWVzIjoiUk9MRV9BRE1JTixST0xFX1VTRVIiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTkwMDAwMDAwMH0.test';

    const roles = service.extractRolesFromToken(token);
    expect(roles).toContain('ROLE_ADMIN');
    expect(roles).toContain('ROLE_USER');
  });
});
