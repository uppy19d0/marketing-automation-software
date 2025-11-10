# ✅ Pre-Deploy Checklist

## Antes de Desplegar en Vercel

### 1. Verificar Archivos de Configuración

- [x] `vercel.json` existe en la raíz
- [x] `package.json` tiene todas las dependencias
- [x] `api/index.ts` está configurado
- [x] `.env.example` está documentado
- [x] `.vercelignore` está configurado

### 2. MongoDB Atlas

- [ ] Cuenta de MongoDB Atlas creada
- [ ] Cluster configurado
- [ ] Network Access permite `0.0.0.0/0` (todas las IPs)
- [ ] Connection string copiado y listo para usar

### 3. Variables de Entorno

Prepara estas variables para Vercel:

- [ ] `MONGODB_URI` - Tu connection string de MongoDB Atlas
- [ ] `JWT_SECRET` - Genera uno nuevo con: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- [ ] `JWT_EXPIRE` - Usa `30d`
- [ ] `NODE_ENV` - Usa `production`
- [ ] `CORS_ORIGIN` - Usa `*` o tu dominio específico

### 4. Dependencias

- [ ] Ejecutar `npm install` completado sin errores
- [ ] No hay vulnerabilidades críticas (`npm audit`)
- [ ] Build local funciona: `npm run build`

### 5. Código

- [ ] No hay errores de TypeScript
- [ ] Todos los imports están correctos
- [ ] Rutas de API están configuradas correctamente
- [ ] Servicios del frontend están listos

### 6. Git (si despliegas desde GitHub)

- [ ] Repositorio creado en GitHub
- [ ] Código subido: `git push origin main`
- [ ] `.gitignore` configurado correctamente
- [ ] No hay archivos sensibles (.env) en el repo

---

## Comandos de Verificación

### Verificar Build Local
```bash
npm run build
```

### Verificar Dependencias
```bash
npm install
npm audit
```

### Verificar TypeScript
```bash
npx tsc --noEmit
```

---

## Pasos de Despliegue

### Opción A: Vercel CLI

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Desplegar (preview)
vercel

# 4. Desplegar a producción
vercel --prod
```

### Opción B: GitHub

1. Conectar repositorio en vercel.com
2. Agregar variables de entorno
3. Deploy automático

---

## Después del Despliegue

### 1. Verificar Health Check
```bash
curl https://tu-dominio.vercel.app/api/health
```

Respuesta esperada:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "..."
}
```

### 2. Probar Registro de Usuario
```bash
curl -X POST https://tu-dominio.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Verificar Frontend
- [ ] Página principal carga correctamente
- [ ] Assets (CSS, JS, imágenes) se cargan
- [ ] No hay errores en la consola del navegador

### 4. Verificar Conexión a MongoDB
- [ ] API puede conectarse a MongoDB
- [ ] Operaciones CRUD funcionan
- [ ] No hay errores de timeout

---

## Troubleshooting

### Si el build falla:
1. Revisa los logs en Vercel Dashboard
2. Verifica que todas las dependencias estén instaladas
3. Asegúrate de que no haya errores de TypeScript

### Si MongoDB no conecta:
1. Verifica el connection string
2. Confirma que la IP esté en la whitelist
3. Revisa que las credenciales sean correctas

### Si la API no responde:
1. Verifica que `vercel.json` esté configurado
2. Confirma que las rutas `/api/*` estén correctas
3. Revisa los logs de funciones serverless en Vercel

---

## 🎯 Archivos Importantes Creados

```
✅ /api/index.ts                         - API serverless principal
✅ /api/tsconfig.json                    - Config TypeScript para API
✅ /vercel.json                          - Configuración de Vercel
✅ /.vercelignore                        - Archivos a ignorar
✅ /.npmrc                               - Config npm
✅ /.env.example                         - Variables de entorno
✅ /.env.local.example                   - Variables locales

📄 Documentación:
✅ /SETUP_COMPLETE.md                    - Guía completa
✅ /DEPLOY_INSTRUCTIONS.md               - Instrucciones detalladas
✅ /QUICK_START.md                       - Inicio rápido
✅ /VERCEL_DEPLOYMENT.md                 - Guía de Vercel
✅ /PRE_DEPLOY_CHECKLIST.md             - Este checklist

🎨 Frontend:
✅ /src/config/api.ts                    - Configuración API
✅ /src/services/authService.ts          - Servicio de autenticación
✅ /src/services/contactService.ts       - Servicio de contactos
✅ /src/services/campaignService.ts      - Servicio de campañas
✅ /src/services/segmentService.ts       - Servicio de segmentos
✅ /src/services/landingPageService.ts   - Servicio de landing pages
✅ /src/services/index.ts                - Exportación de servicios
✅ /src/contexts/AuthContext.tsx         - Context de autenticación
✅ /src/hooks/useApi.ts                  - Custom hook para API
✅ /src/components/ProtectedRoute.tsx    - Componente de rutas protegidas
```

---

## 🚀 ¡Listo para Desplegar!

Una vez que todos los checkboxes estén marcados, ejecuta:

```bash
vercel --prod
```

¡Buena suerte! 🎉
