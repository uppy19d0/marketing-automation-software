import { Response } from 'express';
import Contact from '../models/Contact';
import Segment from '../models/Segment';
import Campaign from '../models/Campaign';
import LandingPage from '../models/LandingPage';
import Event from '../models/Event';
import LandingPageAnalytics from '../models/LandingPageAnalytics';
import { AuthRequest } from '../middleware/auth';

type ChartEntry = {
  date: string;
  opens: number;
  clicks: number;
  submissions: number;
};

const buildChartSeed = (startDate: Date): Record<string, ChartEntry> => {
  const seed: Record<string, ChartEntry> = {};

  for (let i = 0; i < 7; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    const key = day.toISOString().split('T')[0];
    seed[key] = {
      date: key,
      opens: 0,
      clicks: 0,
      submissions: 0,
    };
  }

  return seed;
};

export const getDashboardOverview = async (_req: AuthRequest, res: Response) => {
  try {
    const windowStart = new Date();
    windowStart.setHours(0, 0, 0, 0);
    windowStart.setDate(windowStart.getDate() - 6); // últimos 7 días (incluyendo hoy)

    const [
      totalContacts,
      newContacts,
      activeSegments,
      campaigns,
      landingPages,
      eventTimeline,
      recentEventsRaw,
    ] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ createdAt: { $gte: windowStart } }),
      Segment.countDocuments({ isActive: true }),
      Campaign.find().select('name status stats recipientCount isABTest sentAt createdAt'),
      LandingPage.find().select('name title stats status'),
      Event.aggregate([
        { $match: { createdAt: { $gte: windowStart } } },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              type: '$type',
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.date': 1 } },
      ]),
      Event.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .populate('contactId', 'firstName lastName email country')
        .populate('campaignId', 'name')
        .populate('landingPageId', 'name title'),
    ]);

    const chartSeed = buildChartSeed(windowStart);
    eventTimeline.forEach((bucket: any) => {
      const entry = chartSeed[bucket._id.date];
      if (!entry) return;

      switch (bucket._id.type) {
        case 'email_open':
          entry.opens += bucket.count;
          break;
        case 'email_click':
          entry.clicks += bucket.count;
          break;
        case 'form_submit':
          entry.submissions += bucket.count;
          break;
        default:
          break;
      }
    });

    const chart = Object.values(chartSeed);

    const totalSent = campaigns.reduce(
      (sum, campaign) => sum + (campaign.stats?.sent || 0),
      0
    );
    const totalUniqueOpens = campaigns.reduce(
      (sum, campaign) => sum + (campaign.stats?.uniqueOpens || campaign.stats?.opens || 0),
      0
    );
    const totalUniqueClicks = campaigns.reduce(
      (sum, campaign) => sum + (campaign.stats?.uniqueClicks || campaign.stats?.clicks || 0),
      0
    );

    const openRate = totalSent > 0 ? (totalUniqueOpens / totalSent) * 100 : 0;
    const clickRate = totalSent > 0 ? (totalUniqueClicks / totalSent) * 100 : 0;

    const landingVisits = landingPages.reduce(
      (sum, page) => sum + (page.stats?.visits || 0),
      0
    );
    const landingSubmissions = landingPages.reduce(
      (sum, page) => sum + (page.stats?.submissions || 0),
      0
    );
    const landingConversion = landingVisits > 0 ? (landingSubmissions / landingVisits) * 100 : 0;

    const topCampaigns = campaigns
      .map((campaign) => {
        const sent = campaign.stats?.sent || 0;
        const opens = campaign.stats?.uniqueOpens || campaign.stats?.opens || 0;
        const clicks = campaign.stats?.uniqueClicks || campaign.stats?.clicks || 0;

        return {
          id: campaign._id,
          name: campaign.name,
          status: campaign.status,
          sent,
          opens,
          clicks,
          openRate: sent > 0 ? (opens / sent) * 100 : 0,
          ctr: sent > 0 ? (clicks / sent) * 100 : 0,
        };
      })
      .sort((a, b) => b.openRate - a.openRate)
      .slice(0, 4);

    const recentEvents = recentEventsRaw.map((event) => {
      const contact: any = event.contactId;
      const campaign: any = event.campaignId;
      const landingPage: any = event.landingPageId;
      const contactName = contact
        ? [contact.firstName, contact.lastName].filter(Boolean).join(' ').trim()
        : '';

      return {
        id: event._id,
        type: event.type,
        contact: contactName || contact?.email,
        email: contact?.email,
        campaign: campaign?.name,
        landingPage: landingPage?.title || landingPage?.name,
        country: event.country || contact?.country,
        createdAt: event.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        totals: {
          contacts: totalContacts,
          newContacts,
          segments: activeSegments,
          campaigns: {
            total: campaigns.length,
            active: campaigns.filter((c) => c.status !== 'draft').length,
            sent: campaigns.filter((c) => c.status === 'sent').length,
          },
          landingPages: {
            total: landingPages.length,
            published: landingPages.filter((p) => p.status === 'published').length,
          },
        },
        rates: {
          openRate: Number(openRate.toFixed(1)),
          clickRate: Number(clickRate.toFixed(1)),
          conversionRate: Number(landingConversion.toFixed(1)),
        },
        chart,
        landingMetrics: {
          visits: landingVisits,
          submissions: landingSubmissions,
          conversionRate: Number(landingConversion.toFixed(1)),
        },
        topCampaigns,
        recentEvents,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

export const getReportsOverview = async (_req: AuthRequest, res: Response) => {
  try {
    const windowStart = new Date();
    windowStart.setHours(0, 0, 0, 0);
    windowStart.setDate(windowStart.getDate() - 30);

    const [
      contactsTotal,
      campaigns,
      landingPages,
      eventCounts,
      pageViews,
      formSubmits,
      weeklyContacts,
    ] = await Promise.all([
      Contact.countDocuments(),
      Campaign.find().select('name status stats recipientCount isABTest sentAt createdAt'),
      LandingPage.find().select('name slug stats status'),
      Event.aggregate([
        {
          $match: {
            createdAt: { $gte: windowStart },
            type: { $in: ['email_open', 'email_click'] },
          },
        },
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ]),
      LandingPageAnalytics.countDocuments({
        createdAt: { $gte: windowStart },
        eventType: 'page_view',
      }),
      LandingPageAnalytics.countDocuments({
        createdAt: { $gte: windowStart },
        eventType: 'form_submit',
      }),
      Contact.aggregate([
        { $match: { createdAt: { $gte: windowStart } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              week: { $isoWeek: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.week': 1 } },
      ]),
    ]);

    const opens = eventCounts.find((e: any) => e._id === 'email_open')?.count || 0;
    const clicks = eventCounts.find((e: any) => e._id === 'email_click')?.count || 0;

    const funnel = {
      visits: pageViews,
      submissions: formSubmits,
      opens,
      clicks,
      conversionRate: pageViews > 0 ? (formSubmits / pageViews) * 100 : 0,
    };

    const campaignMetrics = campaigns.map((campaign) => {
      const sent = campaign.stats?.sent || 0;
      const opensMetric = campaign.stats?.uniqueOpens || campaign.stats?.opens || 0;
      const clicksMetric = campaign.stats?.uniqueClicks || campaign.stats?.clicks || 0;
      return {
        id: campaign._id,
        name: campaign.name,
        status: campaign.status,
        sent,
        opens: opensMetric,
        openRate: sent > 0 ? (opensMetric / sent) * 100 : 0,
        clicks: clicksMetric,
        ctr: sent > 0 ? (clicksMetric / sent) * 100 : 0,
        conversions: campaign.stats?.conversions || 0,
        revenue: campaign.stats?.revenue || 0,
      };
    });

    const landingMetrics = landingPages.map((page) => ({
      id: page._id,
      name: page.name,
      slug: page.slug,
      visits: page.stats?.visits || 0,
      submissions: page.stats?.submissions || 0,
      conversionRate: page.stats?.conversionRate || 0,
      bounceRate: page.stats?.bounceRate || 0,
      avgTimeOnPage: page.stats?.avgTimeOnPage || 0,
    }));

    const weeklyContactsFormatted = weeklyContacts.map((entry: any) => ({
      week: `${entry._id.year}-W${String(entry._id.week).padStart(2, '0')}`,
      count: entry.count,
    }));

    res.status(200).json({
      success: true,
      data: {
        totals: {
          contacts: contactsTotal,
          campaigns: campaigns.length,
          landings: landingPages.length,
        },
        funnel,
        campaignMetrics,
        landingMetrics,
        weeklyContacts: weeklyContactsFormatted,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};
