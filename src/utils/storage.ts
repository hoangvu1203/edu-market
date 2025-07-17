// Storage helpers for user favorites and view history
// These functions help initialize state from localStorage or fallback to mock data.

import { mockUser } from '../data/mockData';

const FAVORITES_KEY = 'edu_marketplace_favorites';
const VIEW_HISTORY_KEY = 'edu_marketplace_view_history';

/**
 * Get the initial favorites list from localStorage, or use mock data if not present.
 */
export function getInitialFavorites(): string[] {
  const stored = localStorage.getItem(FAVORITES_KEY);
  if (stored) return JSON.parse(stored);
  return mockUser.favorites;
}

/**
 * Get the initial view history from localStorage, or use mock data if not present.
 */
export function getInitialViewHistory(): string[] {
  const stored = localStorage.getItem(VIEW_HISTORY_KEY);
  if (stored) return JSON.parse(stored);
  return mockUser.viewHistory;
} 