import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * HomeComponent
 *
 * Página de inicio (home) de la aplicación.
 * Punto de entrada principal cuando el usuario accede a la raíz.
 *
 * En futuras etapas (ETAPA 4), aquí irá:
 * - Banner principal
 * - Productos destacados
 * - Categorías
 * - Llamadas a la acción
 *
 * Por ahora es solo un placeholder sin funcionalidad.
 */
@Component({
  selector: 'nc-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="nc-home">
      <div class="nc-home__hero">
        <h1>Bienvenido a NovaCommerce</h1>
        <p>La mejor plataforma de e-commerce de America Latina</p>
      </div>
    </div>
  `,
  styles: [`
    .nc-home {
      width: 100%;
    }

    .nc-home__hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 2rem;
      text-align: center;
      border-radius: 0.5rem;
      min-height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }

      p {
        font-size: 1.25rem;
      }
    }

    @media (max-width: 768px) {
      .nc-home__hero {
        padding: 2rem 1rem;

        h1 {
          font-size: 1.8rem;
        }

        p {
          font-size: 1rem;
        }
      }
    }
  `]
})
export class HomeComponent {}
