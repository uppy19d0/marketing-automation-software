# AutoMarketing – Local

Aplicación web de demostración para automatización de marketing **sin integraciones externas**. Todos los datos son locales y simulados.

## 🎨 Design System

### Tipografía
- **Familia:** Inter (sistema)
- **Jerarquías:**
  - H1: 32px / 500
  - H2: 24px / 500
  - H3: 20px / 500
  - Body: 16px / 400
  - Small: 14px / 400

### Colores
```css
--brand: #0EA5E9 (Cyan 500)
--brand-600: #0284C7 (Cyan 600)
--success: #10B981 (Emerald 500)
--warning: #F59E0B (Amber 500)
--error: #EF4444 (Red 500)
--ink: #111827 (Gray 900)
```

### Grid System
- Sistema base de 8pt para espaciado consistente
- Componentes diseñados con Auto Layout
- Variables de color y tipografía reutilizables

## 📱 Responsive Design

- **Desktop:** 1440px (óptimo)
- **Tablet:** 1024px (sidebar fijo)
- **Móvil:** 375px (sidebar colapsable, menú hamburguesa)

## 🧩 Estructura de Páginas

### 1. Dashboard
- KPIs: Contactos totales, Nuevos hoy, Tasa de apertura, CTR
- Gráfico: Aperturas vs Clics (últimos 7 días)
- Card de Prueba A/B activa
- Timeline de eventos recientes

### 2. Contactos (CRUD completo)
- Tabla con búsqueda y filtros
- Importar CSV con mapeo de columnas
- Acciones masivas (asignar tags, eliminar)
- Slide-over con detalle y timeline de eventos

### 3. Segmentos
- Constructor visual de reglas (AND/OR)
- Vista previa con conteo dinámico
- Segmentos dinámicos y estáticos

### 4. Campañas
- **Wizard de 4 pasos:**
  1. Detalles (nombre, asunto, preheader, remitente)
  2. Contenido (editor por bloques, variables)
  3. Audiencia (selección de segmentos)
  4. Revisión y Programación
- **A/B Testing** (variantes de asunto/cuerpo)
- **Panel IA Local** con sugerencias y score de copy

### 5. Landing Pages
- 2 templates: Lead Magnet y Newsletter
- Editor rápido (logo, título, beneficios, campos formulario)
- Vista previa responsive
- Métricas: visitas y conversiones

### 6. Automatizaciones
- Lienzo nodal simple: Trigger → Acciones
- Triggers: Formulario enviado, Etiqueta añadida
- Acciones: Asignar tag, Programar campaña
- Panel de configuración lateral

### 7. Reportes
- Embudo de conversión
- Cohortes por semana (retención)
- Tabla exportable con métricas por campaña

### 8. Configuración
- General: workspace, zona horaria
- Campos personalizados de contacto
- Variables del sistema ({{first_name}}, etc.)
- **IA Local (Demo):**
  - Sugerir asunto y CTA
  - Score de copy (0-100)
  - Alertas sobre longitud, palabras spam

## 🤖 IA Local (Sin APIs externas)

El panel de IA está integrado en el editor de campañas:

### Características:
- **Sugerir Asunto:** 3 propuestas optimizadas
- **Mejorar CTA:** 3 opciones de llamada a la acción
- **Score de Copy:** 
  - Checklist de 5 puntos
  - Barra de progreso 0-100
  - Alertas sobre problemas comunes

### Ejemplos:
```
Asunto sugerido: "{{first_name}}, activa tu beneficio en 48h"
CTA: "Empieza ahora", "Ver beneficios", "Descargar guía"
```

## 📊 Datos Demo

### Contactos (8 ejemplos)
```javascript
{
  email: "maria.gonzalez@email.com",
  name: "María González",
  tags: ["nuevo", "lead-magnet"],
  country: "RD",
  city: "Santo Domingo",
  score: 85
}
```

### Países representados
- 🇩🇴 República Dominicana (RD)
- 🇲🇽 México (MX)
- 🇨🇴 Colombia (CO)
- 🇪🇸 España (ES)

### Segmentos
1. Nuevos Leads RD (156 contactos)
2. VIPs México (89 contactos)
3. Lead Magnet Activos (234 contactos)

### Campañas
1. Bienvenida A/B (enviada, 45.2% apertura)
2. Newsletter Semanal (enviada, 42.0% apertura)
3. Oferta Especial (programada)

### Landing Pages
1. Lead Magnet - Guía Marketing (19.2% conversión)
2. Newsletter Suscripción (15.7% conversión)

### Automatizaciones
1. Bienvenida (Activa, 42 contactos completados)

## 🎯 Microcopys en Español

### Botones
- Crear, Guardar, Programar, Publicar, Duplicar
- Previsualizar, Probar A/B
- Iniciar, Pausar

### Empty States
- "Aún no tienes contactos"
- "Crea tu primer segmento para empezar"

### Toasts/Alertas
- "Segmento guardado"
- "Campaña programada para hoy 4:00 PM"
- "Workflow activado"

## ♿ Accesibilidad

- Contraste AA WCAG 2.1
- Focus visible en todos los elementos interactivos
- Áreas clicables mínimas: 44x44px
- Labels descriptivos para lectores de pantalla

## 🌙 Modo Oscuro

Toggle en la barra superior para cambiar entre modo claro y oscuro.
La preferencia se guarda en localStorage.

## 🚀 Tecnologías

- **React** con TypeScript
- **Tailwind CSS** v4.0
- **Shadcn UI** (componentes)
- **Recharts** (gráficos)
- **Lucide React** (iconos)

## 📝 Notas Importantes

- ✅ Sin integraciones externas
- ✅ Datos de demostración locales
- ✅ No requiere API keys
- ✅ Completamente funcional en frontend
- ❌ No colecta PII
- ❌ No persiste datos (demo)

## 🎨 Componentes Reutilizables

Todos los componentes UI están en `/components/ui/`:
- Button (variantes: solid, outline, ghost)
- Input, Select, Textarea
- Dialog, Sheet (panel lateral)
- Table, Card, Badge
- Tabs, Progress, Switch
- Toast (Sonner)
- Y más...

## 📦 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

## 🔄 Versión

**v0.1-local** - Demo sin APIs externas

---

Creado como prototipo navegable para demostración de funcionalidades de automatización de marketing.
