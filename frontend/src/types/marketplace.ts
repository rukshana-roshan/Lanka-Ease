import type { Provider } from './index';
export interface WorkHours { day: string; opens: string; closes: string }
export interface ProviderDetails {
  whatsapp: string; subcategory: string; qualifications: string; province: string; district: string; city: string;
  portfolio: string[]; hours: WorkHours[]; blockedDates: string[]; emergency: boolean;
  availabilityStatus: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
}
export interface Offering { id?: number; categoryId: number; categoryName?: string; title: string; description: string;
  priceMin: number; priceMax: number; durationMinutes: number; active: boolean }
export interface MarketplaceProvider extends Provider { details: ProviderDetails; services: Offering[]; reviewCount: number; createdAt: string }
export interface ProfileUpdate { fullName: string; businessName: string; email: string; phone: string; profileImage?: string;
  description: string; experienceYears: number; priceMin: number; priceMax: number; categoryIds: number[];
  serviceCities: string[]; details: ProviderDetails }
export interface DirectoryResult { content: MarketplaceProvider[]; totalElements: number; totalPages: number; page: number;
  categoryCounts: Record<string, number>; allCount: number; locations: {province: string; district: string; city: string}[] }
export interface MarketplaceReview { id: number; customerName: string; rating: number; reviewText: string; createdAt: string }
export interface Verification { id: number; providerId: number; providerName: string; status: string; idDocument: string; businessDocument?: string; notes?: string }
export interface ProviderReport { id: number; providerId: number; providerName: string; reviewId?: number; reason: string; status: string; notes?: string }
