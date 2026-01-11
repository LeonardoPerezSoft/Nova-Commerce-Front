🧩 ETAPA 4 — Órdenes (Orders)

🎯 Objetivo de la etapa
Permitir que un usuario autenticado:
Cree una orden a partir de productos
Visualice totales y descuentos aplicados
Consulte su historial de órdenes
Mantenga reglas de negocio fuera de la UI
Todo reactivo, testeado y alineado con el backend que ya construiste.

🧠 Principios que vamos a respetar (no negociables)
❌ Nada de lógica de negocio en componentes
✅ Facade como single source of truth
✅ Cálculos alineados al backend (no “inventar totales”)
✅ Integración con UserFacade
✅ UI desacoplada de HTTP
✅ Tests donde hay lógica (facade + service)

🏗️ Arquitectura propuesta (Clean Frontend)
features/orders/
├── models/
│   └── order.model.ts
│
├── services/
│   ├── order.service.ts
│   └── order.service.spec.ts
│
├── facade/
│   ├── order.facade.ts
│   └── order.facade.spec.ts
│
├── components/
│   ├── order-summary/
│   ├── order-item/
│   └── discount-badge/
│
├── pages/
│   ├── create-order/
│   └── order-history/
│
└── orders.routes.ts

📦 MODELOS (alineados al backend)
export interface OrderItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Discount {
  type: 'LOYALTY' | 'PRODUCT' | 'SEASON';
  percentage: number;
  amount: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  discounts: Discount[];
  status: 'CREATED' | 'PAID' | 'SHIPPED' | 'COMPLETED';
  createdAt: string;
}


👉 Nada calculado en el component. Todo viene listo o se orquesta desde el Facade.

🧠 OrderFacade (corazón de la etapa)

Responsabilidades:
Crear órdenes
Exponer estado reactivo
Consumir UserContext
Manejar loading / error
Cachear historial
order$;
orders$;
isLoading$;
error$;
createOrder(items);
loadUserOrders();

🖥️ UI / UX (estilo marketplace real)
🛒 Create Order
Lista de productos seleccionados
Totales visibles
Descuentos destacados
CTA: Confirmar Orden

📜 Order History

Tabla / cards por orden
Estado visual (badge)
Totales y descuentos
Fecha y detalle

🧪 Testing (mínimo esperado)
Capa	Qué testear
Service	HTTP calls, mapping
Facade	Estados, flujos, errores
Components	Solo render básico

🎯 Coverage objetivo: ≥ 85%