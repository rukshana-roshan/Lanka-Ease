import type {
  Provider,
  ServiceCategory,
  ServiceRequest,
  FamilyMember,
  SmartAiResponse,
  User,
  Invoice,
} from '../types';
import { demoStorageKey, isDemoSession, sessionValue, localToday } from './session';
import { MOCK_CATEGORIES, MOCK_PROVIDERS } from '../data/mockProvidersData';
import type { MarketplaceProvider, DirectoryResult, ProfileUpdate, Offering, MarketplaceReview, Verification, ProviderReport } from '../types/marketplace';
import type { Conversation, Message } from '../types';

export { MOCK_CATEGORIES, MOCK_PROVIDERS };

const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '');
const BASE_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl.slice(0, -4) : rawBaseUrl;
const API_BASE = `${BASE_URL}/api`;

// Helper for JWT Auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = sessionValue('lankaease_token');
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
    customerImage: '/images/avatars/person-5.svg',
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

// Demo data is used only after an explicit demo sign-in, never after a failed request.
const sampleRequests = structuredClone(MOCK_REQUESTS);
const sampleFamily = structuredClone(MOCK_FAMILY_MEMBERS);
export function hydrateDemoRecords() {
  if (!isDemoSession()) return;
  for (const [kind, records] of [['requests', MOCK_REQUESTS], ['family', MOCK_FAMILY_MEMBERS]] as const) {
    try {
      const stored = JSON.parse(localStorage.getItem(demoStorageKey(kind)) || 'null');
      const seed = kind === 'requests' ? sampleRequests : sampleFamily;
      (records as unknown[]).splice(0, records.length, ...(Array.isArray(stored) ? stored : structuredClone(seed)));
    } catch { /* Keep the initial sample data if browser storage is damaged. */ }
  }
}
hydrateDemoRecords();
function saveDemo(kind: string, records: unknown[]) {
  localStorage.setItem(demoStorageKey(kind), JSON.stringify(records));
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 0) { super(message); this.status = status; }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 60000);
  try {
    const response = await fetch(`${API_BASE}${path}`, { ...options, headers: { ...getAuthHeaders(), ...options.headers }, signal: controller.signal });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new ApiError(body.message || `Request failed (${response.status}). Please try again.`, response.status);
    }
    if (response.status === 204) return undefined as T;
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('We could not reach the service. Check your connection and try again.');
  } finally { window.clearTimeout(timeout); }
}

export interface AdminStats {
  totalRevenue: number;
  totalUsers: number;
  totalCustomers: number;
  totalProviders: number;
  pendingVerifications: number;
  activeRequests: number;
  completedRequests: number;
}

export const adminApi = {
  getContactMessages: (page = 0) => request<{
    content: { id: number; name: string; email: string; phone?: string; subject?: string; message: string; createdAt: string }[];
    page: number; totalPages: number; totalElements: number;
  }>(`/admin/contact-messages?page=${page}&size=20`),
  getStats: () => request<AdminStats>('/admin/stats'),
  getUsers: () => request<User[]>('/admin/users'),
  updateUser: (user: Pick<User, 'id' | 'fullName' | 'phone' | 'role'>) => {
    const params = new URLSearchParams({ fullName: user.fullName, phone: user.phone, role: user.role });
    return request<User>(`/admin/users/${user.id}?${params}`, { method: 'PUT' });
  },
  verifyProvider: (id: number, status: Provider['verificationStatus']) =>
    request<Provider>(`/admin/providers/${id}/verify?${new URLSearchParams({ status })}`, { method: 'PATCH' }),
  saveCategory: (category: Omit<ServiceCategory, 'id'> & { id?: number }) => {
    const params = new URLSearchParams({ name: category.name, slug: category.slug,
      description: category.description, iconName: category.iconName, isActive: String(category.isActive) });
    return request<ServiceCategory>(`/admin/categories${category.id ? `/${category.id}` : ''}?${params}`,
      { method: category.id ? 'PUT' : 'POST' });
  },
  deleteCategory: (id: number) => request<void>(`/admin/categories/${id}`, { method: 'DELETE' }),
};

