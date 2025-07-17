export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  longDescription?: string;
  category: string;
  instructor?: string;
  duration?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  isFavorite?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  favorites: string[];
  viewHistory: string[];
}

export interface FilterOptions {
  priceRange: string;
  category: string;
  level: string;
}

export interface SearchParams {
  query: string;
  filters: FilterOptions;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
} 