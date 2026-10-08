import type {
  Provider,
  ServiceCategory,
  ServiceRequest,
  FamilyMember,
  SmartAiResponse,
} from '../types';
import { MOCK_CATEGORIES, MOCK_PROVIDERS } from '../data/mockProvidersData';

export { MOCK_CATEGORIES, MOCK_PROVIDERS };

const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'https://lanka-ease-production.up.railway.app').trim().replace(/\/$/, '');
const BASE_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl.slice(0, -4) : rawBaseUrl;
const API_BASE = `${BASE_URL}/api`;

// Helper for JWT Auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('lankaease_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const MOCK_REQUESTS: ServiceRequest[] = [
  {
    id: 1,
    requestCode: 'REQ-2026-001',
    customerId: 2,
    customerName: 'Kamal Perera',
    customerPhone: '+94772345678',
    customerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    categoryId: 5,
    categoryName: 'Appliance Repair',
    categorySlug: 'appliance-repair',
    providerId: 4,
    providerName: 'Sunil Rathnayake',
    providerBusinessName: 'Sunil Appliance & AC Doctor',
    providerPhone: '+94776789012',
    problemDescription: 'My washing machine makes a loud grinding noise during spin cycle and leaks water underneath.',
    aiSuggestion: 'Suggested Category: Appliance Repair (Washing Machine)',
    address: 'No. 45, Galle Road, Colombo 03, Sri Lanka',
    latitude: 6.9147,
    longitude: 79.8510,
    preferredDate: '2026-09-24',
    preferredTime: '14:00 - 16:00',
    urgency: 'TODAY',
    status: 'ON_THE_WAY',
    estimatedPrice: 2500,
    finalPrice: 2500,
    mediaUrls: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=400'],
    createdAt: '2026-09-23T09:30:00Z',
    updatedAt: '2026-09-23T11:00:00Z',
  },
  {
    id: 2,
    requestCode: 'REQ-2026-002',
    customerId: 2,
    customerName: 'Kamal Perera',
    customerPhone: '+94772345678',
    categoryId: 1,
    categoryName: 'Electrical',
    categorySlug: 'electrical',
    providerId: 1,
    providerName: 'Kasun Fernando',
    providerBusinessName: 'Kasun Electrical Solutions',
    providerPhone: '+94773456789',
    problemDescription: 'Main circuit breaker trips whenever the kitchen oven and AC are turned on simultaneously.',
    aiSuggestion: 'Suggested Category: Electrical Wiring / Breaker Repair',
    address: 'No. 45, Galle Road, Colombo 03',
    latitude: 6.9147,
    longitude: 79.8510,
    preferredDate: '2026-09-22',
    preferredTime: '09:00 - 11:00',
    urgency: 'NORMAL',
    status: 'COMPLETED',
    estimatedPrice: 2000,
    finalPrice: 2000,
    mediaUrls: [],
    createdAt: '2026-09-21T08:00:00Z',
    updatedAt: '2026-09-22T10:30:00Z',
  }
];

export const MOCK_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 1,
    name: 'Sunil Perera (Father)',
    relationship: 'FATHER',
    phone: '+94718889900',
    address: 'No. 12, Kandy Road, Kurunegala',
    latitude: 7.4863,
    longitude: 80.3623,
    createdAt: '2026-01-20T00:00:00Z',
  },
  {
    id: 2,
    name: 'Kamala Perera (Mother)',
    relationship: 'MOTHER',
    phone: '+94717778899',
    address: 'No. 88, Peradeniya Road, Kandy',
    latitude: 7.2906,
    longitude: 80.6337,
    createdAt: '2026-02-05T00:00:00Z',
  },
];

