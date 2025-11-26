/**
 * ============================================================================
 * AI CONTROLLER - Controlador de Funcionalidades de IA
 * ============================================================================
 *
 * Este controlador maneja todas las peticiones HTTP relacionadas con IA:
 * - Generar subject lines
 * - Generar contenido de emails
 * - Crear variantes A/B
 * - Mejorar contenido existente
 * - Obtener información del servicio de IA
 *
 * ENDPOINTS:
 * POST   /api/ai/generate-subjects       - Generar subject lines
 * POST   /api/ai/generate-content        - Generar contenido de email
 * POST   /api/ai/generate-ab-variants    - Generar variantes A/B
 * POST   /api/ai/improve-content         - Mejorar contenido
 * GET    /api/ai/status                  - Estado del servicio de IA
 *
 * ============================================================================
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import {
  generateSubjectLines,
  generateEmailContent,
  generateABTestVariants,
  improveContent,
  isAIAvailable,
  getAIProviderInfo,
  SubjectLineOptions,
  EmailContentOptions,
  ABTestOptions,
} from '../services/aiService';

// ============================================================================
// GENERACIÓN DE SUBJECT LINES
// ============================================================================

/**
 * Generar subject lines optimizados con IA
 *
 * FLUJO:
 * STEP 1: Validar que el servicio de IA esté disponible
 * STEP 2: Validar parámetros requeridos
 * STEP 3: Llamar al servicio de IA
 * STEP 4: Retornar subject lines generados
 *
 * @route POST /api/ai/generate-subjects
 * @body { topic: string, tone?: string, count?: number, maxLength?: number }
 */
export const generateSubjects = async (req: AuthRequest, res: Response) => {
  try {
    // STEP 1: Verificar disponibilidad de IA
    if (!isAIAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not available. Please configure API keys.',
      });
    }

    // STEP 2: Validar parámetros
    const { topic, tone, count, maxLength } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Topic is required',
      });
    }

    console.log(`[AI Controller] 📝 Generating subjects for topic: "${topic}"`);

    // STEP 3: Generar subject lines con IA
    const options: SubjectLineOptions = {
      topic,
      tone: tone || 'professional',
      count: count || 3,
      maxLength: maxLength || 60,
    };

    const result = await generateSubjectLines(options);

    // STEP 4: Retornar resultados
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('[AI Controller] ❌ Error generating subjects:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error generating subject lines',
    });
  }
};

// ============================================================================
// GENERACIÓN DE CONTENIDO DE EMAIL
// ============================================================================

/**
 * Generar contenido completo de email con IA
 *
 * FLUJO:
 * STEP 1: Verificar disponibilidad del servicio
 * STEP 2: Validar parámetros requeridos (topic, purpose)
 * STEP 3: Construir opciones de generación
 * STEP 4: Llamar al servicio de IA
 * STEP 5: Retornar contenido generado (HTML + subject + preheader)
 *
 * @route POST /api/ai/generate-content
 * @body { topic: string, purpose: string, tone?: string, includeCallToAction?: boolean, callToActionText?: string }
 */
export const generateContent = async (req: AuthRequest, res: Response) => {
  try {
    // STEP 1: Verificar disponibilidad
    if (!isAIAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not available. Please configure API keys.',
      });
    }

    // STEP 2: Validar parámetros
    const { topic, purpose, tone, includeCallToAction, callToActionText, additionalContext } = req.body;

    if (!topic || !purpose) {
      return res.status(400).json({
        success: false,
        message: 'Topic and purpose are required',
      });
    }

    console.log(`[AI Controller] 📧 Generating email content for: "${topic}" (${purpose})`);

    // STEP 3: Construir opciones
    const options: EmailContentOptions = {
      topic,
      purpose,
      tone: tone || 'professional',
      includeCallToAction: includeCallToAction !== false,
      callToActionText: callToActionText || 'Más información',
      additionalContext,
    };

    // STEP 4: Generar contenido
    const result = await generateEmailContent(options);

    // STEP 5: Retornar contenido generado
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('[AI Controller] ❌ Error generating content:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error generating email content',
    });
  }
};

// ============================================================================
// GENERACIÓN DE VARIANTES A/B
// ============================================================================

/**
 * Generar variantes A/B para testing
 *
 * FLUJO:
 * STEP 1: Verificar servicio disponible
 * STEP 2: Validar contenido original
 * STEP 3: Configurar opciones de variantes
 * STEP 4: Generar variantes con IA
 * STEP 5: Retornar variantes con explicaciones
 *
 * @route POST /api/ai/generate-ab-variants
 * @body { originalSubject: string, originalContent: string, variantCount?: number, focus?: string }
 */
