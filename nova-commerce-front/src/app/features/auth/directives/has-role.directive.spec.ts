import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HasRoleDirective } from './has-role.directive';
import { AuthFacade } from '../services/auth.facade';
import { BehaviorSubject } from 'rxjs';
import { vi, describe, it, beforeEach, expect } from 'vitest';

@Component({
  template: `
    <div *hasRole="'ADMIN'" id="admin-only">Admin Content</div>
    <div *hasRole="['ADMIN', 'USER']" id="multiple-roles">Multi Role Content</div>
  `,
  standalone: true,
  imports: [HasRoleDirective],
})
class TestComponent {}

describe('HasRoleDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let authFacade: AuthFacade;
  let authStateSubject: BehaviorSubject<any>;

  beforeEach(() => {
    authStateSubject = new BehaviorSubject({
      isAuthenticated: false,
      username: null,
      roles: [],
    });

    const authFacadeMock = {
      hasAnyRole: vi.fn(),
      authState$: authStateSubject.asObservable(),
    };

    TestBed.configureTestingModule({
      imports: [TestComponent, HasRoleDirective],
      providers: [{ provide: AuthFacade, useValue: authFacadeMock }],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    authFacade = TestBed.inject(AuthFacade);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show element when user has required role', () => {
    vi.mocked(authFacade.hasAnyRole).mockReturnValue(true);
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('#admin-only');
    expect(element).toBeTruthy();
    expect(element.textContent).toContain('Admin Content');
  });

  it('should hide element when user does NOT have required role', () => {
    vi.mocked(authFacade.hasAnyRole).mockReturnValue(false);
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('#admin-only');
    expect(element).toBeNull();
  });

  it('should work with multiple roles', () => {
    vi.mocked(authFacade.hasAnyRole).mockReturnValue(true);
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('#multiple-roles');
    expect(element).toBeTruthy();
  });

  it('should update view when auth state changes', () => {
    vi.mocked(authFacade.hasAnyRole).mockReturnValue(false);
    fixture.detectChanges();

    let element = fixture.nativeElement.querySelector('#admin-only');
    expect(element).toBeNull();

    // Cambiar estado
    vi.mocked(authFacade.hasAnyRole).mockReturnValue(true);
    authStateSubject.next({ isAuthenticated: true, username: 'admin', roles: ['ADMIN'] });
    fixture.detectChanges();

    element = fixture.nativeElement.querySelector('#admin-only');
    expect(element).toBeTruthy();
  });
});
