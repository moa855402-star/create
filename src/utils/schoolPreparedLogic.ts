import type {
  AppState,
  DeviceType,
  GiftCardOffer,
  ItemFilters,
  ManagedApp,
  NewItemInput,
  RedeemedGiftCard,
  SchoolItem,
  SubjectName,
  SyncedDevice,
  ValidationErrors,
} from '../types/schoolPrepared';

export const ALL_CLEAR_BONUS_POINTS = 50;

export const SUBJECTS: SubjectName[] = [
  'Math',
  'Science',
  'English',
  'History',
  'Language',
  'General',
];

export const GIFT_CARD_CATALOG: GiftCardOffer[] = [
  {
    id: 'gc-starbucks-5',
    brand: 'Starbucks',
    valueUsd: 5,
    pointCost: 300,
    brandColor: '#00704A',
    description: 'Digital drink & bakery e-gift card',
  },
  {
    id: 'gc-spotify-5',
    brand: 'Spotify',
    valueUsd: 5,
    pointCost: 400,
    brandColor: '#1DB954',
    description: 'Music & study playlist credit',
  },
  {
    id: 'gc-apple-5',
    brand: 'Apple',
    valueUsd: 5,
    pointCost: 450,
    brandColor: '#1D1D1F',
    description: 'App Store, iTunes & Apple Books',
  },
  {
    id: 'gc-amazon-10',
    brand: 'Amazon',
    valueUsd: 10,
    pointCost: 750,
    brandColor: '#FF9900',
    description: 'Books, tech & everyday essentials',
  },
  {
    id: 'gc-nintendo-10',
    brand: 'Nintendo eShop',
    valueUsd: 10,
    pointCost: 800,
    brandColor: '#E60012',
    description: 'Switch digital games & DLC credit',
  },
  {
    id: 'gc-target-15',
    brand: 'Target',
    valueUsd: 15,
    pointCost: 1100,
    brandColor: '#CC0000',
    description: 'Online & in-store e-gift voucher',
  },
];

export function getLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addHours(base: Date, hours: number): string {
  return new Date(base.getTime() + hours * 60 * 60 * 1000).toISOString();
}

