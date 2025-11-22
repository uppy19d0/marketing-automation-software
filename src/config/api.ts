// API Configuration
const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
const envApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();

export const API_BASE_URL = envApiBaseUrl
  ? envApiBaseUrl.replace(/\/$/, '')
  : isDevelopment
    ? 'http://localhost:5001/api'
    : '/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  ME: `${API_BASE_URL}/auth/me`,
  
  // Contacts
  CONTACTS: `${API_BASE_URL}/contacts`,
  CONTACT_BY_ID: (id: string) => `${API_BASE_URL}/contacts/${id}`,
  IMPORT_CONTACTS: `${API_BASE_URL}/contacts/import`,
  EXPORT_CONTACTS: `${API_BASE_URL}/contacts/export`,
  
  // Campaigns
  CAMPAIGNS: `${API_BASE_URL}/campaigns`,
  CAMPAIGN_BY_ID: (id: string) => `${API_BASE_URL}/campaigns/${id}`,
  SEND_CAMPAIGN: (id: string) => `${API_BASE_URL}/campaigns/${id}/send`,
  CAMPAIGN_STATS: (id: string) => `${API_BASE_URL}/campaigns/${id}/stats`,
  
  // Segments
  SEGMENTS: `${API_BASE_URL}/segments`,
  SEGMENT_BY_ID: (id: string) => `${API_BASE_URL}/segments/${id}`,
  SEGMENT_CONTACTS: (id: string) => `${API_BASE_URL}/segments/${id}/contacts`,
  
  // Landing Pages
  LANDING_PAGES: `${API_BASE_URL}/landing-pages`,
  LANDING_PAGE_BY_ID: (id: string) => `${API_BASE_URL}/landing-pages/${id}`,
  PUBLISH_LANDING_PAGE: (id: string) => `${API_BASE_URL}/landing-pages/${id}/publish`,
  
  // Health
  HEALTH: `${API_BASE_URL}/health`,
};

// API Helper functions
export const apiRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const api = {
  get: (url: string, options?: RequestInit) =>
    apiRequest(url, { ...options, method: 'GET' }),
  
  post: (url: string, body?: any, options?: RequestInit) =>
    apiRequest(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }),
  
  put: (url: string, body?: any, options?: RequestInit) =>
    apiRequest(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  
  patch: (url: string, body?: any, options?: RequestInit) =>
    apiRequest(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  
  delete: (url: string, options?: RequestInit) =>
    apiRequest(url, { ...options, method: 'DELETE' }),
};
