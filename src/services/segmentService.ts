import { api, API_ENDPOINTS } from '../config/api';

export interface Segment {
  _id?: string;
  name: string;
  type: 'dynamic' | 'static';
  rules: Array<{
    field: string;
    operator: string;
    value: string;
    logic?: 'AND' | 'OR';
  }>;
  contactCount?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

class SegmentService {
  async getSegments() {
    return api.get(API_ENDPOINTS.SEGMENTS);
  }

  async getSegmentById(id: string): Promise<Segment> {
    const response = await api.get(API_ENDPOINTS.SEGMENT_BY_ID(id));
    return response.data;
  }

  async createSegment(segment: Omit<Segment, '_id' | 'createdAt' | 'updatedAt'>): Promise<Segment> {
    const response = await api.post(API_ENDPOINTS.SEGMENTS, segment);
    return response.data;
  }

  async updateSegment(id: string, segment: Partial<Segment>): Promise<Segment> {
    const response = await api.put(API_ENDPOINTS.SEGMENT_BY_ID(id), segment);
    return response.data;
  }

  async deleteSegment(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.SEGMENT_BY_ID(id));
  }

  async getSegmentContacts(id: string, page = 1, limit = 50) {
    const url = `${API_ENDPOINTS.SEGMENT_CONTACTS(id)}?page=${page}&limit=${limit}`;
    return api.get(url);
  }
}

export const segmentService = new SegmentService();
