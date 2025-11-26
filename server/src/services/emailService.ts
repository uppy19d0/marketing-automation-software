/**
 * ============================================================================
 * EMAIL SERVICE - Servicio de Envío de Emails con Brevo
 * ============================================================================
 *
 * Este módulo maneja el envío de emails a través de la API de Brevo.
 *
 * FLUJO DE TRABAJO:
 * 1. Validar configuración de credenciales
 * 2. Preparar datos del email (remitente, destinatario, contenido)
 * 3. Enviar a través de Brevo API
 * 4. Manejar respuestas y errores
 *
 * ============================================================================
 */

// ============================================================================
// STEP 1: CONFIGURACIÓN Y CREDENCIALES
// ============================================================================

/**
 * Credenciales de Brevo cargadas desde variables de entorno
 * Estas se validan al iniciar el servicio
 */
const brevoApiKey = process.env.BREVO_API_KEY;
const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.SMTP_USER;
const senderName = process.env.BREVO_SENDER_NAME || 'Marketing Automation';

/**
 * Brevo API endpoint para envío de emails
 */
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

// ============================================================================
// STEP 2: VALIDACIÓN DE CONFIGURACIÓN
// ============================================================================

/**
 * Validar que las credenciales de Brevo estén configuradas correctamente
 * Esto se ejecuta cuando se carga el módulo por primera vez
 */
if (!brevoApiKey) {
  console.warn('[Email] ⚠️ BREVO_API_KEY not configured. Email sending is disabled.');
}

if (!senderEmail) {
  console.warn('[Email] ⚠️ BREVO_SENDER_EMAIL (or SMTP_USER) not configured. Emails will fail to send.');
}

// ============================================================================
// STEP 3: INTERFACES Y TIPOS
// ============================================================================

/**
 * Datos del remitente del email
 */
interface EmailSender {
  name: string;
  email: string;
}

/**
 * Datos del destinatario del email
 */
interface EmailRecipient {
  email: string;
  name?: string;
}

/**
 * Estructura del payload para la API de Brevo
 */
interface BrevoEmailPayload {
  sender: EmailSender;
  to: EmailRecipient[];
  subject: string;
  htmlContent: string;
}

// ============================================================================
// STEP 4: FUNCIONES AUXILIARES
// ============================================================================

/**
 * Validar que los parámetros requeridos estén presentes
 * @param to - Email del destinatario
 * @param subject - Asunto del email
 * @param html - Contenido HTML del email
 * @returns true si es válido, false si no
 */
function validateEmailParams(to: string, subject: string, html: string): boolean {
  if (!to || !subject || !html) {
    console.error('[Email] ❌ Missing required parameters: to, subject, or html');
    return false;
  }

  // Validar formato de email básico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    console.error('[Email] ❌ Invalid email format:', to);
    return false;
  }

  return true;
}

/**
 * Construir el payload para la API de Brevo
 * @param to - Email del destinatario
 * @param subject - Asunto del email
 * @param html - Contenido HTML del email
 * @returns Objeto payload formateado
 */
function buildBrevoPayload(to: string, subject: string, html: string): BrevoEmailPayload {
  return {
    sender: {
      name: senderName,
      email: senderEmail!,
    },
    to: [
      {
        email: to,
      },
    ],
    subject: subject,
    htmlContent: html,
  };
}

/**
 * Preparar headers para la petición a Brevo API
 * @returns Headers HTTP con autenticación
 */
function buildBrevoHeaders(): Record<string, string> {
  return {
    'accept': 'application/json',
    'api-key': brevoApiKey!,
    'content-type': 'application/json',
  };
}

// ============================================================================
// STEP 5: FUNCIÓN PRINCIPAL DE ENVÍO
// ============================================================================

/**
 * Enviar un email a través de la API de Brevo
 *
 * FLUJO INTERNO:
 * 1. Validar credenciales están configuradas
 * 2. Validar parámetros del email
 * 3. Construir payload y headers
 * 4. Hacer petición HTTP a Brevo API
 * 5. Manejar respuesta exitosa o errores
 *
 * @param to - Email del destinatario
 * @param subject - Asunto del email
 * @param html - Contenido HTML del email
 * @returns Respuesta de la API de Brevo o undefined si hay error
 *
 * @example
 * await sendEmail('user@example.com', 'Bienvenido', '<h1>Hola</h1>');
 */
export async function sendEmail(to: string, subject: string, html: string) {
  // STEP 5.1: Verificar que las credenciales estén configuradas
  if (!brevoApiKey || !senderEmail) {
    console.warn('[Email] ⚠️ Tried to send email but required Brevo env vars are missing.');
    return;
  }

  // STEP 5.2: Validar parámetros de entrada
  if (!validateEmailParams(to, subject, html)) {
    throw new Error('Invalid email parameters');
  }

  try {
    // STEP 5.3: Preparar datos para el envío
    const payload = buildBrevoPayload(to, subject, html);
    const headers = buildBrevoHeaders();

    console.log(`[Email] 📧 Sending email to: ${to}`);

    // STEP 5.4: Enviar petición HTTP a Brevo API
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    });

    // STEP 5.5: Verificar si la respuesta fue exitosa
    if (!response.ok) {
      const errorData: any = await response.json().catch(() => ({}));
      throw new Error(
        `Brevo API error: ${response.status} - ${errorData.message || response.statusText}`
      );
    }

    // STEP 5.6: Parsear y retornar respuesta exitosa
    const data = await response.json();
    console.log('[Email] ✅ Email sent successfully to:', to);
    return data;

  } catch (error: any) {
    // STEP 5.7: Manejar errores durante el envío
    console.error('[Email] ❌ Error sending via Brevo:', error?.message || error);
    throw error;
  }
}

/**
 * Enviar múltiples emails en lote
 * Útil para campañas masivas con control de errores individual
 *
 * @param emails - Array de objetos con destinatario, asunto y contenido
 * @returns Resultados del envío (exitosos y fallidos)
 */
export async function sendBulkEmails(
  emails: Array<{ to: string; subject: string; html: string }>
): Promise<{ successful: number; failed: number; errors: any[] }> {
  console.log(`[Email] 📨 Sending bulk emails: ${emails.length} recipients`);

  const results = await Promise.allSettled(
    emails.map(email => sendEmail(email.to, email.subject, email.html))
  );

  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  const errors = results
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map(r => r.reason);

  console.log(`[Email] 📊 Bulk send complete: ${successful} successful, ${failed} failed`);

  return { successful, failed, errors };
}
