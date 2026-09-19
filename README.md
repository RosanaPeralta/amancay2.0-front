# Amancay Frontend

Frontend en React + Vite para Amancay, conectado a la API de [`amancay2.0-back`](../amancay2.0-back) (Spring Boot).

## Requisitos previos

- Node.js `^20.19.0 || ^22.13.0 || >=24`
- El backend [`amancay2.0-back`](../amancay2.0-back) corriendo localmente (por defecto en `http://localhost:8080`) — esta app no tiene datos propios, todas las pantallas consumen esa API.

## Instalación

```bash
npm install
cp .env.example .env
```

Asegurate de tener el backend corriendo (`./mvnw spring-boot:run` desde `amancay2.0-back`, puerto por defecto `8080`) **antes** de levantar el frontend, de lo contrario las peticiones de productos/categorías van a fallar.

## Desarrollo

```bash
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## Variables de entorno

| Variable | Valor por defecto | Descripción |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:8080/api` | URL base de la API de `amancay2.0-back` |
| `VITE_SUPABASE_URL` | *(obligatoria)* | Project URL de Supabase (Project Settings → Data API) |
| `VITE_SUPABASE_ANON_KEY` | *(obligatoria)* | Clave pública `anon` / `publishable` del proyecto (Project Settings → API Keys). Nunca la `service_role` |

## Autenticación

El login y el registro se hacen contra **Supabase Auth** (email + contraseña) con `@supabase/supabase-js`; la sesión queda en `localStorage` y el token se refresca solo. Cada request al backend lleva `Authorization: Bearer <access_token>` (ver `src/services/httpClient.js`); el backend crea el usuario en su tabla `users` en la primera request autenticada.

- Rutas públicas: `/`, `/products`, `/products/:id`, `/login`, `/register`, `/forgot-password`, `/reset-password`.
- Requieren sesión (`/account`): perfil, direcciones, favoritos y mis reseñas.
- Requieren rol `ADMIN` (`/admin`): usuarios y moderación de reseñas. El rol lo define el backend (`GET /api/me`), no Supabase.

Para que funcione, en el proyecto Supabase hay que tener:

- **Authentication → URL Configuration**: `http://localhost:5173` como *Site URL* y `http://localhost:5173/reset-password` en *Redirect URLs* (el link de recuperar contraseña vuelve ahí).
- **Authentication → Sign In / Providers → Confirm email**: si está activado, el registro pide confirmar el mail antes de poder entrar (la app muestra "Check your inbox"). Para desarrollo conviene desactivarlo.
- El backend debe permitir el origen del front por CORS (`CORS_ALLOWED_ORIGINS` en `amancay2.0-back`, por defecto `http://localhost:5173`).

## Scripts

- `npm run dev` — levanta el servidor de desarrollo de Vite
- `npm run build` — genera el build de producción en `dist/`
- `npm run preview` — sirve el build de producción localmente
- `npm run lint` — corre ESLint
