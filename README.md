# Marketing Automation Software

Sistema completo de automatización de marketing con frontend moderno y backend API robusto.

Diseño original en Figma: https://www.figma.com/design/OT3R3QaPCmFg6vTvTmYYo4/Marketing-Automation-Software

## 🎯 Características Principales

### Frontend
- ✅ Dashboard con métricas en tiempo real
- ✅ Gestión completa de contactos con importación CSV
- ✅ Constructor de campañas de email con A/B testing
- ✅ Landing pages personalizables
- ✅ Segmentación dinámica de contactos
- ✅ Automatizaciones de marketing
- ✅ Reportes y analytics
- ✅ Soporte multi-idioma (ES/EN)
- ✅ Modo oscuro/claro

### Backend
- ✅ API RESTful con Express + TypeScript
- ✅ Base de datos MongoDB con Mongoose
- ✅ Autenticación JWT
- ✅ Sistema de roles y permisos
- ✅ Seguimiento de eventos
- ✅ Rate limiting y seguridad
- ✅ Documentación completa

## 🛠️ Stack Tecnológico

### Frontend
- React 18.3.1 + TypeScript
- Vite 6.4.1
- Radix UI components
- Tailwind CSS
- Recharts para gráficos
- React Hook Form

### Backend
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT para autenticación
- Bcrypt para passwords
- Helmet para seguridad

## 🚀 Despliegue en Vercel

Este proyecto está configurado para desplegarse fácilmente en Vercel con MongoDB Atlas.

### Despliegue Rápido

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno en Vercel:**
   - `MONGODB_URI`: Tu conexión de MongoDB Atlas
   - `JWT_SECRET`: Clave secreta para JWT
   - `NODE_ENV`: production
   - `CORS_ORIGIN`: * (o tu dominio)

3. **Desplegar:**
```bash
vercel
```

Ver [DEPLOY_INSTRUCTIONS.md](./DEPLOY_INSTRUCTIONS.md) para instrucciones detalladas.

## 🚀 Inicio Rápido (Desarrollo Local)

### Prerequisitos
- Node.js >= 18.x
- MongoDB >= 6.x
- npm o yarn

### 1. Instalar Dependencias

```bash
# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd server
npm install
cd ..
```

### 2. Configurar MongoDB

**Opción A: MongoDB Local**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Opción B: MongoDB Atlas (Cloud)**
1. Crear cuenta en https://www.mongodb.com/atlas
2. Crear cluster gratuito
3. Obtener connection string
4. Actualizar `server/.env`

### 3. Configurar Variables de Entorno

```bash
# Backend
cd server
cp .env.example .env
# Editar .env con tus valores
cd ..
```

### 4. Ejecutar el Proyecto

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
El backend estará en: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
npm run dev
```
El frontend estará en: http://localhost:3000

## 📝 Configuración Inicial

### Crear Usuario Administrador

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123",
    "name": "Admin User"
  }'
```

## 📚 Documentación

- **Backend API**: Ver [server/README.md](server/README.md)
- **Modelos de datos**: Documentados en cada modelo en `server/src/models/`
- **Endpoints**: Lista completa en la documentación del servidor

## 📊 Estructura del Proyecto

```
marketing-automation-software/
├── src/                        # Frontend (React + Vite)
│   ├── components/            # Componentes de React
│   │   ├── ui/               # Componentes UI (Radix)
│   │   ├── Dashboard.tsx
│   │   ├── Contacts.tsx
│   │   ├── Campaigns.tsx
│   │   └── ...
│   └── contexts/             # React Context
├── server/                    # Backend (Node.js + Express)
│   ├── src/
│   │   ├── models/           # Modelos de MongoDB
│   │   ├── controllers/      # Controladores de la API
│   │   ├── routes/           # Rutas de la API
│   │   └── middleware/       # Auth, errors
│   └── README.md             # Documentación del backend
└── README.md                  # Este archivo
```

## 🔐 Autenticación

La API usa JWT. Para hacer requests autenticados:

1. Login para obtener token
2. Incluir token en header: `Authorization: Bearer TOKEN`

Ver documentación completa en [server/README.md](server/README.md)

## 🎨 Desarrollo

### Scripts Frontend
```bash
npm run dev          # Modo desarrollo
npm run build        # Build para producción
```

### Scripts Backend
```bash
cd server
npm run dev          # Modo desarrollo con nodemon
npm run build        # Compilar TypeScript
npm start            # Ejecutar producción
```

## 🚀 Despliegue

### Frontend
- Vercel, Netlify u otro hosting estático
- Build: `npm run build`
- Deploy carpeta `dist/`

### Backend
- Railway, Render, DigitalOcean
- Configurar MongoDB Atlas
- Establecer variables de entorno

## 📄 Licencia

Este proyecto es privado y confidencial.

---

Para más información, consulta la documentación del backend en [server/README.md](server/README.md)