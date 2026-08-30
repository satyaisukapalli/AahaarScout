import { DishReview } from '../types';

export const INITIAL_DISH_REVIEWS: DishReview[] = [
  // --- Vijayawada: Babai Hotel ---
  {
    id: 'rev-babai-1',
    dishId: 'b-1',
    dishName: 'Babai Special Idli with Venna (White Butter)',
    restaurantId: 'babai-hotel-vijayawada',
    restaurantName: 'Babai Hotel (Since 1942)',
    userId: 'user-satya',
    userName: 'Satya Isukapalli',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    userHashtags: ['#SattvicGourmet', '#HeritageFoodHunter', '#DosaWhisperer'],
    rating: 5,
    comment: 'The dollop of fresh homemade white butter (venna) melting over the piping hot, cloud-like idlis is a spiritual experience! Paired with their coarse podi and fresh coconut chutney, it is unrivaled.',
    tasteTags: ['Pure Ghee & Butter', 'Melt in Mouth', 'Authentic 1942 Recipe', 'Must Order'],
    awardedHashtag: '#HeritageFoodHunter',
    isVerifiedFoodie: true,
    createdAt: '2 hours ago',
    likesCount: 24,
    replies: [
      {
        id: 'reply-1-1',
        reviewId: 'rev-babai-1',
        userId: 'user-anand-2',
        userName: 'Anand Varma',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        userHashtags: ['#GunturSpiceConnoisseur'],
        content: 'Totally agree! Make sure to request extra allam (ginger) chutney on the side, it cuts through the rich butter perfectly.',
        createdAt: '1 hour ago',
        likesCount: 9,
      },
    ],
  },
  {
    id: 'rev-babai-2',
    dishId: 'b-2',
    dishName: 'Ghee Karam Dosa',
    restaurantId: 'babai-hotel-vijayawada',
    restaurantName: 'Babai Hotel (Since 1942)',
    userId: 'user-satya',
    userName: 'Satya Isukapalli',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    userHashtags: ['#DosaWhisperer', '#GunturSpiceConnoisseur'],
    rating: 5,
    comment: 'The crimson spicy red chili garlic paste roasted with pure desi ghee till the edges turn crispy golden brown. Unbelievable texture!',
    tasteTags: ['Crispy & Buttery', 'Spicy Kick', 'Pure Ghee'],
    awardedHashtag: '#DosaWhisperer',
    isVerifiedFoodie: true,
    createdAt: '1 day ago',
    likesCount: 16,
    replies: [],
  },

  // --- Guntur: Sankar Vilas ---
  {
    id: 'rev-sankar-1',
    dishId: 'sv-1',
    dishName: 'Guntur Wafer Ghee Roast Masala Dosa',
    restaurantId: 'sankar-vilas-guntur',
    restaurantName: 'Sankar Vilas (Since 1950)',
    userId: 'user-satya',
    userName: 'Satya Isukapalli',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    userHashtags: ['#GunturSpiceConnoisseur', '#DosaWhisperer'],
    rating: 5,
    comment: 'No other place in Andhra makes dosas as wafer-thin and crisp as Sankar Vilas. The aroma of pure ghee hitting the hot cast iron tawa fills the street. A 70-year-old culinary masterpiece.',
    tasteTags: ['Super Crispy', 'Desi Ghee', 'Authentic Recipe', 'Spicy Chutney'],
    awardedHashtag: '#GunturSpiceConnoisseur',
    isVerifiedFoodie: true,
    createdAt: '3 hours ago',
    likesCount: 31,
    replies: [
      {
        id: 'reply-s-1',
        reviewId: 'rev-sankar-1',
        userId: 'user-swapna-5',
        userName: 'Swapna Reddy',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        userHashtags: ['#FilterCoffeeSommelier'],
        content: 'Don’t forget to pair it with their piping hot degree filter coffee in the stainless steel dabarah set!',
        createdAt: '2 hours ago',
        likesCount: 12,
      },
    ],
  },

  // --- Hyderabad: Paradise Biryani ---
  {
    id: 'rev-paradise-1',
    dishId: 'p-1',
    dishName: 'Royal Chicken Dum Biryani',
    restaurantId: 'paradise-biryani',
    restaurantName: 'Paradise Biryani',
    userId: 'user-satya',
    userName: 'Satya Isukapalli',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    userHashtags: ['#BiryaniGrandmaster', '#HyderabadiTasteCritic'],
    rating: 5,
    comment: 'Aromatic long-grain basmati with distinct saffron notes and fall-off-the-bone tender chicken. The mirchi ka salan has just the right peanut-sesame tang.',
    tasteTags: ['Authentic Dum', 'Zafrani Saffron Aroma', 'Juicy & Tender'],
    awardedHashtag: '#BiryaniGrandmaster',
    isVerifiedFoodie: true,
    createdAt: '5 hours ago',
    likesCount: 45,
    replies: [
      {
        id: 'reply-p-1',
        reviewId: 'rev-paradise-1',
        userId: 'user-harsha-6',
        userName: 'Harsha Vardhan',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        userHashtags: ['#TopTasteAuthority'],
        content: 'Order double masala for an extra rich punch if you like it spicy!',
        createdAt: '4 hours ago',
        likesCount: 18,
      },
    ],
  },

  // --- Bangalore: CTR Shri Sagar ---
  {
    id: 'rev-ctr-1',
    dishId: 'ctr-1',
    dishName: 'Benne Masala Dosa (Butter Dosa)',
    restaurantId: 'ctr-shri-sagar',
    restaurantName: 'CTR (Shri Sagar)',
    userId: 'user-satya',
    userName: 'Satya Isukapalli',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    userHashtags: ['#DosaWhisperer', '#FilterCoffeeSommelier'],
    rating: 5,
    comment: 'Crispy golden brown on the outside, fluffy soft inside, glistening with pure butter. CTR sets the standard for Bangalore benne dosa.',
    tasteTags: ['Golden Crisp', 'Pure Butter', 'Iconic Breakfast'],
    awardedHashtag: '#DosaWhisperer',
    isVerifiedFoodie: true,
    createdAt: '1 day ago',
    likesCount: 38,
    replies: [
      {
        id: 'reply-ctr-1',
        reviewId: 'rev-ctr-1',
        userId: 'user-rahul-m',
        userName: 'Rahul Mathur',
        userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        userHashtags: ['#HeritageFoodHunter'],
        content: 'Their mint-coconut chutney balance is legendary. Arrive before 8:30 AM on weekends to skip the queue!',
        createdAt: '18 hours ago',
        likesCount: 14,
      },
    ],
  },

  // --- Hyderabad: Chutneys ---
  {
    id: 'rev-chutneys-1',
    dishId: 'c-1',
    dishName: 'Guntur Idli & 7-Chutney Platter',
    restaurantId: 'chutneys',
    restaurantName: 'Chutneys',
    userId: 'user-satya',
    userName: 'Satya Isukapalli',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    userHashtags: ['#SattvicGourmet', '#PureVegPaladin'],
    rating: 5,
    comment: 'The 7 fresh chutneys (especially the mango-ginger and red bell pepper ones) make every bite exhilarating. 100% vegetarian bliss.',
    tasteTags: ['7 Artisanal Chutneys', 'Spicy Guntur Podi', 'Pure Veg Favorite'],
    awardedHashtag: '#SattvicGourmet',
    isVerifiedFoodie: true,
    createdAt: '2 days ago',
    likesCount: 22,
    replies: [],
  },

  // --- Chennai: Murugan Idli Shop ---
  {
    id: 'rev-murugan-1',
    dishId: 'm-1',
    dishName: 'Ghee Podi Idli & Degree Filter Coffee',
    restaurantId: 'murugan-idli-shop',
    restaurantName: 'Murugan Idli Shop',
    userId: 'user-satya',
    userName: 'Satya Isukapalli',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    userHashtags: ['#HeritageFoodHunter', '#FilterCoffeeSommelier'],
    rating: 5,
    comment: 'Softest idlis drenched in spicy gunpowder and aromatic ghee. The degree filter coffee is strong, frothy, and heavenly.',
    tasteTags: ['Gun Powder Podi', 'Molten Ghee', 'Degree Coffee'],
    awardedHashtag: '#FilterCoffeeSommelier',
    isVerifiedFoodie: true,
    createdAt: '3 days ago',
    likesCount: 29,
    replies: [],
  },
];

const STORAGE_KEY = 'aahaarscout_dish_reviews';

export const getStoredDishReviews = (): DishReview[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure all reviews reflect authentic Satya Isukapalli authoring
        return parsed.map((r: DishReview) => {
          if (!r.userName || r.userId.startsWith('user-') || r.userName !== 'Satya Isukapalli') {
            return {
              ...r,
              userId: 'user-satya',
              userName: 'Satya Isukapalli',
              userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            };
          }
          return r;
        });
      }
    }
  } catch (e) {
    console.error('Failed to load dish reviews from localStorage', e);
  }
  return INITIAL_DISH_REVIEWS;
};

export const saveStoredDishReviews = (reviews: DishReview[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.error('Failed to save dish reviews', e);
  }
};
