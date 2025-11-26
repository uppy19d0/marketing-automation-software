/**
 * ============================================================================
 * CAMPAIGN CONTROLLER - Controlador de Campañas de Marketing
 * ============================================================================
 *
 * Este módulo maneja todas las operaciones relacionadas con campañas:
 * - CRUD de campañas (crear, leer, actualizar, eliminar)
 * - Envío de campañas a contactos individuales o segmentos
 * - Envío de emails de prueba
 * - Estadísticas y métricas de campañas
 *
 * FLUJOS PRINCIPALES:
 * 1. Crear campaña → Configurar → Enviar a prueba → Enviar a audiencia
 * 2. Obtener estadísticas → Analizar performance (opens, clicks, CTR)
 * 3. Gestionar campañas (listar, editar, eliminar)
 *
 * ============================================================================
 */

import { Response } from 'express';
import Campaign from '../models/Campaign';
import Contact from '../models/Contact';
import Event from '../models/Event';
import { AuthRequest } from '../middleware/auth';
import { sendEmail, sendBulkEmails } from '../services/emailService';

// ============================================================================
// ENVÍO DE CAMPAÑAS
// ============================================================================

/**
 * Enviar una campaña a un contacto específico
 *
 * FLUJO:
 * STEP 1: Validar parámetros (contactId o email)
 * STEP 2: Buscar la campaña en la base de datos
 * STEP 3: Buscar el contacto (por ID o email)
 * STEP 4: Validar que el contacto esté suscrito
 * STEP 5: Enviar el email al contacto
 * STEP 6: Actualizar estadísticas de la campaña
 * STEP 7: Retornar confirmación
 *
 * @route POST /api/campaigns/:id/send-to-contact
 */
