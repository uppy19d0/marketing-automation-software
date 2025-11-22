import { Response } from 'express';
import LandingPage from '../models/LandingPage';
import Contact from '../models/Contact';
import Event from '../models/Event';
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
      landingPage.seo = { metaTitle: landingPage.title, metaDescription: landingPage.subtitle || landingPage.description || '' };
    } else {
      landingPage.seo.metaTitle = landingPage.seo.metaTitle || landingPage.title;
      landingPage.seo.metaDescription = landingPage.seo.metaDescription || landingPage.subtitle || landingPage.description || '';
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
