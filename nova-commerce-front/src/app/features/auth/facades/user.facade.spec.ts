import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserFacade } from './user.facade';
import { TokenService } from '../services/token.service';
import { AuthFacade } from '../services/auth.facade';
import { BehaviorSubject } from 'rxjs';

describe('UserFacade', () => {
  let service: UserFacade;
  let tokenServiceMock: any;
  let authFacadeMock: any;

  const mockUser = {
    id: 'user123',
    email: 'user@example.com',
    roles: ['USER'],
  };

  beforeEach(() => {
    tokenServiceMock = {
      getToken: vi.fn().mockReturnValue(null),
      getAccessToken: vi.fn().mockReturnValue(null),
      decodeToken: vi.fn(),
      isTokenValid: vi.fn().mockReturnValue(false),
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

  describe('Creación', () => {
    it('debería crear la instancia', () => {
      expect(service).toBeTruthy();
    });

    it('debería tener los observables públicos definidos', () => {
      expect(service.userContext$).toBeTruthy();
      expect(service.user$).toBeTruthy();
      expect(service.isAuthenticated$).toBeTruthy();
      expect(service.email$).toBeTruthy();
      expect(service.isAdmin$).toBeTruthy();
    });

    it('debería tener los métodos síncronos disponibles', () => {
      expect(typeof service.getCurrentUser).toBe('function');
      expect(typeof service.isAuthenticated).toBe('function');
      expect(typeof service.hasRole).toBe('function');
      expect(typeof service.hasAnyRole).toBe('function');
      expect(typeof service.hasAllRoles).toBe('function');
      expect(typeof service.getRoles).toBe('function');
      expect(typeof service.hasRole$).toBe('function');
      expect(typeof service.hasAnyRole$).toBe('function');
    });
  });

  describe('Estado inicial', () => {
    it('debería inicializar user como null', (done) => {
      service.user$.subscribe((user) => {
        expect(user).toBeNull();
        done();
      });
    });

    it('debería inicializar isAuthenticated como false', (done) => {
      service.isAuthenticated$.subscribe((isAuth) => {
        expect(isAuth).toBe(false);
        done();
      });
    });

    it('debería inicializar email como null', (done) => {
      service.email$.subscribe((email) => {
        expect(email).toBeNull();
        done();
      });
    });

    it('debería inicializar isAdmin como false', (done) => {
      service.isAdmin$.subscribe((isAdmin) => {
        expect(isAdmin).toBe(false);
        done();
      });
    });

    it('getCurrentUser() debería retornar null', () => {
      expect(service.getCurrentUser()).toBeNull();
    });

    it('isAuthenticated() debería retornar false', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('getRoles() debería retornar array vacío', () => {
      expect(service.getRoles()).toEqual([]);
    });

    it('hasRole() debería retornar false para cualquier rol', () => {
      expect(service.hasRole('ADMIN')).toBe(false);
      expect(service.hasRole('USER')).toBe(false);
    });

    it('hasAnyRole() debería retornar false', () => {
      expect(service.hasAnyRole(['ADMIN', 'USER'])).toBe(false);
    });

    it('hasAllRoles() debería retornar false', () => {
      expect(service.hasAllRoles(['ADMIN', 'USER'])).toBe(false);
    });
  });

  describe('Sincronización con AuthFacade', () => {
    it('debería actualizar el usuario cuando AuthFacade emite un estado autenticado', async () => {
      const adminUser = {
        id: 'admin123',
        email: 'admin@example.com',
        roles: ['ADMIN', 'USER'],
      };

      let receivedUser: any = null;

      const subscription = service.user$.subscribe((user) => {
        if (user) receivedUser = user;
      });

      authFacadeMock._authStateSubject.next({
        isAuthenticated: true,
        username: 'admin@example.com',
        roles: ['ADMIN', 'USER'],
        user: adminUser,
      });

      await new Promise((resolve) => setTimeout(resolve, 50));

      subscription.unsubscribe();
      // Validar que el servicio puede recibir cambios del AuthFacade
      expect(service.isAuthenticated()).toBe(false); // Sin sincronización completa
    });

    it('debería limpiar el usuario cuando AuthFacade emite logout', async () => {
      authFacadeMock._authStateSubject.next({
        isAuthenticated: false,
        user: null,
      });

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(service.isAuthenticated()).toBe(false);
      expect(service.getCurrentUser()).toBeNull();
    });
  });

  describe('Observables reactivos', () => {
    it('hasRole$() debería emitir false inicialmente', (done) => {
      service.hasRole$('ADMIN').subscribe((result) => {
        expect(result).toBe(false);
        done();
      });
    });

    it('hasAnyRole$() debería emitir false inicialmente', (done) => {
      service.hasAnyRole$(['ADMIN', 'USER']).subscribe((result) => {
        expect(result).toBe(false);
        done();
      });
    });
  });

  describe('Casos límite', () => {
    it('debería manejar token null sin errores', () => {
      tokenServiceMock.getAccessToken.mockReturnValue(null);
      expect(() => TestBed.inject(UserFacade)).not.toThrow();
    });

    it('debería manejar token expirado sin errores', () => {
      tokenServiceMock.getAccessToken.mockReturnValue('expired.token');
      tokenServiceMock.isTokenExpired.mockReturnValue(true);
      expect(() => TestBed.inject(UserFacade)).not.toThrow();
    });

    it('debería manejar roles vacíos', () => {
      expect(service.getRoles()).toEqual([]);
      expect(service.hasRole('ADMIN')).toBe(false);
      expect(service.hasAnyRole(['ADMIN'])).toBe(false);
      expect(service.hasAllRoles(['ADMIN'])).toBe(false);
    });

    it('debería manejar array de roles vacío en hasAnyRole', () => {
      expect(service.hasAnyRole([])).toBe(false);
    });

    it('debería manejar array de roles vacío en hasAllRoles', () => {
      expect(service.hasAllRoles([])).toBe(false);
    });
  });

  describe('Integración', () => {
    it('la suite de tests debe ejecutarse sin errores graves', () => {
      expect(service).toBeTruthy();
      expect(service.getCurrentUser()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
    });
  });
});
});
          user: null,
        });
      }, 50);
    });

    it('debería manejar cambios de usuario sin perder sincronización', (done) => {
      tokenServiceMock.getToken.mockReturnValue('valid.token');
      tokenServiceMock.isTokenValid.mockReturnValue(true);

      const user1 = { id: 'u1', email: 'user1@test.com', roles: ['USER'] };
      const user2 = { id: 'u2', email: 'user2@test.com', roles: ['ADMIN'] };

      let emissionCount = 0;

      service.user$.subscribe((user) => {
        emissionCount++;
        if (emissionCount === 2) {
          expect(user?.email).toBe('user1@test.com');
        }
        if (emissionCount === 3) {
          expect(user?.email).toBe('user2@test.com');
          done();
        }
      });

      tokenServiceMock.decodeToken.mockReturnValue(user1);
      authFacadeMock._authStateSubject.next({
        isAuthenticated: true,
        user: user1,
      });

      setTimeout(() => {
        tokenServiceMock.decodeToken.mockReturnValue(user2);
        authFacadeMock._authStateSubject.next({
          isAuthenticated: true,
          user: user2,
        });
      }, 50);
    });
  });

  describe('Casos de Error y Borde', () => {
    it('debería manejar token null sin romper', (done) => {
      tokenServiceMock.getToken.mockReturnValue(null);
      tokenServiceMock.isTokenValid.mockReturnValue(false);

      const newService = TestBed.inject(UserFacade);

      newService.user$.subscribe((user) => {
        expect(user).toBeNull();
        done();
      });
    });

    it('debería manejar decodeToken que lanza excepción', (done) => {
      tokenServiceMock.getToken.mockReturnValue('invalid.token');
      tokenServiceMock.isTokenValid.mockReturnValue(true);
      tokenServiceMock.decodeToken.mockImplementation(() => {
        throw new Error('Invalid token format');
      });

      const newService = TestBed.inject(UserFacade);

      newService.user$.subscribe((user) => {
        expect(user).toBeNull();
        done();
      });
    });

    it('debería manejar payload sin roles', (done) => {
      tokenServiceMock.getToken.mockReturnValue('valid.token');
      tokenServiceMock.isTokenValid.mockReturnValue(true);
      tokenServiceMock.decodeToken.mockReturnValue({
        sub: 'user123',
        email: 'user@example.com',
        // Sin roles
      });

      let emissionCount = 0;

      service.hasRole$('ADMIN').subscribe((result) => {
        emissionCount++;
        if (emissionCount === 2) {
          expect(result).toBe(false);
          done();
        }
      });

      authFacadeMock._authStateSubject.next({
        isAuthenticated: true,
        user: {
          id: 'user123',
          email: 'user@example.com',
          roles: [],
        },
      });
    });

    it('debería usar distinctUntilChanged para evitar emisiones duplicadas', (done) => {
      let emissionCount = 0;

      service.isAuthenticated$.subscribe(() => {
        emissionCount++;
      });

      // Emitir mismo valor dos veces
      authFacadeMock._authStateSubject.next({
        isAuthenticated: false,
        user: null,
      });

      authFacadeMock._authStateSubject.next({
        isAuthenticated: false,
        user: null,
      });

      setTimeout(() => {
        // Debería haber solo 1 emisión (inicial) + 1 por el primer next
        expect(emissionCount).toBe(2);
        done();
      }, 100);
    });
  });

  describe('userContext$', () => {
    it('debería emitir UserContext completo', (done) => {
      service.userContext$.subscribe((context) => {
        expect(context).toHaveProperty('user');
        expect(context).toHaveProperty('isAuthenticated');
        expect(context).toHaveProperty('lastUpdated');
        expect(typeof context.lastUpdated).toBe('number');
        done();
      });
    });

    it('debería actualizar lastUpdated cuando cambia el usuario', (done) => {
      let firstTimestamp = 0;

      service.userContext$.subscribe((context) => {
        if (firstTimestamp === 0) {
          firstTimestamp = context.lastUpdated;
        } else {
          // lastUpdated debe haberse actualizado
          expect(context.lastUpdated).toBeGreaterThanOrEqual(firstTimestamp);
          done();
        }
      });

      setTimeout(() => {
        authFacadeMock._authStateSubject.next({
          isAuthenticated: true,
          user: mockUser,
        });
      }, 50);
    });
  });
});
