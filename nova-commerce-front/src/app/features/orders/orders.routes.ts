/**
 * Orders Routing
 *
 * Rutas lazy-loaded para feature de órdenes
 * '' → OrderHistoryComponent (listar órdenes del usuario)
 * 'create' → CreateOrderComponent (crear orden desde carrito)
 */

import { Routes } from '@angular/router';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { CreateOrderComponent } from './pages/create-order/create-order.component';

export const ordersRoutes: Routes = [
  {
    path: '',
    component: OrderHistoryComponent,
  },
  {
    path: 'create',
    component: CreateOrderComponent,
  },
];
