import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_CLEAR_BONUS_POINTS,
  GIFT_CARD_CATALOG,
  addSchoolItem,
  createInitialState,
  deleteSchoolItem,
  filterAndSortItems,
  getLockStatus,
  isAppLockedOnDevice,
  redeemGiftCard,
  toggleItemCompletion,
  validateNewItem,
} from './schoolPreparedLogic';

test('initial state starts with active device lock when today required tasks are incomplete', () => {
  const fixedNow = new Date('2026-11-20T14:00:00.000Z');
  const state = createInitialState(fixedNow);
  const lock = getLockStatus(state.items, state.devices, state.apps);

  assert.equal(lock.blockingItems.length, 2);
  assert.equal(lock.isDeviceLocked, true);
  assert.ok(lock.lockedApps.length > 0);
  assert.equal(
    isAppLockedOnDevice(state.apps[0], 'phone', state.devices, lock.isDeviceLocked),
    true,
  );
});

test('completing all blocking items on time unlocks apps and awards item points plus all-clear bonus', () => {
  const fixedNow = new Date('2026-11-20T14:00:00.000Z');
  let state = createInitialState(fixedNow);
  const initialPoints = state.points;

  const lockBefore = getLockStatus(state.items, state.devices, state.apps);
  assert.equal(lockBefore.blockingItems.length, 2);

  // Complete first blocking item on time
  const firstId = lockBefore.blockingItems[0].id;
  const firstPts = lockBefore.blockingItems[0].points;
  const res1 = toggleItemCompletion(state, firstId, fixedNow);
  state = res1.nextState;
  assert.equal(res1.unlockedNow, false);
  assert.equal(res1.bonusAwarded, 0);
  assert.equal(state.points, initialPoints + firstPts);

  // Complete second blocking item on time -> unlocks all devices & awards bonus
  const secondId = lockBefore.blockingItems[1].id;
  const secondPts = lockBefore.blockingItems[1].points;
  const res2 = toggleItemCompletion(state, secondId, fixedNow);
  state = res2.nextState;
  assert.equal(res2.unlockedNow, true);
  assert.equal(res2.bonusAwarded, ALL_CLEAR_BONUS_POINTS);
  assert.equal(
    state.points,
    initialPoints + firstPts + secondPts + ALL_CLEAR_BONUS_POINTS,
  );

  const lockAfter = getLockStatus(state.items, state.devices, state.apps);
  assert.equal(lockAfter.isDeviceLocked, false);
  assert.equal(lockAfter.lockedApps.length, 0);
});

test('toggling a completed item back to incomplete reverses earned points to prevent farming', () => {
  const fixedNow = new Date('2026-11-20T14:00:00.000Z');
  let state = createInitialState(fixedNow);
  const target = state.items.find((i) => !i.completed && i.requiresLockClearance)!;
  const startPoints = state.points;

  const completedRes = toggleItemCompletion(state, target.id, fixedNow);
  state = completedRes.nextState;
  assert.ok(state.points > startPoints);

  const uncheckedRes = toggleItemCompletion(state, target.id, fixedNow);
  state = uncheckedRes.nextState;
  assert.equal(state.points, startPoints);
});

test('late completion awards zero on-time points and does not grant all-clear bonus', () => {
  const fixedNow = new Date('2026-11-20T14:00:00.000Z');
  let state = createInitialState(fixedNow);
  const startPoints = state.points;

  // Complete all blocking tasks way past their due date
  const veryLate = new Date('2026-11-25T14:00:00.000Z');
  const blocking = getLockStatus(state.items, state.devices, state.apps).blockingItems;

  for (const item of blocking) {
    state = toggleItemCompletion(state, item.id, veryLate).nextState;
  }

  assert.equal(state.points, startPoints);
  const lockAfter = getLockStatus(state.items, state.devices, state.apps);
  assert.equal(lockAfter.isDeviceLocked, false);
});

test('gift card redemption deducts points, generates claim code, and blocks insufficient balances', () => {
  const fixedNow = new Date('2026-11-20T14:00:00.000Z');
  const state = createInitialState(fixedNow); // 320 pts

  const expensiveOffer = GIFT_CARD_CATALOG.find((c) => c.pointCost === 750)!;
  const failResult = redeemGiftCard(state, expensiveOffer, fixedNow);
  assert.equal(failResult.ok, false);

  const affordableOffer = GIFT_CARD_CATALOG.find((c) => c.pointCost === 300)!;
  const successResult = redeemGiftCard(state, affordableOffer, fixedNow);
  assert.equal(successResult.ok, true);
  if (successResult.ok) {
    assert.equal(successResult.nextState.points, 20);
    assert.equal(successResult.nextState.redeemedCards.length, 1);
    assert.match(successResult.card.code, /^SP-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  }
});

test('new item validation rejects invalid inputs and add/delete updates state cleanly', () => {
  const fixedNow = new Date('2026-11-20T14:00:00.000Z');
  const invalidErrors = validateNewItem({
    title: ' ',
    category: 'assignment',
    subject: 'Math',
    dueAt: '',
    points: 5,
    requiresLockClearance: true,
  });
  assert.ok(invalidErrors.title);
  assert.ok(invalidErrors.dueAt);
  assert.ok(invalidErrors.points);

  const validInput = {
    title: 'Physics Momentum Worksheet',
    category: 'assignment' as const,
    subject: 'Science' as const,
    dueAt: '2026-11-20T19:00:00.000Z',
    points: 80,
    requiresLockClearance: true,
  };
  const validErrors = validateNewItem(validInput);
  assert.deepEqual(validErrors, {});

  let state = createInitialState(fixedNow);
  const countBefore = state.items.length;
  state = addSchoolItem(state, validInput, fixedNow);
  assert.equal(state.items.length, countBefore + 1);
  assert.equal(state.items[0].title, 'Physics Momentum Worksheet');

  state = deleteSchoolItem(state, state.items[0].id);
  assert.equal(state.items.length, countBefore);
});

test('filterAndSortItems filters by search, category, subject, and status', () => {
  const fixedNow = new Date('2026-11-20T14:00:00.000Z');
  const state = createInitialState(fixedNow);

  const importantOnly = filterAndSortItems(state.items, {
    search: '',
    category: 'important',
    status: 'all',
    subject: 'all',
  });
  assert.ok(importantOnly.every((i) => i.category === 'important'));

  const bioSearch = filterAndSortItems(state.items, {
    search: 'Biology',
    category: 'all',
    status: 'all',
    subject: 'all',
  });
  assert.equal(bioSearch.length, 1);
  assert.equal(bioSearch[0].subject, 'Science');
});
