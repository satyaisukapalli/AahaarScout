export type ScreenType = 
  | 'home'
  | 'city'
  | 'search'
  | 'ai-assistant'
  | 'tonight-pick'
  | 'restaurant-detail'
  | 'saved'
  | 'collections'
  | 'profile'
  | 'forum';

export type ForumCategory = 
  | 'all'
  | 'spicy-street'
  | 'biryani-wars'
  | 'tiffins-coffee'
  | 'pure-veg'
  | 'memes-humor'
  | 'shorts-15s'
  | 'recommendations';

export interface MediaAttachment {
  id: string;
  type: 'photo' | 'gif' | 'meme' | 'video';
  url: string;
  thumbnailUrl?: string;
  durationSeconds?: number; // strictly capped at 15s max for videos
  title?: string;
  memeTopText?: string;
  memeBottomText?: string;
  aspectRatio?: 'square' | 'video' | 'portrait';
}

export interface ForumPollOption {
  id: string;
  text: string;
  votes: number;
  votedUserIds: string[];
}

export interface ForumPoll {
  question: string;
  options: ForumPollOption[];
  totalVotes: number;
  hasVoted?: boolean;
}

export interface ForumPostReply {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userBadge?: string;
  content: string;
  media?: MediaAttachment;
  createdAt: string;
  likesCount: number;
  isLikedByMe?: boolean;
}

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorBadge?: string;
  authorCity?: string;
  category: ForumCategory;
  title: string;
  content: string;
  tags: string[];
  media?: MediaAttachment[];
  poll?: ForumPoll;
  createdAt: string;
  likesCount: number;
  reactions: {
    spicy: number;
    drool: number;
    laugh: number;
    heart: number;
  };
  userReaction?: 'spicy' | 'drool' | 'laugh' | 'heart' | null;
  isLikedByMe?: boolean;
  viewsCount: number;
  repliesCount: number;
  replies: ForumPostReply[];
  isPinned?: boolean;
  isReported?: boolean;
  moderationStatus: 'approved' | 'flagged' | 'blocked';
}

export interface MemeTemplate {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  defaultTopText: string;
  defaultBottomText: string;
  description: string;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: string;
  matchScore: number;
  image: string;
  rating?: number;
  reviewsCount?: number;
}

export interface DishReviewReply {
  id: string;
  reviewId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userHashtags?: string[];
  content: string;
  createdAt: string;
  likesCount: number;
  isLikedByMe?: boolean;
}

export interface DishReview {
  id: string;
  dishId: string;
  dishName: string;
  restaurantId: string;
  restaurantName: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userHashtags: string[];
  rating: number;
  comment: string;
  tasteTags: string[];
  awardedHashtag?: string;
  isVerifiedFoodie?: boolean;
  createdAt: string;
  likesCount: number;
  isLikedByMe?: boolean;
  replies: DishReviewReply[];
}

export interface HashtagBadge {
  id: string;
  tag: string;
  title: string;
  description: string;
  category: 'spice' | 'biryani' | 'pure-veg' | 'dosa' | 'heritage' | 'beverage' | 'sweets' | 'top-critic';
  icon: string;
  unlockedAt?: string;
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
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'google' | 'facebook' | 'email';
  connectedAt: string;
  dietaryPreference?: 'veg' | 'all';
  favoriteCity?: string;
  savedSpotsCount?: number;
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