export const sendCampaignToContact = async (req: AuthRequest, res: Response) => {
  try {
    // STEP 1: Validar que se proporcione contactId o email
    const { contactId, email } = req.body;

    if (!contactId && !email) {
      return res.status(400).json({
        success: false,
        message: 'Provide "contactId" or "email" to send the campaign.',
      });
    }

    // STEP 2: Buscar la campaña por ID
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    // STEP 3: Buscar el contacto por ID o email
    const contact = await Contact.findOne(
      contactId ? { _id: contactId } : { email: (email as string).toLowerCase().trim() }
    );

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    // STEP 4: Validar estado de suscripción del contacto
    if (contact.status !== 'subscribed') {
      return res.status(400).json({
        success: false,
        message: 'Contact is not subscribed; campaign will not be sent.',
      });
    }

    // STEP 5: Preparar y enviar el email
    const subject = campaign.subject;
    const html = campaign.content?.html || '<p>(Sin contenido)</p>';

    console.log(`[Campaign] 📧 Sending campaign "${campaign.name}" to ${contact.email}`);
    await sendEmail(contact.email, subject, html);

    // STEP 6: Actualizar estadísticas de la campaña
    campaign.recipientCount = (campaign.recipientCount || 0) + 1;
    campaign.stats.sent = (campaign.stats.sent || 0) + 1;
    campaign.status = 'sent';
    campaign.sentAt = new Date();
    await campaign.save();

    // STEP 7: Retornar confirmación exitosa
    res.status(200).json({
      success: true,
      message: `Campaign sent to ${contact.email}`,
      data: {
        campaignId: campaign._id,
        contactId: contact._id,
      },
    });
  } catch (error: any) {
    console.error('[Campaign] ❌ Error sending campaign to contact:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================================
// GESTIÓN DE CAMPAÑAS (CRUD)
// ============================================================================

/**
 * Obtener todas las campañas con paginación
 *
 * FLUJO:
 * STEP 1: Parsear parámetros de paginación (page, limit)
 * STEP 2: Construir filtros (opcional: por status)
 * STEP 3: Contar total de campañas que cumplen el filtro
 * STEP 4: Obtener campañas con paginación
 * STEP 5: Retornar datos con información de paginación
 *
 * @route GET /api/campaigns?page=1&limit=20&status=sent
 */
export const getCampaigns = async (req: AuthRequest, res: Response) => {
  try {
    // STEP 1: Parsear parámetros de paginación
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // STEP 2: Construir filtros opcionales
    const filter: any = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    console.log(`[Campaign] 📋 Fetching campaigns - Page ${page}, Filter:`, filter);

    // STEP 3: Contar total de documentos
    const total = await Campaign.countDocuments(filter);

    // STEP 4: Obtener campañas con paginación y población de relaciones
    const campaigns = await Campaign.find(filter)
      .populate('segmentId')  // Traer datos del segmento relacionado
      .sort({ createdAt: -1 })  // Más recientes primero
      .skip(skip)
      .limit(limit);

    // STEP 5: Retornar datos con metadata de paginación
    res.status(200).json({
      success: true,
      data: campaigns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('[Campaign] ❌ Error fetching campaigns:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Enviar email de prueba
 *
 * FLUJO:
 * STEP 1: Validar que se proporcione email destino
 * STEP 2: Enviar email de prueba con contenido predefinido
 * STEP 3: Retornar confirmación
 *
 * @route POST /api/campaigns/test-email
 */
export const sendTestEmail = async (req: AuthRequest, res: Response) => {
  try {
    // STEP 1: Validar parámetro "to"
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({ success: false, message: 'Missing "to" in request body' });
    }

    // STEP 2: Enviar email de prueba
    console.log(`[Campaign] 🧪 Sending test email to: ${to}`);
    await sendEmail(
      to,
      'Prueba de campaña',
      '<h1>Prueba de campaña</h1><p>Este es un correo de prueba desde tu backend de Marketing Automation.</p>'
    );

    // STEP 3: Confirmar envío exitoso
    res.status(200).json({ success: true, message: `Test email sent to ${to}` });
  } catch (error: any) {
    console.error('[Campaign] ❌ Error sending test email:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Obtener una campaña específica por ID
 *
 * FLUJO:
 * STEP 1: Buscar campaña por ID
 * STEP 2: Validar que existe
 * STEP 3: Retornar datos de la campaña
 *
 * @route GET /api/campaigns/:id
 */
export const getCampaign = async (req: AuthRequest, res: Response) => {
  try {
    // STEP 1 y 2: Buscar campaña y popular relaciones
    const campaign = await Campaign.findById(req.params.id).populate('segmentId');

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    // STEP 3: Retornar campaña
    res.status(200).json({ success: true, data: campaign });
  } catch (error: any) {
    console.error('[Campaign] ❌ Error fetching campaign:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Crear una nueva campaña
 *
 * FLUJO:
 * STEP 1: Extraer datos del request body
 * STEP 2: Agregar usuario creador (del token JWT)
 * STEP 3: Crear campaña en la base de datos
 * STEP 4: Retornar campaña creada
 *
 * @route POST /api/campaigns
 */
export const createCampaign = async (req: AuthRequest, res: Response) => {
  try {
    // STEP 1 y 2: Preparar datos de la campaña
    const campaignData = {
      ...req.body,
      createdBy: req.user?._id,  // Usuario autenticado del JWT
    };

    console.log(`[Campaign] ➕ Creating new campaign: ${campaignData.name}`);

    // STEP 3: Crear en la base de datos
    const campaign = await Campaign.create(campaignData);

    // STEP 4: Retornar campaña creada
    res.status(201).json({ success: true, data: campaign });
  } catch (error: any) {
    console.error('[Campaign] ❌ Error creating campaign:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Actualizar una campaña existente
 *
 * FLUJO:
 * STEP 1: Buscar campaña por ID
 * STEP 2: Actualizar con nuevos datos
 * STEP 3: Validar que existe
 * STEP 4: Retornar campaña actualizada
 *
 * @route PUT /api/campaigns/:id
 */
export const updateCampaign = async (req: AuthRequest, res: Response) => {
  try {
    console.log(`[Campaign] ✏️ Updating campaign: ${req.params.id}`);

    // STEP 1 y 2: Buscar y actualizar
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }  // Retornar documento actualizado y validar
    );

    // STEP 3: Validar que existe
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    // STEP 4: Retornar campaña actualizada
    res.status(200).json({ success: true, data: campaign });
  } catch (error: any) {
    console.error('[Campaign] ❌ Error updating campaign:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Eliminar una campaña
 *
 * FLUJO:
 * STEP 1: Buscar y eliminar campaña por ID
 * STEP 2: Validar que existía
 * STEP 3: Retornar confirmación
 *
 * @route DELETE /api/campaigns/:id
 */
export const deleteCampaign = async (req: AuthRequest, res: Response) => {
  try {
    console.log(`[Campaign] 🗑️ Deleting campaign: ${req.params.id}`);

    // STEP 1: Buscar y eliminar
    const campaign = await Campaign.findByIdAndDelete(req.params.id);

    // STEP 2: Validar que existía
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    // STEP 3: Confirmar eliminación
    res.status(200).json({ success: true, data: {} });
  } catch (error: any) {
    console.error('[Campaign] ❌ Error deleting campaign:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================================
// ENVÍO MASIVO Y ESTADÍSTICAS
// ============================================================================

/**
 * Enviar campaña a todos los contactos de un segmento (o todos los contactos)
 *
 * FLUJO:
 * STEP 1: Buscar la campaña por ID
 * STEP 2: Obtener lista de destinatarios (segmento o todos)
 * STEP 3: Filtrar solo contactos suscritos
 * STEP 4: Preparar datos del email (subject y contenido HTML)
 * STEP 5: Enviar emails en lote a todos los destinatarios
 * STEP 6: Contar resultados exitosos y fallidos
 * STEP 7: Actualizar estadísticas de la campaña
 * STEP 8: Retornar resumen del envío
 *
 * @route POST /api/campaigns/:id/send
 */
export const sendCampaign = async (req: AuthRequest, res: Response) => {
  try {
    // STEP 1: Buscar campaña por ID
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    console.log(`[Campaign] 🚀 Starting campaign send: "${campaign.name}"`);

    // STEP 2 y 3: Obtener destinatarios según segmento
    let recipients;
    if (campaign.segmentId) {
      // Enviar a un segmento específico
      recipients = await Contact.find({
        segments: campaign.segmentId,
        status: 'subscribed'
      });
      console.log(`[Campaign] 👥 Sending to segment: ${recipients.length} contacts`);
    } else {
      // Enviar a todos los contactos suscritos
      recipients = await Contact.find({ status: 'subscribed' });
      console.log(`[Campaign] 👥 Sending to all contacts: ${recipients.length} contacts`);
    }

    // STEP 4: Preparar contenido del email
    const subject = campaign.subject;
    const html = campaign.content?.html || '<p>(Sin contenido)</p>';

    // STEP 5: Enviar emails en paralelo usando Promise.allSettled
    // Esto permite que algunos fallos no detengan el envío completo
    const sendResults = await Promise.allSettled(
      recipients.map((contact: any) =>
        sendEmail(contact.email, subject, html)
      )
    );

    // STEP 6: Contar envíos exitosos y fallidos
    const successful = sendResults.filter(r => r.status === 'fulfilled').length;
    const failed = sendResults.filter(r => r.status === 'rejected').length;

    console.log(`[Campaign] 📊 Campaign send results: ${successful} successful, ${failed} failed`);

    // STEP 7: Actualizar estadísticas de la campaña
    campaign.recipientCount = recipients.length;
    campaign.status = 'sent';
    campaign.sentAt = new Date();
    campaign.stats.sent = successful;

    await campaign.save();

    // STEP 8: Retornar resumen del envío
    res.status(200).json({
      success: true,
      data: campaign,
      message: `Campaign sent to ${successful} of ${recipients.length} recipients`,
    });
  } catch (error: any) {
    console.error('[Campaign] ❌ Error sending campaign:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Obtener estadísticas detalladas de una campaña
 *
 * FLUJO:
 * STEP 1: Buscar la campaña por ID
 * STEP 2: Consultar eventos de apertura (opens)
 * STEP 3: Consultar eventos de click (clicks)
 * STEP 4: Calcular métricas únicas (unique opens/clicks)
 * STEP 5: Actualizar estadísticas en el modelo de campaña
 * STEP 6: Calcular tasas (open rate, CTR)
 * STEP 7: Retornar estadísticas completas
 *
 * MÉTRICAS CALCULADAS:
 * - Opens: Total de aperturas de email
 * - Unique Opens: Usuarios únicos que abrieron
 * - Clicks: Total de clicks en links
 * - Unique Clicks: Usuarios únicos que clickearon
 * - Open Rate: % de contactos que abrieron el email
 * - CTR (Click-Through Rate): % de contactos que clickearon
 *
 * @route GET /api/campaigns/:id/stats
 */
export const getCampaignStats = async (req: AuthRequest, res: Response) => {
  try {
    // STEP 1: Buscar campaña
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    console.log(`[Campaign] 📊 Calculating stats for campaign: "${campaign.name}"`);

    // STEP 2: Contar total de aperturas de email
    const opens = await Event.find({
      campaignId: campaign._id,
      type: 'email_open'
    }).countDocuments();

    // STEP 3: Contar total de clicks en links
    const clicks = await Event.find({
      campaignId: campaign._id,
      type: 'email_click'
    }).countDocuments();

    // STEP 4: Calcular usuarios únicos que abrieron
    const uniqueOpens = await Event.distinct('contactId', {
      campaignId: campaign._id,
      type: 'email_open',
    });

    // STEP 4: Calcular usuarios únicos que clickearon
    const uniqueClicks = await Event.distinct('contactId', {
      campaignId: campaign._id,
      type: 'email_click',
    });

    // STEP 5: Actualizar estadísticas en la campaña
    campaign.stats.opens = opens;
    campaign.stats.clicks = clicks;
    campaign.stats.uniqueOpens = uniqueOpens.length;
    campaign.stats.uniqueClicks = uniqueClicks.length;

    await campaign.save();

    // STEP 6: Convertir a objeto con virtuals (para calcular rates)
    const campaignObj = campaign.toObject({ virtuals: true }) as any;

    console.log(`[Campaign] ✅ Stats calculated - Opens: ${opens}, Clicks: ${clicks}`);

    // STEP 7: Retornar estadísticas completas con tasas calculadas
    res.status(200).json({
      success: true,
      data: {
        campaign: campaignObj,
        openRate: campaignObj.openRate || 0,  // Calculado por virtual en modelo
        ctr: campaignObj.ctr || 0,  // Calculado por virtual en modelo
      },
    });
  } catch (error: any) {
    console.error('[Campaign] ❌ Error calculating campaign stats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
