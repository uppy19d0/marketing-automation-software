# 🚀 Instrucciones de Despliegue Rápido en Vercel

## Pasos para Desplegar

### 1. Preparar el Proyecto
```bash
# Asegúrate de que las dependencias estén instaladas
npm install
```

### 2. Configurar Variables de Entorno en Vercel

Ve a tu proyecto en Vercel Dashboard → Settings → Environment Variables y agrega:

```
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/marketing-automation?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=tu-clave-secreta-super-segura-cambiala-en-produccion
JWT_EXPIRE=30d
NODE_ENV=production
CORS_ORIGIN=*
```

### 3. Desplegar

#### Opción A: Desde la Terminal
```bash
# Instalar Vercel CLI si no lo tienes
npm install -g vercel

# Desplegar
vercel

# Para producción
vercel --prod
```

#### Opción B: Desde GitHub
1. Sube tu código a GitHub
2. Conecta el repositorio en vercel.com
3. Vercel detectará automáticamente la configuración
4. Agrega las variables de entorno
5. Haz clic en "Deploy"

### 4. Verificar el Despliegue

Una vez desplegado, prueba estos endpoints:

```bash
# Health check
curl https://tu-app.vercel.app/api/health

# Debería responder:
# {"success":true,"message":"Server is running","timestamp":"..."}
```

## 📁 Estructura del Proyecto

```
/
├── api/                    # Backend API (Serverless)
│   └── index.ts           # Punto de entrada de la API
├── server/                # Código del backend original
│   └── src/
│       ├── models/        # Modelos de MongoDB
│       ├── routes/        # Rutas de la API
│       ├── controllers/   # Controladores
│       └── middleware/    # Middleware
├── src/                   # Frontend React
│   ├── components/        # Componentes UI
│   ├── config/           # Configuración (API endpoints)
│   ├── services/         # Servicios (auth, etc.)
│   └── hooks/            # Custom hooks
├── dist/                  # Build del frontend (generado)
├── vercel.json           # Configuración de Vercel
└── package.json          # Dependencias unificadas
```

## 🔧 Configuración MongoDB Atlas

Asegúrate de que MongoDB Atlas permita conexiones desde Vercel:

1. Ve a MongoDB Atlas → Network Access
2. Agrega `0.0.0.0/0` a la whitelist (permite todas las IPs)
3. O agrega las IPs específicas de Vercel

## 📡 Endpoints Disponibles

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual
- `POST /api/auth/logout` - Cerrar sesión

### Contactos
- `GET /api/contacts` - Listar contactos
- `POST /api/contacts` - Crear contacto
- `GET /api/contacts/:id` - Obtener contacto
- `PUT /api/contacts/:id` - Actualizar contacto
- `DELETE /api/contacts/:id` - Eliminar contacto
- `POST /api/contacts/import` - Importar contactos (CSV)

### Campañas
- `GET /api/campaigns` - Listar campañas
- `POST /api/campaigns` - Crear campaña
- `GET /api/campaigns/:id` - Obtener campaña
- `PUT /api/campaigns/:id` - Actualizar campaña
- `DELETE /api/campaigns/:id` - Eliminar campaña
- `POST /api/campaigns/:id/send` - Enviar campaña

### Segmentos
- `GET /api/segments` - Listar segmentos
- `POST /api/segments` - Crear segmento
- `GET /api/segments/:id` - Obtener segmento
- `PUT /api/segments/:id` - Actualizar segmento
- `DELETE /api/segments/:id` - Eliminar segmento

### Landing Pages
- `GET /api/landing-pages` - Listar landing pages
- `POST /api/landing-pages` - Crear landing page
- `GET /api/landing-pages/:id` - Obtener landing page
- `PUT /api/landing-pages/:id` - Actualizar landing page
- `DELETE /api/landing-pages/:id` - Eliminar landing page
- `POST /api/landing-pages/:id/publish` - Publicar landing page

## 🔐 Seguridad

- ✅ Helmet para headers de seguridad
- ✅ Rate limiting (100 req/15min por IP)
- ✅ CORS configurado
- ✅ JWT para autenticación
- ✅ Bcrypt para passwords

## 🐛 Solución de Problemas

### Error: "Cannot connect to MongoDB"
- Verifica las credenciales en `MONGODB_URI`
- Asegúrate de que la IP esté en la whitelist de MongoDB Atlas
- Revisa que el nombre de la base de datos sea correcto

### Error: "Module not found"
- Ejecuta `npm install` en la raíz del proyecto
- Verifica que `package.json` tenga todas las dependencias

### Frontend no se conecta al backend
- En desarrollo: Asegúrate de que el backend esté corriendo en `localhost:5001`
- En producción: Las rutas de API son relativas (`/api/*`)

### Build falla en Vercel
- Revisa los logs de build en Vercel Dashboard
- Asegúrate de que no haya errores de TypeScript
- Verifica que todas las dependencias estén en `package.json`

## 📝 Notas Importantes

1. **Conexión MongoDB**: Usa caché para optimizar funciones serverless
2. **CORS**: Configurado para `*` (todas las origenes). Cambia en producción
3. **JWT Secret**: Genera una clave segura y única para producción
4. **Rate Limiting**: Protege contra ataques DDoS

## 🎉 ¡Listo!

Tu aplicación de Marketing Automation está lista para usar en Vercel con:
- ✅ Frontend React moderno
- ✅ Backend API serverless
- ✅ MongoDB Atlas integrado
- ✅ Autenticación JWT
- ✅ Todo en un solo proyecto
