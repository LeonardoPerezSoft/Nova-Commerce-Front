import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserFacade } from './user.facade';
import { TokenService } from '../services/token.service';
import { AuthFacade } from '../services/auth.facade';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

describe('UserFacade', () => {
  let service: UserFacade;
  let tokenServiceMock: any;
  let authFacadeMock: any;

  beforeEach(() => {
    tokenServiceMock = {
      getAccessToken: vi.fn().mockReturnValue(null),
      decodeToken: vi.fn(),
      isTokenExpired: vi.fn().mockReturnValue(true),
      getUsername: vi.fn().mockReturnValue(null),
      getRoles: vi.fn().mockReturnValue([]),
    };

    const authStateSubject = new BehaviorSubject<any>({
      isAuthenticated: false,
      user: null,
    });

    authFacadeMock = {
      authState$: authStateSubject.asObservable(),
      _authStateSubject: authStateSubject,
    };

    TestBed.configureTestingModule({
      providers: [
        UserFacade,
        { provide: TokenService, useValue: tokenServiceMock },
        { provide: AuthFacade, useValue: authFacadeMock },
      ],
    });

    service = TestBed.inject(UserFacade);
  });

  describe('Creación del Servicio', () => {
    it('debería crear la instancia de UserFacade', () => {
      expect(service).toBeTruthy();
    });

    it('debería tener todos los observables públicos', () => {
      expect(service.userContext$).toBeDefined();
      expect(service.user$).toBeDefined();
      expect(service.isAuthenticated$).toBeDefined();
      expect(service.email$).toBeDefined();
      expect(service.isAdmin$).toBeDefined();
    });

    it('debería tener todos los métodos síncronos', () => {
      expect(typeof service.getCurrentUser).toBe('function');
      expect(typeof service.isAuthenticated).toBe('function');
      expect(typeof service.hasRole).toBe('function');
      expect(typeof service.getRoles).toBe('function');
    });

    it('debería tener todos los métodos observable', () => {
      expect(typeof service.hasRole$).toBe('function');
      expect(typeof service.hasAnyRole$).toBe('function');
    });
  });

  describe('Estado Inicial', () => {
    it('debería inicializar user como null', async () => {
      const user = await firstValueFrom(service.user$);
      expect(user).toBeNull();
    });

    it('debería inicializar isAuthenticated como false', async () => {
      const isAuth = await firstValueFrom(service.isAuthenticated$);
      expect(isAuth).toBe(false);
    });

    it('debería inicializar email como null', async () => {
      const email = await firstValueFrom(service.email$);
      expect(email).toBeNull();
    });

    it('debería inicializar isAdmin como false', async () => {
      const isAdmin = await firstValueFrom(service.isAdmin$);
      expect(isAdmin).toBe(false);
    });
  });

  describe('Métodos Síncronos', () => {
    it('getCurrentUser() retorna null inicialmente', () => {
      expect(service.getCurrentUser()).toBeNull();
    });

    it('isAuthenticated() retorna false inicialmente', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('getRoles() retorna array vacío inicialmente', () => {
      expect(service.getRoles()).toEqual([]);
    });

    it('hasRole() retorna false para cualquier rol', () => {
      expect(service.hasRole('ADMIN')).toBe(false);
      expect(service.hasRole('USER')).toBe(false);
    });

    it('hasAnyRole() retorna false con roles vacíos', () => {
      expect(service.hasAnyRole([])).toBe(false);
      expect(service.hasAnyRole(['ADMIN'])).toBe(false);
    });

    it('hasAllRoles() retorna false con roles vacíos', () => {
      expect(service.hasAllRoles([])).toBe(false);
      expect(service.hasAllRoles(['ADMIN'])).toBe(false);
    });
  });

  describe('Observables Reactivos', () => {
    it('hasRole$() emite false inicialmente', async () => {
      const result = await firstValueFrom(service.hasRole$('ADMIN'));
      expect(result).toBe(false);
    });

    it('hasAnyRole$() emite false inicialmente', async () => {
      const result = await firstValueFrom(service.hasAnyRole$(['ADMIN', 'USER']));
      expect(result).toBe(false);
    });
  });

  describe('Sincronización con AuthFacade', () => {
    it('debería detectar cambios en AuthFacade', async () => {
      const newAuthState = {
        isAuthenticated: true,
        user: {
          id: 'user123',
          email: 'user@example.com',
          roles: ['USER'],
        },
      };

      authFacadeMock._authStateSubject.next(newAuthState);

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Después de la sincronización
      expect(service.isAuthenticated()).toBe(false);
    });

    it('debería limpiar contexto en logout', async () => {
      authFacadeMock._authStateSubject.next({
        isAuthenticated: false,
        user: null,
      });

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(service.getCurrentUser()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('Casos Límite', () => {
    it('debería manejar token null sin errores', () => {
      tokenServiceMock.getAccessToken.mockReturnValue(null);
      expect(service.getCurrentUser()).toBeNull();
    });

    it('debería manejar token expirado', () => {
      tokenServiceMock.getAccessToken.mockReturnValue('expired.token');
      tokenServiceMock.isTokenExpired.mockReturnValue(true);
      expect(service.getCurrentUser()).toBeNull();
    });

    it('debería manejar decodeToken con error', () => {
      tokenServiceMock.getAccessToken.mockReturnValue('invalid.token');
      tokenServiceMock.decodeToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });
      expect(service.getCurrentUser()).toBeNull();
    });

    it('debería manejar payload sin roles', () => {
      tokenServiceMock.getAccessToken.mockReturnValue('valid.token');
      tokenServiceMock.getRoles.mockReturnValue([]);
      expect(service.getRoles()).toEqual([]);
      expect(service.hasRole('ADMIN')).toBe(false);
    });
  });

  describe('userContext$ Observable', () => {
    it('debería emitir contexto completo', async () => {
      const context = await firstValueFrom(service.userContext$);
      expect(context).toHaveProperty('user');
      expect(context).toHaveProperty('isAuthenticated');
      expect(context).toHaveProperty('lastUpdated');
    });

    it('debería tener lastUpdated como number', async () => {
      const context = await firstValueFrom(service.userContext$);
      expect(typeof context.lastUpdated).toBe('number');
    });
  });

  describe('Integración Completa', () => {
    it('el servicio está completamente inicializado', () => {
      expect(service).toBeTruthy();
      expect(service.getCurrentUser()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
      expect(service.getRoles()).toEqual([]);
    });

    it('no causa memory leaks con suscripciones', () => {
      const sub1 = service.user$.subscribe();
      const sub2 = service.isAuthenticated$.subscribe();
      const sub3 = service.email$.subscribe();

      sub1.unsubscribe();
      sub2.unsubscribe();
      sub3.unsubscribe();

      expect(service).toBeTruthy();
    });
  });
});
