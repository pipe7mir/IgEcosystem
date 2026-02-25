# OASIS Project - Serverless Structure

Este proyecto ha sido migrado a una arquitectura serverless utilizando **Supabase** para el backend y **React + Vite** para el frontend.

## Prerrequisitos
- Node.js 18+
- Un proyecto en [Supabase](https://supabase.com/)

## Instalación y Configuración

### 1. Frontend (React + Vite)
Navega al directorio `frontend`:
```bash
cd frontend
```

Instala las dependencias:
```bash
npm install
```

Configura las variables de entorno:
Crea o edita el archivo `.env` en la carpeta `frontend/` con tus credenciales de Supabase:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anon_publica
```

Inicia el servidor de desarrollo:
```bash
npm run dev
```

### 2. Backend (Futuro - NestJS)
El proyecto incluye una carpeta `backend-nest` que se mantiene para futuras expansiones de lógica personalizada o servicios adicionales. Actualmente, todas las funciones principales (Auth, DB, Storage) son manejadas por Supabase.

## Despliegue (Deployment)

### Frontend (Vercel / Netlify / Railway)
- Conecta tu repositorio.
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Variables de Entorno**: Asegúrate de añadir `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en el panel de control de tu proveedor.

## Estructura del Proyecto
- `/frontend`: Aplicación principal en React con Tailwind CSS y Supabase SDK.
- `/backend-nest`: Estructura base para futuros microservicios.
- `/.github/workflows`: Automatización de CI/CD.

---
*Transformado a Serverless con Supabase.*
