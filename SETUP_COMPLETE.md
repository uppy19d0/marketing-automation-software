# ✅ Configuración Completada - Marketing Automation Software

## 🎉 Tu proyecto está listo para desplegarse en Vercel

### 📦 Lo que se ha configurado:

#### 1. **Backend API Serverless** (`/api/index.ts`)
- ✅ Express API optimizada para Vercel
- ✅ Conexión a MongoDB Atlas con caché
- ✅ Todas las rutas del backend integradas
- ✅ Middleware de seguridad (Helmet, CORS, Rate Limiting)

#### 2. **Frontend React** (`/src`)
- ✅ Configuración de API (`src/config/api.ts`)
- ✅ Servicios para todas las entidades:
  - `authService` - Autenticación
  - `contactService` - Gestión de contactos
  - `campaignService` - Campañas de marketing
  - `segmentService` - Segmentación
  - `landingPageService` - Landing pages
- ✅ Context API para autenticación (`AuthContext`)
- ✅ Custom hooks (`useApi`)
- ✅ Componente de rutas protegidas

#### 3. **Configuración de Vercel**
- ✅ `vercel.json` configurado
- ✅ Variables de entorno documentadas
- ✅ Build scripts actualizados
- ✅ Routing para API y frontend

#### 4. **Dependencias**
- ✅ Todas las dependencias del backend agregadas
- ✅ TypeScript types instalados
- ✅ Package.json unificado

---

## 🚀 Pasos para Desplegar

### Opción 1: Despliegue Rápido con Vercel CLI

```bash
# 1. Instalar dependencias (si aún no lo has hecho)
npm install

# 2. Instalar Vercel CLI
npm install -g vercel

# 3. Desplegar
vercel

# 4. Para producción
vercel --prod
```

### Opción 2: Despliegue desde GitHub

1. Sube tu código a GitHub:
```bash
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

2. Ve a [vercel.com](https://vercel.com)
3. Haz clic en "New Project"
4. Importa tu repositorio de GitHub
5. Vercel detectará automáticamente la configuración
6. Agrega las variables de entorno (ver abajo)
7. Haz clic en "Deploy"

---

## 🔐 Variables de Entorno Requeridas

Configura estas variables en Vercel Dashboard → Settings → Environment Variables:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/marketing-automation?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=genera-una-clave-super-segura-aqui-cambiala

JWT_EXPIRE=30d

NODE_ENV=production

CORS_ORIGIN=*
```

### 🔑 Generar JWT_SECRET seguro:

```bash
# En tu terminal:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📡 Endpoints de la API

Una vez desplegado, tu API estará disponible en:

### Base URL
```
https://tu-dominio.vercel.app/api
```

### Endpoints Disponibles

**Autenticación:**
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Usuario actual
- `POST /api/auth/logout` - Cerrar sesión

**Contactos:**
- `GET /api/contacts` - Listar contactos
- `POST /api/contacts` - Crear contacto
- `GET /api/contacts/:id` - Obtener contacto
- `PUT /api/contacts/:id` - Actualizar contacto
- `DELETE /api/contacts/:id` - Eliminar contacto
- `POST /api/contacts/import` - Importar CSV

**Campañas:**
- `GET /api/campaigns` - Listar campañas
- `POST /api/campaigns` - Crear campaña
- `GET /api/campaigns/:id` - Obtener campaña
- `PUT /api/campaigns/:id` - Actualizar campaña
- `DELETE /api/campaigns/:id` - Eliminar campaña
- `POST /api/campaigns/:id/send` - Enviar campaña
- `GET /api/campaigns/:id/stats` - Estadísticas

**Segmentos:**
- `GET /api/segments` - Listar segmentos
- `POST /api/segments` - Crear segmento
- `GET /api/segments/:id` - Obtener segmento
- `PUT /api/segments/:id` - Actualizar segmento
- `DELETE /api/segments/:id` - Eliminar segmento
- `GET /api/segments/:id/contacts` - Contactos del segmento

**Landing Pages:**
- `GET /api/landing-pages` - Listar landing pages
- `POST /api/landing-pages` - Crear landing page
- `GET /api/landing-pages/:id` - Obtener landing page
- `PUT /api/landing-pages/:id` - Actualizar landing page
- `DELETE /api/landing-pages/:id` - Eliminar landing page
- `POST /api/landing-pages/:id/publish` - Publicar

**Health Check:**
- `GET /api/health` - Verificar estado del servidor

---

## 🧪 Probar el Despliegue

### 1. Health Check
```bash
curl https://tu-dominio.vercel.app/api/health
```

Respuesta esperada:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-11-10T20:00:00.000Z"
}
```

### 2. Registrar un Usuario
```bash
curl -X POST https://tu-dominio.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "company": "Test Company"
  }'
```

---

## 📁 Estructura del Proyecto

