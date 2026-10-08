export type Role = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
export type Urgency = 'NORMAL' | 'TODAY' | 'URGENT';
export type RequestStatus = 
  | 'DRAFT'
  | 'CREATED'
  | 'PROVIDER_FOUND'
  | 'ACCEPTED'
  | 'ON_THE_WAY'
  | 'ARRIVED'
  | 'WORKING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REVIEWED';

export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'MORE_INFO';
export type PaymentMethod = 'CARD' | 'PAYHERE' | 'STRIPE' | 'BANK_TRANSFER' | 'CASH';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type Relationship = 'MOTHER' | 'FATHER' | 'SISTER' | 'BROTHER' | 'OTHER';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  preferredLanguage: string;
  profileImage?: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  isActive: boolean;
}

export interface Provider {
  id: number;
  userId: number;
  fullName: string;
  businessName: string;
  description: string;
  experienceYears: number;
  priceMin: number;
  priceMax: number;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  ratingAvg: number;
  jobsCompletedCount: number;
  responseTimeMinutes: number;
  isAvailable: boolean;
  currentLatitude: number;
  currentLongitude: number;
  profileImage?: string;
  phone: string;
  email: string;
  categories: ServiceCategory[];
  serviceCities: string[];
}

export interface FamilyMember {
  id: number;
  name: string;
  relationship: Relationship;
  phone?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
}

export interface ServiceRequest {
  id: number;
  requestCode: string;
  customerId: number;
  customerName: string;
  customerPhone: string;
  customerImage?: string;
  familyMemberId?: number;
  familyMemberName?: string;
  familyMemberRelationship?: string;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  providerId?: number;
  providerName?: string;
  providerBusinessName?: string;
  providerPhone?: string;
  problemDescription: string;
  aiSuggestion?: string;
  address: string;
  latitude: number;
  longitude: number;
  preferredDate?: string;
  preferredTime?: string;
  urgency: Urgency;
  status: RequestStatus;
  estimatedPrice?: number;
  finalPrice?: number;
  cancelReason?: string;
  mediaUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: number;
  otherUserId: number;
  otherUserName: string;
  otherUserProfileImage?: string;
  requestId?: number;
  requestCode?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  senderProfileImage?: string;
  textContent: string;
  mediaUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  referenceId?: string;
  createdAt: string;
}

export interface Payment {
  id: number;
  paymentCode: string;
  requestId: number;
  requestCode: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionReference?: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  requestId: number;
  requestCode: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  providerName: string;
  providerBusinessName: string;
  providerPhone: string;
  labourFee: number;
  partsFee: number;
  serviceFee: number;
  totalAmount: number;
  paymentStatus: string;
  items: InvoiceItem[];
  createdAt: string;
}

export interface Review {
  id: number;
  requestId: number;
  requestCode: string;
  customerName: string;
  customerProfileImage?: string;
  providerId: number;
  providerBusinessName: string;
  rating: number;
  reviewText: string;
  photoUrl?: string;
  createdAt: string;
}

export interface SmartAiResponse {
  suggestedCategoryName: string;
  suggestedCategoryId: number;
  categorySlug: string;
  clarifyingQuestions: string[];
  summary: string;
  disclaimer: string;
}

export interface AdminStats {
  totalUsers: number;
  totalCustomers: number;
  totalProviders: number;
  pendingVerifications: number;
  activeRequests: number;
  completedRequests: number;
  totalRevenue: number;
}
