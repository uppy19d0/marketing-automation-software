# Configuración del Sistema de Login

## Usuario Administrador Base

El sistema ahora incluye autenticación funcional con las siguientes credenciales de administrador:

- **Email:** admin@unicaribe.edu.do
- **Password:** 123456
- **Rol:** admin

## Pasos para Configurar y Ejecutar

### 1. Configurar el Backend

```bash
cd server

# Copiar el archivo de configuración
cp .env.example .env

# Instalar dependencias (si no están instaladas)
npm install
```

**Nota:** El usuario administrador se crea automáticamente cuando el servidor se inicia por primera vez. No necesitas ejecutar ningún script adicional.

### 2. Iniciar el Servidor Backend

```bash
# En la carpeta server/
npm run dev
```

El servidor se ejecutará en `http://localhost:5000` y creará automáticamente el usuario administrador si no existe.

### 3. Iniciar el Frontend

```bash
# En la carpeta raíz del proyecto
npm run dev
```

El frontend se ejecutará en `http://localhost:5173` (o el puerto que Vite asigne)

### 4. Iniciar Sesión

1. Abre el navegador en la URL del frontend
2. Verás la pantalla de login
3. Ingresa las credenciales:
   - Email: `admin@unicaribe.edu.do`
   - Password: `123456`
4. Haz clic en "Iniciar sesión"

## Características Implementadas

### Frontend
- ✅ Componente de Login con formulario funcional
- ✅ Integración con AuthContext para manejo de estado de autenticación
- ✅ Protección de rutas (solo usuarios autenticados pueden acceder)
- ✅ Pantalla de carga mientras se verifica la autenticación
- ✅ Información del usuario en el header
- ✅ Funcionalidad de logout

### Backend
- ✅ Endpoints de autenticación (login, register, me)
- ✅ Modelo de Usuario con roles (admin, editor, viewer)
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Generación de tokens JWT
- ✅ Middleware de protección de rutas
- ✅ Seed automático de usuario administrador al iniciar el servidor

## Estructura de Archivos Nuevos/Modificados

```
src/
├── components/
│   └── Login.tsx                 # Nuevo: Componente de login
├── contexts/
│   └── AuthContext.tsx           # Ya existía: Contexto de autenticación
├── services/
│   └── authService.ts            # Actualizado: Servicio de autenticación
└── App.tsx                       # Actualizado: Integración de autenticación

server/
├── src/
│   ├── config/
│   │   └── database.ts           # Actualizado: Ejecuta seed automático
│   ├── utils/
│   │   └── seedDatabase.ts       # Nuevo: Función de seed automático
│   ├── scripts/
│   │   └── seedAdmin.ts          # Nuevo: Script manual (opcional)
│   ├── controllers/
│   │   └── authController.ts     # Ya existía: Controlador de auth
│   ├── models/
│   │   └── User.ts               # Ya existía: Modelo de usuario
│   └── routes/
│       └── authRoutes.ts         # Ya existía: Rutas de auth
└── package.json                  # Actualizado: Script seed:admin
```

## Requisitos Previos

- Node.js (v16 o superior)
- MongoDB (local o remoto)
- npm o yarn

## Solución de Problemas

### Error de conexión a MongoDB
Si ves un error de conexión a MongoDB, asegúrate de que:
1. MongoDB esté instalado y ejecutándose
2. La URL de conexión en `.env` sea correcta
3. El puerto 27017 esté disponible

### Error "Usuario ya existe"
El sistema verifica automáticamente si el usuario admin existe antes de crearlo. Si ya existe, simplemente mostrará un mensaje informativo y continuará normalmente. Esto es completamente normal y esperado en reinicios del servidor.

### Error de CORS
Si ves errores de CORS, verifica que:
1. El backend esté ejecutándose en el puerto 5000
2. La variable `CORS_ORIGIN` en `.env` apunte al frontend correcto

## Próximos Pasos

- [ ] Agregar recuperación de contraseña
- [ ] Implementar registro de nuevos usuarios
- [ ] Agregar autenticación de dos factores
- [ ] Implementar refresh tokens
