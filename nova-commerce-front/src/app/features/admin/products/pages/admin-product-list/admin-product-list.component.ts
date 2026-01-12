import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminProductFacade } from '../../admin-product.facade';
import type { AdminProductState } from '../../admin-product.facade';
import { AdminProductTableComponent } from '../../components/admin-product-table/admin-product-table.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminProductTableComponent],
  templateUrl: './admin-product-list.component.html',
  styleUrls: ['./admin-product-list.component.scss'],
})
export class AdminProductListComponent implements OnInit {
  private facade = inject(AdminProductFacade);
  state$ = this.facade.state$;

  ngOnInit() {
    this.facade.loadProducts();
  }
}
