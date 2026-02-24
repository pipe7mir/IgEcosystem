# Solución CORS - Documentación

## Problema
El backend Laravel tiene `supports_credentials: true` en la configuración CORS, pero el frontend no enviaba `credentials: 'include'` en las peticiones fetch, causando errores de CORS.

## Cambios Implementados

### 1. Backend (`backend/config/cors.php`)
✅ Configurado con orígenes específicos permitidos:
- `https://ig-ecosystem-git-main-pipe7mirs-projects.vercel.app`
- `https://igecosystem-production.up.railway.app`
- `http://localhost:5173`
- `http://127.0.0.1:5173`

✅ Patrón regex para subdominios Vercel: `/^https:\/\/ig-ecosystem.*\.vercel\.app$/`

✅ `supports_credentials: true` - permite cookies/sesiones

### 2. Frontend - Cambios Completados

#### ✅ Autenticación (`frontend/src/auth/auth.js`)
- Login: añadido `credentials: 'include'`
- Register: añadido `credentials: 'include'`

#### ✅ Cliente Axios (`frontend/src/api/client.js`)
- Añadido `withCredentials: true` al cliente axios

#### ✅ Logout (`frontend/src/modules/admin.js`)
- Añadido `credentials: 'include'`

#### ✅ Nuevo Helper (`frontend/src/api/fetch-helper.js`)
Creado helper que automáticamente incluye credentials en todas las peticiones:
```javascript
import { apiFetch, apiPost, apiGet } from './api/fetch-helper';

// Uso:
const response = await apiPost('/login', { username, password });
const data = await apiGet('/users');
```

### 3. Peticiones Fetch Pendientes (Opcional)

Hay **21 peticiones fetch adicionales** que podrían actualizarse para usar el nuevo helper o añadir `credentials: 'include'` manualmente:

**Archivos con peticiones fetch:**
- `frontend/src/modules/usuarios.js` (4 peticiones)
- `frontend/src/modules/solicitudes.js` (3 peticiones)
- `frontend/src/modules/recursos.js` (1 petición)
- `frontend/src/modules/peticiones.js` (1 petición)
- `frontend/src/modules/home.js` (3 peticiones - públicas, no requieren credentials)
- `frontend/src/modules/anuncios.js` (3 peticiones)
- `frontend/src/modules/admin-recursos.js` (4 peticiones)
- `frontend/src/modules/admin-streaming.js` (2 peticiones)

## Opciones de Refactorización

### Opción A: Refactorizar todo (Recomendado)
Reemplazar todas las peticiones `fetch` con el nuevo `apiFetch` helper:

```javascript
// Antes:
const response = await fetch(\`\${apiUrl}/users\`, {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
});

// Después:
import { apiGet } from '../api/fetch-helper';
const response = await apiGet('/users');
```

### Opción B: Añadir credentials manualmente
Añadir `credentials: 'include'` a cada petición fetch existente.

### Opción C: Deshabilitar credentials (NO Recomendado)
Si no usas cookies/sesiones, cambiar en `backend/config/cors.php`:
```php
'supports_credentials' => false,
```

## Pruebas

1. Limpiar caché del navegador (Ctrl+Shift+Del)
2. Limpiar caché de Laravel: `php artisan optimize:clear`
3. Reconstruir frontend: `npm run build` o `npm run dev`
4. Probar login/register
5. Verificar que no hay errores CORS en la consola

## Estado Actual

✅ Login/Register funcionan con credentials
✅ Cliente axios configurado
✅ Backend CORS configurado correctamente
⚠️ Otras peticiones fetch pueden necesitar actualización

## Próximos Pasos

1. Probar login/register en producción
2. Si funciona, refactorizar gradualmente otras peticiones a usar `fetch-helper.js`
3. Monitorear consola del navegador para detectar errores CORS restantes

---
**Fecha:** ${new Date().toLocaleDateString()}
**Estado:** Implementación parcial completada
