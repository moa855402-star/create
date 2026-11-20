import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface LoadingScreenProps {
  onContinue: () => void;
}

const LOGO_SRC = '/assets/aistudio/9A8435B0-A9CB-4B4F-A292-F9049440289B_7fe800c3.png';

export function LoadingScreen({ onContinue }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setProgress(100);
      return;
    }

    const start = performance.now();
    const duration = 550;
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const ratio = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - ratio, 3);
      setProgress(Math.round(eased * 100));
      if (ratio < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const isReady = progress >= 100;

  return (
    <div
      data-testid="loading-screen"
      className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center p-6"
    >
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 text-center shadow-xs space-y-7">
        {/* App Logo */}
        <div className="flex justify-center">
          {!imageFailed ? (
            <div className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
              <img
                src={LOGO_SRC}
                alt="School Prepared app logo"
                referrerPolicy="no-referrer"
                onError={() => setImageFailed(true)}
                className="w-full h-full object-contain mix-blend-multiply select-none"
              />
            </div>
          ) : (
            <div
              aria-label="School Prepared logo fallback"
              className="w-24 h-24 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-display text-3xl font-bold tracking-tight"
            >
              SP
            </div>
          )}
        </div>

        {/* Brand & Value Proposition */}
        <div className="space-y-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
            School Prepared
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Keep assignments organized, pause distracting apps until work is done, and earn points for e-gift cards.
          </p>
        </div>

        {/* Loading Progress Indicator */}
        <div className="space-y-2.5 text-left">
          <div className="flex items-center justify-between text-xs text-slate-500 tabular-nums">
            <span className="font-medium text-slate-700 inline-flex items-center gap-1.5">
              {isReady && (
                <CheckCircle2
                  className="w-3.5 h-3.5 text-emerald-600 shrink-0"
                  aria-hidden="true"
                />
              )}
              <span>
                {isReady
                  ? 'Ready — assignments & device shield synced'
                  : 'Preparing assignments & device shield...'}
              </span>
            </span>
            <span className="font-mono font-semibold text-slate-700">
              {progress}%
            </span>
          </div>

          <div
            role="progressbar"
            aria-label="App initialization progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"
          >
            <div
              className={`h-full transition-colors duration-200 ${
                isReady ? 'bg-emerald-600' : 'bg-indigo-700'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Continue Action */}
        <button
          type="button"
          onClick={onContinue}
          disabled={!isReady}
          className={`w-full min-h-[48px] px-5 py-3 text-sm sm:text-base font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 ${
            isReady
              ? 'bg-indigo-700 text-white hover:bg-indigo-800 cursor-pointer'
              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-wait'
          }`}
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>

        <p className="text-xs text-slate-400">
          Laptop · iPad · Phone
        </p>
      </div>
    </div>
  );
}