function addDaysAtHour(base: Date, days: number, hour: number, minute = 0): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export function createInitialState(now: Date = new Date()): AppState {
  const todayEvening = new Date(now);
  todayEvening.setHours(21, 0, 0, 0);
  if (todayEvening.getTime() <= now.getTime() + 60 * 60 * 1000) {
    todayEvening.setTime(now.getTime() + 3 * 60 * 60 * 1000);
  }

  const items: SchoolItem[] = [
    {
      id: 'item-1',
      title: 'AP Biology Lab 4 — Cellular Respiration',
      category: 'assignment',
      subject: 'Science',
      dueAt: addHours(now, 3),
      points: 60,
      completed: false,
      notes: 'Complete data table & analysis questions 1–5 before submitting.',
      requiresLockClearance: true,
    },
    {
      id: 'item-2',
      title: 'Pack graphing calculator & signed field trip slip',
      category: 'important',
      subject: 'General',
      dueAt: todayEvening.toISOString(),
      points: 40,
      completed: false,
      notes: 'Leave by backpack front zipper so it is ready for tomorrow morning.',
      requiresLockClearance: true,
    },
    {
      id: 'item-3',
      title: 'Algebra II Problem Set 7 (Even problems)',
      category: 'assignment',
      subject: 'Math',
      dueAt: addHours(now, -2),
      points: 50,
      completed: true,
      completedAt: addHours(now, -3),
      completedOnTime: true,
      notes: 'Checked answers against syllabus key.',
      requiresLockClearance: true,
    },
    {
      id: 'item-4',
      title: 'World History Primary Source Outline',
      category: 'assignment',
      subject: 'History',
      dueAt: addDaysAtHour(now, 1, 17, 0),
      points: 65,
      completed: false,
      notes: 'Two-page outline on Industrial Revolution primary letters.',
      requiresLockClearance: false,
    },
    {
      id: 'item-5',
      title: 'Charge school laptop & iPad to 100%',
      category: 'important',
      subject: 'General',
      dueAt: addDaysAtHour(now, 1, 8, 0),
      points: 25,
      completed: true,
      completedAt: addHours(now, -1),
      completedOnTime: true,
      notes: 'Plugged in at desk charging dock.',
      requiresLockClearance: false,
    },
    {
      id: 'item-6',
      title: 'Spanish III Oral Presentation Note Cards',
      category: 'assignment',
      subject: 'Language',
      dueAt: addDaysAtHour(now, 2, 14, 0),
      points: 55,
      completed: false,
      notes: 'Prepare 6 index cards in Spanish without full sentences.',
      requiresLockClearance: false,
    },
    {
      id: 'item-7',
      title: 'AP English Essay Rough Draft Peer Review',
      category: 'assignment',
      subject: 'English',
      dueAt: addDaysAtHour(now, 3, 23, 59),
      points: 70,
      completed: false,
      notes: 'Leave 3 constructive margin comments for partner.',
      requiresLockClearance: false,
    },
  ];

  const devices: SyncedDevice[] = [
    {
      id: 'dev-laptop',
      name: 'MacBook Air',
      platform: 'macOS',
      type: 'laptop',
      shieldEnabled: true,
      lastSyncedAt: addHours(now, -0.05),
    },
    {
      id: 'dev-ipad',
      name: 'iPad Air',
      platform: 'iPadOS',
      type: 'ipad',
      shieldEnabled: true,
      lastSyncedAt: addHours(now, -0.08),
    },
    {
      id: 'dev-phone',
      name: 'iPhone 15',
      platform: 'iOS',
      type: 'phone',
      shieldEnabled: true,
      lastSyncedAt: addHours(now, -0.02),
    },
  ];

  const apps: ManagedApp[] = [
    {
      id: 'app-tiktok',
      name: 'TikTok',
      category: 'Video',
      devices: ['phone', 'ipad'],
      lockedWhenIncomplete: true,
    },
    {
      id: 'app-youtube',
      name: 'YouTube',
      category: 'Video',
      devices: ['laptop', 'ipad', 'phone'],
      lockedWhenIncomplete: true,
    },
    {
      id: 'app-instagram',
      name: 'Instagram',
      category: 'Social',
      devices: ['phone', 'ipad', 'laptop'],
      lockedWhenIncomplete: true,
    },
    {
      id: 'app-discord',
      name: 'Discord',
      category: 'Messaging',
      devices: ['laptop', 'phone'],
      lockedWhenIncomplete: true,
    },
    {
      id: 'app-roblox',
      name: 'Roblox',
      category: 'Games',
      devices: ['laptop', 'ipad', 'phone'],
      lockedWhenIncomplete: true,
    },
    {
      id: 'app-netflix',
      name: 'Netflix',
      category: 'Video',
      devices: ['laptop', 'ipad', 'phone'],
      lockedWhenIncomplete: true,
    },
    {
      id: 'app-minecraft',
      name: 'Minecraft',
      category: 'Games',
      devices: ['laptop', 'ipad'],
      lockedWhenIncomplete: false,
    },
    {
      id: 'app-snapchat',
      name: 'Snapchat',
      category: 'Social',
      devices: ['phone'],
      lockedWhenIncomplete: true,
    },
  ];

  return {
    items,
    devices,
    apps,
    points: 320,
    onTimeStreakDays: 4,
    allClearBonusClaimedDate: null,
    redeemedCards: [],
    transactions: [
      {
        id: 'tx-1',
        label: 'Algebra II Problem Set 7 (On Time)',
        delta: 50,
        timestamp: addHours(now, -3),
        type: 'earned',
      },
      {
        id: 'tx-2',
        label: 'Charge school laptop & iPad to 100%',
        delta: 25,
        timestamp: addHours(now, -1),
        type: 'earned',
      },
      {
        id: 'tx-3',
        label: '4-Day On-Time Streak Reward',
        delta: 245,
        timestamp: addDaysAtHour(now, -1, 20, 15),
        type: 'bonus',
      },
    ],
    strictLockMode: true,
  };
}

