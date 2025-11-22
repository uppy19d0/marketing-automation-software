import { api, API_ENDPOINTS } from '../config/api';

export interface Contact {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
  tags?: string[];
  country?: string;
  city?: string;
  score?: number;
  customFields?: Record<string, any>;
  status: 'subscribed' | 'unsubscribed' | 'bounced';
  source?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactFilters {
  search?: string;
  tags?: string[];
  status?: string;
  page?: number;
  limit?: number;
}

export interface ContactsResponse {
  success: boolean;
  data: Contact[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ContactDetailResponse {
  contact: Contact;
  events?: any[];
}

class ContactService {
  async getContacts(filters?: ContactFilters): Promise<ContactsResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }

    const url = `${API_ENDPOINTS.CONTACTS}?${params.toString()}`;
    return api.get(url);
  }

  async getContactById(id: string): Promise<Contact | ContactDetailResponse> {
    const response = await api.get(API_ENDPOINTS.CONTACT_BY_ID(id));
    return response.data || response;
  }

  async createContact(contact: Omit<Contact, '_id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    const response = await api.post(API_ENDPOINTS.CONTACTS, contact);
    return response.data;
  }

  async updateContact(id: string, contact: Partial<Contact>): Promise<Contact> {
    const response = await api.put(API_ENDPOINTS.CONTACT_BY_ID(id), contact);
    return response.data;
  }

  async deleteContact(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.CONTACT_BY_ID(id));
  }

  async importContacts(file: File): Promise<{ imported: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(API_ENDPOINTS.IMPORT_CONTACTS, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to import contacts');
    }

    return response.json();
  }

  async exportContacts(filters?: ContactFilters): Promise<Blob> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const url = `${API_ENDPOINTS.EXPORT_CONTACTS}?${params.toString()}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to export contacts');
    }

    return response.blob();
  }
}

export const contactService = new ContactService();
