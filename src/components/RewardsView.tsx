import React, { useState } from 'react';
import { Check, Copy, Gift, Sparkles, X } from 'lucide-react';
import type {
  GiftCardOffer,
  PointTransaction,
  RedeemedGiftCard,
} from '../types/schoolPrepared';
import { GIFT_CARD_CATALOG } from '../utils/schoolPreparedLogic';
import { GiftCardLogo } from './BrandIcons';

interface RewardsViewProps {
  points: number;
  onTimeStreakDays: number;
  redeemedCards: RedeemedGiftCard[];
  transactions: PointTransaction[];
  onRedeemOffer: (offer: GiftCardOffer) => RedeemedGiftCard | null;
}

export function RewardsView({
  points,
  onTimeStreakDays,
  redeemedCards,
  transactions,
  onRedeemOffer,
}: RewardsViewProps) {
  const [confirmOffer, setConfirmOffer] = useState<GiftCardOffer | null>(null);
  const [justRedeemedCard, setJustRedeemedCard] = useState<RedeemedGiftCard | null>(
    null,
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const totalRedeemedUsd = redeemedCards.reduce((sum, c) => sum + c.valueUsd, 0);

  const handleConfirmRedeem = () => {
    if (!confirmOffer) return;
    const card = onRedeemOffer(confirmOffer);
    setConfirmOffer(null);
    if (card) {
      setJustRedeemedCard(card);
    }
  };

  const handleCopyCode = async (card: RedeemedGiftCard) => {
    try {
      await navigator.clipboard.writeText(card.code);
      setCopiedId(card.id);
      setTimeout(() => setCopiedId((prev) => (prev === card.id ? null : prev)), 2000);
    } catch {
      setCopiedId(card.id);
      setTimeout(() => setCopiedId((prev) => (prev === card.id ? null : prev)), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Points Summary Strip */}
      <section
        aria-label="Points summary"
        className="bg-white border border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200"
      >
        <div className="p-5">
          <p className="text-xs font-medium text-slate-500">Available Points</p>
          <p className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {points} <span className="text-base font-medium text-slate-500">pts</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Earned from on-time assignments & daily lock clears
          </p>
        </div>

        <div className="p-5">
          <p className="text-xs font-medium text-slate-500">On-Time Streak</p>
          <p className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {onTimeStreakDays}{' '}
            <span className="text-base font-medium text-slate-500">days</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Finish all lock tasks on time for +50 bonus pts/day
          </p>
        </div>

        <div className="p-5">
          <p className="text-xs font-medium text-slate-500">E-Gift Cards Claimed</p>
          <p className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
            ${totalRedeemedUsd}{' '}
            <span className="text-base font-medium text-slate-500">
              ({redeemedCards.length} {redeemedCards.length === 1 ? 'card' : 'cards'})
            </span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Instant digital codes stored in your wallet below
          </p>
        </div>
      </section>

      {/* Just Redeemed Banner */}
      {justRedeemedCard && (
        <div
          role="status"
          className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-950">
                ${justRedeemedCard.valueUsd} {justRedeemedCard.brand} e-Gift Card Ready
              </p>
              <p className="text-xs text-emerald-800 mt-0.5">
                Claim code:{' '}
                <span className="font-mono font-semibold text-emerald-950 select-all">
                  {justRedeemedCard.code}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleCopyCode(justRedeemedCard)}
              className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-emerald-900 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors inline-flex items-center gap-1.5"
            >
              {copiedId === justRedeemedCard.id ? (
                <>
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setJustRedeemedCard(null)}
              aria-label="Dismiss redemption banner"
              className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* E-Gift Card Storefront */}
      <section aria-label="E-Gift Card Store" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Redeem E-Gift Cards
          </h2>
          <p className="text-xs text-slate-500">
            Digital codes delivered immediately upon redemption
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GIFT_CARD_CATALOG.map((offer) => {
            const canAfford = points >= offer.pointCost;
            const shortfall = offer.pointCost - points;
            const progressPct = Math.min(
              100,
              Math.round((points / offer.pointCost) * 100),
            );

            return (
              <article
                key={offer.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0"
                      style={{ backgroundColor: offer.brandColor }}
                    >
                      <GiftCardLogo brand={offer.brand} />
                    </div>
                    <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                      ${offer.valueUsd}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {offer.brand} e-Gift Card
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {offer.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs tabular-nums">
                    <span className="font-mono font-semibold text-slate-900">
                      {offer.pointCost} pts
                    </span>
                    <span className={canAfford ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                      {canAfford ? 'Ready to redeem' : `${shortfall} pts needed`}
                    </span>
                  </div>

                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        canAfford ? 'bg-emerald-600' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  <button
                    type="button"
                    disabled={!canAfford}
                    onClick={() => setConfirmOffer(offer)}
                    aria-label={`Redeem $${offer.valueUsd} ${offer.brand} e-Gift Card for ${offer.pointCost} points`}
                    className={`w-full min-h-[42px] px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap ${
                      canAfford
                        ? 'bg-indigo-700 text-white hover:bg-indigo-800 transition-colors'
                        : 'bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed'
                    }`}
                  >
                    {canAfford
                      ? `Redeem for ${offer.pointCost} pts`
                      : `Need ${shortfall} More Pts`}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Wallet & Points History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Redeemed Wallet */}
        <section aria-label="My Redeemed E-Gift Cards" className="space-y-3">
          <h3 className="text-base font-bold text-slate-900">
            My E-Gift Cards Wallet
          </h3>
          {redeemedCards.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-2">
              <Gift className="w-6 h-6 text-slate-400 mx-auto" aria-hidden="true" />
              <p className="text-sm font-medium text-slate-800">
                No redeemed e-gift cards yet
              </p>
              <p className="text-xs text-slate-500">
                Redeem an offer above to unlock your digital claim code here.
              </p>
            </div>
          ) : (
            <ul className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-200 overflow-hidden">
              {redeemedCards.map((card) => (
                <li
                  key={card.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      ${card.valueUsd} {card.brand} e-Gift Card
                    </p>
                    <p className="text-xs text-slate-500 tabular-nums mt-0.5">
                      Code:{' '}
                      <span className="font-mono font-semibold text-slate-800 select-all">
                        {card.code}
                      </span>{' '}
                      · {new Date(card.redeemedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(card)}
                    aria-label={`Copy claim code for ${card.brand}`}
                    className="min-h-[38px] px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto whitespace-nowrap"
                  >
                    {copiedId === card.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Points Activity Ledger */}
        <section aria-label="Points Activity" className="space-y-3">
          <h3 className="text-base font-bold text-slate-900">Points Activity</h3>
          <ul className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-200 overflow-hidden">
            {transactions.slice(0, 8).map((tx) => (
              <li
                key={tx.id}
                className="px-4 py-3 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {tx.label}
                  </p>
                  <p className="text-xs text-slate-500 tabular-nums">
                    {new Date(tx.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <span
                  className={`text-sm font-mono font-semibold tabular-nums shrink-0 ${
                    tx.delta > 0
                      ? 'text-emerald-700'
                      : tx.delta < 0
                      ? 'text-slate-700'
                      : 'text-slate-400'
                  }`}
                >
                  {tx.delta > 0 ? `+${tx.delta}` : tx.delta} pts
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Confirmation Dialog */}
      {confirmOffer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-redeem-title"
        >
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-5">
            <div className="space-y-2">
              <h2 id="confirm-redeem-title" className="text-lg font-bold text-slate-900">
                Confirm E-Gift Card Redemption
              </h2>
              <p className="text-sm text-slate-600">
                Redeem{' '}
                <span className="font-semibold text-slate-900">
                  ${confirmOffer.valueUsd} {confirmOffer.brand} e-Gift Card
                </span>{' '}
                for{' '}
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {confirmOffer.pointCost} pts
                </span>
                ? Your remaining balance will be{' '}
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {points - confirmOffer.pointCost} pts
                </span>
                .
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmOffer(null)}
                className="min-h-[42px] px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRedeem}
                className="min-h-[42px] px-4 py-2 text-sm font-semibold text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 transition-colors"
              >
                Confirm Redemption
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
