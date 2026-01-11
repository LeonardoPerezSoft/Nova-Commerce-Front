🔐 ETAPA 2 — Autenticación & Seguridad (Frontend)
🎯 Objetivo de la etapa

Implementar autenticación robusta, escalable y alineada con backend, respetando Clean Architecture, separación de responsabilidades y seguridad real (no “simulada”).

Al finalizar esta etapa:
El usuario podrá iniciar sesión
El token JWT se manejará de forma centralizada
Las rutas estarán protegidas por roles
La UI reaccionará según permisos
El sistema quedará listo para crecer (Admin, Cliente, Usuario)

🧠 Principios que se aplican (muy importante)

✔️ Single Responsibility
✔️ Facade Pattern para no acoplar UI ↔ Auth
✔️ Stateless Frontend
✔️ Security First
✔️ Reutilización total
✔️ Nada hardcodeado


🧱 Arquitectura que vamos a respetar

features/
 └── auth/
     ├── pages/
     │   └── login/
     ├── services/
     │   ├── auth.service.ts
     │   ├── auth.facade.ts
     │   └── token.service.ts
     ├── guards/
     │   ├── auth.guard.ts
     │   └── role.guard.ts
     ├── interceptors/
     │   └── token.interceptor.ts
     ├── directives/
     │   └── has-role.directive.ts
     ├── models/
     │   └── auth.models.ts
     └── auth.routes.ts


🧩 ¿Qué se construye exactamente?
1️⃣ AuthService

Responsable solo de:
Login
Refresh token
Logout

👉 NO maneja storage
👉 NO maneja navegación
👉 NO toca UI

servicios:
http://localhost:8080/api/auth/login

Body:
{
"userIdentifier":"admin",
"password":"Admin123!"
}
Response:
{
    "access_token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGhvcml0aWVzIjoiUk9MRV9DUkVBVEUsUk9MRV9ERUxFVEUsUk9MRV9VUERBVEUsVVNFUl9ERUxFVEUsVVNFUl9DUkVBVEUsVVNFUl9VUERBVEUsUk9MRV9BRE1JTixBVVRIX1ZBTElEQVRFLFVTRVJfUkVBRCxST0xFX1JFQUQiLCJpYXQiOjE3NjgxNDMzNzIsImV4cCI6MTc2ODIyOTc3Mn0.Rg5dpIouD675_OyGZrmLuAbfNbwxo4331M2cmAtLTF1FqIK8GlcQAR8ouKsBXfSpBKMRUAGYHTnyaExD27zsgg",
    "refresh_token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc2ODE0MzM3MiwiZXhwIjoxNzY4NzQ4MTcyfQ.K0p3iv_nwapsUtjUiWc1jcWPW6bNGt6oEuQLbV3Gp5bsiAV6OTNRjTGDX77ggF5U0kxc9DcqQfKljm1y5bL1iA",
    "token_type": "Bearer",
    "expires_in": 86400,
    "username": "admin",
    "roles": [
        "ADMIN"
    ]
}


http://localhost:8080/api/auth/refresh
Body
{
  "refreshToken": "{{refresh_token}}"
}
 response:

{
    "access_token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGhvcml0aWVzIjoiIiwiaWF0IjoxNzY4MTQzNDY1LCJleHAiOjE3NjgyMjk4NjV9.FrRCDt80CGHmV2VBg7gWVYLZIpWEo9cgYAc1l9ZtlMwETourgN4n_UXXjYh8dG2LJnTltedRhrDGu3QZWIKGBA",
    "refresh_token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc2ODE0MzM3MiwiZXhwIjoxNzY4NzQ4MTcyfQ.K0p3iv_nwapsUtjUiWc1jcWPW6bNGt6oEuQLbV3Gp5bsiAV6OTNRjTGDX77ggF5U0kxc9DcqQfKljm1y5bL1iA",
    "token_type": "Bearer",
    "expires_in": 86400,
    "username": "admin",
    "roles": []
}


http://localhost:8080/api/auth/validate

Authorization
Bearer Token:
{{access_token}}

Body 
none
Response:

{
    "valid": true,
    "username": "admin",
    "authorities": "ROLE_CREATE,ROLE_DELETE,ROLE_UPDATE,USER_DELETE,USER_CREATE,USER_UPDATE,ROLE_ADMIN,AUTH_VALIDATE,USER_READ,ROLE_READ"
}

2️⃣ TokenService

Responsable solo de:
Guardar / leer / borrar tokens
localStorage
Decodificar JWT (roles)

👉 Aquí vive la verdad del token
👉 Nada de lógica duplicada

3️⃣ AuthFacade (MUY IMPORTANTE)

Es el cerebro del frontend auth:
Orquesta AuthService + TokenService
Expone métodos simples:
login()
logout()
isAuthenticated()
hasRole()

Es el único punto que usan:

Componentes
Guards
Directivas
👉 UI nunca habla directo con servicios

4️⃣ TokenInterceptor

Adjunta automáticamente:
Authorization: Bearer <token>

Excluye:
/auth/login
/auth/refresh

Maneja 401 / 403

5️⃣ AuthGuard

Protege rutas autenticadas
Redirige a /login si no hay sesión

6️⃣ RoleGuard

Protege rutas por rol:
ADMIN
CUSTOMER
USER

Se apoya en AuthFacade

7️⃣ Directiva hasRole

Permite cosas como:
5️⃣ AuthGuard

Protege rutas autenticadas

Redirige a /login si no hay sesión

6️⃣ RoleGuard

Protege rutas por rol:

ADMIN

CUSTOMER

USER

Se apoya en AuthFacade

7️⃣ Directiva hasRole

Permite cosas como:
<button *hasRole="'ADMIN'">Eliminar</button>
o 
<div *hasRole="['ADMIN','MANAGER']">
👉 UI dinámica según permisos

8️⃣ Login Page

Formulario reactivo
Validaciones
Feedback visual
Redirección automática post-login

BONUS:

🎨 Branding / Logo DEL NEGCIO

👉 Sí, absolutamente correcto hacerlo ahora

¿Por qué ahora?

Header
Login
Loading states
Error pages
Favicon

No tener logo = producto sin identidad
Genbera el logo del negocio:

Integrar el logo como asset
Usarlo en:
Header
Login
Mantener diseño sobrio tipo:
Amazon
MercadoLibre
Ebay
Nada infantil, nada exagerado