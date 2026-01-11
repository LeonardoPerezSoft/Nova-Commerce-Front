/**
 * CategoryFilterComponent — Filtro de categorías
 *
 * RESPONSABILIDADES:
 * • Mostrar lista de categorías disponibles
 * • Emitir evento cuando se selecciona una categoría
 * • Mostrar categoría activa
 *
 * ENTRADA:
 * @Input categories: Category[]
 * @Input selectedCategoryId: string | null
 *
 * SALIDA:
 * @Output categorySelected: EventEmitter<string | null>
 *
 * USO:
 * <app-category-filter
 *   [categories]="categories$ | async"
 *   [selectedCategoryId]="selectedCategory"
 *   (categorySelected)="onCategoryChange($event)"
 * />
 */

import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/product.model';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-filter.component.html',
  styleUrl: './category-filter.component.scss',
})
export class CategoryFilterComponent {
  /**
   * Lista de categorías disponibles
   */
  categories = input<Category[]>([]);

  /**
   * ID de la categoría seleccionada actualmente
   */
  selectedCategoryId = input<string | null>(null);

  /**
   * Evento emitido cuando se selecciona una categoría
   * null = "Todas las categorías"
   */
  categorySelected = output<string | null>();

  /**
   * Maneja el clic en una categoría
   */
  onCategoryClick(categoryId: string | null): void {
    this.categorySelected.emit(categoryId);
  }

  /**
   * Verifica si una categoría está activa
   */
  isActive(categoryId: string | null): boolean {
    return this.selectedCategoryId() === categoryId;
  }
}
