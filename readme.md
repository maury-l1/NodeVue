# Node + Vue Monorepo

Este proyecto es un monorepo que contiene un **backend Node.js** y un **frontend Vue 3 (Vite)**.  
Permite iniciar ambos stacks con un solo comando.

---

## Estructura del proyecto

```
NodeVue/
├── backend/       # Node.js + SQLite backend
├── frontend/      # Vue 3 + Vite frontend
├── package.json   # raíz con workspaces
└── README.md
```

---

## Dependencias en la raíz

```json
{
  "name": "NodeVue",
  "private": true,
  "workspaces": ["frontend", "backend"],
  "scripts": {
    "install-all": "npm install",
    "dev": "npm run dev --workspace backend & npm run dev --workspace frontend"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

- `concurrently` → opcional, permite correr ambos stacks al mismo tiempo.
- `workspaces` → asegura que `npm install` instale dependencias en **frontend** y **backend** automáticamente.

---

## Scripts principales

- `npm run install-all` → instala todas las dependencias de backend y frontend.  
- `npm run dev` → inicia backend y frontend al mismo tiempo (frontend corre con Vite y proxy configurado).

---

## Backend (Node.js + SQLite)

- Carpeta: `backend/`
- Dependencias principales:
  - `express`
  - `sqlite3`
  - `jsonwebtoken`
  - `cors`
- Endpoints:
  - `/api/register` → registro de usuarios
  - `/api/login` → login y JWT
  - `/api/tasks` → CRUD de tareas
  - `/api/users` → listado y eliminar usuarios (solo admin)
  
---

## Frontend (Vue 3 + Vite + Pinia)

- Carpeta: `frontend/`
- Dependencias principales:
  - `vue`
  - `pinia`
  - `vue-router`
- Funcionalidades:
  - Registro y login con JWT
  - Navbar dinámico según rol
  - CRUD de tareas
  - Vista de usuarios para admin

---

## Configuración Vite

- Proxy para conectar frontend con backend:

```js
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      secure: false
    }
  }
}
```

---

## Instrucciones para ejecutar

1. Instalar todas las dependencias:

```bash
npm run install-all
```

2. Iniciar ambos stacks:

```bash
npm run dev
```

3. Acceder al frontend en: [http://localhost:5173](http://localhost:5173)  
   Backend corre en: [http://localhost:3000](http://localhost:3000)

---

¡Listo! Ahora puedes trabajar en el frontend y backend simultáneamente sin configurar puertos manualmente.

