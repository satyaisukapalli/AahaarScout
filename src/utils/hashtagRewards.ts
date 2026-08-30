import { HashtagBadge, DishReview, Restaurant } from '../types';

export const ALL_HASHTAG_BADGES: HashtagBadge[] = [
  {
    id: 'biryani-grandmaster',
    tag: '#BiryaniGrandmaster',
    title: 'Biryani Grandmaster',
    description: 'Awarded for authentic critiques on slow-cooked Hyderabadi Dum Biryanis & Zafrani spices.',
    category: 'biryani',
    icon: 'local_fire_department',
  },
  {
    id: 'guntur-spice-connoisseur',
    tag: '#GunturSpiceConnoisseur',
    title: 'Guntur Spice Connoisseur',
    description: 'Awarded for fearless tasting of fiery Andhra curries, Mirchi Bajjis & Erra Karam.',
    category: 'spice',
    icon: 'whatshot',
  },
  {
    id: 'dosa-whisperer',
    tag: '#DosaWhisperer',
    title: 'Dosa Whisperer',
    description: 'Awarded for discerning wafer-thin crunch, pure ghee roasting & artisanal tiffin chutneys.',
    category: 'dosa',
    icon: 'bakery_dining',
  },
  {
    id: 'sattvic-gourmet',
    tag: '#SattvicGourmet',
    title: 'Sattvic Gourmet',
    description: 'Awarded for reviews on 100% pure vegetarian feasts, temple thalis & wholesome comfort foods.',
    category: 'pure-veg',
    icon: 'eco',
  },
  {
    id: 'heritage-food-hunter',
    tag: '#HeritageFoodHunter',
    title: 'Heritage Food Hunter',
    description: 'Awarded for uncovering timeless recipes, 70-year-old mess culture & South Indian culinary roots.',
    category: 'heritage',
    icon: 'history_edu',
  },
  {
    id: 'filter-coffee-sommelier',
    tag: '#FilterCoffeeSommelier',
    title: 'Filter Coffee Sommelier',
    description: 'Awarded for recognizing first-decoction froth, Mysore chicory ratios & aromatic brews.',
    category: 'beverage',
    icon: 'coffee',
  },
  {
    id: 'sweet-tooth-explorer',
    tag: '#SweetToothExplorer',
    title: 'Sweet Tooth Explorer',
    description: 'Awarded for reviewing paper-thin Pootharekulu, melted Ghee Bobbatlu & Nizam desserts.',
    category: 'sweets',
    icon: 'cake',
  },
  {
    id: 'top-taste-authority',
    tag: '#TopTasteAuthority',
    title: 'Top Taste Authority',
    description: 'Awarded for highly detailed, verified reviews that help fellow foodies make informed dining decisions.',
    category: 'top-critic',
    icon: 'verified',
  },
];

const STORAGE_KEY = 'aahaarscout_user_hashtags';

export const getUserHashtags = (): string[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load user hashtags', e);
  }
  // Default starter badge for enthusiastic foodies
  return ['#FoodieVerified', '#SouthIndianTasteHunter'];
};

export const saveUserHashtags = (hashtags: string[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(new Set(hashtags))));
  } catch (e) {
    console.error('Failed to save user hashtags', e);
  }
};

export const awardHashtagsToUser = (newTags: string[]): string[] => {
  const current = getUserHashtags();
  const updated = Array.from(new Set([...current, ...newTags]));
  saveUserHashtags(updated);
  return updated;
};

/**
 * Analyzes a user's dish review and calculates which hashtags should be awarded.
 */