```
/
├── api/                          # Backend API (Serverless)
│   ├── index.ts                 # Punto de entrada de la API
│   └── tsconfig.json            # Config TypeScript para API
│
├── server/                       # Código backend original
│   └── src/
│       ├── config/              # Configuración DB
│       ├── models/              # Modelos MongoDB
│       ├── routes/              # Rutas API
│       ├── controllers/         # Controladores
│       └── middleware/          # Middleware
│
├── src/                         # Frontend React
│   ├── components/              # Componentes UI
│   │   ├── ui/                 # Componentes base
│   │   └── ProtectedRoute.tsx  # Protección de rutas
│   ├── contexts/               # Context API
│   │   ├── AuthContext.tsx    # Contexto de autenticación
│   │   └── LanguageContext.tsx
│   ├── config/                 # Configuración
│   │   └── api.ts             # Endpoints y helpers
│   ├── services/               # Servicios API
│   │   ├── authService.ts
│   │   ├── contactService.ts
│   │   ├── campaignService.ts
│   │   ├── segmentService.ts
│   │   ├── landingPageService.ts
│   │   └── index.ts
│   ├── hooks/                  # Custom hooks
│   │   └── useApi.ts
│   └── styles/                 # Estilos globales
│
├── dist/                        # Build del frontend (generado)
├── vercel.json                  # Configuración Vercel
├── package.json                 # Dependencias unificadas
├── .env.example                 # Ejemplo de variables
├── .vercelignore               # Archivos a ignorar
├── .npmrc                      # Configuración npm
│
└── Documentación/
    ├── README.md               # Documentación principal
    ├── DEPLOY_INSTRUCTIONS.md  # Instrucciones detalladas
    ├── VERCEL_DEPLOYMENT.md    # Guía de Vercel
    └── SETUP_COMPLETE.md       # Este archivo
```

---

## 🔧 Configuración MongoDB Atlas

### Permitir Conexiones desde Vercel:

1. Ve a [MongoDB Atlas](https://cloud.mongodb.com)
2. Selecciona tu cluster
3. Ve a **Network Access**
4. Haz clic en **Add IP Address**
5. Selecciona **Allow Access from Anywhere** (`0.0.0.0/0`)
6. Guarda los cambios

> **Nota:** En producción, considera restringir las IPs a las de Vercel específicamente.

---

## 💡 Uso de los Servicios en el Frontend

### Ejemplo: Autenticación

```typescript
import { useAuth } from './contexts/AuthContext';

function LoginComponent() {
  const { login, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password');
      // Usuario autenticado
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <button onClick={handleLogin}>
      Login
    </button>
  );
}
```

### Ejemplo: Obtener Contactos

```typescript
import { contactService } from './services';
import { useApi } from './hooks/useApi';

function ContactsList() {
  const { data, loading, execute } = useApi();

  useEffect(() => {
    execute(() => contactService.getContacts({ page: 1, limit: 50 }));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {data?.data.map(contact => (
        <div key={contact._id}>{contact.email}</div>
      ))}
    </div>
  );
}
```

### Ejemplo: Crear Campaña

```typescript
import { campaignService } from './services';

async function createCampaign() {
  try {
    const campaign = await campaignService.createCampaign({
      name: 'Welcome Campaign',
      subject: 'Welcome to our platform!',
      content: '<h1>Welcome!</h1>',
      type: 'email',
      status: 'draft'
    });
    console.log('Campaign created:', campaign);
  } catch (error) {
    console.error('Failed to create campaign:', error);
  }
}
```

---

## 🐛 Solución de Problemas Comunes

### Error: "Cannot connect to MongoDB"
- ✅ Verifica que `MONGODB_URI` esté correctamente configurada
- ✅ Asegúrate de que la IP `0.0.0.0/0` esté en la whitelist de MongoDB Atlas
- ✅ Confirma que las credenciales sean correctas

### Error: "Module not found"
- ✅ Ejecuta `npm install` en la raíz del proyecto
- ✅ Verifica que todas las dependencias estén en `package.json`
- ✅ Limpia caché: `rm -rf node_modules package-lock.json && npm install`

### Frontend no se conecta al backend
- ✅ En desarrollo: Backend debe estar en `localhost:5000`
- ✅ En producción: Las rutas son relativas (`/api/*`)
- ✅ Verifica CORS en la configuración del backend

### Build falla en Vercel
- ✅ Revisa los logs en Vercel Dashboard
- ✅ Asegúrate de que no haya errores de TypeScript
- ✅ Verifica que `vercel.json` esté en la raíz

### JWT Token inválido
- ✅ Genera un nuevo `JWT_SECRET` seguro
- ✅ Asegúrate de que esté configurado en Vercel
- ✅ Verifica que el token se esté enviando en el header `Authorization`

---

## 📊 Características de Seguridad

- ✅ **Helmet**: Headers de seguridad HTTP
- ✅ **Rate Limiting**: 100 requests por 15 minutos por IP
- ✅ **CORS**: Configurado para permitir origenes específicos
- ✅ **JWT**: Autenticación con tokens seguros
- ✅ **Bcrypt**: Hashing de contraseñas
- ✅ **Validación**: Express-validator para inputs

---

## 🎯 Próximos Pasos

1. **Desplegar en Vercel** siguiendo las instrucciones arriba
2. **Configurar variables de entorno** en Vercel Dashboard
3. **Probar los endpoints** con el health check
4. **Integrar el frontend** con los servicios creados
5. **Personalizar** según tus necesidades

---

## 📚 Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)

---

## 🎉 ¡Felicidades!

Tu aplicación de Marketing Automation está completamente configurada y lista para desplegarse en Vercel con MongoDB Atlas.

**Todo está integrado en un solo proyecto:**
- ✅ Frontend React moderno
- ✅ Backend API serverless
- ✅ MongoDB Atlas
- ✅ Autenticación JWT
- ✅ Servicios completos
- ✅ TypeScript en todo el stack

**¡Solo falta desplegar!** 🚀
