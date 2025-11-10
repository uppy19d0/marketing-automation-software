import { api, API_ENDPOINTS } from '../config/api';

export interface Campaign {
  _id?: string;
  name: string;
  subject: string;
  content: string;
  type: 'email' | 'sms' | 'push';
  status: 'draft' | 'scheduled' | 'sent' | 'paused';
  segmentId?: string;
  scheduledAt?: Date;
  sentAt?: Date;
  stats?: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
  abTest?: {
    enabled: boolean;
    variantA: string;
    variantB: string;
    splitPercentage: number;
  };
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

  async sendCampaign(id: string): Promise<void> {
    await api.post(API_ENDPOINTS.SEND_CAMPAIGN(id));
  }

  async getCampaignStats(id: string) {
    return api.get(API_ENDPOINTS.CAMPAIGN_STATS(id));
  }
}

export const campaignService = new CampaignService();
