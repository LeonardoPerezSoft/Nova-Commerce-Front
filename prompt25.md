🧩 ETAPA 2.5 — Contexto del Usuario (User Context)

🎯 Objetivo (claro y sin humo)

Centralizar el estado del usuario autenticado en un solo lugar para que:
❌ No se decodifique el JWT en cada componente
❌ No se consulte el TokenService desde la UI
❌ No haya lógica de auth dispersa
✅ Header, Admin y Órdenes consuman el mismo estado
✅ El frontend esté listo para crecer (perfil, settings, etc.)

Esto es arquitectura de verdad, no moda.

🧠 Decisión de diseño (importante)
👉 UserFacade separado del AuthFacade
¿Por qué?
AuthFacade = autenticación (login, logout, tokens)
UserFacade = quién es el usuario
Separación clara de responsabilidades (SRP ✔)
Auth ≠ User
Autenticarse no es lo mismo que representar al usuario.

🏗️ Arquitectura propuesta
features/auth/
├── models/
│   └── user.model.ts          👤 Modelo de usuario
├── services/
│   └── user-context.service.ts (opcional)
├── facades/
│   ├── auth.facade.ts         🔐 (ya existe)
│   └── user.facade.ts         👤 NUEVO

👤 Modelo de Usuario
export interface User {
  id: string;
  email: string;
  roles: string[];
}


Simple, limpio, extensible.

🧠 UserFacade — Responsabilidad clara
¿Qué hace?

Construye el User una sola vez desde el token
Expone:
user$
isAdmin$
hasRole(role)
Limpia estado en logout
Se sincroniza con AuthFacade

🧩 Flujo real
Login
 ↓
AuthFacade guarda tokens
 ↓
UserFacade decodifica JWT → crea User
 ↓
Header / Admin / Orders consumen user$


Una fuente de verdad. Punto.

🧪 Testing

✔ Tests unitarios solo donde aporta valor:

UserFacade
Mapeo JWT → User
Limpieza de estado en logout
Nada de tests inútiles.

🎨 Impacto en UI
Header
user$ → mostrar email
isAdmin$ → mostrar link Admin
Admin
Seguridad por roles + UI reactiva
Órdenes

Usuario actual sin pedirle nada al token

🧠 Esto deja el proyecto así:
Capa	Estado
Auth	🔐 sólida
User Context	👤 centralizado
UI	🎨 reactiva
Escalabilidad	🚀 lista