export const evaluateReviewForHashtags = (
  review: {
    dishName: string;
    comment: string;
    rating: number;
    tasteTags: string[];
  },
  restaurant?: Restaurant
): HashtagBadge[] => {
  const text = `${review.dishName} ${review.comment} ${review.tasteTags.join(' ')} ${restaurant?.cuisine || ''} ${restaurant?.name || ''} ${restaurant?.neighborhood || ''} ${restaurant?.city || ''}`.toLowerCase();
  
  const awarded: HashtagBadge[] = [];

  // 1. Biryani
  if (
    text.includes('biryani') ||
    text.includes('mandi') ||
    text.includes('zafrani') ||
    text.includes('dum') ||
    text.includes('basmati')
  ) {
    const badge = ALL_HASHTAG_BADGES.find((b) => b.id === 'biryani-grandmaster');
    if (badge) awarded.push(badge);
  }

  // 2. Guntur / Spice
  if (
    text.includes('guntur') ||
    text.includes('spicy') ||
    text.includes('mirchi') ||
    text.includes('erra karam') ||
    text.includes('gongura') ||
    text.includes('fiery') ||
    text.includes('podi')
  ) {
    const badge = ALL_HASHTAG_BADGES.find((b) => b.id === 'guntur-spice-connoisseur');
    if (badge) awarded.push(badge);
  }

  // 3. Dosa / Tiffin
  if (
    text.includes('dosa') ||
    text.includes('idli') ||
    text.includes('babai') ||
    text.includes('sankar vilas') ||
    text.includes('benne') ||
    text.includes('vada') ||
    text.includes('chutney') ||
    text.includes('tiffin')
  ) {
    const badge = ALL_HASHTAG_BADGES.find((b) => b.id === 'dosa-whisperer');
    if (badge) awarded.push(badge);
  }

  // 4. Pure Veg / Sattvic
  if (
    restaurant?.isPureVeg ||
    restaurant?.isVeg ||
    text.includes('pure veg') ||
    text.includes('sattvic') ||
    text.includes('bhojanam') ||
    text.includes('thali') ||
    text.includes('sweet magic') ||
    text.includes('dharani')
  ) {
    const badge = ALL_HASHTAG_BADGES.find((b) => b.id === 'sattvic-gourmet');
    if (badge) awarded.push(badge);
  }

  // 5. Heritage
  if (
    text.includes('1942') ||
    text.includes('1950') ||
    text.includes('legendary') ||
    text.includes('heritage') ||
    text.includes('vintage') ||
    text.includes('authentic recipe') ||
    text.includes('decades') ||
    text.includes('tradition')
  ) {
    const badge = ALL_HASHTAG_BADGES.find((b) => b.id === 'heritage-food-hunter');
    if (badge) awarded.push(badge);
  }

  // 6. Filter Coffee / Chai
  if (
    text.includes('coffee') ||
    text.includes('filter coffee') ||
    text.includes('degree') ||
    text.includes('chai') ||
    text.includes('irani') ||
    text.includes('roastery')
  ) {
    const badge = ALL_HASHTAG_BADGES.find((b) => b.id === 'filter-coffee-sommelier');
    if (badge) awarded.push(badge);
  }

  // 7. Sweets
  if (
    text.includes('sweet') ||
    text.includes('pootharekulu') ||
    text.includes('bobbatlu') ||
    text.includes('qubani') ||
    text.includes('halwa') ||
    text.includes('payasam') ||
    text.includes('garikapati') ||
    text.includes('ghee sweet')
  ) {
    const badge = ALL_HASHTAG_BADGES.find((b) => b.id === 'sweet-tooth-explorer');
    if (badge) awarded.push(badge);
  }

  // 8. Quality detailed review (> 30 characters and has taste tags)
  if (review.comment.trim().length >= 30 || review.tasteTags.length >= 2) {
    const badge = ALL_HASHTAG_BADGES.find((b) => b.id === 'top-taste-authority');
    if (badge && !awarded.some((b) => b.id === 'top-taste-authority')) {
      awarded.push(badge);
    }
  }

  // Fallback if none matched
  if (awarded.length === 0) {
    const fallback = ALL_HASHTAG_BADGES[Math.floor(Math.random() * ALL_HASHTAG_BADGES.length)];
    awarded.push(fallback);
  }

  return awarded;
};
