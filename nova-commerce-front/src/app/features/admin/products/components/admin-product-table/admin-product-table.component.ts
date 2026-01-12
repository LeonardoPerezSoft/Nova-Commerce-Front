import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminProduct } from '../../admin-product.model';
import { AdminProductFacade } from '../../admin-product.facade';

@Component({
  selector: 'app-admin-product-table',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-product-table.component.html',
  styleUrls: ['./admin-product-table.component.scss'],
})
export class AdminProductTableComponent {
  @Input() products: AdminProduct[] = [];

  private facade = inject(AdminProductFacade);

  deleteProduct(id: number, name: string) {
    if (confirm(`¿Estás seguro de que deseas eliminar "${name}"?`)) {
      this.facade.deleteProduct(id);
    }
  }
}
