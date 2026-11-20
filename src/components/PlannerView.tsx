import React from 'react';
import {
  Check,
  Lock,
  LockOpen,
  Search,
  Trash2,
  Plus,
  Gift,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import type {
  ItemFilters,
  ManagedApp,
  SchoolItem,
  SubjectName,
} from '../types/schoolPrepared';
import {
  ALL_CLEAR_BONUS_POINTS,
  SUBJECTS,
  formatDueLabel,
  filterAndSortItems,
  type LockStatusSummary,
} from '../utils/schoolPreparedLogic';

interface PlannerViewProps {
  items: SchoolItem[];
  filters: ItemFilters;
  lockStatus: LockStatusSummary;
  sampleLockedApp: ManagedApp | null;
  onChangeFilters: (next: ItemFilters) => void;
  onToggleComplete: (id: string) => void;
  onToggleLockRequirement: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onOpenAddModal: () => void;
  onPreviewLockScreen: (app: ManagedApp) => void;
  onNavigateTab: (tab: 'planner' | 'applock' | 'rewards' | 'devices') => void;
}

export function PlannerView({
  items,
  filters,
  lockStatus,
  sampleLockedApp,
  onChangeFilters,
  onToggleComplete,
  onToggleLockRequirement,
  onDeleteItem,
  onOpenAddModal,
  onPreviewLockScreen,
  onNavigateTab,
}: PlannerViewProps) {
  const filteredItems = filterAndSortItems(items, filters);
  const completedTotal = items.filter((i) => i.completed).length;

  return (
    <div className="space-y-6">
      {/* Lock Status & On-Time Bonus Banner */}
      <section
        aria-label="App lock status summary"
        className={`border rounded-2xl p-5 sm:p-6 transition-colors ${
          lockStatus.isDeviceLocked
            ? 'bg-white border-amber-300'
            : 'bg-white border-emerald-300'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="flex items-start gap-4">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                lockStatus.isDeviceLocked
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}
            >
              {lockStatus.isDeviceLocked ? (
                <ShieldAlert className="w-5 h-5" aria-hidden="true" />
              ) : (
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              )}
            </div>
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 text-balance">
                {lockStatus.isDeviceLocked
                  ? `Apps Locked — ${lockStatus.blockingItems.length} ${
                      lockStatus.blockingItems.length === 1 ? 'task' : 'tasks'
                    } left to unlock`
                  : 'All Apps Unlocked — Focus Tasks Complete'}
              </h2>
              <p className="text-sm text-slate-600">
                {lockStatus.isDeviceLocked ? (
                  <>
                    {lockStatus.lockedApps.length} distracting apps paused across your synced devices. Complete remaining lock tasks on time for a{' '}
                    <span className="font-semibold text-slate-900 tabular-nums">
                      +{ALL_CLEAR_BONUS_POINTS} pt
                    </span>{' '}
                    bonus.
                  </>
                ) : (
                  'Your laptop, iPad, and phone apps are unlocked. Redeem your earned points for e-gift cards anytime.'
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {lockStatus.isDeviceLocked && sampleLockedApp ? (
              <>
                <button
                  type="button"
                  onClick={() => onPreviewLockScreen(sampleLockedApp)}
                  className="min-h-[42px] px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-amber-700" aria-hidden="true" />
                  <span>Preview Lock Screen</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab('applock')}
                  className="min-h-[42px] px-4 py-2 text-sm font-semibold text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 transition-colors whitespace-nowrap shrink-0"
                >
                  Manage App Lock
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => onNavigateTab('rewards')}
                className="min-h-[42px] px-4 py-2 text-sm font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
              >
                <Gift className="w-4 h-4" aria-hidden="true" />
                <span>Redeem E-Gift Cards</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="w-full sm:flex-1 h-2 bg-slate-100 rounded-full overflow-hidden shrink-0">
            <div
              className={`h-full transition-all duration-300 ${
                lockStatus.isDeviceLocked ? 'bg-indigo-700' : 'bg-emerald-600'
              }`}
              style={{ width: `${lockStatus.completionPercent}%` }}
            />
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-600 tabular-nums shrink-0">
            <span>
              <strong className="text-slate-900">
                {lockStatus.completedRequiredCount}/{lockStatus.allRequiredItems.length}
              </strong>{' '}
              lock tasks done
            </span>
            <span aria-hidden="true">·</span>
            <span>
              <strong className="text-slate-900">
                {completedTotal}/{items.length}
              </strong>{' '}
              total organized
            </span>
          </div>
        </div>
      </section>

      {/* Filter & Search Toolbar */}
      <section aria-label="Filter assignments and important things" className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Segmented Tabs */}
          <div
            role="group"
            aria-label="Filter by item type"
            className="inline-flex items-center p-1 bg-slate-200/70 rounded-xl self-start"
          >
            {(
              [
                { id: 'all', label: 'All Items' },
                { id: 'assignment', label: 'Assignments' },
                { id: 'important', label: 'Important Things' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeFilters({ ...filters, category: tab.id })}
                className={`min-h-[38px] px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  filters.category === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full md:w-auto">
            <div className="relative w-full sm:w-60">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                aria-label="Search assignments and important things"
                placeholder="Search tasks or notes..."
                value={filters.search}
                onChange={(e) =>
                  onChangeFilters({ ...filters, search: e.target.value })
                }
                className="w-full min-h-[40px] pl-9 pr-3 py-1.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 sm:flex items-center gap-2.5">
              <select
                aria-label="Filter by subject"
                value={filters.subject}
                onChange={(e) =>
                  onChangeFilters({
                    ...filters,
                    subject: e.target.value as 'all' | SubjectName,
                  })
                }
                className="min-h-[40px] px-3 py-1.5 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="all">All Subjects</option>
                {SUBJECTS.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>

              <select
                aria-label="Filter by completion status"
                value={filters.status}
                onChange={(e) =>
                  onChangeFilters({
                    ...filters,
                    status: e.target.value as ItemFilters['status'],
                  })
                }
                className="min-h-[40px] px-3 py-1.5 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="all">All Statuses</option>
                <option value="lock-required">Locks Apps Now</option>
                <option value="active">Active Only</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Organized List */}
      <section aria-label="Task list">
        {filteredItems.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3">
            <h3 className="text-base font-semibold text-slate-900">
              No matching assignments or reminders
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              {items.length === 0
                ? 'Add your school assignments, exam dates, and important things to pack so School Prepared can keep everything organized.'
                : 'Try adjusting your search or filter selections to see your remaining items.'}
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    onChangeFilters({
                      search: '',
                      category: 'all',
                      status: 'all',
                      subject: 'all',
                    })
                  }
                  className="min-h-[40px] px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Clear Filters
                </button>
              )}
              <button
                type="button"
                onClick={onOpenAddModal}
                className="min-h-[40px] px-4 py-2 text-sm font-semibold text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Add Item</span>
              </button>
            </div>
          </div>
        ) : (
          <ul className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-200 overflow-hidden">
            {filteredItems.map((item) => {
              const due = formatDueLabel(item.dueAt);
              const dueTextClass = item.completed
                ? 'text-emerald-700'
                : due.urgency === 'overdue'
                ? 'text-red-700 font-medium'
                : due.urgency === 'today'
                ? 'text-amber-700 font-medium'
                : 'text-slate-600';

              return (
                <li
                  key={item.id}
                  className={`px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    item.completed ? 'bg-slate-50/60' : 'hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => onToggleComplete(item.id)}
                      aria-label={
                        item.completed
                          ? `Mark '${item.title}' as incomplete`
                          : `Mark '${item.title}' as completed`
                      }
                      aria-pressed={item.completed}
                      className="min-w-[44px] min-h-[44px] -ml-2 -mt-1.5 flex items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-indigo-600 shrink-0"
                    >
                      <span
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          item.completed
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'bg-white border-slate-400 hover:border-indigo-600'
                        }`}
                      >
                        {item.completed && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                      </span>
                    </button>

                    <div className="min-w-0 space-y-1">
                      <p
                        className={`text-sm sm:text-base font-medium leading-snug ${
                          item.completed
                            ? 'line-through text-slate-400'
                            : 'text-slate-900'
                        }`}
                      >
                        {item.title}
                      </p>

                      {item.notes && (
                        <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">
                          {item.notes}
                        </p>
                      )}

                      {/* Zero-Pill Unboxed Metadata Line */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 tabular-nums">
                        <span className="font-medium text-slate-700">{item.subject}</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {item.category === 'assignment' ? 'Assignment' : 'Important Thing'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className={dueTextClass}>
                          {item.completed
                            ? item.completedOnTime
                              ? 'Completed on time'
                              : 'Completed late'
                            : due.label}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono font-medium text-slate-700">
                          +{item.points} pts
                        </span>
                        {item.requiresLockClearance && !item.completed && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-amber-700 font-medium inline-flex items-center gap-1">
                              <Lock className="w-3 h-3" aria-hidden="true" />
                              Locks apps
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pl-9 sm:pl-0 shrink-0">
                    {!item.completed && (
                      <button
                        type="button"
                        onClick={() => onToggleLockRequirement(item.id)}
                        aria-label={
                          item.requiresLockClearance
                            ? `Remove app lock requirement from '${item.title}'`
                            : `Require '${item.title}' before unlocking apps`
                        }
                        aria-pressed={item.requiresLockClearance}
                        className={`min-h-[40px] px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                          item.requiresLockClearance
                            ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {item.requiresLockClearance ? (
                          <>
                            <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Locking</span>
                          </>
                        ) : (
                          <>
                            <LockOpen className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>No Lock</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      aria-label={`Delete '${item.title}'`}
                      className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
