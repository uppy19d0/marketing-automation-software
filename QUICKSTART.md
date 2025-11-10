# 🚀 Inicio Rápido - Marketing Automation Software

## Resumen
Backend completo creado con Node.js + Express + MongoDB + TypeScript

## ⚡ Inicio en 3 Pasos

### 1. Instalar MongoDB

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**O usa MongoDB Atlas (Cloud):** https://www.mongodb.com/atlas

### 2. Configurar e Instalar

```bash
# Backend
cd server
npm install
cp .env.example .env
# Editar .env si es necesario

# Frontend (en otra terminal)
cd ..
npm install
```

### 3. Ejecutar

```bash
# Terminal 1 - Backend
cd server
npm run dev
# ✅ Backend en http://localhost:5000

# Terminal 2 - Frontend
npm run dev
# ✅ Frontend en http://localhost:3000
```

## 🔑 Primer Login

1. Ir a http://localhost:3000
2. El sistema te redirigirá al login/registro
3. Crear cuenta o usar la API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123",
    "name": "Admin"
  }'
```

## 📊 Estructura Creada

```
✅ Backend Completo:
   ├── 7 Modelos MongoDB (User, Contact, Campaign, etc.)
   ├── 5 Controladores con toda la lógica
   ├── 5 Rutas RESTful
   ├── Autenticación JWT
   ├── Middleware de seguridad
   └── Documentación completa

✅ API Endpoints:
   - /api/auth/*         (Login, Register)
   - /api/contacts/*     (CRUD + Import CSV)
   - /api/campaigns/*    (CRUD + Send + Stats)
   - /api/segments/*     (CRUD + Preview)
   - /api/landing-pages/* (CRUD + Submit Form)
```

## 🧪 Test Rápido

```bash
# Health check
curl http://localhost:5000/api/health

# Registrar usuario
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Login (guarda el token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Usar el token para crear un contacto
curl -X POST http://localhost:5000/api/contacts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "email":"contacto@example.com",
    "firstName":"Juan",
    "lastName":"Pérez",
    "country":"RD",
    "tags":["nuevo","lead"]
  }'
```

## 📚 Documentación

- **README Principal**: [README.md](README.md)
- **Backend Detallado**: [server/README.md](server/README.md)

## 🔧 Características del Backend

- ✅ Autenticación JWT con bcrypt
- ✅ Base de datos MongoDB con Mongoose
- ✅ Validación de datos
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Manejo de errores centralizado
- ✅ TypeScript con tipado completo
- ✅ Importación CSV de contactos
- ✅ Segmentación dinámica
- ✅ Tracking de eventos
- ✅ Sistema de roles (admin, editor, viewer)

## 🌐 Colecciones MongoDB

Al iniciar, MongoDB creará automáticamente estas colecciones:

- **users** - Usuarios del sistema
- **contacts** - Base de datos de contactos
- **campaigns** - Campañas de email
- **segments** - Segmentos de contactos
- **landingpages** - Landing pages
- **automations** - Automatizaciones
- **events** - Eventos de tracking
- **customfields** - Campos personalizados

## 🎯 Próximos Pasos

1. **Conectar Frontend con Backend**:
   - Crear servicio API en `src/services/api.ts`
   - Implementar contexto de autenticación
   - Reemplazar datos mock con llamadas reales

2. **Implementar Envío de Emails**:
   - Configurar SMTP o SendGrid
   - Crear servicio de emails
   - Implementar templates

3. **Agregar WebSockets**:
   - Para notificaciones en tiempo real
   - Dashboard updates live

## ❓ Troubleshooting

**MongoDB no conecta:**
```bash
# Verificar que MongoDB está corriendo
brew services list | grep mongodb  # macOS
sudo systemctl status mongodb      # Linux
```

**Puerto ocupado:**
```bash
# Cambiar puerto en server/.env
PORT=5001
```

**Errores de TypeScript:**
```bash
cd server
npm run build
```

## 📞 Soporte

Ver documentación completa en [README.md](README.md) y [server/README.md](server/README.md)

---

¡Listo para desarrollar! 🎉
