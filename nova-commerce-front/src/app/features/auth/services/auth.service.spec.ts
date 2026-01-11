import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginCredentials, LoginResponse } from '../models/auth.models';
import { describe, it, beforeEach, afterEach, expect } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send POST request to /api/auth/login', () => {
    const credentials: LoginCredentials = {
      userIdentifier: 'admin',
      password: 'Admin123!',
    };

    const mockResponse: LoginResponse = {
      access_token: 'test-token',
      refresh_token: 'test-refresh',
      token_type: 'Bearer',
      expires_in: 86400,
      username: 'admin',
      roles: ['ADMIN'],
    };

    service.login(credentials).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(mockResponse);
  });

  it('should send POST request to /api/auth/refresh', () => {
    const refreshToken = 'test-refresh-token';
    const mockResponse = {
      access_token: 'new-token',
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: 86400,
      username: 'admin',
      roles: ['ADMIN'],
    };

    service.refreshToken(refreshToken).subscribe((response) => {
      expect(response.access_token).toBe('new-token');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/auth/refresh');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ refreshToken });
    req.flush(mockResponse);
  });

  it('should send GET request to /api/auth/validate', () => {
    const mockResponse = {
      valid: true,
      username: 'admin',
      authorities: 'ROLE_ADMIN',
    };

    service.validateToken().subscribe((response) => {
      expect(response.valid).toBe(true);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/auth/validate');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