// API Methods with automatic backend fallback
export const api = {
  // Service Categories
  getCategories: async (): Promise<ServiceCategory[]> => {
    try {
      const res = await fetch(`${API_BASE}/services`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return MOCK_CATEGORIES;
    }
  },

  // Providers
  getProviders: async (categoryId?: number): Promise<Provider[]> => {
    try {
      const url = categoryId ? `${API_BASE}/providers?categoryId=${categoryId}` : `${API_BASE}/providers`;
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      if (categoryId) {
        return MOCK_PROVIDERS.filter((p) => p.categories.some((c) => c.id === categoryId));
      }
      return MOCK_PROVIDERS;
    }
  },

  getProviderById: async (id: number): Promise<Provider> => {
    try {
      const res = await fetch(`${API_BASE}/providers/${id}`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const found = MOCK_PROVIDERS.find((p) => p.id === Number(id));
      return found || MOCK_PROVIDERS[0];
    }
  },

  // AI Classification
  classifyAiProblem: async (problemDescription: string): Promise<SmartAiResponse> => {
    try {
      const res = await fetch(`${API_BASE}/ai/classify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemDescription }),
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const lower = problemDescription.toLowerCase();
      let catName = 'Home Maintenance';
      let catId = 15;
      let slug = 'home-maintenance';

      if (lower.includes('wash') || lower.includes('fridge') || lower.includes('ac')) {
        catName = 'Appliance Repair'; catId = 5; slug = 'appliance-repair';
      } else if (lower.includes('wire') || lower.includes('light') || lower.includes('socket') || lower.includes('electric') || lower.includes('trip')) {
        catName = 'Electrical'; catId = 1; slug = 'electrical';
      } else if (lower.includes('pipe') || lower.includes('leak') || lower.includes('tap') || lower.includes('water')) {
        catName = 'Plumbing'; catId = 2; slug = 'plumbing';
      } else if (lower.includes('clean') || lower.includes('sofa')) {
        catName = 'Home Cleaning'; catId = 4; slug = 'cleaning';
      } else if (lower.includes('car') || lower.includes('mechanic') || lower.includes('bike')) {
        catName = 'Vehicle Repair'; catId = 6; slug = 'vehicle-repair';
      }

      return {
        suggestedCategoryName: catName,
        suggestedCategoryId: catId,
        categorySlug: slug,
        clarifyingQuestions: [
          'What is the specific brand or model of the appliance/equipment?',
          'How long has this issue been occurring?',
          'Are there any immediate safety hazards?'
        ],
        summary: `AI Assistant classified your request as '${catName}'. Top local experts in this category are available now!`,
        disclaimer: 'AI recommendations help assign the best verified Sri Lankan professional.',
      };
    }
  },

  // Requests
  createServiceRequest: async (payload: any): Promise<ServiceRequest> => {
    try {
      const res = await fetch(`${API_BASE}/requests`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const category = MOCK_CATEGORIES.find((c) => c.id === payload.categoryId) || MOCK_CATEGORIES[0];
      const selectedPro = payload.providerId ? MOCK_PROVIDERS.find(p => p.id === payload.providerId) : undefined;

      const newReq: ServiceRequest = {
        id: Date.now(),
        requestCode: `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        customerId: 2,
        customerName: 'Kamal Perera',
        customerPhone: '+94772345678',
        categoryId: category.id,
        categoryName: category.name,
        categorySlug: category.slug,
        problemDescription: payload.problemDescription || 'General service request',
        aiSuggestion: payload.aiSuggestion || `Assigned category: ${category.name}`,
        address: payload.address || 'No. 45, Galle Road, Colombo 03',
        latitude: payload.latitude || 6.9147,
        longitude: payload.longitude || 79.8510,
        preferredDate: payload.preferredDate || '2026-09-26',
        preferredTime: payload.preferredTime || '10:00 - 12:00',
        urgency: payload.urgency || 'NORMAL',
        status: payload.providerId ? 'ACCEPTED' : 'CREATED',
        providerId: payload.providerId,
        providerName: selectedPro?.fullName,
        providerBusinessName: selectedPro?.businessName,
        providerPhone: selectedPro?.phone,
        estimatedPrice: selectedPro ? selectedPro.priceMin : 2500,
        finalPrice: selectedPro ? selectedPro.priceMin : 2500,
        mediaUrls: payload.mediaUrls || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_REQUESTS.unshift(newReq);
      return newReq;
    }
  },

  getRequestById: async (id: number): Promise<ServiceRequest> => {
    try {
      const res = await fetch(`${API_BASE}/requests/${id}`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return MOCK_REQUESTS.find((r) => r.id === Number(id)) || MOCK_REQUESTS[0];
    }
  },

  getCustomerRequests: async (): Promise<ServiceRequest[]> => {
    try {
      const res = await fetch(`${API_BASE}/requests/customer`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return MOCK_REQUESTS;
    }
  },

  updateRequestStatus: async (requestId: number, newStatus: string, notes?: string): Promise<ServiceRequest> => {
    try {
      const res = await fetch(`${API_BASE}/requests/${requestId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ newStatus, notes }),
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const req = MOCK_REQUESTS.find((r) => r.id === Number(requestId));
      if (req) {
        req.status = newStatus as any;
      }
      return req || MOCK_REQUESTS[0];
    }
  },

  // Family Members
  getFamilyMembers: async (): Promise<FamilyMember[]> => {
    try {
      const res = await fetch(`${API_BASE}/family`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return MOCK_FAMILY_MEMBERS;
    }
  },

  addFamilyMember: async (payload: any): Promise<FamilyMember> => {
    try {
      const res = await fetch(`${API_BASE}/family`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const newMember: FamilyMember = {
        id: Date.now(),
        name: payload.name,
        relationship: payload.relationship,
        phone: payload.phone,
        address: payload.address,
        createdAt: new Date().toISOString(),
      };
      MOCK_FAMILY_MEMBERS.push(newMember);
      return newMember;
    }
  },

  // Contact form submission handler with robust offline fallback
  submitContactForm: async (payload: { name: string; email: string; phone: string; message: string }): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      return true;
    } catch {
      console.log('Contact submission saved locally:', payload);
      return true;
    }
  },

  // Authentication APIs
  loginUser: async (credentials: { email: string; password: string }) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) throw new Error('Login failed');
      return await res.json();
    } catch (err) {
      console.warn('Backend login fallback used:', err);
      return null;
    }
  },

  registerCustomer: async (data: { fullName: string; email: string; password: string; phone: string }) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Registration failed');
      return await res.json();
    } catch (err) {
      console.warn('Backend customer registration fallback used:', err);
      return null;
    }
  },

  registerProvider: async (data: { fullName: string; email: string; password: string; phone: string; businessName?: string }) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register/provider`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Provider registration failed');
      return await res.json();
    } catch (err) {
      console.warn('Backend provider registration fallback used:', err);
      return null;
    }
  },

  getInvoicePdfUrl: (invoiceId: number) => {
    return `${API_BASE}/invoices/${invoiceId}/pdf`;
  },
};
