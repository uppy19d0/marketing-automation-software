/**
 * ============================================================================
 * AI SERVICE - Servicio de Inteligencia Artificial para Marketing
 * ============================================================================
 *
 * Este módulo integra IA para generar contenido de marketing automáticamente:
 * - Generar subject lines optimizados
 * - Generar contenido HTML de emails
 * - Crear variantes A/B automáticamente
 * - Mejorar y optimizar contenido existente
 * - Sugerir segmentación inteligente
 *
 * PROVEEDORES SOPORTADOS:
 * - OpenAI (GPT-4, GPT-3.5)
 * - Anthropic (Claude)
 *
 * FLUJO DE TRABAJO:
 * 1. Usuario solicita generación de contenido
 * 2. El servicio formatea el prompt según la tarea
 * 3. Se envía a la API de IA configurada
 * 4. Se procesa y formatea la respuesta
 * 5. Se retorna contenido listo para usar
 *
 * ============================================================================
 */

// ============================================================================
// STEP 1: CONFIGURACIÓN Y CREDENCIALES
// ============================================================================

/**
 * Configuración de APIs de IA desde variables de entorno
 */
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

/**
 * Proveedor de IA a usar (por defecto: openai)
 * Valores válidos: 'openai' | 'anthropic'
 */
const AI_PROVIDER = (process.env.AI_PROVIDER || 'openai') as 'openai' | 'anthropic';

/**
 * Modelo de IA a usar
 */
const AI_MODEL = process.env.AI_MODEL || 'gpt-4-turbo-preview';

/**
 * Validar configuración al cargar el módulo
 */
if (!OPENAI_API_KEY && !ANTHROPIC_API_KEY) {
  console.warn('[AI] ⚠️ No AI API keys configured. AI features will be disabled.');
}

console.log(`[AI] ✅ AI Service initialized with provider: ${AI_PROVIDER}`);

// ============================================================================
// STEP 2: INTERFACES Y TIPOS
// ============================================================================

/**
 * Opciones para generación de subject lines
 */
export interface SubjectLineOptions {
  topic: string;              // Tema del email
  tone?: 'professional' | 'casual' | 'urgent' | 'friendly';
  maxLength?: number;         // Longitud máxima en caracteres
  count?: number;             // Número de variantes a generar
}

/**
 * Opciones para generación de contenido de email
 */
export interface EmailContentOptions {
  topic: string;              // Tema principal
  purpose: string;            // Objetivo del email (venta, info, bienvenida, etc.)
  tone?: 'professional' | 'casual' | 'urgent' | 'friendly';
  includeCallToAction?: boolean;
  callToActionText?: string;
  additionalContext?: string; // Contexto adicional para personalizar
}

/**
 * Opciones para generar variantes A/B
 */
export interface ABTestOptions {
  originalSubject: string;
  originalContent: string;
  variantCount?: number;      // Número de variantes (default: 2)
  focus?: 'subject' | 'content' | 'both';
}

/**
 * Respuesta de generación de subject lines
 */
export interface SubjectLineResult {
  subjects: string[];
  reasoning?: string;
}

/**
 * Respuesta de generación de contenido
 */
export interface EmailContentResult {
  html: string;
  subject?: string;
  preheader?: string;
}

/**
 * Respuesta de variantes A/B
 */
export interface ABTestResult {
  variants: Array<{
    name: string;
    subject: string;
    content: string;
    differences: string;
  }>;
}

// ============================================================================
// STEP 3: FUNCIONES AUXILIARES - LLAMADAS A APIs
// ============================================================================

/**
 * Llamar a OpenAI API
 */
