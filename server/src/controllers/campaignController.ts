import { Response } from 'express';
import Campaign from '../models/Campaign';
import Contact from '../models/Contact';
import Event from '../models/Event';
import { AuthRequest } from '../middleware/auth';
import { sendEmail } from '../services/emailService';

export const getCampaigns = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (req.query.status) filter.status = req.query.status;

    const total = await Campaign.countDocuments(filter);
    const campaigns = await Campaign.find(filter)
      .populate('segmentId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: campaigns,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendTestEmail = async (req: AuthRequest, res: Response) => {
  try {
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({ success: false, message: 'Missing "to" in request body' });
    }

    await sendEmail(
      to,
      'Prueba de campaña',
      '<h1>Prueba de campaña</h1><p>Este es un correo de prueba desde tu backend de Marketing Automation.</p>'
    );

    res.status(200).json({ success: true, message: `Test email sent to ${to}` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('segmentId');
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    res.status(200).json({ success: true, data: campaign });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const campaignData = {
      ...req.body,
      createdBy: req.user?._id,
    };
    const campaign = await Campaign.create(campaignData);
    res.status(201).json({ success: true, data: campaign });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    res.status(200).json({ success: true, data: campaign });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    // Get recipients
    let recipients;
    if (campaign.segmentId) {
      const segment = await Contact.find({ segments: campaign.segmentId, status: 'subscribed' });
      recipients = segment;
    } else {
      recipients = await Contact.find({ status: 'subscribed' });
    }

    // Enviar emails (simplificado: mismo contenido/subject para todos)
    const subject = campaign.subject;
    const html = campaign.content?.html || '<p>(Sin contenido)</p>';

    const sendResults = await Promise.allSettled(
      recipients.map((contact: any) =>
        sendEmail(contact.email, subject, html)
      )
    );

    const successful = sendResults.filter(r => r.status === 'fulfilled').length;

    campaign.recipientCount = recipients.length;
    campaign.status = 'sent';
    campaign.sentAt = new Date();
    campaign.stats.sent = successful;

    await campaign.save();

    res.status(200).json({
      success: true,
      data: campaign,
      message: `Campaign sent to ${successful} of ${recipients.length} recipients`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCampaignStats = async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    // Get detailed events
    const opens = await Event.find({
      campaignId: campaign._id,
      type: 'email_open'
    }).countDocuments();

    const clicks = await Event.find({
      campaignId: campaign._id,
      type: 'email_click'
    }).countDocuments();

    const uniqueOpens = await Event.distinct('contactId', {
      campaignId: campaign._id,
      type: 'email_open',
    });

    const uniqueClicks = await Event.distinct('contactId', {
      campaignId: campaign._id,
      type: 'email_click',
    });

    campaign.stats.opens = opens;
    campaign.stats.clicks = clicks;
    campaign.stats.uniqueOpens = uniqueOpens.length;
    campaign.stats.uniqueClicks = uniqueClicks.length;

    await campaign.save();

    const campaignObj = campaign.toObject({ virtuals: true }) as any;

    res.status(200).json({
      success: true,
      data: {
        campaign: campaignObj,
        openRate: campaignObj.openRate || 0,
        ctr: campaignObj.ctr || 0,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
