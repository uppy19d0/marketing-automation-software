import { api, API_ENDPOINTS } from '../config/api';

export interface Campaign {
  _id?: string;
  name: string;
  subject: string;
  preheader?: string;
  content: {
    html: string;
    blocks?: Array<{
      type: 'title' | 'paragraph' | 'button' | 'image';
      content: string;
    }>;
  };
  isABTest?: boolean;
  variants?: Array<{
    name: string;
    subject: string;
    trafficPercentage: number;
  }>;
  status: 'draft' | 'scheduled' | 'sent' | 'sending';
  segmentId?: string;
  scheduledAt?: Date;
  sentAt?: Date;
  recipientCount?: number;
  stats?: {
    sent: number;
    delivered?: number;
    opens?: number;
    uniqueOpens?: number;
    clicks?: number;
    uniqueClicks?: number;
    bounces?: number;
    unsubscribes?: number;
  };
  openRate?: number;
  ctr?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CampaignFilters {
  status?: string;
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
}

class CampaignService {
  async getCampaigns(filters?: CampaignFilters) {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const url = `${API_ENDPOINTS.CAMPAIGNS}?${params.toString()}`;
    return api.get(url);
  }

  async getCampaignById(id: string): Promise<Campaign> {
    const response = await api.get(API_ENDPOINTS.CAMPAIGN_BY_ID(id));
    return response.data;
  }

  async createCampaign(campaign: Omit<Campaign, '_id' | 'createdAt' | 'updatedAt'>): Promise<Campaign> {
    const response = await api.post(API_ENDPOINTS.CAMPAIGNS, campaign);
    return response.data;
  }

  async updateCampaign(id: string, campaign: Partial<Campaign>): Promise<Campaign> {
    const response = await api.put(API_ENDPOINTS.CAMPAIGN_BY_ID(id), campaign);
    return response.data;
  }

  async deleteCampaign(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.CAMPAIGN_BY_ID(id));
  }

  async sendCampaign(id: string) {
    const response = await api.post(API_ENDPOINTS.SEND_CAMPAIGN(id));
    return response.data || response;
  }

  async getCampaignStats(id: string) {
    return api.get(API_ENDPOINTS.CAMPAIGN_STATS(id));
  }
}

export const campaignService = new CampaignService();
