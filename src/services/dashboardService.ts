import { api, API_ENDPOINTS } from '../config/api';

export type DashboardChartPoint = {
  date: string;
  opens: number;
  clicks: number;
  submissions: number;
};

export type DashboardOverview = {
  totals: {
    contacts: number;
    newContacts: number;
    segments: number;
    campaigns: {
      total: number;
      active: number;
      sent: number;
    };
    landingPages: {
      total: number;
      published: number;
    };
  };
  rates: {
    openRate: number;
    clickRate: number;
    conversionRate: number;
  };
  chart: DashboardChartPoint[];
  landingMetrics: {
    visits: number;
    submissions: number;
    conversionRate: number;
  };
  topCampaigns: Array<{
    id?: string;
    name: string;
    status: string;
    sent: number;
    opens: number;
    clicks: number;
    openRate: number;
    ctr: number;
  }>;
  recentEvents: Array<{
    id?: string;
    type: string;
    contact?: string;
    email?: string;
    campaign?: string;
    landingPage?: string;
    country?: string;
    createdAt: string;
  }>;
};

export type ReportsOverview = {
  totals: {
    contacts: number;
    campaigns: number;
    landings: number;
  };
  funnel: {
    visits: number;
    submissions: number;
    opens: number;
    clicks: number;
    conversionRate: number;
  };
  campaignMetrics: Array<{
    id?: string;
    name: string;
    status: string;
    sent: number;
    opens: number;
    openRate: number;
    clicks: number;
    ctr: number;
    conversions: number;
    revenue: number;
  }>;
  landingMetrics: Array<{
    id?: string;
    name: string;
    slug: string;
    visits: number;
    submissions: number;
    conversionRate: number;
    bounceRate: number;
    avgTimeOnPage: number;
  }>;
  weeklyContacts: Array<{ week: string; count: number }>;
};

class DashboardService {
  async getOverview(): Promise<DashboardOverview> {
    const response = await api.get(API_ENDPOINTS.DASHBOARD_OVERVIEW);
    return (response as any).data || response;
  }

  async getReports(): Promise<ReportsOverview> {
    const response = await api.get(API_ENDPOINTS.REPORTS_OVERVIEW);
    return (response as any).data || response;
  }
}

export const dashboardService = new DashboardService();
