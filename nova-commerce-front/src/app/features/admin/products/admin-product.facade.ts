import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AdminProductService } from './admin-product.service';
import { AdminProduct, AdminProductInput } from './admin-product.model';

export interface AdminProductState {
  products: AdminProduct[];
  selectedProduct: AdminProduct | null;
  loading: boolean;
  filter?: { active?: boolean };
}

@Injectable({ providedIn: 'root' })
export class AdminProductFacade {
  private service = inject(AdminProductService);
  private _state$ = new BehaviorSubject<AdminProductState>({
    products: [],
    selectedProduct: null,
    loading: false,
    filter: {},
  });

  state$ = this._state$.asObservable();
  products$ = this._state$.asObservable();
  selectedProduct$ = this._state$.asObservable();

  private setState(partial: Partial<AdminProductState>) {
    const current = this._state$.value;
    this._state$.next({ ...current, ...partial });
  }

  loadProducts() {
    this.setState({ loading: true });
    this.service.list().subscribe({
      next: (products) => this.setState({ products, loading: false }),
      error: () => this.setState({ loading: false }),
    });
  }

  loadProductById(id: number) {
    this.setState({ loading: true });
    this.service.getById(id).subscribe({
      next: (selectedProduct) => this.setState({ selectedProduct, loading: false }),
      error: () => this.setState({ loading: false }),
    });
  }

  createProduct(input: AdminProductInput) {
    this.setState({ loading: true });
    this.service.create(input).subscribe({
      next: (p) => this.setState({
        products: [p, ...this._state$.value.products],
        selectedProduct: p,
        loading: false,
      }),
      error: () => this.setState({ loading: false }),
    });
  }

  updateProduct(id: number, input: AdminProductInput) {
    this.setState({ loading: true });
    this.service.update(id, input).subscribe({
      next: (p) => {
        const products = this._state$.value.products.map((it) => (it.id === p.id ? p : it));
        this.setState({ products, selectedProduct: p, loading: false });
      },
      error: () => this.setState({ loading: false }),
    });
  }

  setActive(id: number, status: 'ACTIVE' | 'INACTIVE') {
    this.setState({ loading: true });
    this.service.setActive(id, status).subscribe({
      next: (p) => {
        const products = this._state$.value.products.map((it) => (it.id === p.id ? p : it));
        this.setState({ products, selectedProduct: p, loading: false });
      },
      error: () => this.setState({ loading: false }),
    });
  }

  deleteProduct(id: number) {
    this.setState({ loading: true });
    this.service.delete(id).subscribe({
      next: () => {
        const products = this._state$.value.products.filter((p) => p.id !== id);
        this.setState({ products, loading: false });
      },
      error: () => this.setState({ loading: false }),
    });
  }

  setFilter(filter: { active?: boolean }) {
    this.setState({ filter });
  }
}
