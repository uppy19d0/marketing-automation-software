# Marketing Automation Backend API

Backend API para el sistema de automatización de marketing construido con Node.js, Express, TypeScript y MongoDB.

## 🚀 Características

- **Autenticación JWT** - Sistema completo de registro y login
- **Gestión de Contactos** - CRUD completo con importación CSV
- **Campañas de Email** - Creación, envío y seguimiento de campañas
- **Landing Pages** - Constructor de páginas de aterrizaje
- **Segmentación** - Segmentos dinámicos y estáticos
- **Automatizaciones** - Workflows automatizados
- **Analytics** - Seguimiento de eventos y métricas

## 📋 Requisitos Previos

- Node.js >= 18.x
- MongoDB >= 6.x
- npm o yarn

## 🛠️ Instalación

1. **Instalar dependencias**
```bash
cd server
npm install
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/marketing-automation
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
CORS_ORIGIN=http://localhost:3000
```

3. **Iniciar MongoDB**
```bash
# macOS (con Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# O usa MongoDB Atlas (cloud)
```

4. **Ejecutar el servidor**
```bash
# Modo desarrollo (con hot reload)
npm run dev

# Build para producción
npm run build

# Ejecutar producción
npm start
```

## 📚 Estructura del Proyecto

```
server/
├── src/
│   ├── config/
│   │   └── database.ts          # Configuración de MongoDB
│   ├── models/
│   │   ├── User.ts              # Modelo de usuarios
│   │   ├── Contact.ts           # Modelo de contactos
│   │   ├── Campaign.ts          # Modelo de campañas
│   │   ├── LandingPage.ts       # Modelo de landing pages
│   │   ├── Segment.ts           # Modelo de segmentos
│   │   ├── Automation.ts        # Modelo de automatizaciones
│   │   ├── Event.ts             # Modelo de eventos
│   │   └── CustomField.ts       # Campos personalizados
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── contactController.ts
│   │   ├── campaignController.ts
│   │   ├── segmentController.ts
│   │   └── landingPageController.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── contactRoutes.ts
│   │   ├── campaignRoutes.ts
│   │   ├── segmentRoutes.ts
│   │   └── landingPageRoutes.ts
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication
│   │   └── errorHandler.ts      # Error handling
│   └── server.ts                # Entry point
├── .env                          # Variables de entorno (no commitear)
├── .env.example                  # Ejemplo de variables
├── package.json
├── tsconfig.json
└── nodemon.json
```

## 🔐 API Endpoints

### Authentication

```http
POST   /api/auth/register        # Registrar nuevo usuario
POST   /api/auth/login           # Login
GET    /api/auth/me              # Obtener usuario actual
PUT    /api/auth/preferences     # Actualizar preferencias
```

### Contacts

```http
GET    /api/contacts             # Listar contactos (con filtros)
POST   /api/contacts             # Crear contacto
GET    /api/contacts/:id         # Obtener contacto específico
PUT    /api/contacts/:id         # Actualizar contacto
DELETE /api/contacts/:id         # Eliminar contacto
POST   /api/contacts/import      # Importar desde CSV
POST   /api/contacts/bulk-tag    # Asignación masiva de tags
```

**Query params para GET /api/contacts:**
- `page` - Número de página (default: 1)
- `limit` - Resultados por página (default: 50)
- `search` - Buscar por nombre o email
- `tags` - Filtrar por tags (separados por coma)
- `country` - Filtrar por país
- `status` - Filtrar por status (subscribed, unsubscribed, bounced)

### Campaigns

```http
GET    /api/campaigns            # Listar campañas
POST   /api/campaigns            # Crear campaña
GET    /api/campaigns/:id        # Obtener campaña
PUT    /api/campaigns/:id        # Actualizar campaña
DELETE /api/campaigns/:id        # Eliminar campaña
POST   /api/campaigns/:id/send   # Enviar campaña
GET    /api/campaigns/:id/stats  # Estadísticas de campaña
```

### Segments

```http
GET    /api/segments             # Listar segmentos
POST   /api/segments             # Crear segmento
GET    /api/segments/:id         # Obtener segmento
PUT    /api/segments/:id         # Actualizar segmento
DELETE /api/segments/:id         # Eliminar segmento
GET    /api/segments/:id/contacts # Contactos del segmento
POST   /api/segments/preview     # Vista previa de segmento
```

### Landing Pages

```http
GET    /api/landing-pages                  # Listar (requiere auth)
POST   /api/landing-pages                  # Crear (requiere auth)
GET    /api/landing-pages/:id              # Obtener por ID (requiere auth)
PUT    /api/landing-pages/:id              # Actualizar (requiere auth)
DELETE /api/landing-pages/:id              # Eliminar (requiere auth)
GET    /api/landing-pages/slug/:slug       # Obtener por slug (público)
POST   /api/landing-pages/:id/submit       # Enviar formulario (público)
```

## 🔑 Autenticación

La API usa JWT (JSON Web Tokens) para autenticación.

**Para hacer requests autenticados:**

1. Login o registro para obtener token:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

2. Incluir el token en el header Authorization:
```bash
curl http://localhost:5000/api/contacts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📊 Modelos de Datos

### Contact
```typescript
{
  email: string;           // Único, requerido
  firstName: string;
  lastName: string;
  tags: string[];         // Array de tags
  country: string;
  city: string;
  score: number;          // 0-100
  customFields: Map;      // Campos personalizados
  segments: ObjectId[];   // Referencias a segmentos
  status: string;         // subscribed, unsubscribed, bounced
}
```

### Campaign
```typescript
{
  name: string;
  subject: string;
  preheader: string;
  content: {
    html: string;
    blocks: Array;
  };
  isABTest: boolean;
  variants: Array;
  segmentId: ObjectId;
  status: string;         // draft, scheduled, sent, sending
  stats: {
    sent: number;
    opens: number;
    clicks: number;
    // ... más métricas
  };
}
```

### LandingPage
```typescript
{
  name: string;
  slug: string;           // Único, para URL
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  formFields: Object;     // Configuración del formulario
  styling: Object;        // Colores, estilos
  seo: Object;           // Meta tags
  status: string;         // published, draft, archived
  stats: Object;         // Visitas, conversiones
}
```

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén implementados)
npm test

# Health check
curl http://localhost:5000/api/health
```

## 🚀 Despliegue

### Preparar para producción

1. Construir el proyecto:
```bash
npm run build
```

2. Configurar variables de entorno de producción

3. Usar un process manager como PM2:
```bash
npm install -g pm2
pm2 start dist/server.js --name marketing-api
```

### Servicios recomendados

- **Database**: MongoDB Atlas (https://www.mongodb.com/atlas)
- **Hosting**: Railway, Render, DigitalOcean, AWS
- **Email**: SendGrid, AWS SES, Mailgun

## 📝 Próximas Características

- [ ] Envío real de emails (integración SMTP/SendGrid)
- [ ] WebSockets para actualizaciones en tiempo real
- [ ] Sistema de automatizaciones completamente funcional
- [ ] Integración con servicios externos (Webhooks)
- [ ] Panel de analytics más detallado
- [ ] Sistema de plantillas de email
- [ ] A/B testing funcional
- [ ] Rate limiting por usuario
- [ ] Logs y monitoreo

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👥 Soporte

Para problemas o preguntas:
- Abrir un issue en GitHub
- Contactar al equipo de desarrollo

---

**Nota**: Este es un proyecto en desarrollo. Algunas características pueden no estar completamente implementadas.
