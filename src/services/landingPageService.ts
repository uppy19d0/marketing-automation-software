import { api, API_ENDPOINTS } from '../config/api';

export interface LandingPage {
  _id?: string;
  name: string;
  slug: string;
  title: string;
  description?: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  styles?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
  };
  formFields?: Array<{
    name: string;
    type: string;
    label: string;
    required: boolean;
  }>;
  stats?: {
    views: number;
    submissions: number;
    conversionRate: number;
  };
  publishedAt?: Date;
  createdAt?: string;
  updatedAt?: string;
}

class LandingPageService {
  async getLandingPages() {
    return api.get(API_ENDPOINTS.LANDING_PAGES);
  }

  async getLandingPageById(id: string): Promise<LandingPage> {
    const response = await api.get(API_ENDPOINTS.LANDING_PAGE_BY_ID(id));
    return response.data;
  }

  async createLandingPage(landingPage: Omit<LandingPage, '_id' | 'createdAt' | 'updatedAt'>): Promise<LandingPage> {
    const response = await api.post(API_ENDPOINTS.LANDING_PAGES, landingPage);
    return response.data;
  }

  async updateLandingPage(id: string, landingPage: Partial<LandingPage>): Promise<LandingPage> {
    const response = await api.put(API_ENDPOINTS.LANDING_PAGE_BY_ID(id), landingPage);
    return response.data;
  }

  async deleteLandingPage(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.LANDING_PAGE_BY_ID(id));
  }

  async publishLandingPage(id: string): Promise<LandingPage> {
    const response = await api.post(API_ENDPOINTS.PUBLISH_LANDING_PAGE(id));
    return response.data;
  }
}

export const landingPageService = new LandingPageService();
