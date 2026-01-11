/**
 * ProductSkeletonComponent — Placeholder de carga
 *
 * RESPONSABILIDADES:
 * • Mostrar skeleton mientras cargan productos
 * • Mejorar UX indicando estado de loading
 * • Mantener estructura visual del grid
 *
 * ENTRADA:
 * @Input count: number (cantidad de skeletons a mostrar)
 *
 * USO:
 * @if (loading$ | async) {
 *   <app-product-skeleton [count]="8" />
 * }
 */

import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-skeleton.component.html',
  styleUrl: './product-skeleton.component.scss',
})
export class ProductSkeletonComponent {
  /**
   * Número de skeletons a renderizar
   */
  count = input<number>(8);

  /**
   * Array para ngFor (genera [0, 1, 2, ..., count-1])
   */
  get items(): number[] {
    return Array.from({ length: this.count() }, (_, i) => i);
  }
}
