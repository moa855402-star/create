export type ItemCategory = 'assignment' | 'important';

export type SubjectName =
  | 'Math'
  | 'Science'
  | 'English'
  | 'History'
  | 'Language'
  | 'General';

export type DeviceType = 'laptop' | 'ipad' | 'phone';

export interface SchoolItem {
  id: string;
  title: string;
  category: ItemCategory;
  subject: SubjectName;
  dueAt: string; // ISO string
  points: number;
  completed: boolean;
  completedAt?: string;
  completedOnTime?: boolean;
  bonusAwarded?: number;
  notes?: string;
  requiresLockClearance: boolean;
}

export interface SyncedDevice {
  id: string;
  name: string;
  platform: string;
  type: DeviceType;
  shieldEnabled: boolean;
  lastSyncedAt: string;
}

export interface ManagedApp {
  id: string;
  name: string;
  category: 'Social' | 'Games' | 'Video' | 'Messaging';
  devices: DeviceType[];
  lockedWhenIncomplete: boolean;
}

export interface GiftCardOffer {
  id: string;
  brand: string;
  valueUsd: number;
  pointCost: number;
  brandColor: string;
  description: string;
}

export interface RedeemedGiftCard {
  id: string;
  offerId: string;
  brand: string;
  valueUsd: number;
  pointCost: number;
  code: string;
  redeemedAt: string;
}

export interface PointTransaction {
  id: string;
  label: string;
  delta: number;
  timestamp: string;
  type: 'earned' | 'bonus' | 'redeemed' | 'reversed';
}

export interface AppState {
  items: SchoolItem[];
  devices: SyncedDevice[];
  apps: ManagedApp[];
  points: number;
  onTimeStreakDays: number;
  allClearBonusClaimedDate: string | null; // YYYY-MM-DD local date
  redeemedCards: RedeemedGiftCard[];
  transactions: PointTransaction[];
  strictLockMode: boolean;
}

export interface ItemFilters {
  search: string;
  category: 'all' | ItemCategory;
  status: 'all' | 'active' | 'completed' | 'lock-required';
  subject: 'all' | SubjectName;
}

export interface NewItemInput {
  title: string;
  category: ItemCategory;
  subject: SubjectName;
  dueAt: string;
  points: number;
  notes?: string;
  requiresLockClearance: boolean;
}

export interface ValidationErrors {
  title?: string;
  dueAt?: string;
  points?: string;
}