export function isItemOverdue(item: SchoolItem, now: Date = new Date()): boolean {
  if (item.completed) return false;
  return new Date(item.dueAt).getTime() < now.getTime();
}

export function isItemDueTodayOrEarlier(item: SchoolItem, now: Date = new Date()): boolean {
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);
  return new Date(item.dueAt).getTime() <= endOfToday.getTime();
}

export interface LockStatusSummary {
  blockingItems: SchoolItem[];
  allRequiredItems: SchoolItem[];
  completedRequiredCount: number;
  completionPercent: number;
  anyDeviceShieldActive: boolean;
  isDeviceLocked: boolean;
  lockedApps: ManagedApp[];
}

export function getLockStatus(
  items: SchoolItem[],
  devices: SyncedDevice[],
  apps: ManagedApp[],
): LockStatusSummary {
  const allRequiredItems = items.filter((item) => item.requiresLockClearance);
  const blockingItems = allRequiredItems.filter((item) => !item.completed);
  const completedRequiredCount = allRequiredItems.length - blockingItems.length;
  const completionPercent =
    allRequiredItems.length === 0
      ? 100
      : Math.round((completedRequiredCount / allRequiredItems.length) * 100);

  const anyDeviceShieldActive = devices.some((d) => d.shieldEnabled);
  const isDeviceLocked = blockingItems.length > 0 && anyDeviceShieldActive;
  const lockedApps = isDeviceLocked
    ? apps.filter((app) => app.lockedWhenIncomplete)
    : [];

  return {
    blockingItems,
    allRequiredItems,
    completedRequiredCount,
    completionPercent,
    anyDeviceShieldActive,
    isDeviceLocked,
    lockedApps,
  };
}

export function isAppLockedOnDevice(
  app: ManagedApp,
  deviceType: DeviceType | 'all',
  devices: SyncedDevice[],
  isDeviceLocked: boolean,
): boolean {
  if (!isDeviceLocked || !app.lockedWhenIncomplete) return false;
  if (deviceType === 'all') {
    return devices.some(
      (d) => d.shieldEnabled && app.devices.includes(d.type),
    );
  }
  const targetDevice = devices.find((d) => d.type === deviceType);
  return Boolean(
    targetDevice &&
      targetDevice.shieldEnabled &&
      app.devices.includes(deviceType),
  );
}

