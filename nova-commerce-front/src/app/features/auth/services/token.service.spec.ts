import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';
import { describe, it, beforeEach, afterEach, expect } from 'vitest';

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

  it('should check if token is expired', () => {
    const expiredToken =
      'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGhvcml0aWVzIjoiUk9MRV9BRE1JTiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxfQ.test';

    expect(service.isTokenExpired(expiredToken)).toBe(true);
  });

  it('should return true for hasValidToken when token is valid and present', () => {
    const validToken =
      'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGhvcml0aWVzIjoiUk9MRV9BRE1JTiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxOTAwMDAwMDAwfQ.test';

    service.setTokens(validToken, 'refresh', 'admin', ['ADMIN']);

    expect(service.hasValidToken()).toBe(true);
  });

  it('should return false for hasValidToken when no token present', () => {
    service.clearTokens();

    expect(service.hasValidToken()).toBe(false);
  });

  it('should handle invalid token format in decodeToken', () => {
    const invalidToken = 'invalid.token';

    const payload = service.decodeToken(invalidToken);

    expect(payload).toBeNull();
  });

  it('should handle invalid base64 in decodeToken', () => {
    const invalidToken =
      'eyJhbGciOiJIUzUxMiJ9.!!!invalid!!!.test';

    const payload = service.decodeToken(invalidToken);

    expect(payload).toBeNull();
  });

  it('should return empty array for extractRolesFromToken when token has no authorities', () => {
    const tokenNoAuthorities =
      'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxOTAwMDAwMDAwfQ.test';

    const roles = service.extractRolesFromToken(tokenNoAuthorities);

    expect(roles).toEqual([]);
  });

  it('should return null for extractUsernameFromToken when token invalid', () => {
    const invalidToken = 'invalid.token';

    const username = service.extractUsernameFromToken(invalidToken);

    expect(username).toBeNull();
  });

  it('should filter empty roles when extracting from token', () => {
    const tokenWithEmptyRoles =
      'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGhvcml0aWVzIjoiUk9MRV9BRE1JTiwgLCBST0xFX1VTRVIiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTkwMDAwMDAwMH0.test';

    const roles = service.extractRolesFromToken(tokenWithEmptyRoles);

    // Should not include empty strings
    expect(roles.every((role) => role.trim() !== '')).toBe(true);
  });
});
