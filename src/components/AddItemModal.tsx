import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type {
  ItemCategory,
  NewItemInput,
  SubjectName,
  ValidationErrors,
} from '../types/schoolPrepared';
import {
  SUBJECTS,
  toLocalDateTimeInputValue,
  validateNewItem,
} from '../utils/schoolPreparedLogic';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: NewItemInput) => void;
}

export function AddItemModal({ isOpen, onClose, onSubmit }: AddItemModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('assignment');
  const [subject, setSubject] = useState<SubjectName>('Math');
  const [dueAt, setDueAt] = useState('');
  const [points, setPoints] = useState('50');
  const [notes, setNotes] = useState('');
  const [requiresLockClearance, setRequiresLockClearance] = useState(true);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (isOpen) {
      const defaultDue = new Date(Date.now() + 4 * 60 * 60 * 1000);
      defaultDue.setMinutes(0, 0, 0);
      setTitle('');
      setCategory('assignment');
      setSubject('Math');
      setDueAt(toLocalDateTimeInputValue(defaultDue));
      setPoints('50');
      setNotes('');
      setRequiresLockClearance(true);
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPoints = Number(points);
    const input: NewItemInput = {
      title,
      category,
      subject,
      dueAt,
      points: parsedPoints,
      notes,
      requiresLockClearance,
    };
    const nextErrors = validateNewItem(input);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    onSubmit(input);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-item-title"
    >
      <div className="w-full sm:max-w-lg bg-white border border-slate-200 rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 id="add-item-title" className="text-lg font-semibold text-slate-900">
            Add Assignment or Important Thing
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close add item dialog"
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-5 overflow-y-auto">
          <div>
            <label
              htmlFor="item-title-input"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              Title
            </label>
            <input
              id="item-title-input"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="e.g. AP Chemistry Lab Report or Pack gym uniform"
              className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
            />
            {errors.title && (
              <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                {errors.title}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="block text-sm font-medium text-slate-800 mb-1.5">
                Type
              </span>
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setCategory('assignment')}
                  className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    category === 'assignment'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Assignment
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('important')}
                  className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    category === 'important'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Important Thing
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="item-subject-select"
                className="block text-sm font-medium text-slate-800 mb-1.5"
              >
                Subject
              </label>
              <select
                id="item-subject-select"
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectName)}
                className="w-full min-h-[42px] px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="item-due-input"
                className="block text-sm font-medium text-slate-800 mb-1.5"
              >
                Due Date & Time
              </label>
              <input
                id="item-due-input"
                type="datetime-local"
                value={dueAt}
                onChange={(e) => {
                  setDueAt(e.target.value);
                  if (errors.dueAt) setErrors((prev) => ({ ...prev, dueAt: undefined }));
                }}
                className="w-full min-h-[42px] px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              {errors.dueAt && (
                <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                  {errors.dueAt}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="item-points-input"
                className="block text-sm font-medium text-slate-800 mb-1.5"
              >
                On-Time Points (10–500)
              </label>
              <input
                id="item-points-input"
                type="number"
                min={10}
                max={500}
                step={5}
                value={points}
                onChange={(e) => {
                  setPoints(e.target.value);
                  if (errors.points) setErrors((prev) => ({ ...prev, points: undefined }));
                }}
                className="w-full min-h-[42px] px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              {errors.points && (
                <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                  {errors.points}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="item-notes-input"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              Notes (Optional)
            </label>
            <textarea
              id="item-notes-input"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Materials needed, teacher instructions, or submission link..."
              className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <input
              id="item-lock-checkbox"
              type="checkbox"
              checked={requiresLockClearance}
              onChange={(e) => setRequiresLockClearance(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-700 focus:ring-indigo-600"
            />
            <label htmlFor="item-lock-checkbox" className="text-sm text-slate-700 cursor-pointer">
              <span className="font-medium text-slate-900 block">
                Lock distracting apps until completed
              </span>
              <span className="text-xs text-slate-500">
                Shielded apps stay paused on your laptop, iPad, and phone until this item is checked off.
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[42px] px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[42px] px-5 py-2 text-sm font-semibold text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
            >
              Save Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