async function callOpenAI(prompt: string, systemPrompt?: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  console.log('[AI] 🤖 Calling OpenAI API...');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error: any = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API error: ${response.status} - ${error.error?.message || 'Unknown error'}`);
  }

  const data: any = await response.json();
  const content = data.choices[0]?.message?.content || '';

  console.log('[AI] ✅ OpenAI response received');
  return content;
}

/**
 * Llamar a Anthropic Claude API
 */
async function callAnthropic(prompt: string, systemPrompt?: string): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key not configured');
  }

  console.log('[AI] 🤖 Calling Anthropic Claude API...');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: AI_MODEL.includes('claude') ? AI_MODEL : 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: prompt }
      ],
    }),
  });

  if (!response.ok) {
    const error: any = await response.json().catch(() => ({}));
    throw new Error(`Anthropic API error: ${response.status} - ${error.error?.message || 'Unknown error'}`);
  }

  const data: any = await response.json();
  const content = data.content[0]?.text || '';

  console.log('[AI] ✅ Anthropic response received');
  return content;
}

/**
 * Llamar a la IA configurada (OpenAI o Anthropic)
 */
async function callAI(prompt: string, systemPrompt?: string): Promise<string> {
  if (AI_PROVIDER === 'anthropic') {
    return callAnthropic(prompt, systemPrompt);
  }
  return callOpenAI(prompt, systemPrompt);
}

// ============================================================================
// STEP 4: FUNCIONES DE GENERACIÓN DE CONTENIDO
// ============================================================================

/**
 * Generar subject lines optimizados para emails
 *
 * FLUJO:
 * STEP 1: Validar opciones y configurar defaults
 * STEP 2: Construir prompt especializado
 * STEP 3: Llamar a la IA
 * STEP 4: Parsear y formatear respuesta
 * STEP 5: Retornar subject lines generados
 *
 * @example
 * const result = await generateSubjectLines({
 *   topic: 'Nueva colección de verano',
 *   tone: 'casual',
 *   count: 3
 * });
 */
export async function generateSubjectLines(options: SubjectLineOptions): Promise<SubjectLineResult> {
  console.log(`[AI] 📝 Generating subject lines for topic: "${options.topic}"`);

  // STEP 1: Configurar opciones por defecto
  const tone = options.tone || 'professional';
  const maxLength = options.maxLength || 60;
  const count = options.count || 3;

  // STEP 2: Construir prompt optimizado
  const systemPrompt = `Eres un experto en email marketing y copywriting.
Tu trabajo es crear subject lines que maximicen el open rate.
Usa técnicas de persuasión, urgencia y curiosidad cuando sea apropiado.`;

  const prompt = `Genera ${count} subject lines para un email sobre: "${options.topic}"

Requisitos:
- Tono: ${tone}
- Longitud máxima: ${maxLength} caracteres
- Que generen curiosidad y maximicen el open rate
- Evitar spam words (GRATIS, URGENTE EN MAYÚSCULAS, etc.)
- En español

Formato de respuesta (JSON):
{
  "subjects": ["Subject 1", "Subject 2", "Subject 3"],
  "reasoning": "Breve explicación de la estrategia usada"
}`;

  // STEP 3: Llamar a la IA
  const response = await callAI(prompt, systemPrompt);

  // STEP 4: Parsear respuesta JSON
  try {
    const parsed = JSON.parse(response);
    return {
      subjects: parsed.subjects || [],
      reasoning: parsed.reasoning,
    };
  } catch {
    // Si no es JSON válido, extraer líneas como subjects
    const lines = response.split('\n').filter(line => line.trim().length > 0 && line.trim().length <= maxLength);
    return {
      subjects: lines.slice(0, count),
    };
  }
}

/**
 * Generar contenido HTML completo para un email
 *
 * FLUJO:
 * STEP 1: Validar opciones
 * STEP 2: Construir prompt con contexto
 * STEP 3: Llamar a la IA
 * STEP 4: Formatear HTML generado
 * STEP 5: Retornar contenido completo
 *
 * @example
 * const content = await generateEmailContent({
 *   topic: 'Lanzamiento nuevo producto',
 *   purpose: 'Venta',
 *   tone: 'professional',
 *   includeCallToAction: true,
 *   callToActionText: 'Ver producto'
 * });
 */
export async function generateEmailContent(options: EmailContentOptions): Promise<EmailContentResult> {
  console.log(`[AI] 📧 Generating email content for: "${options.topic}"`);

  // STEP 1: Configurar opciones
  const tone = options.tone || 'professional';
  const includeCTA = options.includeCallToAction !== false;
  const ctaText = options.callToActionText || 'Más información';

  // STEP 2: Construir prompt especializado
  const systemPrompt = `Eres un experto en email marketing y diseño de emails HTML.
Creas emails que convierten, con diseño limpio y profesional.
Usas HTML con estilos inline para compatibilidad con clientes de email.`;

  const prompt = `Genera el contenido HTML completo para un email sobre: "${options.topic}"

Detalles:
- Propósito: ${options.purpose}
- Tono: ${tone}
${includeCTA ? `- Incluir botón de Call-to-Action con texto: "${ctaText}"` : ''}
${options.additionalContext ? `- Contexto adicional: ${options.additionalContext}` : ''}

Requisitos técnicos:
- HTML válido con estilos inline
- Responsive (mobile-friendly)
- Colores profesionales
- Estructura clara: header, body, footer
- Incluir un subject line y preheader sugeridos

Formato de respuesta (JSON):
{
  "subject": "Subject line sugerido",
  "preheader": "Preheader text",
  "html": "<html>...</html>"
}`;

  // STEP 3: Llamar a la IA
  const response = await callAI(prompt, systemPrompt);

  // STEP 4: Parsear y formatear respuesta
  try {
    const parsed = JSON.parse(response);
    return {
      html: parsed.html || response,
      subject: parsed.subject,
      preheader: parsed.preheader,
    };
  } catch {
    // Si no es JSON, asumir que toda la respuesta es HTML
    return {
      html: response,
    };
  }
}

/**
 * Generar variantes A/B para testing
 *
 * FLUJO:
 * STEP 1: Analizar contenido original
 * STEP 2: Construir prompt para variantes
 * STEP 3: Generar variantes con la IA
 * STEP 4: Formatear resultados
 * STEP 5: Retornar variantes con explicaciones
 *
 * @example
 * const variants = await generateABTestVariants({
 *   originalSubject: 'Descubre nuestra nueva colección',
 *   originalContent: '<html>...</html>',
 *   variantCount: 2,
 *   focus: 'subject'
 * });
 */
export async function generateABTestVariants(options: ABTestOptions): Promise<ABTestResult> {
  console.log(`[AI] 🧪 Generating A/B test variants`);

  // STEP 1: Configurar opciones
  const variantCount = options.variantCount || 2;
  const focus = options.focus || 'both';

  // STEP 2: Construir prompt
  const systemPrompt = `Eres un experto en A/B testing y optimización de campañas de email.
Creas variantes que permiten testear hipótesis específicas de marketing.`;

  const prompt = `Genera ${variantCount} variantes A/B para testing de email.

ORIGINAL:
Subject: ${options.originalSubject}
Content: ${options.originalContent.substring(0, 500)}... (truncado)

Enfoque del test: ${focus}

Crea variantes que testeen diferentes hipótesis:
- Si focus='subject': Testear diferentes estilos de subject (curiosidad vs directo, corto vs largo, etc.)
- Si focus='content': Testear diferentes estructuras de contenido
- Si focus='both': Testear ambos aspectos

Formato de respuesta (JSON):
{
  "variants": [
    {
      "name": "Variante A",
      "subject": "Subject de la variante",
      "content": "<html>Contenido de la variante</html>",
      "differences": "Qué cambia y por qué (hipótesis a testear)"
    }
  ]
}`;

  // STEP 3: Llamar a la IA
  const response = await callAI(prompt, systemPrompt);

  // STEP 4: Parsear respuesta
  try {
    const parsed = JSON.parse(response);
    return parsed;
  } catch {
    throw new Error('Failed to parse A/B test variants response');
  }
}

/**
 * Mejorar contenido existente de un email
 *
 * @param content - Contenido actual (subject o HTML)
 * @param improvementType - Tipo de mejora: 'engagement' | 'clarity' | 'conversion'
 * @returns Contenido mejorado con explicación de cambios
 */
export async function improveContent(
  content: string,
  improvementType: 'engagement' | 'clarity' | 'conversion' = 'engagement'
): Promise<{ improved: string; changes: string }> {
  console.log(`[AI] 🔧 Improving content for: ${improvementType}`);

  const systemPrompt = `Eres un experto en optimización de contenido de email marketing.`;

  const prompt = `Mejora el siguiente contenido enfocándote en: ${improvementType}

CONTENIDO ORIGINAL:
${content}

Mejoras a aplicar según el tipo:
- engagement: Hacer más atractivo, usar storytelling, generar curiosidad
- clarity: Hacer más claro, conciso, fácil de entender
- conversion: Optimizar para acción, agregar urgencia, CTA más fuerte

Formato de respuesta (JSON):
{
  "improved": "Contenido mejorado aquí",
  "changes": "Explicación de qué cambió y por qué"
}`;

  const response = await callAI(prompt, systemPrompt);

  try {
    return JSON.parse(response);
  } catch {
    return {
      improved: response,
      changes: 'Contenido mejorado',
    };
  }
}

// ============================================================================
// STEP 5: EXPORTAR FUNCIONALIDADES
// ============================================================================

/**
 * Verificar si el servicio de IA está disponible
 */
export function isAIAvailable(): boolean {
  return !!(OPENAI_API_KEY || ANTHROPIC_API_KEY);
}

/**
 * Obtener información del proveedor configurado
 */
export function getAIProviderInfo() {
  return {
    provider: AI_PROVIDER,
    model: AI_MODEL,
    available: isAIAvailable(),
  };
}
