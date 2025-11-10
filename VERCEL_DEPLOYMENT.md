# Despliegue en Vercel - Marketing Automation Software

## Configuración Rápida

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Variables de Entorno en Vercel

Configura las siguientes variables de entorno en tu proyecto de Vercel:

**Variables Requeridas:**
- `MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/marketing-automation?retryWrites=true&w=majority&appName=Cluster0`
- `JWT_SECRET`: Una clave secreta fuerte (genera una nueva para producción)
- `JWT_EXPIRE`: `30d`
- `NODE_ENV`: `production`
- `CORS_ORIGIN`: `*` (o tu dominio específico)

**Variables Opcionales (para envío de emails):**
- `SMTP_HOST`: `smtp.gmail.com`
- `SMTP_PORT`: `587`
- `SMTP_USER`: Tu email
- `SMTP_PASSWORD`: Tu contraseña de aplicación
- `SMTP_FROM`: Email remitente

### 3. Desplegar en Vercel

#### Opción A: Desde la CLI de Vercel
```bash
npm install -g vercel
vercel
```

#### Opción B: Desde GitHub
1. Conecta tu repositorio a Vercel
2. Vercel detectará automáticamente la configuración
3. Agrega las variables de entorno en el dashboard
4. Despliega

### 4. Estructura del Proyecto

```
/
├── api/                    # API serverless para Vercel
│   └── index.ts           # Punto de entrada de la API
├── server/                # Código del backend
│   └── src/
│       ├── models/        # Modelos de MongoDB
│       ├── routes/        # Rutas de la API
│       ├── controllers/   # Controladores
│       └── middleware/    # Middleware
├── src/                   # Frontend React
├── dist/                  # Build del frontend
├── vercel.json           # Configuración de Vercel
└── package.json          # Dependencias unificadas
```

### 5. Endpoints de la API

Una vez desplegado, tu API estará disponible en:

- `https://tu-dominio.vercel.app/api/health` - Health check
- `https://tu-dominio.vercel.app/api/auth/*` - Autenticación
- `https://tu-dominio.vercel.app/api/contacts/*` - Gestión de contactos
- `https://tu-dominio.vercel.app/api/campaigns/*` - Campañas
- `https://tu-dominio.vercel.app/api/segments/*` - Segmentos
- `https://tu-dominio.vercel.app/api/landing-pages/*` - Landing pages

### 6. Verificar el Despliegue

```bash
curl https://tu-dominio.vercel.app/api/health
```

Deberías recibir:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-11-10T19:49:00.000Z"
}
```

## Características

✅ Frontend y Backend en un solo proyecto
✅ MongoDB Atlas integrado
✅ API serverless optimizada para Vercel
✅ Conexión a base de datos con caché
✅ CORS configurado
✅ Rate limiting
✅ Seguridad con Helmet
✅ Manejo de errores centralizado

## Notas Importantes

1. **MongoDB Connection**: La conexión usa caché para optimizar las funciones serverless
2. **CORS**: Configurado para aceptar todas las origenes (`*`). Cambia esto en producción
3. **JWT Secret**: Genera una clave segura para producción
4. **Rate Limiting**: 100 requests por 15 minutos por IP

## Troubleshooting

### Error de conexión a MongoDB
- Verifica que la IP de Vercel esté en la whitelist de MongoDB Atlas (usa `0.0.0.0/0` para permitir todas)
- Confirma que las credenciales sean correctas

### Error 404 en rutas de API
- Verifica que `vercel.json` esté en la raíz del proyecto
- Confirma que las rutas comiencen con `/api/`

### Frontend no carga
- Ejecuta `npm run build` localmente para verificar que no hay errores
- Revisa los logs de build en Vercel
