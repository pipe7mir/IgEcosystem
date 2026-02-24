# ✅ CHECKLIST DE DEPLOYMENT - PASOS MANUALES

## ✓ COMPLETADO LOCALMENTE:
- [x] Base de datos limpia (todas las tablas recreadas)
- [x] Migraciones ejecutadas exitosamente (21 tablas creadas)
- [x] Usuario admin creado (username: admin, password: admin123)
- [x] Backend optimizado para producción
- [x] Frontend compilado
- [x] Código pusheado a GitHub

---

## 🔴 RAILWAY - BACKEND (10 min)

### Paso 1: Verificar Deployment Automático
1. Abre: https://railway.app/dashboard
2. Busca tu proyecto actual
3. Deberías ver un deployment en progreso (commit 5087f6a)
4. Espera a que termine (~3 minutos)

### Paso 2: Configurar Variables de Entorno
Ve a tu servicio → Variables → Verifica que tengas:

```
APP_NAME=Oasis
APP_ENV=production
APP_DEBUG=false
APP_URL=${{RAILWAY_PUBLIC_DOMAIN}}

DB_CONNECTION=mysql
DB_HOST=gondola.proxy.rlwy.net
DB_PORT=32192
DB_DATABASE=railway
DB_USERNAME=root
DB_PASSWORD=OuxGyqhyFrfNOpRaIJmIRvfaJjexvOkx

CORS_ALLOWED_ORIGINS=*
```

**IMPORTANTE:** Necesitas agregar `APP_KEY` (generada en .env local)

### Paso 3: Copiar APP_KEY
En PowerShell local ejecuta:
```powershell
cd backend
Get-Content .env | Select-String "APP_KEY"
```

Copia ese valor y agrégalo en Railway variables como:
```
APP_KEY=base64:TU_VALOR_AQUI
```

### Paso 4: Verificar Root Directory
En Railway → Settings → Root Directory debe ser:
```
backend
```

### Paso 5: Redeploy
Después de agregar APP_KEY, haz click en "Deploy" para forzar un nuevo deployment.

### Paso 6: Copiar URL del Backend
Una vez desplegado, copia la URL pública (ejemplo):
```
https://igecosystem-production.up.railway.app
```

📝 **GUARDA ESTA URL** para el siguiente paso.

---

## 🔵 VERCEL - FRONTEND (5 min)

### Paso 1: Abrir Dashboard
Abre: https://vercel.com/dashboard

### Paso 2: Encontrar tu Proyecto
Busca tu proyecto frontend (debería auto-deployar desde GitHub)

### Paso 3: Configurar Variable de Entorno
1. Ve a Settings → Environment Variables
2. Busca `VITE_API_URL`
3. **Actualízalo con la URL de Railway del Paso 6**

Ejemplo:
```
VITE_API_URL=https://igecosystem-production.up.railway.app
```

**NO OLVIDES** el protocolo `https://` y **NO AGREGUES** barra final `/`

### Paso 4: Redeploy
1. Ve a "Deployments" tab
2. Click en "..." del último deployment
3. Click en "Redeploy"
4. Espera ~2 minutos

### Paso 5: Copiar URL del Frontend
Una vez desplegado, copia la URL pública:
```
https://tu-proyecto.vercel.app
```

---

## 🧪 VERIFICACIÓN FINAL (3 min)

### Test 1: Backend CORS
Abre tu navegador y ve a:
```
https://TU-RAILWAY-URL/api/test-cors
```

Deberías ver:
```json
{
  "success": true,
  "message": "CORS funcionando correctamente",
  "origin": "...",
  "timestamp": "..."
}
```

### Test 2: Login
1. Abre tu URL de Vercel
2. Presiona F12 para abrir DevTools
3. Ve a la pestaña "Network"
4. Intenta hacer login:
   - Usuario: `admin`
   - Contraseña: `admin123`

**Si funciona:**
✅ ¡Deployment exitoso!

**Si falla:**
1. Revisa la consola (Console tab) para errores
2. Revisa la petición de login (Network tab)
3. Verifica que `VITE_API_URL` en Vercel sea correcta

---

## 📝 COMANDOS ÚTILES

### Verificar APP_KEY local:
```powershell
cd backend
Get-Content .env | Select-String "APP_KEY"
```

### Verificar Railway está usando la DB correcta:
En Railway console ejecuta:
```bash
php artisan db:show
```

### Ver usuarios en Railway:
```bash
php artisan tinker --execute="echo User::count() . ' usuarios'"
```

---

## 🆘 SI ALGO FALLA

### Error: "APP_KEY not set" en Railway
→ Agrega APP_KEY en Railway variables (ver Paso 3 arriba)

### Error: CORS persiste
→ Asegúrate que Railway tenga `CORS_ALLOWED_ORIGINS=*`

### Error: Login no conecta
1. Abre F12 → Console en tu frontend
2. Ejecuta: `console.log(import.meta.env.VITE_API_URL)`
3. Debe mostrar tu URL de Railway
4. Si no, reconfigura en Vercel y redeploy

### Error: Base de datos no conecta en Railway
→ Verifica que las credenciales DB_* estén correctas en Railway variables

---

## ✅ AL TERMINAR

Marca cada paso conforme lo completes:

**Railway:**
- [ ] Deployment completado
- [ ] APP_KEY agregada
- [ ] Variables verificadas
- [ ] URL copiada
- [ ] `/api/test-cors` funciona

**Vercel:**
- [ ] VITE_API_URL actualizada
- [ ] Redeploy completado
- [ ] URL copiada
- [ ] Login funciona con admin/admin123

---

**¿Listo? En cuanto termines, prueba el login y me avisas cómo te fue! 🚀**
