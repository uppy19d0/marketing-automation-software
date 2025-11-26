/**
 * ============================================================================
 * AI ROUTES - Rutas de IA para Marketing Automation
 * ============================================================================
 *
 * Define todos los endpoints relacionados con funcionalidades de IA:
 * - Generación de subject lines
 * - Generación de contenido de emails
 * - Creación de variantes A/B
 * - Mejora de contenido
 * - Estado del servicio de IA
 *
 * Todas las rutas requieren autenticación (middleware auth)
 *
 * ============================================================================
 */

import express from 'express';
import { auth } from '../middleware/auth';
import {
  generateSubjects,
  generateContent,
  generateABVariants,
  improveContentEndpoint,
  getAIStatus,
  generateCompleteCampaign,
} from '../controllers/aiController';

const router = express.Router();

// ============================================================================
// TODAS LAS RUTAS REQUIEREN AUTENTICACIÓN
// ============================================================================
router.use(auth);

// ============================================================================
// ENDPOINTS DE GENERACIÓN
// ============================================================================

/**
 * POST /api/ai/generate-subjects
 * Generar subject lines optimizados
 *
 * Body:
 * {
 *   "topic": "Lanzamiento nuevo producto",
 *   "tone": "professional",  // optional: 'professional' | 'casual' | 'urgent' | 'friendly'
 *   "count": 3,              // optional: número de variantes
 *   "maxLength": 60          // optional: longitud máxima
 * }
 */
router.post('/generate-subjects', generateSubjects);

/**
 * POST /api/ai/generate-content
 * Generar contenido HTML completo para email
 *
 * Body:
 * {
 *   "topic": "Nueva colección verano",
 *   "purpose": "Venta",
 *   "tone": "casual",               // optional
 *   "includeCallToAction": true,    // optional
 *   "callToActionText": "Ver ahora", // optional
 *   "additionalContext": "..."       // optional
 * }
 */
router.post('/generate-content', generateContent);

/**
 * POST /api/ai/generate-campaign
 * Generar campaña completa (subject + content)
 *
 * Body:
 * {
 *   "topic": "Webinar de marketing digital",
 *   "purpose": "Registro a evento",
 *   "tone": "professional",
 *   "callToActionText": "Registrarme",
 *   "additionalContext": "Evento el 15 de marzo"
 * }
 */
router.post('/generate-campaign', generateCompleteCampaign);

/**
 * POST /api/ai/generate-ab-variants
 * Generar variantes A/B para testing
 *
 * Body:
 * {
 *   "originalSubject": "Subject original",
 *   "originalContent": "<html>...</html>",
 *   "variantCount": 2,              // optional
 *   "focus": "subject"              // optional: 'subject' | 'content' | 'both'
 * }
 */
router.post('/generate-ab-variants', generateABVariants);

/**
 * POST /api/ai/improve-content
 * Mejorar contenido existente
 *
 * Body:
 * {
 *   "content": "Contenido a mejorar",
 *   "improvementType": "engagement"  // optional: 'engagement' | 'clarity' | 'conversion'
 * }
 */
router.post('/improve-content', improveContentEndpoint);

// ============================================================================
// ENDPOINT DE ESTADO
// ============================================================================

/**
 * GET /api/ai/status
 * Obtener estado del servicio de IA
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "provider": "openai",
 *     "model": "gpt-4-turbo-preview",
 *     "available": true,
 *     "features": {
 *       "subjectGeneration": true,
 *       "contentGeneration": true,
 *       "abTesting": true,
 *       "contentImprovement": true
 *     }
 *   }
 * }
 */
router.get('/status', getAIStatus);

export default router;
