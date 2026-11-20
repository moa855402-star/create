import React, { useEffect } from 'react';
import { Lock, CheckCircle2, ArrowRight, X, ShieldCheck } from 'lucide-react';
import type { ManagedApp, SchoolItem } from '../types/schoolPrepared';
import { formatDueLabel } from '../utils/schoolPreparedLogic';
import { ManagedAppIcon } from './BrandIcons';

interface AppLockGateModalProps {
  app: ManagedApp | null;
  isLocked: boolean;
  blockingItems: SchoolItem[];
  onClose: () => void;
  onCompleteItem: (itemId: string) => void;
  onGoToPlanner: () => void;
}

export function AppLockGateModal({
  app,
  isLocked,
  blockingItems,
  onClose,
  onCompleteItem,
  onGoToPlanner,
}: AppLockGateModalProps) {
  useEffect(() => {
    if (!app) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [app, onClose]);

  if (!app) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lock-gate-heading"
    >
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <ManagedAppIcon name={app.name} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{app.name}</p>
              <p className="text-xs text-slate-500">
                {app.category} · {app.devices.join(', ')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close app lock preview"
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6">
          {isLocked ? (
            <div className="space-y-5">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-3">
                  <Lock className="w-6 h-6" aria-hidden="true" />
                </div>
                <h2
                  id="lock-gate-heading"
                  className="text-xl font-bold text-slate-900 tracking-tight"
                >
                  {app.name} is Locked
                </h2>
                <p className="mt-1.5 text-sm text-slate-600 max-w-sm">
                  Finish {blockingItems.length} remaining{' '}
                  {blockingItems.length === 1 ? 'task' : 'tasks'} on time to unlock your apps and earn{' '}
                  <span className="font-semibold text-slate-900 tabular-nums">+50 bonus pts</span>.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl divide-y divide-slate-200 bg-slate-50/50">
                {blockingItems.slice(0, 3).map((item) => {
                  const due = formatDueLabel(item.dueAt);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500 tabular-nums">
                          {item.subject} · {due.label} · +{item.points} pts
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onCompleteItem(item.id)}
                        aria-label={`Complete '${item.title}' now`}
                        className="min-h-[36px] px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors whitespace-nowrap shrink-0"
                      >
                        Mark Done
                      </button>
                    </div>
                  );
                })}
                {blockingItems.length > 3 && (
                  <div className="px-4 py-2 text-xs text-slate-500">
                    +{blockingItems.length - 3} more tasks in Planner
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onGoToPlanner();
                  }}
                  className="flex-1 min-h-[44px] px-4 py-2.5 text-sm font-semibold text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>Go to Assignments</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[44px] px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  Stay Focused
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-6 h-6" aria-hidden="true" />
                </div>
                <h2
                  id="lock-gate-heading"
                  className="text-xl font-bold text-slate-900 tracking-tight"
                >
                  {app.name} is Unlocked
                </h2>
                <p className="mt-1.5 text-sm text-slate-600">
                  All required assignments and important tasks are completed. Enjoy your free time!
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3.5 py-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>App Shield is clear across all synced devices</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full min-h-[44px] px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
