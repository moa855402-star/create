import React, { useEffect, useState } from 'react';
import {
  CheckSquare,
  Gift,
  Laptop,
  Lock,
  LockOpen,
  Plus,
  Shield,
  Coins,
} from 'lucide-react';
import type {
  AppState,
  DeviceType,
  GiftCardOffer,
  ItemFilters,
  ManagedApp,
  NewItemInput,
  RedeemedGiftCard,
} from './types/schoolPrepared';
import {
  addSchoolItem,
  createInitialState,
  deleteSchoolItem,
  getLockStatus,
  redeemGiftCard,
  toggleItemCompletion,
} from './utils/schoolPreparedLogic';
import { PlannerView } from './components/PlannerView';
import { AppLockView } from './components/AppLockView';
import { RewardsView } from './components/RewardsView';
import { DevicesView } from './components/DevicesView';
import { AddItemModal } from './components/AddItemModal';
import { AppLockGateModal } from './components/AppLockGateModal';
import { LoadingScreen } from './components/LoadingScreen';

type ActiveTab = 'planner' | 'applock' | 'rewards' | 'devices';

const STORAGE_KEY = 'school_prepared_state_v1';

function loadSavedState(): AppState {
  if (typeof window === 'undefined') {
    return createInitialState();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as AppState;
    if (
      !parsed ||
      !Array.isArray(parsed.items) ||
      !Array.isArray(parsed.devices) ||
      !Array.isArray(parsed.apps) ||
      typeof parsed.points !== 'number'
    ) {
      return createInitialState();
    }
    return parsed;
  } catch {
    return createInitialState();
  }
}

const TAB_TITLES: Record<ActiveTab, string> = {
  planner: 'Assignments & Important Things',
  applock: 'Device App Lock',
  rewards: 'Points & E-Gift Cards',
  devices: 'Synced Devices',
};

