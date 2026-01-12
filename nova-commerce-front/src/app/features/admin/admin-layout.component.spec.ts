import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminLayoutComponent } from './admin-layout.component';
import { provideRouter } from '@angular/router';
import { AuthFacade } from '../auth/services/auth.facade';
import { BehaviorSubject } from 'rxjs';

describe('AdminLayoutComponent', () => {
  let fixture: ComponentFixture<AdminLayoutComponent>;
  let component: AdminLayoutComponent;

  beforeEach(async () => {
    const authStateSubject = new BehaviorSubject({
      currentUser: {
        id: 1,
        username: 'admin',
        email: 'admin@test.com',
        role: 'ADMIN'
      },
      isLoggedIn: true,
      loading: false
    });

    await TestBed.configureTestingModule({
      imports: [AdminLayoutComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthFacade,
          useValue: {
            state$: authStateSubject.asObservable(),
            currentUser$: authStateSubject.asObservable(),
            hasAnyRole: vi.fn().mockReturnValue(true)
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
