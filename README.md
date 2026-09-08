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

## Scripts

- `npm run dev` — levanta el servidor de desarrollo de Vite
- `npm run build` — genera el build de producción en `dist/`
- `npm run preview` — sirve el build de producción localmente
- `npm run lint` — corre ESLint
