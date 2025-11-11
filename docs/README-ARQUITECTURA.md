# Vista Funcional del Sistema - Punto C
## Sistema de Automatización de Marketing

Este documento presenta la arquitectura funcional del sistema, describiendo los principales componentes y sus procesos básicos.

---

## Tabla de Contenidos

1. [Diagrama de Componentes](#diagrama-de-componentes)
2. [Descripción de Componentes](#descripción-de-componentes)
3. [Procesos Básicos](#procesos-básicos)
4. [Tabla de Componentes](#tabla-de-componentes)
5. [Cómo Visualizar los Diagramas](#cómo-visualizar-los-diagramas)

---

## Diagrama de Componentes

**Archivo:** `architecture-components.puml`

Este diagrama muestra la arquitectura completa del sistema con todos sus componentes principales y sus relaciones:

### Actores del Sistema
- **Administrador**: Gestiona la configuración del sistema, usuarios y permisos
- **Usuario Marketing**: Crea y gestiona campañas, contactos, landing pages y automatizaciones
- **Visitante Web**: Interactúa con landing pages públicas

### Componentes Principales

#### 1. Frontend (React + TypeScript)
- **Portal Web**: Interfaz de usuario principal
  - Dashboard con métricas clave
  - Gestión de contactos (importación, exportación, búsqueda)
  - Creación y envío de campañas
  - Editor de landing pages
  - Constructor de segmentos dinámicos
  - Editor visual de automatizaciones
  - Dashboards de analytics

#### 2. Backend (Node.js + Express)
- **API REST**: Gateway principal para todas las operaciones
  - Auth Service: Autenticación JWT y gestión de sesiones
  - Contact Service: CRUD de contactos e importación masiva
  - Campaign Service: Gestión de campañas de email
  - Segment Service: Evaluación dinámica de segmentos
  - Landing Page Service: Publicación y tracking de conversiones
  - Automation Service: Gestión de workflows

- **Motor de Reglas**: Evaluación de condiciones y criterios
  - Evaluador de Segmentos: Procesa reglas dinámicas para filtrar contactos
  - Procesador de Workflows: Ejecuta acciones condicionales

- **Programador de Tareas**: Ejecución diferida y cron jobs
  - Cron Jobs: Tareas periódicas (agregación de métricas, limpieza)
  - Queue Manager: Cola de trabajos asíncronos (envío masivo)

- **Motor de Plantillas**: Personalización de contenido
  - Email Templates: Renderizado con variables dinámicas
  - Landing Templates: Generación de páginas personalizadas

- **Notificador**: Sistema de envío multicanal
  - Email Service: Integración SMTP con rate limiting
  - SMS Service: Gateway para mensajes de texto

#### 3. Persistencia (MongoDB)
Base de datos NoSQL con esquemas flexibles:
- **Users**: Cuentas de usuario con roles y preferencias
- **Contacts**: Información de leads y clientes
- **Campaigns**: Campañas de email con contenido y programación
- **Segments**: Definiciones de segmentos con reglas dinámicas
- **Landing Pages**: Configuración de páginas de captura
- **Workflows**: Definiciones de automatizaciones
- **Analytics**: Eventos, métricas agregadas y reportes

#### 4. Servicios Externos
- **SMTP Server**: Servidor de correo para envío masivo
- **SMS Gateway**: Proveedor de mensajería SMS
- **CDN/Storage**: Almacenamiento de imágenes y assets

### Comunicación entre Componentes

- **Frontend ↔ Backend**: HTTP/REST con JSON, autenticación JWT Bearer
- **Backend ↔ Database**: Mongoose ODM con queries MongoDB
- **Backend ↔ Servicios Externos**: APIs REST/SMTP

---

## Descripción de Componentes

### Tabla de Componentes

| Componente | Responsabilidad | Entradas | Salidas | Interfaces |
|------------|----------------|----------|---------|------------|
| **Portal Web** | Interfaz de usuario para gestión de marketing | Interacciones usuario, eventos UI | Requests HTTP a API | REST API (JSON) |
| **API REST** | Gateway y orquestación de servicios | HTTP requests con JWT | Responses JSON, status codes | Express routes, Middleware chain |
| **Auth Service** | Autenticación y autorización | Credenciales usuario | JWT tokens, user sessions | POST /api/auth/login, /register |
| **Contact Service** | Gestión de contactos | CSV files, contact data | Listas contactos, import reports | GET/POST /api/contacts |
| **Campaign Service** | Creación y envío de campañas | Campaign data, segment IDs | Campaign stats, send reports | POST /api/campaigns/:id/send |
| **Segment Service** | Segmentación dinámica | Reglas/filtros, contact queries | Listas contactos filtradas | POST /api/segments |
| **Landing Service** | Publicación de landing pages | Landing config, form submissions | Slug URLs, conversion data | GET /api/landing-pages/:slug |
| **Automation Service** | Workflows automatizados | Workflow definitions, triggers | Execution logs, stats | POST /api/workflows |
| **Motor de Reglas** | Evaluación de condiciones | Rules JSON, contact data | Boolean results, matched contacts | JavaScript evaluation engine |
| **Programador** | Ejecución diferida | Job definitions, cron expressions | Execution callbacks | Node-cron, Queue system |
| **Motor Plantillas** | Renderizado personalizado | Templates, variable data | HTML/text renderizado | Handlebars, variable interpolation |
| **Notificador** | Envío multicanal | Messages, recipient lists | Delivery status, tracking IDs | SMTP client, SMS API |
| **MongoDB** | Persistencia de datos | CRUD operations, queries | Documents JSON | Mongoose ODM, Aggregation pipeline |

---

## Procesos Básicos

El sistema implementa 6 procesos principales que cubren todo el ciclo de vida del marketing automation:

### Proceso 1: Autenticación y Gestión de Usuarios
**Archivo:** `process-authentication.puml`

**Actor:** Usuario
**Disparador:** Acceso a la aplicación

**Pasos clave:**
1. **Registro**: Usuario envía datos → Sistema valida unicidad email → Hash password con bcrypt → Crea documento en DB → Genera JWT token
2. **Login**: Usuario envía credenciales → Sistema busca por email → Compara password hasheado → Genera JWT con expiración → Retorna token + datos usuario
3. **Verificación de sesión**: Request con Bearer token → Sistema decodifica JWT → Valida expiración → Retorna datos usuario o error 401

**Resultado:** Token JWT válido almacenado en localStorage del navegador

---

### Proceso 2: Gestión de Contactos
**Archivo:** `process-contact-management.puml`

**Actor:** Usuario Marketing
**Disparador:** Importación de CSV o creación manual

**Pasos clave:**
1. **Importación CSV**:
   - Usuario sube archivo → Parse y validación formato → Preview primeras filas
   - Usuario mapea columnas CSV a campos del sistema
   - Sistema procesa cada fila: valida email, busca duplicados
   - Decide estrategia: crear nuevo o actualizar existente
   - Genera reporte: total, creados, actualizados, errores

2. **Segmentación Dinámica**:
   - Usuario define reglas (ej: email contains "@gmail.com", tags includes "cliente")
   - Sistema valida sintaxis de reglas
   - Guarda segmento en DB
   - Al solicitar contactos: construye query MongoDB dinámico
   - Retorna contactos que cumplen criterios en tiempo real

**Resultado:** Base de contactos organizada y segmentada dinámicamente

---

### Proceso 3: Creación y Ejecución de Campañas
**Archivo:** `process-campaign-execution.puml`

**Actor:** Usuario Marketing
**Disparador:** Crear nueva campaña

**Pasos clave:**
1. **Creación**: Usuario completa nombre, asunto, contenido HTML, selecciona segmento → Sistema valida campos → Guarda como 'draft'

2. **Programación**: Usuario define fecha/hora de envío → Sistema valida destinatarios y contenido → Actualiza status a 'scheduled' → Registra job en Scheduler

3. **Ejecución automática** (en fecha programada):
   - Scheduler dispara campaña
   - Sistema obtiene contactos del segmento
   - Para cada contacto:
     - Renderiza template con variables personalizadas ({{nombre}}, {{empresa}})
     - Inserta tracking pixel para aperturas
     - Wrappea links con URLs de tracking
     - Envía vía SMTP
     - Registra log de envío (success/error)
   - Actualiza status a 'sent' con totalSent

4. **Tracking**: Sistema registra aperturas (pixel) y clicks (redirect URLs) → Calcula tasas → Muestra en dashboard

**Resultado:** Campaña enviada con tracking completo de engagement

---

### Proceso 4: Landing Pages
**Archivo:** `process-landing-pages.puml`

**Actor:** Usuario Marketing (creación), Visitante Web (conversión)
**Disparador:** Crear landing page o visitar URL pública

**Pasos clave:**
1. **Creación**:
   - Usuario configura título, descripción, campos formulario, estilos CSS, SEO metadata
   - Editor muestra preview en tiempo real
   - Sistema genera slug único (ej: "mi-landing-page")
   - Guarda como 'draft'

2. **Publicación**:
   - Sistema valida: tiene título, formulario, CTA, metadata SEO
   - Actualiza status a 'published' con timestamp
   - Retorna URL pública: `/lp/{slug}`

3. **Visita**:
   - Visitante accede a `/lp/{slug}`
   - Sistema busca landing por slug con status 'published'
   - Incrementa stats.visits
   - Renderiza con estilos custom y formulario dinámico

4. **Conversión**:
   - Visitante completa formulario y acepta GDPR
   - Sistema valida datos (email válido, campos requeridos)
   - Crea o actualiza contacto con tag de landing page
   - Incrementa stats.submissions y recalcula conversionRate
   - Muestra página de éxito con successMessage

**Resultado:** Lead capturado y agregado automáticamente a base de contactos

---

### Proceso 5: Automatizaciones (Workflows)
**Archivo:** `process-workflows.puml`

**Actor:** Usuario Marketing (configuración), Sistema (ejecución)
**Disparador:** Evento del sistema (ej: nuevo contacto, email abierto)

**Pasos clave:**
1. **Creación de workflow**:
   - Usuario define en editor visual: trigger, condiciones, acciones secuenciales
   - Sistema valida estructura (no ciclos infinitos, acciones soportadas)
   - Registra listeners para el trigger especificado
   - Activa workflow

2. **Disparo por evento**:
   - Evento ocurre en sistema (ej: 'contact.created')
   - Sistema busca workflows activos con ese trigger
   - Motor de Reglas evalúa condiciones para cada workflow
   - Si cumplen: crea workflow instance y programa primera acción

3. **Ejecución de acciones** (automatizada):
   - Scheduler ejecuta acción cuando llega su momento
   - Tipos de acciones:
     - **Send Email**: Renderiza template y envía vía Notifier
     - **Add Tag**: Actualiza array de tags del contacto
     - **Change Segment**: Mueve contacto a otro segmento
     - **Wait**: Delay hasta próxima acción (minutos/horas/días)
     - **Webhook**: POST HTTP a URL externa
   - Sistema registra log de cada acción ejecutada
   - Programa siguiente acción con su delay
   - Cuando termina última acción: marca instance como 'completed'

**Ejemplo - Workflow de Bienvenida:**
```
Trigger: Nuevo contacto creado
Condición: source = 'landing-page'
Acciones:
  1. Esperar 5 minutos
  2. Enviar email bienvenida
  3. Esperar 24 horas
  4. Enviar email seguimiento
  5. Añadir tag "onboarding-complete"
```

**Resultado:** Secuencias automatizadas que nutren leads sin intervención manual

---

### Proceso 6: Analytics y Seguimiento
**Archivo:** `process-analytics.puml`

**Actor:** Destinatario Email (genera eventos), Usuario Marketing (consume métricas)
**Disparador:** Apertura de email, click en link, acceso a dashboard

**Pasos clave:**
1. **Registro de apertura**:
   - Email contiene pixel 1x1 transparente: `<img src="/track/open/{trackingId}.png">`
   - Cliente de email carga imagen
   - Sistema decodifica trackingId → obtiene campaignId + contactId
   - Verifica si es primera apertura (evita duplicados)
   - Registra evento, incrementa stats, actualiza lastInteraction del contacto

2. **Registro de clicks**:
   - Links en email están "wrapped": `/track/click/{linkId}?url={originalUrl}`
   - Usuario hace click
   - Sistema decodifica linkId, registra evento de click
   - Incrementa stats y engagementScore del contacto (+5 puntos)
   - Redirige (302) a URL original

3. **Agregación de métricas** (cron job diario):
   - Sistema procesa eventos de últimas 24h
   - Calcula métricas por campaña:
     - Open Rate = (unique opens / sent) × 100
     - CTR = (unique clicks / unique opens) × 100
     - Bounce rate
   - Calcula engagementScore por contacto:
     - Email open: +2 pts
     - Link click: +5 pts
     - Form submit: +10 pts
     - Decay: -1 pt/día sin interacción
   - Guarda agregados diarios para reportes

4. **Visualización de dashboard**:
   - Usuario accede a Analytics
   - Sistema obtiene datos agregados del período (ej: últimos 30 días)
   - Calcula KPIs: total contactos, campañas enviadas, tasas promedio
   - Genera series temporales para gráficas
   - Identifica top campañas y contactos más engaged

5. **Generación de reportes**:
   - Usuario solicita reporte de campaña específica
   - Sistema compila: info campaña, eventos, stats, top links, distribución geográfica
   - Genera documento PDF con gráficas y recomendaciones

**Resultado:** Visibilidad completa del rendimiento de campañas y engagement de contactos

---

## Flujo de Datos entre Procesos

Los 6 procesos están interconectados:

```
[Autenticación] → Valida acceso a todos los demás procesos

[Gestión Contactos] → Provee destinatarios para [Campañas]
                   → Provee audiencias para [Landing Pages]
                   → Provee sujetos para [Workflows]

[Campañas] → Genera eventos para [Analytics]
           → Puede disparar [Workflows] (trigger: email_opened)

[Landing Pages] → Crea contactos en [Gestión Contactos]
                → Genera eventos para [Analytics]
                → Puede disparar [Workflows] (trigger: form_submitted)

[Workflows] → Ejecuta acciones sobre [Gestión Contactos]
            → Envía campañas mediante [Notificador]
            → Genera eventos para [Analytics]

[Analytics] → Consume eventos de todos los procesos
            → Provee insights para optimizar [Campañas] y [Workflows]
```

---

## Tecnologías y Patrones Utilizados

### Frontend
- **React 18**: Librería UI con hooks
- **TypeScript**: Tipado estático
- **Vite**: Build tool y dev server
- **shadcn/ui**: Componentes UI basados en Radix
- **React Query**: Cache y sincronización de datos
- **React Router**: Navegación SPA

### Backend
- **Node.js + Express**: Runtime y framework web
- **TypeScript**: Tipado estático en backend
- **Mongoose**: ODM para MongoDB
- **JWT**: Autenticación stateless
- **bcrypt**: Hashing de passwords
- **node-cron**: Tareas programadas
- **Nodemailer**: Cliente SMTP

### Database
- **MongoDB**: Base de datos NoSQL
- **Mongoose Schemas**: Validación y estructura
- **Aggregation Pipeline**: Queries complejas y reportes

### Deployment
- **Vercel**: Hosting serverless (frontend + API)
- **MongoDB Atlas**: Base de datos en la nube

### Patrones de Diseño
- **RESTful API**: Arquitectura stateless con recursos
- **Repository Pattern**: Abstracción de acceso a datos
- **Service Layer**: Lógica de negocio separada de controllers
- **Event-Driven**: Workflows disparados por eventos
- **Queue Pattern**: Procesamiento asíncrono de envíos masivos
- **Custom Hooks**: Encapsulación de lógica de estado (React)

---

## Cómo Visualizar los Diagramas

### Opción 1: Online (PlantUML Web)
1. Ve a http://www.plantuml.com/plantuml/uml/
2. Copia el contenido de cualquier archivo `.puml`
3. Pega en el editor
4. El diagrama se renderiza automáticamente

### Opción 2: VS Code
1. Instala la extensión "PlantUML" de jebbs
2. Abre cualquier archivo `.puml`
3. Presiona `Alt + D` para preview
4. O click derecho → "Preview Current Diagram"

### Opción 3: CLI (Generar imágenes)
```bash
# Instalar PlantUML (requiere Java)
brew install plantuml  # macOS
apt-get install plantuml  # Linux

# Generar PNG
plantuml docs/architecture-components.puml

# Generar SVG
plantuml -tsvg docs/process-authentication.puml

# Generar todos
plantuml docs/*.puml
```

---

## Lista de Archivos de Diagramas

1. **architecture-components.puml** - Diagrama de componentes completo
2. **process-authentication.puml** - Proceso de autenticación y gestión de usuarios
3. **process-contact-management.puml** - Proceso de gestión de contactos e importación
4. **process-campaign-execution.puml** - Proceso de creación y envío de campañas
5. **process-landing-pages.puml** - Proceso de landing pages y conversión
6. **process-workflows.puml** - Proceso de automatizaciones y workflows
7. **process-analytics.puml** - Proceso de analytics y tracking

---

## Resumen Ejecutivo

Este sistema de automatización de marketing está compuesto por:

- **3 actores principales**: Administrador, Usuario Marketing, Visitante Web
- **11 componentes principales** organizados en 4 capas: Frontend, Backend, Persistencia, Servicios Externos
- **6 procesos básicos** que cubren todo el ciclo: autenticación, gestión de contactos, campañas, landing pages, workflows y analytics
- **Arquitectura RESTful** con separación clara de responsabilidades
- **Flujo de datos event-driven** que permite automatizaciones complejas
- **Tracking completo** de engagement con métricas en tiempo real

El sistema permite a equipos de marketing capturar leads, segmentar audiencias, ejecutar campañas personalizadas y automatizar secuencias de nurturing, todo con visibilidad completa del rendimiento mediante analytics detallados.
