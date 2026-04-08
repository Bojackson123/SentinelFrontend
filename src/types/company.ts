import type { SubscriptionStatus } from "./enums";

export interface Company {
  id: number;
  name: string;
  contactEmail: string;
  contactPhone: string | null;
  billingEmail: string;
  focalPointName: string | null;
  subscriptionStatus: SubscriptionStatus;
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