export const generateABVariants = async (req: AuthRequest, res: Response) => {
  try {
    // STEP 1: Verificar disponibilidad
    if (!isAIAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not available. Please configure API keys.',
      });
    }

    // STEP 2: Validar parámetros
    const { originalSubject, originalContent, variantCount, focus } = req.body;

    if (!originalSubject || !originalContent) {
      return res.status(400).json({
        success: false,
        message: 'Original subject and content are required',
      });
    }

    console.log(`[AI Controller] 🧪 Generating A/B test variants`);

    // STEP 3: Configurar opciones
    const options: ABTestOptions = {
      originalSubject,
      originalContent,
      variantCount: variantCount || 2,
      focus: focus || 'both',
    };

    // STEP 4: Generar variantes
    const result = await generateABTestVariants(options);

    // STEP 5: Retornar variantes
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('[AI Controller] ❌ Error generating A/B variants:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error generating A/B test variants',
    });
  }
};

// ============================================================================
// MEJORA DE CONTENIDO
// ============================================================================

/**
 * Mejorar contenido existente con IA
 *
 * FLUJO:
 * STEP 1: Verificar servicio disponible
 * STEP 2: Validar contenido a mejorar
 * STEP 3: Determinar tipo de mejora
 * STEP 4: Aplicar mejoras con IA
 * STEP 5: Retornar contenido mejorado con explicación
 *
 * @route POST /api/ai/improve-content
 * @body { content: string, improvementType?: 'engagement' | 'clarity' | 'conversion' }
 */
export const improveContentEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    // STEP 1: Verificar disponibilidad
    if (!isAIAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not available. Please configure API keys.',
      });
    }

    // STEP 2: Validar contenido
    const { content, improvementType } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required',
      });
    }

    console.log(`[AI Controller] 🔧 Improving content (type: ${improvementType || 'engagement'})`);

    // STEP 3 y 4: Mejorar contenido
    const type = improvementType || 'engagement';
    const result = await improveContent(content, type);

    // STEP 5: Retornar resultado
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('[AI Controller] ❌ Error improving content:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error improving content',
    });
  }
};

// ============================================================================
// ESTADO DEL SERVICIO
// ============================================================================

/**
 * Obtener estado y configuración del servicio de IA
 *
 * FLUJO:
 * STEP 1: Obtener información del proveedor
 * STEP 2: Verificar disponibilidad
 * STEP 3: Retornar estado completo
 *
 * @route GET /api/ai/status
 */
export const getAIStatus = async (req: AuthRequest, res: Response) => {
  try {
    // STEP 1 y 2: Obtener información
    const info = getAIProviderInfo();
    const available = isAIAvailable();

    // STEP 3: Retornar estado
    res.status(200).json({
      success: true,
      data: {
        ...info,
        available,
        features: {
          subjectGeneration: available,
          contentGeneration: available,
          abTesting: available,
          contentImprovement: available,
        },
      },
    });
  } catch (error: any) {
    console.error('[AI Controller] ❌ Error getting AI status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error getting AI status',
    });
  }
};

// ============================================================================
// GENERACIÓN COMPLETA DE CAMPAÑA
// ============================================================================

/**
 * Generar una campaña completa con IA (subject + content)
 *
 * FLUJO:
 * STEP 1: Verificar disponibilidad
 * STEP 2: Validar parámetros
 * STEP 3: Generar subject lines
 * STEP 4: Generar contenido HTML
 * STEP 5: Combinar resultados
 * STEP 6: Retornar campaña completa lista para usar
 *
 * @route POST /api/ai/generate-campaign
 * @body { topic: string, purpose: string, tone?: string }
 */
export const generateCompleteCampaign = async (req: AuthRequest, res: Response) => {
  try {
    // STEP 1: Verificar disponibilidad
    if (!isAIAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not available. Please configure API keys.',
      });
    }

    // STEP 2: Validar parámetros
    const { topic, purpose, tone, callToActionText, additionalContext } = req.body;

    if (!topic || !purpose) {
      return res.status(400).json({
        success: false,
        message: 'Topic and purpose are required',
      });
    }

    console.log(`[AI Controller] 🎯 Generating complete campaign for: "${topic}"`);

    // STEP 3: Generar subject lines
    const subjectsResult = await generateSubjectLines({
      topic,
      tone: tone || 'professional',
      count: 3,
    });

    // STEP 4: Generar contenido
    const contentResult = await generateEmailContent({
      topic,
      purpose,
      tone: tone || 'professional',
      includeCallToAction: true,
      callToActionText: callToActionText || 'Más información',
      additionalContext,
    });

    // STEP 5 y 6: Combinar y retornar
    res.status(200).json({
      success: true,
      data: {
        subjectOptions: subjectsResult.subjects,
        recommendedSubject: subjectsResult.subjects[0],
        content: {
          html: contentResult.html,
          preheader: contentResult.preheader,
        },
        reasoning: subjectsResult.reasoning,
      },
      message: 'Complete campaign generated successfully',
    });
  } catch (error: any) {
    console.error('[AI Controller] ❌ Error generating complete campaign:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error generating complete campaign',
    });
  }
};
