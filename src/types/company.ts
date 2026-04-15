import type { SubscriptionStatus } from "./enums";

export interface Company {
  id: number;
  name: string;
  contactEmail: string;
  contactPhone: string | null;
  billingEmail: string;
  focalPointName: string | null;
  subscriptionStatus: SubscriptionStatus;
  isInternal: boolean;
  customerCount: number;
  siteCount: number;
  deviceCount: number;
  createdAt: string;
}

export interface SiteSummary {
  id: number;
  customerId: number;
  name: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  deviceCount: number;
  createdAt: string;
}

export interface CustomerSummary {
  id: number;
  companyId: number | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  siteCount: number;
  createdAt: string;
}

export interface CreateCompanyRequest {
  name: string;
  contactEmail: string;
  contactPhone?: string;
  billingEmail: string;
  focalPointName?: string;
  subscriptionStatus?: SubscriptionStatus;
  isInternal: boolean;
}

export interface CreateSiteRequest {
  customerId: number;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  timezone: string;
}

export interface CreateCustomerRequest {
  companyId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}