export function toggleItemCompletion(
  state: AppState,
  itemId: string,
  now: Date = new Date(),
): { nextState: AppState; pointsDelta: number; unlockedNow: boolean; bonusAwarded: number } {
  const target = state.items.find((item) => item.id === itemId);
  if (!target) {
    return { nextState: state, pointsDelta: 0, unlockedNow: false, bonusAwarded: 0 };
  }

  const todayKey = getLocalDateKey(now);
  const wasLockedBefore =
    state.items.some((i) => i.requiresLockClearance && !i.completed) &&
    state.devices.some((d) => d.shieldEnabled);

  if (!target.completed) {
    const onTime = now.getTime() <= new Date(target.dueAt).getTime();
    const earnedPoints = onTime ? target.points : 0;

    const updatedItems = state.items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            completed: true,
            completedAt: now.toISOString(),
            completedOnTime: onTime,
          }
        : item,
    );

    const remainingBlocking = updatedItems.filter(
      (i) => i.requiresLockClearance && !i.completed,
    );
    const unlockedNow = wasLockedBefore && remainingBlocking.length === 0;

    // Check if all lock-required items are completed and on-time for today's All-Clear Bonus
    const allRequiredOnTime = updatedItems
      .filter((i) => i.requiresLockClearance)
      .every((i) => i.completed && i.completedOnTime !== false);

    let bonusAwarded = 0;
    let nextBonusDate = state.allClearBonusClaimedDate;

    if (
      remainingBlocking.length === 0 &&
      updatedItems.some((i) => i.requiresLockClearance) &&
      allRequiredOnTime &&
      state.allClearBonusClaimedDate !== todayKey
    ) {
      bonusAwarded = ALL_CLEAR_BONUS_POINTS;
      nextBonusDate = todayKey;
    }

    const newTransactions = [...state.transactions];
    if (earnedPoints > 0) {
      newTransactions.unshift({
        id: `tx-${now.getTime()}-${itemId}`,
        label: `${target.title} (On Time)`,
        delta: earnedPoints,
        timestamp: now.toISOString(),
        type: 'earned',
      });
    } else {
      newTransactions.unshift({
        id: `tx-${now.getTime()}-${itemId}-late`,
        label: `${target.title} (Completed Late — 0 pts)`,
        delta: 0,
        timestamp: now.toISOString(),
        type: 'earned',
      });
    }

    if (bonusAwarded > 0) {
      newTransactions.unshift({
        id: `tx-${now.getTime()}-bonus`,
        label: 'All Lock Tasks Completed On Time Bonus',
        delta: bonusAwarded,
        timestamp: now.toISOString(),
        type: 'bonus',
      });
    }

    const totalDelta = earnedPoints + bonusAwarded;

    return {
      nextState: {
        ...state,
        items: updatedItems,
        points: state.points + totalDelta,
        allClearBonusClaimedDate: nextBonusDate,
        transactions: newTransactions.slice(0, 30),
      },
      pointsDelta: totalDelta,
      unlockedNow,
      bonusAwarded,
    };
  } else {
    // Reversing completion removes points previously earned by that item so points cannot be farmed
    const pointsToReverse = target.completedOnTime ? target.points : 0;
    const updatedItems = state.items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            completed: false,
            completedAt: undefined,
            completedOnTime: undefined,
          }
        : item,
    );

    const newTransactions = [...state.transactions];
    if (pointsToReverse > 0) {
      newTransactions.unshift({
        id: `tx-${now.getTime()}-rev-${itemId}`,
        label: `Unchecked: ${target.title}`,
        delta: -pointsToReverse,
        timestamp: now.toISOString(),
        type: 'reversed',
      });
    }

    return {
      nextState: {
        ...state,
        items: updatedItems,
        points: Math.max(0, state.points - pointsToReverse),
        transactions: newTransactions.slice(0, 30),
      },
      pointsDelta: -pointsToReverse,
      unlockedNow: false,
      bonusAwarded: 0,
    };
  }
}

export function validateNewItem(input: NewItemInput): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!input.title || input.title.trim().length < 2) {
    errors.title = 'Enter a title of at least 2 characters.';
  }
  if (!input.dueAt || Number.isNaN(new Date(input.dueAt).getTime())) {
    errors.dueAt = 'Select a valid due date and time.';
  }
  if (!Number.isFinite(input.points) || input.points < 10 || input.points > 500) {
    errors.points = 'Points must be between 10 and 500.';
  }
  return errors;
}

export function addSchoolItem(
  state: AppState,
  input: NewItemInput,
  now: Date = new Date(),
): AppState {
  const newItem: SchoolItem = {
    id: `item-${now.getTime()}-${Math.random().toString(36).slice(2, 6)}`,
    title: input.title.trim(),
    category: input.category,
    subject: input.subject,
    dueAt: new Date(input.dueAt).toISOString(),
    points: Math.round(input.points),
    completed: false,
    notes: input.notes?.trim() || undefined,
    requiresLockClearance: input.requiresLockClearance,
  };

  return {
    ...state,
    items: [newItem, ...state.items],
  };
}

export function deleteSchoolItem(state: AppState, itemId: string): AppState {
  return {
    ...state,
    items: state.items.filter((item) => item.id !== itemId),
  };
}

