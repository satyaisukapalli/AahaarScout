export type ScreenType = 
  | 'home'
  | 'city'
  | 'search'
  | 'ai-assistant'
  | 'tonight-pick'
  | 'restaurant-detail'
  | 'saved'
  | 'collections'
  | 'profile';

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: string;
  matchScore: number;
  image: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  neighborhood: string;
  city: string;
  rating: number;
  reviewsCount?: number;
  priceRange: string;
  priceForTwo?: string;
  distance?: string;
  matchScore: number;
  image: string;
  heroImage?: string;
  tags: string[];
  mustTry?: string;
  aiReasoning: string;
  aiInsight?: string;
  signatureDishes?: Dish[];
  phone?: string;
  website?: string;
  hours?: string;
  address?: string;
  mapImage?: string;
  isSaved?: boolean;
  vibe?: string;
  vibes?: string[];
  isVeg?: boolean;
  isPureVeg?: boolean;
}

export interface SearchFilterState {
  query: string;
  city: string;
  openNow: boolean;
  highlyRated: boolean;
  distance: string;
  nonVeg: boolean;
  isVegOnly?: boolean;
  priceLimit?: number;
  vibe?: string;
}
