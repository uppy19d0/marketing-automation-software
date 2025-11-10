import { Response } from 'express';
import Campaign from '../models/Campaign';
import Contact from '../models/Contact';
import Event from '../models/Event';
import { AuthRequest } from '../middleware/auth';

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

    campaign.recipientCount = recipients.length;
    campaign.status = 'sent';
    campaign.sentAt = new Date();
    campaign.stats.sent = recipients.length;

    await campaign.save();

    // TODO: Implement actual email sending logic here
    // For now, just update the campaign status

    res.status(200).json({
      success: true,
      data: campaign,
      message: `Campaign sent to ${recipients.length} recipients`,
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
