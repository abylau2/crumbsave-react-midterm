import { categoryImage, seedBags } from '../data/seedBags.js';
import { normalizeBag, validateBag } from '../utils/validation.js';

const STORAGE_KEY = 'crumbsave:demo:v1';
const FAIL_NEXT_KEY = 'crumbsave:fail-next';
const WAIT_MS = 450;

export class ApiError extends Error {
  constructor(message, code = 'API_ERROR') {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

const copy = (value) => structuredClone(value);

function readState() {
  let raw;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      const initial = { bags: copy(seedBags), reservations: [] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const state = JSON.parse(raw);
    if (!Array.isArray(state.bags) || !Array.isArray(state.reservations)) {
      throw new ApiError('Saved demo data is invalid. Reset the demo data and try again.', 'CORRUPT_DATA');
    }
    return state;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Demo storage is unavailable. Check browser storage settings and try again.', 'STORAGE_ERROR');
  }
}

function writeState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    throw new ApiError('Could not save demo data. Free up browser storage and try again.', 'STORAGE_ERROR');
  }
}

function delay(signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException('Request cancelled', 'AbortError'));
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort);
      resolve();
    }, WAIT_MS);
    function abort() {
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
      reject(new DOMException('Request cancelled', 'AbortError'));
    }
    signal?.addEventListener('abort', abort, { once: true });
  });
}

async function run(operation, signal, action) {
  await delay(signal);
  if (signal?.aborted) throw new DOMException('Request cancelled', 'AbortError');
  try {
    if (sessionStorage.getItem(FAIL_NEXT_KEY) === operation) {
      sessionStorage.removeItem(FAIL_NEXT_KEY);
      throw new ApiError('A temporary demo request failed. Please try again.', 'SIMULATED_FAILURE');
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    // Some browsers block sessionStorage. That should not block the marketplace.
  }
  return action();
}

export function getBags({ signal } = {}) {
  return run('getBags', signal, () => copy(readState().bags));
}

export function getBagById(id, { signal } = {}) {
  return run('getBagById', signal, () => copy(readState().bags.find((bag) => bag.id === id) ?? null));
}

export function getReservations({ signal } = {}) {
  return run('getReservations', signal, () => copy(readState().reservations));
}

export function createBag(data, { signal } = {}) {
  return run('createBag', signal, () => {
    const errors = validateBag(data);
    if (Object.keys(errors).length) throw new ApiError('Please correct the bag details and try again.', 'VALIDATION_ERROR');
    const state = readState();
    const bag = {
      ...normalizeBag(data),
      id: `bag-${crypto.randomUUID()}`,
      image: categoryImage(data.category),
      featuredRank: -Date.now(),
      createdAt: new Date().toISOString()
    };
    state.bags = [bag, ...state.bags];
    writeState(state);
    return copy(bag);
  });
}

export function reserveBag(id, { signal } = {}) {
  return run('reserveBag', signal, () => {
    const state = readState();
    const index = state.bags.findIndex((bag) => bag.id === id);
    if (index < 0) throw new ApiError('This bag could not be found.', 'NOT_FOUND');
    if (state.reservations.some((reservation) => reservation.bagId === id)) {
      throw new ApiError('You already reserved this bag in the demo.', 'DUPLICATE');
    }
    const bag = state.bags[index];
    if (bag.quantity <= 0) throw new ApiError('This bag is sold out.', 'SOLD_OUT');
    const updated = { ...bag, quantity: bag.quantity - 1 };
    const reservation = {
      id: `reservation-${crypto.randomUUID()}`,
      bagId: id,
      title: bag.title,
      businessName: bag.businessName,
      price: bag.price,
      district: bag.district,
      pickupStart: bag.pickupStart,
      pickupEnd: bag.pickupEnd,
      image: bag.image,
      status: 'Reserved',
      createdAt: new Date().toISOString()
    };
    state.bags = state.bags.map((entry, entryIndex) => entryIndex === index ? updated : entry);
    state.reservations = [reservation, ...state.reservations];
    writeState(state);
    return copy({ bag: updated, reservation });
  });
}

// Development utility: call resetDemoData() from the console through a local test harness.
export function resetDemoData() {
  writeState({ bags: copy(seedBags), reservations: [] });
}

export const demoStorageKey = STORAGE_KEY;
export const demoFailNextKey = FAIL_NEXT_KEY;
