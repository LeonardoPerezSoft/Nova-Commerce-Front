import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminProductFacade } from '../../admin-product.facade';
import { AdminProductFormFieldsComponent } from '../../components/admin-product-form-fields/admin-product-form-fields.component';
import { AdminProductInput } from '../../admin-product.model';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminProductFormFieldsComponent],
  templateUrl: './admin-product-form.component.html',
  styleUrls: ['./admin-product-form.component.scss'],
})
export class AdminProductFormComponent implements OnInit {
  private facade = inject(AdminProductFacade);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  model: AdminProductInput = {
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    status: 'ACTIVE',
    productType: 'PHYSICAL',
    categoryId: undefined
  };
  isEdit = false;

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      const id = parseInt(idParam, 10);
      this.facade.loadProductById(id);
      (this.facade as any).products$.subscribe((state: any) => {
        if (state.selectedProduct) {
          const p = state.selectedProduct;
          this.model = {
            name: p.name,
            description: p.description,
            price: p.price,
            stockQuantity: p.stockQuantity,
            status: p.status,
            productType: p.productType,
            categoryId: p.categoryId
          };
        }
      });
    }
  }

  save() {
    if (this.isEdit) {
      const idParam = this.route.snapshot.paramMap.get('id')!;
      const id = parseInt(idParam, 10);
      this.facade.updateProduct(id, this.model);
    } else {
      this.facade.createProduct(this.model);
    }
    this.router.navigate(['/admin/products']);
  }

  onModelChange(updatedModel: AdminProductInput) {
    this.model = updatedModel;
  }
}
