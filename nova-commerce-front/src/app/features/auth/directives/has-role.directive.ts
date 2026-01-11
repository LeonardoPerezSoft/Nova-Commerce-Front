import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { AuthFacade } from '../services/auth.facade';
import { Subject, takeUntil } from 'rxjs';

/**
 * HasRoleDirective
 *
 * Directiva estructural para mostrar/ocultar elementos según roles
 *
 * Uso en templates:
 *
 * Un solo rol:
 * ```html
 * <button *hasRole="'ADMIN'">Eliminar Usuario</button>
 * ```
 *
 * Múltiples roles (OR - al menos uno):
 * ```html
 * <div *hasRole="['ADMIN', 'MANAGER']">
 *   Panel de administración
 * </div>
 * ```
 *
 * Comportamiento:
 * - Si el usuario tiene el/los rol(es) → Renderiza el elemento
 * - Si NO tiene el rol → NO renderiza el elemento (ni siquiera en DOM)
 *
 * Reactiva: Se actualiza automáticamente cuando cambia la sesión
 */
@Directive({
  selector: '[hasRole]',
  standalone: true,
})
export class HasRoleDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private requiredRoles: string[] = [];

  @Input() set hasRole(roles: string | string[]) {
    this.requiredRoles = Array.isArray(roles) ? roles : [roles];
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authFacade: AuthFacade
  ) {}

  ngOnInit(): void {
    // Suscribirse a cambios en el estado de autenticación
    this.authFacade.authState$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateView();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateView(): void {
    this.viewContainer.clear();

    // Si no hay roles requeridos, mostrar el elemento
    if (this.requiredRoles.length === 0) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      return;
    }

    // Verificar si el usuario tiene al menos uno de los roles
    const hasPermission = this.authFacade.hasAnyRole(this.requiredRoles);

    if (hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
