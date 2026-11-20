import React, { useState } from 'react';
import {
  Laptop,
  Tablet,
  Smartphone,
  Lock,
  LockOpen,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import type {
  DeviceType,
  ManagedApp,
  SyncedDevice,
} from '../types/schoolPrepared';
import {
  isAppLockedOnDevice,
  type LockStatusSummary,
} from '../utils/schoolPreparedLogic';
import { ManagedAppIcon } from './BrandIcons';

interface AppLockViewProps {
  apps: ManagedApp[];
  devices: SyncedDevice[];
  lockStatus: LockStatusSummary;
  onToggleAppShield: (appId: string) => void;
  onTestOpenApp: (app: ManagedApp) => void;
  onCompleteBlockingItem: (itemId: string) => void;
  onGoToPlanner: () => void;
}

export function AppLockView({
  apps,
  devices,
  lockStatus,
  onToggleAppShield,
  onTestOpenApp,
  onCompleteBlockingItem,
  onGoToPlanner,
}: AppLockViewProps) {
  const [selectedDevice, setSelectedDevice] = useState<'all' | DeviceType>('all');

  const filteredApps = apps.filter((app) =>
    selectedDevice === 'all' ? true : app.devices.includes(selectedDevice),
  );

  const lockedCountOnView = filteredApps.filter((app) =>
    isAppLockedOnDevice(app, selectedDevice, devices, lockStatus.isDeviceLocked),
  ).length;

  return (
    <div className="space-y-6">
      {/* Device Lock Overview */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {lockStatus.isDeviceLocked
                ? 'App Shield is Active'
                : 'App Shield is Unlocked'}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {lockStatus.isDeviceLocked
                ? `${lockedCountOnView} distracting apps are currently locked until ${lockStatus.blockingItems.length} required ${
                    lockStatus.blockingItems.length === 1 ? 'task is' : 'tasks are'
                  } finished.`
                : 'All lock-required school tasks are complete. Shielded apps are open across your devices.'}
            </p>
          </div>

          <div
            role="group"
            aria-label="Filter apps by device"
            className="inline-flex items-center p-1 bg-slate-100 rounded-xl self-start overflow-x-auto max-w-full"
          >
            <button
              type="button"
              onClick={() => setSelectedDevice('all')}
              className={`min-h-[38px] px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedDevice === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Devices
            </button>
            <button
              type="button"
              onClick={() => setSelectedDevice('laptop')}
              className={`min-h-[38px] px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
                selectedDevice === 'laptop'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Laptop</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedDevice('ipad')}
              className={`min-h-[38px] px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
                selectedDevice === 'ipad'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" aria-hidden="true" />
              <span>iPad</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedDevice('phone')}
              className={`min-h-[38px] px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
                selectedDevice === 'phone'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Phone</span>
            </button>
          </div>
        </div>

        {/* Blocking Tasks Inline Quick-Clear */}
        {lockStatus.blockingItems.length > 0 ? (
          <div className="pt-4 border-t border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-700">
                Tasks blocking your apps right now ({lockStatus.blockingItems.length})
              </p>
              <button
                type="button"
                onClick={onGoToPlanner}
                className="text-xs font-semibold text-indigo-700 hover:text-indigo-800 hover:underline whitespace-nowrap"
              >
                Open Full Planner
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {lockStatus.blockingItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 tabular-nums">
                      {item.subject} · +{item.points} pts
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCompleteBlockingItem(item.id)}
                    aria-label={`Complete '${item.title}'`}
                    className="min-h-[36px] px-3 py-1.5 text-xs font-semibold text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 transition-colors whitespace-nowrap shrink-0"
                  >
                    Complete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="pt-4 border-t border-slate-200 flex items-center gap-2.5 text-sm text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
            <span>Zero blocking tasks remaining. All shielded apps can be opened normally.</span>
          </div>
        )}
      </section>

      {/* Managed Apps List */}
      <section aria-label="Managed apps list">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Shielded & Allowed Apps
          </h3>
          <p className="text-xs text-slate-500">
            Toggle any app to include it in the lock shield, or test launching it.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-200 overflow-hidden">
          {filteredApps.map((app) => {
            const lockedNow = isAppLockedOnDevice(
              app,
              selectedDevice,
              devices,
              lockStatus.isDeviceLocked,
            );

            return (
              <div
                key={app.id}
                className="px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      lockedNow
                        ? 'bg-amber-50 border-amber-200 text-amber-800'
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <ManagedAppIcon name={app.name} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{app.name}</p>
                    <p className="text-xs text-slate-500">
                      {app.category} ·{' '}
                      {app.devices
                        .map((d) =>
                          d === 'laptop' ? 'Laptop' : d === 'ipad' ? 'iPad' : 'Phone',
                        )
                        .join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pl-13 sm:pl-0">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap ${
                      lockedNow
                        ? 'text-amber-800'
                        : app.lockedWhenIncomplete
                        ? 'text-emerald-700'
                        : 'text-slate-500'
                    }`}
                  >
                    {lockedNow ? (
                      <>
                        <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Locked</span>
                      </>
                    ) : (
                      <>
                        <LockOpen className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>
                          {app.lockedWhenIncomplete ? 'Unlocked' : 'Always Allowed'}
                        </span>
                      </>
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={() => onTestOpenApp(app)}
                    aria-label={`Test open ${app.name}`}
                    className="min-h-[38px] px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap inline-flex items-center gap-1.5"
                  >
                    <span>Test Open</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={app.lockedWhenIncomplete}
                    aria-label={`Include ${app.name} in app lock shield`}
                    onClick={() => onToggleAppShield(app.id)}
                    className={`min-h-[38px] px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                      app.lockedWhenIncomplete
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-800 hover:bg-indigo-100'
                        : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {app.lockedWhenIncomplete ? 'Shield On' : 'Shield Off'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