export function generateGiftCardCode(seedValue: number): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let acc = (Math.floor(seedValue) ^ 0x9e3779b9) >>> 0;
  if (acc === 0) acc = 2463534242;
  const block = () => {
    let out = '';
    for (let i = 0; i < 4; i++) {
      acc ^= acc << 13;
      acc ^= acc >>> 17;
      acc ^= acc << 5;
      acc = (Math.imul(acc, 0x45d9f3b) + 12345) >>> 0;
      out += chars[acc % chars.length];
    }
    return out;
  };
  return `SP-${block()}-${block()}-${block()}`;
}

export function redeemGiftCard(
  state: AppState,
  offer: GiftCardOffer,
  now: Date = new Date(),
): { ok: true; nextState: AppState; card: RedeemedGiftCard } | { ok: false; error: string } {
  if (state.points < offer.pointCost) {
    return {
      ok: false,
      error: `You need ${offer.pointCost - state.points} more points to redeem ${offer.brand} ($${offer.valueUsd}).`,
    };
  }

  const card: RedeemedGiftCard = {
    id: `card-${now.getTime()}-${Math.random().toString(36).slice(2, 6)}`,
    offerId: offer.id,
    brand: offer.brand,
    valueUsd: offer.valueUsd,
    pointCost: offer.pointCost,
    code: generateGiftCardCode(now.getTime() + state.redeemedCards.length * 97),
    redeemedAt: now.toISOString(),
  };

  const nextState: AppState = {
    ...state,
    points: state.points - offer.pointCost,
    redeemedCards: [card, ...state.redeemedCards],
    transactions: [
      {
        id: `tx-${now.getTime()}-redeem`,
        label: `Redeemed $${offer.valueUsd} ${offer.brand} e-Gift Card`,
        delta: -offer.pointCost,
        timestamp: now.toISOString(),
        type: 'redeemed' as const,
      },
      ...state.transactions,
    ].slice(0, 30),
  };

  return { ok: true, nextState, card };
}

export function filterAndSortItems(
  items: SchoolItem[],
  filters: ItemFilters,
): SchoolItem[] {
  const query = filters.search.trim().toLowerCase();

  return items
    .filter((item) => {
      if (filters.category !== 'all' && item.category !== filters.category) {
        return false;
      }
      if (filters.subject !== 'all' && item.subject !== filters.subject) {
        return false;
      }
      if (filters.status === 'active' && item.completed) {
        return false;
      }
      if (filters.status === 'completed' && !item.completed) {
        return false;
      }
      if (
        filters.status === 'lock-required' &&
        (!item.requiresLockClearance || item.completed)
      ) {
        return false;
      }
      if (query.length > 0) {
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesSubject = item.subject.toLowerCase().includes(query);
        const matchesNotes = item.notes?.toLowerCase().includes(query) ?? false;
        if (!matchesTitle && !matchesSubject && !matchesNotes) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      // Incomplete items first, lock-required items prioritized, then earliest due date
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (!a.completed && a.requiresLockClearance !== b.requiresLockClearance) {
        return a.requiresLockClearance ? -1 : 1;
      }
      return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
    });
}

export function formatDueLabel(dueIso: string, now: Date = new Date()): {
  label: string;
  urgency: 'overdue' | 'today' | 'upcoming';
} {
  const due = new Date(dueIso);
  const diffMs = due.getTime() - now.getTime();
  const timeStr = due.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  if (diffMs < 0) {
    return { label: `Overdue · ${timeStr}`, urgency: 'overdue' };
  }

  const todayKey = getLocalDateKey(now);
  const dueKey = getLocalDateKey(due);

  if (todayKey === dueKey) {
    return { label: `Today, ${timeStr}`, urgency: 'today' };
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (getLocalDateKey(tomorrow) === dueKey) {
    return { label: `Tomorrow, ${timeStr}`, urgency: 'upcoming' };
  }

  const dayLabel = due.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  return { label: `${dayLabel}, ${timeStr}`, urgency: 'upcoming' };
}

export function toLocalDateTimeInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
