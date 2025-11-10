# 🚀 Quick Start Guide

## Despliegue en Vercel (3 pasos)

### 1️⃣ Instalar Dependencias
```bash
npm install
```

### 2️⃣ Instalar Vercel CLI y Desplegar
```bash
npm install -g vercel
vercel
```

### 3️⃣ Configurar Variables de Entorno en Vercel

Ve a tu proyecto en [vercel.com](https://vercel.com) → Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/marketing-automation?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=<genera-una-clave-segura>

JWT_EXPIRE=30d

NODE_ENV=production

CORS_ORIGIN=*
```

**Generar JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## ✅ Verificar Despliegue

```bash
curl https://tu-dominio.vercel.app/api/health
```

---

## 📝 Comandos Útiles

### Desarrollo Local
```bash
# Frontend
npm run dev

# Backend (en otra terminal)
cd server
npm run dev
```

### Build
```bash
npm run build
```

### Despliegue
```bash
# Preview
vercel

# Producción
vercel --prod
```

---

## 🔗 Archivos Importantes

- **SETUP_COMPLETE.md** - Documentación completa
- **DEPLOY_INSTRUCTIONS.md** - Guía detallada de despliegue
- **.env.example** - Ejemplo de variables de entorno
- **vercel.json** - Configuración de Vercel

---

## 🎯 Estructura de Archivos Creados

```
✅ /api/index.ts                    - API serverless
✅ /vercel.json                     - Config Vercel
✅ /src/config/api.ts              - Endpoints API
✅ /src/services/                  - Servicios (auth, contacts, etc.)
✅ /src/contexts/AuthContext.tsx   - Context de autenticación
✅ /src/hooks/useApi.ts            - Custom hook
✅ /src/components/ProtectedRoute.tsx - Protección de rutas
```

---

## 💡 Próximos Pasos

1. ✅ Ejecutar `npm install`
2. ✅ Desplegar con `vercel`
3. ✅ Configurar variables de entorno
4. ✅ Probar endpoint `/api/health`
5. ✅ Integrar servicios en tus componentes

---

¡Listo para desplegar! 🎉