export const providerApi = {
  getProfile: () => request<Provider>('/providers/me'),
  getRequests: () => request<ServiceRequest[]>('/requests/provider'),
  setAvailability: (isAvailable: boolean) => request<Provider>(
    `/providers/me/availability?${new URLSearchParams({ isAvailable: String(isAvailable) })}`, { method: 'PATCH' }),
  updateRequest: (id: number, update: { newStatus: ServiceRequest['status']; notes?: string;
    labourFee?: number; partsFee?: number; finalPrice?: number }) =>
    request<ServiceRequest>(`/requests/${id}/status`, { method: 'PATCH', body: JSON.stringify(update) }),
};

export const mediaUrl = (value?: string) => value?.startsWith('/api/') || value?.startsWith('/uploads/') ? `${BASE_URL}${value}` : value;
export const marketplaceApi = {
  directory: (filters: Record<string, string>) => request<DirectoryResult>(`/marketplace/providers?${new URLSearchParams(Object.entries(filters).filter(([,v]) => v !== ''))}`),
  profile: (id: number) => request<MarketplaceProvider>(`/marketplace/providers/${id}`),
  mine: () => request<MarketplaceProvider>('/marketplace/me'),
  availability: (status:string) => request<MarketplaceProvider>(`/marketplace/me/availability?${new URLSearchParams({status})}`,{method:'PATCH'}),
  saveProfile: (body: ProfileUpdate) => request<MarketplaceProvider>('/marketplace/me', { method: 'PUT', body: JSON.stringify(body) }),
  saveService: (body: Offering) => request<Offering>(`/marketplace/me/services${body.id ? `/${body.id}` : ''}`, {method: body.id ? 'PUT' : 'POST', body: JSON.stringify(body)}),
  deactivateService: (id: number) => request<void>(`/marketplace/me/services/${id}`, {method:'DELETE'}),
  performance: () => request<{totalBookings:number; pendingRequests:number; earnings:number; completedJobs:number; averageRating:number; reviewCount:number}>('/marketplace/me/performance'),
  reviews: (id: number) => request<MarketplaceReview[]>(`/reviews/provider/${id}`),
  review: (requestId: number, rating: number, reviewText: string) => request('/reviews', {method:'POST',body:JSON.stringify({requestId,rating,reviewText})}),
  propose: (id: number, date: string, time: string) => request(`/marketplace/bookings/${id}/reschedule`,{method:'POST',body:JSON.stringify({date,time})}),
  acceptProposal: (id: number) => request(`/marketplace/bookings/${id}/reschedule/accept`,{method:'POST'}),
  conversations: () => request<Conversation[]>('/conversations'),
  startConversation: (providerUserId: number, requestId?: number) => request<Conversation>(`/conversations/start?${new URLSearchParams({providerUserId:String(providerUserId),...(requestId?{requestId:String(requestId)}:{})})}`,{method:'POST'}),
  messages: (id:number) => request<Message[]>(`/conversations/${id}/messages`),
  send: (id:number,textContent:string) => request<Message>(`/conversations/${id}/messages`,{method:'POST',body:JSON.stringify({textContent})}),
  verification: () => request<Verification[]>('/marketplace/me/verification'),
  submitVerification: (idDocument:string,businessDocument?:string) => request('/marketplace/me/verification',{method:'POST',body:JSON.stringify({idDocument,businessDocument})}),
  verifications: () => request<Verification[]>('/marketplace/admin/verifications'),
  decide: (id:number,status:string,notes:string) => request(`/marketplace/admin/verifications/${id}`,{method:'PATCH',body:JSON.stringify({status,notes})}),
  report: (id:number,reason:string,reviewId?:number) => request(`/marketplace/providers/${id}/reports`,{method:'POST',body:JSON.stringify({reason,reviewId})}),
  reports: () => request<ProviderReport[]>('/marketplace/admin/reports'),
  adminProviders: () => request<(MarketplaceProvider & {suspended:boolean})[]>('/marketplace/admin/providers'),
  adminBookings: (page:number) => request<{content:import('../types').ServiceRequest[];totalPages:number;totalElements:number}>(`/requests?page=${page}&size=20`),
  moderate: (id:number,status:string,notes:string) => request(`/marketplace/admin/reports/${id}`,{method:'PATCH',body:JSON.stringify({status,notes})}),
  suspend: (id:number,suspended:boolean) => request(`/marketplace/admin/providers/${id}/suspension?suspended=${suspended}`,{method:'PATCH'}),
  hideReview: (id:number,hidden:boolean) => request(`/marketplace/admin/reviews/${id}?hidden=${hidden}`,{method:'PATCH'}),
  upload: async (file:File,purpose:'PROFILE'|'PORTFOLIO'|'VERIFICATION') => {
    if(!['image/jpeg','image/png','image/gif'].includes(file.type)||file.size>5*1024*1024)throw new ApiError('Choose a JPEG, PNG or GIF image under 5 MB.');
    const data=new FormData();data.append('file',file);const token=sessionValue('lankaease_token');
    const response=await fetch(`${API_BASE}/marketplace/media?purpose=${purpose}`,{method:'POST',headers:{Authorization:`Bearer ${token}`},body:data});
    if(!response.ok){const body=await response.json().catch(()=>({}));throw new ApiError(body.message||'Image upload failed.',response.status);}
    return await response.json() as {id:string;url:string};
  },
  setPhoto: (url:string) => request('/marketplace/me/photo',{method:'PATCH',body:JSON.stringify({url})}),
  privateImage: async (url:string) => {
    // Resolve only our own API paths; never forward a bearer token to another host.
    if(!url.startsWith('/api/marketplace/media/'))throw new ApiError('Invalid document location.');
    const response=await fetch(`${BASE_URL}${url}`,{headers:{Authorization:`Bearer ${sessionValue('lankaease_token')}`}});
    if(!response.ok)throw new ApiError('Document access failed.',response.status);
    return URL.createObjectURL(await response.blob());
  },
};