export default function App() {
  const [hasEnteredApp, setHasEnteredApp] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('autostart') === '1';
  });
  const [state, setState] = useState<AppState>(() => loadSavedState());
  const [activeTab, setActiveTab] = useState<ActiveTab>('planner');
  const [filters, setFilters] = useState<ItemFilters>({
    search: '',
    category: 'all',
    status: 'all',
    subject: 'all',
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewApp, setPreviewApp] = useState<ManagedApp | null>(null);
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const showFeedback = (message: string) => {
    setFeedbackBanner(message);
  };

  useEffect(() => {
    if (!feedbackBanner) return;
    const timer = setTimeout(() => setFeedbackBanner(null), 4000);
    return () => clearTimeout(timer);
  }, [feedbackBanner]);

  const lockStatus = getLockStatus(state.items, state.devices, state.apps);

  const handleToggleComplete = (itemId: string) => {
    const now = new Date();
    const result = toggleItemCompletion(state, itemId, now);
    setState(result.nextState);

    if (result.unlockedNow && result.bonusAwarded > 0) {
      showFeedback(
        `All apps unlocked! Earned +${result.pointsDelta} pts (including +${result.bonusAwarded} pt on-time bonus).`,
      );
    } else if (result.unlockedNow) {
      showFeedback('All required tasks finished — your device apps are now unlocked.');
    } else if (result.pointsDelta > 0) {
      showFeedback(`Task completed on time (+${result.pointsDelta} pts).`);
    }
  };

  const handleToggleLockRequirement = (itemId: string) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId
          ? { ...item, requiresLockClearance: !item.requiresLockClearance }
          : item,
      ),
    }));
  };

  const handleDeleteItem = (itemId: string) => {
    setState((prev) => deleteSchoolItem(prev, itemId));
  };

  const handleAddItem = (input: NewItemInput) => {
    setState((prev) => addSchoolItem(prev, input, new Date()));
    showFeedback(
      input.requiresLockClearance
        ? `Added "${input.title.trim()}" — App Lock active until completed.`
        : `Added "${input.title.trim()}" to your organizer.`,
    );
  };

  const handleToggleAppShield = (appId: string) => {
    setState((prev) => ({
      ...prev,
      apps: prev.apps.map((app) =>
        app.id === appId
          ? { ...app, lockedWhenIncomplete: !app.lockedWhenIncomplete }
          : app,
      ),
    }));
  };

  const handleToggleDeviceShield = (deviceId: string) => {
    setState((prev) => ({
      ...prev,
      devices: prev.devices.map((d) =>
        d.id === deviceId ? { ...d, shieldEnabled: !d.shieldEnabled } : d,
      ),
    }));
  };

  const handleSyncAllDevices = () => {
    const nowIso = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      devices: prev.devices.map((d) => ({ ...d, lastSyncedAt: nowIso })),
    }));
  };

  const handleAddDevice = (name: string, type: DeviceType) => {
    const platformMap: Record<DeviceType, string> = {
      laptop: 'Laptop OS',
      ipad: 'iPadOS',
      phone: 'Mobile OS',
    };
    setState((prev) => ({
      ...prev,
      devices: [
        ...prev.devices,
        {
          id: `dev-${Date.now()}`,
          name,
          platform: platformMap[type],
          type,
          shieldEnabled: true,
          lastSyncedAt: new Date().toISOString(),
        },
      ],
    }));
    showFeedback(`Connected ${name} with App Shield enabled.`);
  };

  const handleRedeemOffer = (offer: GiftCardOffer): RedeemedGiftCard | null => {
    const result = redeemGiftCard(state, offer, new Date());
    if (!result.ok) {
      showFeedback(result.error);
      return null;
    }
    setState(result.nextState);
    showFeedback(`Redeemed $${offer.valueUsd} ${offer.brand} e-Gift Card.`);
    return result.card;
  };

  const sampleLockedApp =
    lockStatus.lockedApps[0] ?? state.apps.find((a) => a.lockedWhenIncomplete) ?? state.apps[0] ?? null;

  const navItems: {
    id: ActiveTab;
    label: string;
    shortLabel: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'planner', label: 'Planner', shortLabel: 'Planner', icon: CheckSquare },
    { id: 'applock', label: 'App Lock', shortLabel: 'App Lock', icon: Shield },
    { id: 'rewards', label: 'E-Gift Cards', shortLabel: 'Rewards', icon: Gift },
    { id: 'devices', label: 'Devices', shortLabel: 'Devices', icon: Laptop },
  ];

  if (!hasEnteredApp) {
    return <LoadingScreen onContinue={() => setHasEnteredApp(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col md:flex-row">
      {/* Desktop & iPad Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-slate-200 z-30">
        <div className="h-16 px-6 flex items-center border-b border-slate-200">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('planner');
            }}
            className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            School Prepared
          </a>
        </div>

        <nav aria-label="Primary navigation" className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-800 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </span>
                {item.id === 'applock' && (
                  <span
                    className={`text-xs font-mono tabular-nums ${
                      lockStatus.isDeviceLocked ? 'text-amber-700' : 'text-emerald-700'
                    }`}
                  >
                    {lockStatus.isDeviceLocked ? 'Locked' : 'Open'}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Summary Footer */}
        <div className="p-4 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Shield Status</span>
            <span
              className={`font-medium inline-flex items-center gap-1 ${
                lockStatus.isDeviceLocked ? 'text-amber-800' : 'text-emerald-700'
              }`}
            >
              {lockStatus.isDeviceLocked ? (
                <>
                  <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{lockStatus.blockingItems.length} left</span>
                </>
              ) : (
                <>
                  <LockOpen className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Unlocked</span>
                </>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Reward Points</span>
            <span className="font-mono font-semibold text-slate-900 tabular-nums">
              {state.points} pts
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">On-Time Streak</span>
            <span className="font-mono font-semibold text-slate-900 tabular-nums">
              {state.onTimeStreakDays} days
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar (<= 52px to stay within 15% sticky budget with bottom bar) */}
      <header className="md:hidden sticky top-0 z-30 h-[52px] px-4 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between gap-3">
        <span className="font-display text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
          School Prepared
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('rewards')}
            aria-label={`Points balance: ${state.points} points`}
            className="min-h-[36px] px-2.5 py-1 text-xs font-mono font-semibold text-slate-800 bg-slate-100 rounded-lg tabular-nums whitespace-nowrap"
          >
            {state.points} pts
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="min-h-[36px] px-3 py-1.5 text-xs font-semibold text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 whitespace-nowrap inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Add</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Desktop Header */}
        <header className="hidden md:flex h-16 px-8 bg-white border-b border-slate-200 items-center justify-between gap-8 sticky top-0 z-20">
          <h1 className="font-display text-xl font-bold text-slate-900 truncate">
            {TAB_TITLES[activeTab]}
          </h1>

          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('rewards')}
              aria-label={`View rewards — ${state.points} points available`}
              className="min-h-[40px] px-3.5 py-1.5 text-sm font-mono font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors tabular-nums inline-flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <Coins className="w-4 h-4 text-indigo-700" aria-hidden="true" />
              <span>{state.points} pts</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="min-h-[40px] px-4 py-2 text-sm font-semibold text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Add Assignment</span>
            </button>
          </div>
        </header>

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-5 sm:py-6 space-y-5">
          {/* Mobile Section Title */}
          <h1 className="md:hidden font-display text-xl font-bold text-slate-900">
            {TAB_TITLES[activeTab]}
          </h1>

          {/* Live Action Feedback Toast */}
          {feedbackBanner && (
            <div
              role="status"
              aria-live="polite"
              className="bg-slate-900 text-white text-sm font-medium px-4 py-3 rounded-xl flex items-center justify-between gap-3"
            >
              <span>{feedbackBanner}</span>
              <button
                type="button"
                onClick={() => setFeedbackBanner(null)}
                className="text-xs text-slate-300 hover:text-white underline shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          {activeTab === 'planner' && (
            <PlannerView
              items={state.items}
              filters={filters}
              lockStatus={lockStatus}
              sampleLockedApp={sampleLockedApp}
              onChangeFilters={setFilters}
              onToggleComplete={handleToggleComplete}
              onToggleLockRequirement={handleToggleLockRequirement}
              onDeleteItem={handleDeleteItem}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onPreviewLockScreen={(app) => setPreviewApp(app)}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'applock' && (
            <AppLockView
              apps={state.apps}
              devices={state.devices}
              lockStatus={lockStatus}
              onToggleAppShield={handleToggleAppShield}
              onTestOpenApp={(app) => setPreviewApp(app)}
              onCompleteBlockingItem={handleToggleComplete}
              onGoToPlanner={() => setActiveTab('planner')}
            />
          )}

          {activeTab === 'rewards' && (
            <RewardsView
              points={state.points}
              onTimeStreakDays={state.onTimeStreakDays}
              redeemedCards={state.redeemedCards}
              transactions={state.transactions}
              onRedeemOffer={handleRedeemOffer}
            />
          )}

          {activeTab === 'devices' && (
            <DevicesView
              devices={state.devices}
              isDeviceLocked={lockStatus.isDeviceLocked}
              onToggleDeviceShield={handleToggleDeviceShield}
              onSyncAllDevices={handleSyncAllDevices}
              onAddDevice={handleAddDevice}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar (60px height) */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-[60px] bg-white/95 backdrop-blur-md border-t border-slate-200 grid grid-cols-4 items-center"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`min-h-[44px] h-full flex flex-col items-center justify-center gap-0.5 ${
                isActive
                  ? 'text-indigo-700 font-semibold bg-indigo-50/70'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              <span className="text-[11px] leading-tight whitespace-nowrap">
                {item.shortLabel}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Modals */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddItem}
      />

      <AppLockGateModal
        app={previewApp}
        isLocked={Boolean(
          previewApp &&
            lockStatus.isDeviceLocked &&
            previewApp.lockedWhenIncomplete,
        )}
        blockingItems={lockStatus.blockingItems}
        onClose={() => setPreviewApp(null)}
        onCompleteItem={handleToggleComplete}
        onGoToPlanner={() => setActiveTab('planner')}
      />
    </div>
  );
}
