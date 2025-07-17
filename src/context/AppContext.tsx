import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Product, FilterOptions } from '../types';
import { mockUser } from '../data/mockData';
import { getInitialFavorites, getInitialViewHistory } from '../utils/storage';

const FAVORITES_KEY = 'edu_marketplace_favorites';
const VIEW_HISTORY_KEY = 'edu_marketplace_view_history';

interface AppState {
  user: {
    id: string;
    name: string;
    email: string;
    favorites: string[];
    viewHistory: string[];
  };
  products: Product[];
  filteredProducts: Product[];
  suggestions: Product[];
  searchQuery: string;
  filters: FilterOptions;
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_FILTERED_PRODUCTS'; payload: Product[] }
  | { type: 'SET_SUGGESTIONS'; payload: Product[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: FilterOptions }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_TO_FAVORITES'; payload: string }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: string }
  | { type: 'ADD_TO_VIEW_HISTORY'; payload: string };

const initialState: AppState = {
  user: {
    ...mockUser,
    favorites: getInitialFavorites(),
    viewHistory: getInitialViewHistory(),
  },
  products: [],
  filteredProducts: [],
  suggestions: [],
  searchQuery: '',
  filters: {
    priceRange: 'All',
    category: 'All',
    level: 'All'
  },
  loading: false,
  error: null
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      // Set the full product list
      return { ...state, products: action.payload };
    case 'SET_FILTERED_PRODUCTS':
      // Set the filtered product list (after search/filter)
      return { ...state, filteredProducts: action.payload };
    case 'SET_SUGGESTIONS':
      // Set the AI product suggestions
      return { ...state, suggestions: action.payload };
    case 'SET_SEARCH_QUERY':
      // Update the search query string
      return { ...state, searchQuery: action.payload };
    case 'SET_FILTERS':
      // Update the filter state (category, level, price)
      return { ...state, filters: action.payload };
    case 'SET_LOADING':
      // Set loading state (for API calls)
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      // Set error message (for API errors)
      return { ...state, error: action.payload };
    case 'ADD_TO_FAVORITES':
      // Add a product to the user's favorites (if not already present)
      if (state.user.favorites.includes(action.payload)) return state;
      return {
        ...state,
        user: {
          ...state.user,
          favorites: [...state.user.favorites, action.payload]
        }
      };
    case 'REMOVE_FROM_FAVORITES':
      // Remove a product from the user's favorites
      return {
        ...state,
        user: {
          ...state.user,
          favorites: state.user.favorites.filter(id => id !== action.payload)
        }
      };
    case 'ADD_TO_VIEW_HISTORY':
      // Add a product to the user's view history (most recent first, max 10)
      return {
        ...state,
        user: {
          ...state.user,
          viewHistory: [
            action.payload,
            ...state.user.viewHistory.filter(id => id !== action.payload)
          ].slice(0, 10)
        }
      };
    default:
      // Return current state for unknown actions
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

/**
 * AppContext - Quản lý state toàn cục cho toàn bộ ứng dụng
 * Sử dụng useReducer để kiểm soát các thao tác với sản phẩm, filter, yêu thích, lịch sử...
 */
const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * useAppContext - Custom hook để lấy state và dispatch từ AppContext
 * Dùng cho mọi component cần truy cập state toàn cục
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

/**
 * AppProvider - Bọc toàn bộ app, cung cấp state và dispatch cho các component con
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Sync favorites to localStorage
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.user.favorites));
  }, [state.user.favorites]);

  // Sync viewHistory to localStorage (optional, for completeness)
  useEffect(() => {
    localStorage.setItem(VIEW_HISTORY_KEY, JSON.stringify(state.user.viewHistory));
  }, [state.user.viewHistory]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}; 