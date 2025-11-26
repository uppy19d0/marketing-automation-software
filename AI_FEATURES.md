# 🤖 Funcionalidades de IA - Marketing Automation

Este documento explica todas las funcionalidades de Inteligencia Artificial integradas en tu sistema de Marketing Automation.

## 📋 Índice

1. [Configuración](#-configuración)
2. [Arquitectura del Código](#-arquitectura-del-código)
3. [Endpoints Disponibles](#-endpoints-disponibles)
4. [Ejemplos de Uso](#-ejemplos-de-uso)
5. [Casos de Uso Reales](#-casos-de-uso-reales)

---

## ⚙️ Configuración

### Paso 1: Configurar API Key

Necesitas una API key de **OpenAI** o **Anthropic (Claude)**:

#### Opción A: OpenAI (Recomendado)
```bash
# En tu archivo .env
OPENAI_API_KEY=sk-tu-api-key-aqui
AI_PROVIDER=openai
AI_MODEL=gpt-4-turbo-preview
```

#### Opción B: Anthropic Claude
```bash
# En tu archivo .env
ANTHROPIC_API_KEY=sk-ant-tu-api-key-aqui
AI_PROVIDER=anthropic
AI_MODEL=claude-3-sonnet-20240229
```

### Paso 2: Obtener API Key

**OpenAI:**
1. Visita https://platform.openai.com/api-keys
2. Crea una cuenta o inicia sesión
3. Genera una nueva API key
4. Copia y pega en tu `.env`

**Anthropic:**
1. Visita https://console.anthropic.com/
2. Crea una cuenta
3. Genera una API key
4. Copia y pega en tu `.env`

### Paso 3: Verificar Estado
```bash
curl http://localhost:5001/api/ai/status \
  -H "Authorization: Bearer TU_JWT_TOKEN"
```

---

## 🏗️ Arquitectura del Código

Tu código ahora está organizado con **pasos claros** y comentarios explicativos:

### 📁 Estructura de Archivos

```
server/src/
├── services/
│   ├── emailService.ts      ✅ REESTRUCTURADO - Envío de emails con Brevo
│   └── aiService.ts          ✨ NUEVO - Servicios de IA
├── controllers/
│   ├── campaignController.ts ✅ REESTRUCTURADO - Gestión de campañas
│   └── aiController.ts        ✨ NUEVO - Endpoints de IA
└── routes/
    └── aiRoutes.ts            ✨ NUEVO - Rutas de IA
```

### 📝 Ejemplo de Documentación Step-by-Step

Cada función ahora tiene comentarios claros:

```typescript
/**
 * Generar subject lines optimizados con IA
 *
 * FLUJO:
 * STEP 1: Verificar que el servicio de IA esté disponible
 * STEP 2: Validar parámetros requeridos
 * STEP 3: Llamar al servicio de IA
 * STEP 4: Retornar subject lines generados
 */
export const generateSubjects = async (req, res) => {
  // STEP 1: Verificar disponibilidad de IA
  if (!isAIAvailable()) {
    return res.status(503).json({ ... });
  }

  // STEP 2: Validar parámetros
  const { topic } = req.body;

  // ... resto del código
};
```

---

## 🚀 Endpoints Disponibles

### 1. Generar Subject Lines

**POST** `/api/ai/generate-subjects`

Genera subject lines optimizados para maximizar el open rate.

**Request:**
```json
{
  "topic": "Lanzamiento nueva colección de verano",
  "tone": "casual",
  "count": 3,
  "maxLength": 60
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subjects": [
      "☀️ Tu verano perfecto empieza aquí",
      "Nueva colección: frescura y estilo garantizados",
      "Descubre los colores del verano"
    ],
    "reasoning": "Se usó un tono casual con emojis y palabras que generan curiosidad..."
  }
}
```

---

### 2. Generar Contenido de Email

**POST** `/api/ai/generate-content`

Genera el contenido HTML completo de un email.

**Request:**
```json
{
  "topic": "Webinar gratuito de Marketing Digital",
  "purpose": "Registro a evento",
  "tone": "professional",
  "includeCallToAction": true,
  "callToActionText": "Registrarme gratis",
  "additionalContext": "El webinar es el 15 de marzo a las 3pm"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subject": "Webinar exclusivo: Domina el Marketing Digital",
    "preheader": "Aprende estrategias probadas de expertos. 15 de marzo, 3pm.",
    "html": "<html>...</html>"
  }
}
```

---

### 3. Generar Campaña Completa

**POST** `/api/ai/generate-campaign`

Genera subject lines + contenido en una sola llamada.

**Request:**
```json
{
  "topic": "Black Friday - Descuentos hasta 70%",
  "purpose": "Venta",
  "tone": "urgent",
  "callToActionText": "Ver ofertas"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendedSubject": "🔥 Black Friday: Hasta 70% OFF - Solo 24h",
    "subjectOptions": [
      "🔥 Black Friday: Hasta 70% OFF - Solo 24h",
      "No te lo pierdas: tus favoritos hasta -70%",
      "Última oportunidad: Black Friday termina hoy"
    ],
    "content": {
      "html": "<html>...</html>",
      "preheader": "Las mejores ofertas del año te esperan"
    },
    "reasoning": "Se usó urgencia y scarcity para maximizar conversión"
  }
}
```

---

### 4. Generar Variantes A/B

**POST** `/api/ai/generate-ab-variants`

Crea variantes para A/B testing.

**Request:**
```json
{
  "originalSubject": "Nueva funcionalidad disponible",
  "originalContent": "<html>...</html>",
  "variantCount": 2,
  "focus": "subject"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "variants": [
      {
        "name": "Variante A - Curiosidad",
        "subject": "¿Ya descubriste lo que agregamos?",
        "content": "...",
        "differences": "Usa curiosidad en vez de información directa"
      },
      {
        "name": "Variante B - Beneficio",
        "subject": "Ahorra 3 horas por semana con esta funcionalidad",
        "content": "...",
        "differences": "Enfoca en beneficio concreto y medible"
      }
    ]
  }
}
```

---

### 5. Mejorar Contenido

**POST** `/api/ai/improve-content`

Optimiza contenido existente.

**Request:**
```json
{
  "content": "Hola, tenemos productos nuevos. Visita nuestra tienda.",
  "improvementType": "engagement"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "improved": "🎉 ¡Acaban de llegar! Descubre nuestra nueva colección que está revolucionando el mercado. ¿Listo para ser el primero en verla?",
    "changes": "Se agregó emoji, storytelling, pregunta que genera curiosidad, y sensación de exclusividad"
  }
}
```

---

### 6. Estado del Servicio

**GET** `/api/ai/status`

Verifica configuración y disponibilidad.

**Response:**
```json
{
  "success": true,
  "data": {
    "provider": "openai",
    "model": "gpt-4-turbo-preview",
    "available": true,
    "features": {
      "subjectGeneration": true,
      "contentGeneration": true,
      "abTesting": true,
      "contentImprovement": true
    }
  }
}
```

---

## 💡 Casos de Uso Reales

### Caso 1: Crear Campaña de Bienvenida
```bash
# 1. Generar campaña completa
curl -X POST http://localhost:5001/api/ai/generate-campaign \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Bienvenida a nuevos suscriptores",
    "purpose": "Engagement inicial",
    "tone": "friendly",
    "callToActionText": "Explorar plataforma"
  }'

# 2. Usar la respuesta para crear la campaña
curl -X POST http://localhost:5001/api/campaigns \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Campaña de Bienvenida",
    "subject": "🎉 Bienvenido a Marketing Automation",
    "content": {
      "html": "HTML GENERADO POR IA"
    }
  }'
```

### Caso 2: Optimizar Campaña Existente
```bash
# 1. Obtener campaña actual
curl http://localhost:5001/api/campaigns/CAMPAIGN_ID \
  -H "Authorization: Bearer TU_TOKEN"

# 2. Mejorar el subject line
curl -X POST http://localhost:5001/api/ai/improve-content \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Newsletter mensual - Marzo 2024",
    "improvementType": "engagement"
  }'

# 3. Actualizar campaña con versión mejorada
curl -X PUT http://localhost:5001/api/campaigns/CAMPAIGN_ID \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "SUBJECT MEJORADO POR IA"
  }'
```

### Caso 3: A/B Testing Automático
```bash
# 1. Generar variantes A/B
curl -X POST http://localhost:5001/api/ai/generate-ab-variants \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "originalSubject": "Descuento especial para ti",
    "originalContent": "<html>...</html>",
    "variantCount": 3,
    "focus": "subject"
  }'

# 2. Crear múltiples campañas con las variantes
# (Una para cada variante A, B, C)
```

---

## 🎯 Mejores Prácticas

### 1. Subject Lines
- **Longitud ideal:** 40-60 caracteres
- **Tono:** Elegir según audiencia (professional, casual, urgent)
- **Testear:** Siempre generar 3+ opciones y comparar

### 2. Contenido de Email
- **Ser específico:** Proporciona contexto adicional cuando sea posible
- **CTA claro:** Siempre incluir call-to-action
- **Propósito definido:** Especifica el objetivo (venta, info, registro, etc.)

### 3. A/B Testing
- **Probar una variable:** Focus en 'subject', 'content' o 'both'
- **Sample size:** Asegúrate de tener suficientes contactos para resultados significativos
- **Duración:** Espera al menos 24-48h antes de sacar conclusiones

### 4. Mejora de Contenido
- **engagement:** Para newsletters y contenido informativo
- **clarity:** Para emails transaccionales o instruccionales
- **conversion:** Para emails de venta o promocionales

---

## 🔧 Troubleshooting

### Error: "AI service is not available"
**Causa:** No hay API key configurada
**Solución:**
1. Verifica que `OPENAI_API_KEY` o `ANTHROPIC_API_KEY` esté en tu `.env`
2. Reinicia el servidor
3. Verifica con `GET /api/ai/status`

### Error: "OpenAI API error: 401"
**Causa:** API key inválida o sin créditos
**Solución:**
1. Verifica que la API key sea correcta
2. Revisa saldo en https://platform.openai.com/account/billing

### Error: "OpenAI API error: 429"
**Causa:** Límite de rate excedido
**Solución:**
1. Espera unos minutos
2. Considera upgrade de plan en OpenAI
3. Implementa retry logic con backoff

---

## 📊 Monitoreo y Logs

Todos los servicios de IA generan logs claros:

```bash
# Inicialización
[AI] ✅ AI Service initialized with provider: openai

# Generación de contenido
[AI] 📝 Generating subject lines for topic: "Nueva colección"
[AI] 🤖 Calling OpenAI API...
[AI] ✅ OpenAI response received

# Errores
[AI] ❌ Error: OpenAI API error: 401 - Invalid API key
```

---

## 🚀 Próximos Pasos

1. **Configurar API key** en tu `.env`
2. **Probar endpoints** con Postman o curl
3. **Integrar en frontend** para que usuarios puedan generar contenido
4. **Monitorear uso** de API para controlar costos
5. **Iterar y mejorar** prompts según resultados

---

## 💰 Costos Estimados

### OpenAI GPT-4 Turbo
- **Costo:** ~$0.01 - $0.03 por generación
- **Recomendado para:** Producción, mejor calidad

### OpenAI GPT-3.5 Turbo
- **Costo:** ~$0.001 - $0.002 por generación
- **Recomendado para:** Testing, alto volumen

### Anthropic Claude
- **Costo:** Similar a GPT-4
- **Ventaja:** Mejores respuestas en español

---

## 📞 Soporte

Si tienes problemas con la integración de IA:
1. Verifica logs en consola del servidor
2. Revisa este documento
3. Consulta documentación oficial:
   - [OpenAI API Docs](https://platform.openai.com/docs)
   - [Anthropic API Docs](https://docs.anthropic.com/)

---

¡Disfruta de tu sistema de Marketing Automation potenciado con IA! 🚀
