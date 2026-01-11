import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthFacade } from '../../services/auth.facade';

/**
 * LoginComponent
 *
 * Página de inicio de sesión
 *
 * Responsabilidades:
 * - Mostrar formulario de login
 * - Validar credenciales (client-side)
 * - Llamar a AuthFacade.login()
 * - Mostrar errores de autenticación
 * - Redirigir después del login exitoso
 */
@Component({
  selector: 'nc-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authFacade: AuthFacade,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      userIdentifier: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Maneja el submit del formulario
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = {
      userIdentifier: this.loginForm.value.userIdentifier,
      password: this.loginForm.value.password,
    };

    this.authFacade
      .login(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (success) => {
          this.isLoading = false;
          if (success) {
            // Redirigir a la URL original o al home
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            this.router.navigate([returnUrl]);
          } else {
            this.errorMessage = 'Credenciales inválidas. Por favor, intenta de nuevo.';
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en login:', error);

          if (error.status === 401) {
            this.errorMessage = 'Usuario o contraseña incorrectos';
          } else if (error.status === 0) {
            this.errorMessage = 'No se pudo conectar con el servidor';
          } else {
            this.errorMessage = 'Error al iniciar sesión. Intenta de nuevo.';
          }
        },
      });
  }

  /**
   * Marca todos los campos como touched para mostrar errores
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Verifica si un campo tiene error y fue tocado
   */
  hasError(field: string, error: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control?.hasError(error) && control?.touched);
  }

  /**
   * Obtiene el mensaje de error para un campo
   */
  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (!control || !control.touched) return '';

    if (control.hasError('required')) {
      return `${field === 'userIdentifier' ? 'Usuario' : 'Contraseña'} es requerido`;
    }

    if (control.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }

    return '';
  }
}
