import { Response } from 'express';
import LandingPage from '../models/LandingPage';
import Contact from '../models/Contact';
import Event from '../models/Event';
import LandingPageAnalytics from '../models/LandingPageAnalytics';
import { AuthRequest } from '../middleware/auth';

export const getLandingPages = async (req: AuthRequest, res: Response) => {
  try {
    const filter: any = {};
    if (req.query.status) filter.status = req.query.status;

    const landingPages = await LandingPage.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: landingPages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLandingPage = async (req: AuthRequest, res: Response) => {
  try {
    const landingPage = await LandingPage.findById(req.params.id);
    if (!landingPage) {
      return res.status(404).json({ success: false, message: 'Landing page not found' });
    }
    res.status(200).json({ success: true, data: landingPage });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLandingPageBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const landingPage = await LandingPage.findOne({
      slug: req.params.slug,
      status: 'published'
    });

    if (!landingPage) {
      return res.status(404).json({ success: false, message: 'Landing page not found' });
    }

    // Track page view
    landingPage.stats.visits += 1;
    await landingPage.save();

    res.status(200).json({ success: true, data: landingPage });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createLandingPage = async (req: AuthRequest, res: Response) => {
  try {
    const landingPage = await LandingPage.create(req.body);
    res.status(201).json({ success: true, data: landingPage });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLandingPage = async (req: AuthRequest, res: Response) => {
  try {
    const landingPage = await LandingPage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!landingPage) {
      return res.status(404).json({ success: false, message: 'Landing page not found' });
    }
    res.status(200).json({ success: true, data: landingPage });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLandingPage = async (req: AuthRequest, res: Response) => {
  try {
    const landingPage = await LandingPage.findByIdAndDelete(req.params.id);
    if (!landingPage) {
      return res.status(404).json({ success: false, message: 'Landing page not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const publishLandingPage = async (req: AuthRequest, res: Response) => {
  try {
    const landingPage = await LandingPage.findById(req.params.id);
    if (!landingPage) {
      return res.status(404).json({ success: false, message: 'Landing page not found' });
    }

    landingPage.status = 'published';
    landingPage.publishedAt = new Date();

    // Ensure SEO defaults exist
    if (!landingPage.seo) {
      landingPage.seo = {
        metaTitle: landingPage.title,
        metaDescription: landingPage.subtitle || landingPage.description || '',
        keywords: [],
      };
    } else {
      landingPage.seo.metaTitle = landingPage.seo.metaTitle || landingPage.title;
      landingPage.seo.metaDescription =
        landingPage.seo.metaDescription || landingPage.subtitle || landingPage.description || '';
      landingPage.seo.keywords = landingPage.seo.keywords || [];
    }

    await landingPage.save();

    res.status(200).json({ success: true, data: landingPage });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitLandingPageForm = async (req: AuthRequest, res: Response) => {
  try {
    const landingPage = await LandingPage.findById(req.params.id);
    if (!landingPage || landingPage.status !== 'published') {
      return res.status(404).json({ success: false, message: 'Landing page not found' });
    }

    const { email, firstName, lastName, source, ...customFields } = req.body;
    const mergedCustomFields: Record<string, any> = { ...customFields };
    if (source) {
      mergedCustomFields.source = source;
    }

    // Create or update contact
    let contact = await Contact.findOne({ email });
    if (contact) {
      // Update existing contact
      if (firstName) contact.firstName = firstName;
      if (lastName) contact.lastName = lastName;
      if (source) {
        contact.customFields = contact.customFields || new Map();
        contact.customFields.set('source', source);
      }
      Object.assign(contact.customFields, mergedCustomFields);
      await contact.save();
    } else {
      // Create new contact
      contact = await Contact.create({
        email,
        firstName,
        lastName,
        customFields: mergedCustomFields,
        status: 'subscribed',
      });
    }

    // Create event
    await Event.create({
      contactId: contact._id,
      landingPageId: landingPage._id,
      type: 'form_submit',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Update landing page stats
    landingPage.stats.submissions += 1;
    landingPage.stats.conversionRate =
      (landingPage.stats.submissions / landingPage.stats.visits) * 100;
    await landingPage.save();

    res.status(200).json({
      success: true,
      message: landingPage.successMessage,
      data: { contact },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const trackLandingPageEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { eventType, metadata, sessionId } = req.body;
    const landingPageId = req.params.id;

    // Validar que la landing page existe
    const landingPage = await LandingPage.findById(landingPageId);
    if (!landingPage) {
      return res.status(404).json({ success: false, message: 'Landing page not found' });
    }

    // Crear evento de analytics
    await LandingPageAnalytics.create({
      landingPageId,
      sessionId,
      eventType,
      metadata,
      ipAddress: req.ip,
    });

    // Actualizar estadísticas según el tipo de evento
    if (eventType === 'exit_intent' && metadata?.timeOnPage) {
      // Calcular promedio de tiempo en página
      const allExitEvents = await LandingPageAnalytics.find({
        landingPageId,
        eventType: 'exit_intent',
        'metadata.timeOnPage': { $exists: true },
      });

      const totalTime = allExitEvents.reduce((sum, event) => sum + (event.metadata.timeOnPage || 0), 0);
      const avgTime = Math.round(totalTime / allExitEvents.length);

      landingPage.stats.avgTimeOnPage = avgTime;
      await landingPage.save();
    }

    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLandingPageAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const landingPageId = req.params.id;

    // Validar que la landing page existe
    const landingPage = await LandingPage.findById(landingPageId);
    if (!landingPage) {
      return res.status(404).json({ success: false, message: 'Landing page not found' });
    }

    // Obtener estadísticas básicas
    const stats = landingPage.stats;

    // Obtener eventos de analytics
    const events = await LandingPageAnalytics.find({ landingPageId }).sort({ createdAt: -1 });

    // Calcular métricas avanzadas
    const pageViews = events.filter((e) => e.eventType === 'page_view').length;
    const formSubmits = events.filter((e) => e.eventType === 'form_submit').length;
    const buttonClicks = events.filter((e) => e.eventType === 'button_click').length;

    // Bounce rate (usuarios que vieron la página pero no interactuaron)
    const uniqueSessions = new Set(events.map((e) => e.sessionId).filter(Boolean));
    const sessionsWithInteraction = new Set(
      events
        .filter((e) => ['form_submit', 'button_click', 'form_focus'].includes(e.eventType))
        .map((e) => e.sessionId)
        .filter(Boolean)
    );
    const bounceRate = uniqueSessions.size > 0
      ? Math.round(((uniqueSessions.size - sessionsWithInteraction.size) / uniqueSessions.size) * 100)
      : 0;

    // Dispositivos
    const deviceCounts: Record<string, number> = { mobile: 0, tablet: 0, desktop: 0 };
    events
      .filter((e) => e.eventType === 'page_view' && e.metadata?.device?.deviceType)
      .forEach((e) => {
        const deviceType = e.metadata?.device?.deviceType;
        if (deviceType) {
          deviceCounts[deviceType] = (deviceCounts[deviceType] || 0) + 1;
        }
      });

    // Navegadores
    const browserCounts: Record<string, number> = {};
    events
      .filter((e) => e.eventType === 'page_view' && e.metadata?.device?.browser)
      .forEach((e) => {
        const browser = e.metadata?.device?.browser;
        if (browser) {
          browserCounts[browser] = (browserCounts[browser] || 0) + 1;
        }
      });

    // Timeline de eventos (últimos 30 días)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentEvents = await LandingPageAnalytics.aggregate([
      {
        $match: {
          landingPageId: landingPage._id,
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            eventType: '$eventType',
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.date': 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          ...stats,
          bounceRate,
        },
        metrics: {
          pageViews,
          formSubmits,
          buttonClicks,
          uniqueVisitors: uniqueSessions.size,
        },
        devices: deviceCounts,
        browsers: browserCounts,
        timeline: recentEvents,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