export const api = {
  getCategories: async (): Promise<ServiceCategory[]> => isDemoSession() ? MOCK_CATEGORIES : request('/services'),
  getProviders: async (categoryId?: number): Promise<Provider[]> => isDemoSession()
    ? MOCK_PROVIDERS.filter(p => !categoryId || p.categories.some(c => c.id === categoryId))
    : request(`/providers${categoryId ? `?categoryId=${categoryId}` : ''}`),
  getProviderById: async (id: number): Promise<Provider> => {
    if (!isDemoSession()) return request(`/providers/${id}`);
    const provider = MOCK_PROVIDERS.find(p => p.id === id);
    if (!provider) throw new ApiError('Professional not found.', 404);
    return provider;
  },
  classifyAiProblem: async (problemDescription: string): Promise<SmartAiResponse> => {
    if (!isDemoSession()) return request('/ai/classify', { method: 'POST', body: JSON.stringify({ problemDescription }) });
    const text = problemDescription.toLowerCase();
    const rules: [RegExp, string][] = [
      [/\b(laptop|computer|pc|virus|software)\b/, 'computer-repair'],
      [/\b(mobile|phone|smartphone)\b/, 'mobile-repair'],
      [/\b(clean|cleaning|sofa|dust|wash house)\b/, 'cleaning'],
      [/\b(washing machine|washer|fridge|refrigerator|ac|air conditioner|oven|microwave)\b/, 'appliance-repair'],
      [/\b(wire|wiring|light|socket|electric|electrical|breaker|trip)\b/, 'electrical'],
      [/\b(pipe|leak|leaking|tap|water|drain|sink|toilet)\b/, 'plumbing'],
      [/\b(carpenter|carpentry|chair|table|door|furniture)\b/, 'carpentry'],
      [/\b(car|mechanic|bike|engine|brake)\b/, 'vehicle-repair'],
      [/\b(paint|painting|wall)\b/, 'painting'],
      [/\b(garden|gardening|lawn|plants)\b/, 'gardening'],
      [/\b(tutor|tuition|lesson|maths)\b/, 'tutors'],
      [/\b(move|moving|relocate|transport)\b/, 'moving-transport'],
    ];
    const slug = rules.find(([pattern]) => pattern.test(text))?.[1] || 'home-maintenance';
    const category = MOCK_CATEGORIES.find(c => c.slug === slug)!;
    return { suggestedCategoryName: category.name, suggestedCategoryId: category.id, categorySlug: slug,
      clarifyingQuestions: ['When would you prefer the visit?', 'Are there any access instructions?'],
      summary: `Suggested service: ${category.name}.`, disclaimer: 'Demo categorisation uses keywords; confirm the category before booking.' };
  },
  createServiceRequest: async (payload: Partial<ServiceRequest> & { isDraft?: boolean }): Promise<ServiceRequest> => {
    if (!isDemoSession()) return request('/requests', { method: 'POST', body: JSON.stringify(payload) });
    const category = MOCK_CATEGORIES.find(c => c.id === payload.categoryId);
    if (!category) throw new ApiError('Choose a valid service category.');
    const pro = MOCK_PROVIDERS.find(p => p.id === payload.providerId);
    const family = MOCK_FAMILY_MEMBERS.find(m => m.id === payload.familyMemberId);
    const user: User = JSON.parse(sessionValue('lankaease_user') || '{}');
    const now = new Date().toISOString();
    const record: ServiceRequest = {
      id: Date.now(), requestCode: `REQ-${new Date().getFullYear()}-${crypto.randomUUID().slice(0,8).toUpperCase()}`,
      customerId: user.id || 2, customerName: user.fullName || 'Demo customer', customerPhone: user.phone || '',
      categoryId: category.id, categoryName: category.name, categorySlug: category.slug,
      problemDescription: payload.problemDescription || '', address: payload.address || '',
      latitude: payload.latitude ?? 6.9147, longitude: payload.longitude ?? 79.8510,
      preferredDate: payload.preferredDate || localToday(), preferredTime: payload.preferredTime || '',
      urgency: payload.urgency || 'NORMAL', status: payload.isDraft ? 'DRAFT' : 'CREATED',
      providerId: pro?.id, providerName: pro?.fullName, providerBusinessName: pro?.businessName, providerPhone: pro?.phone,
      familyMemberId: family?.id, familyMemberName: family?.name, familyMemberRelationship: family?.relationship,
      mediaUrls: payload.mediaUrls || [], estimatedPrice: pro?.priceMin || 2500, aiSuggestion: payload.aiSuggestion,
      createdAt: now, updatedAt: now,
    };
    MOCK_REQUESTS.unshift(record);
    try { saveDemo('requests', MOCK_REQUESTS); } catch { MOCK_REQUESTS.shift(); throw new ApiError('Browser storage is full. Remove large attachments and try again.'); }
    return record;
  },
  getRequestById: async (id: number): Promise<ServiceRequest> => {
    if (!isDemoSession()) return request(`/requests/${id}`);
    const record = MOCK_REQUESTS.find(r => r.id === id);
    if (!record) throw new ApiError('Service request not found.', 404);
    return record;
  },
  getCustomerRequests: async (): Promise<ServiceRequest[]> => isDemoSession() ? [...MOCK_REQUESTS] : request('/requests/customer'),
  updateRequestStatus: async (id: number, newStatus: string, notes?: string): Promise<ServiceRequest> => {
    if (!isDemoSession()) return request(`/requests/${id}/status`, { method: 'PATCH', body: JSON.stringify({ newStatus, notes }) });
    const record = MOCK_REQUESTS.find(r => r.id === id);
    if (!record) throw new ApiError('Service request not found.', 404);
    record.status = newStatus as ServiceRequest['status']; record.updatedAt = new Date().toISOString();
    saveDemo('requests', MOCK_REQUESTS); return record;
  },
  getFamilyMembers: async (): Promise<FamilyMember[]> => isDemoSession() ? [...MOCK_FAMILY_MEMBERS] : request('/family'),
  addFamilyMember: async (payload: Pick<FamilyMember, 'name'|'relationship'|'address'> & Partial<FamilyMember>): Promise<FamilyMember> => {
    if (!isDemoSession()) return request('/family', { method: 'POST', body: JSON.stringify(payload) });
    const record: FamilyMember = { ...payload, id: Date.now(), createdAt: new Date().toISOString() };
    MOCK_FAMILY_MEMBERS.push(record);
    try { saveDemo('family', MOCK_FAMILY_MEMBERS); } catch { MOCK_FAMILY_MEMBERS.pop(); throw new ApiError('Browser storage is full. Please try again.'); }
    return record;
  },
  submitContactForm: async (payload: { name: string; email: string; phone: string; message: string }) => {
    const result = await request<{ id?: number }>('/contact', { method: 'POST', body: JSON.stringify(payload) });
    if (!Number.isFinite(result.id)) throw new ApiError('The server could not confirm that your message was saved. Please contact support directly.');
    return true;
  },
  loginUser: (credentials: { email: string; password: string }) => request<{ token: string; accessToken?: string; user: User }>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  registerCustomer: (data: { fullName: string; email: string; password: string; phone: string }) => request<{ token: string; user: User }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  registerProvider: (data: { fullName: string; email: string; password: string; phone: string; businessName?: string }) => request<{ token: string; user: User }>('/auth/register/provider', { method: 'POST', body: JSON.stringify(data) }),
  getInvoices: async (): Promise<Invoice[]> => {
    const requests = await api.getCustomerRequests();
    const rows = await Promise.all(requests.map(async record => {
      try { return await request<Invoice>(`/invoices/request/${record.id}`); }
      catch (error) { if (error instanceof ApiError && error.status === 404) return null; throw error; }
    }));
    return rows.filter((row): row is Invoice => row !== null);
  },
  uploadMedia: async (file: File): Promise<string> => {
    if (!['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm'].includes(file.type)) throw new ApiError('Choose a JPG, PNG, WebP, GIF, MP4, or WebM file.');
    if (file.size > (isDemoSession() ? 2 : 15) * 1024 * 1024) throw new ApiError(isDemoSession() ? 'Demo attachments must be smaller than 2 MB.' : 'Attachments must be smaller than 15 MB.');
    if (isDemoSession()) return new Promise((resolve, reject) => {
      const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new ApiError('The file could not be read.')); reader.readAsDataURL(file);
    });
    const data = new FormData(); data.append('file', file);
    const token = sessionValue('lankaease_token');
    const response = await fetch(`${API_BASE}/uploads`, { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: data });
    if (!response.ok) throw new ApiError('The attachment could not be uploaded.', response.status);
    const body = await response.json(); return new URL(body.url, BASE_URL || location.origin).href;
  },
  getInvoicePdfUrl: (invoiceId: number) => `${API_BASE}/invoices/${invoiceId}/pdf`,
  downloadInvoice: async (invoiceId: number) => {
    if (isDemoSession()) throw new ApiError('Sample invoices do not have official PDFs. Sign in with a real account to download a saved invoice.');
    const res = await fetch(`${API_BASE}/invoices/${invoiceId}/pdf`, { headers: getAuthHeaders() });
    if (!res.ok) throw new ApiError('The invoice could not be downloaded.', res.status);
    const url = URL.createObjectURL(await res.blob()); const link = document.createElement('a');
    link.href = url; link.download = `Invoice-${invoiceId}.pdf`; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  },
};
