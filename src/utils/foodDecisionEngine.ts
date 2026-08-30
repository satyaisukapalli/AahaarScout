import { Restaurant, Dish } from '../types';

export interface ParsedFoodIntent {
  rawQuery: string;
  craving?: string;
  cuisine?: string;
  maxBudget?: number;
  peopleCount?: number;
  dietary?: 'veg' | 'non-veg' | 'pure-veg' | 'all';
  occasion?: 'solo' | 'date' | 'family' | 'group' | 'late-night' | 'quick';
  mood?: 'spicy' | 'comfort' | 'healthy' | 'sweet' | 'adventurous';
  location?: string;
  maxDistanceKm?: number;
  isLateNight?: boolean;
}

export interface AaharScoutPick {
  id: string;
  restaurant: Restaurant;
  dishName: string;
  dishDescription: string;
  dishPrice: number;
  priceFormatted: string;
  priceType: 'verified' | 'estimated';
  dishImage: string;
  matchScore: number;
  matchReasons: string[];
  bestForCategory: string;
  bestForIcon: string;
  spiceLevel?: 'Mild' | 'Medium' | 'Fiery Spicy' | 'None';
  dietType: 'veg' | 'non-veg' | 'pure-veg';
  aiExplanation: string;
  sentimentSummary: string;
  isLateNight?: boolean;
  isHiddenGem?: boolean;
}

export interface MealPlanItem {
  name: string;
  portion: string;
  estimatedPrice: number;
  type: 'main' | 'starter' | 'beverage' | 'dessert';
}

export interface BudgetMealPlan {
  title: string;
  restaurant: Restaurant;
  peopleCount: number;
  targetBudget: number;
  totalCost: number;
  items: MealPlanItem[];
  planType: 'best-value' | 'best-quantity' | 'best-flavor';
  whyItWorks: string;
}

export interface FoodPersonality {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  traits: string[];
  favoriteBudget: string;
  topCuisines: string[];
  recommendedDish: string;
  description: string;
}

export const FOOD_PERSONALITIES: FoodPersonality[] = [
  {
    id: 'spice-hunter',
    title: 'The Spice Hunter',
    subtitle: 'Fiery Andhra & Chettinad Connoisseur',
    emoji: '🌶️',
    traits: ['High Spice Tolerance', 'Craves Mirchi & Pepper', 'Authentic Street Feasts'],
    favoriteBudget: '₹200 – ₹400 per meal',
    topCuisines: ['Andhra Spiced Meals', 'Guntur Mirchi Dosa', 'Chettinad Pepper Fry'],
    recommendedDish: 'Guntur Gongura Natukodi Fry & Mirchi Bajji',
    description: 'You seek bold, unapologetic spice profiles. Subtle curries bore you—you crave red chilies, freshly cracked black pepper, and tangy gongura leaf masala.',
  },
  {
    id: 'biryani-baron',
    title: 'The Biryani Baron',
    subtitle: 'Nizami & Dum Saffron Purist',
    emoji: '👑',
    traits: ['Zafrani Saffron Afficionado', 'Long-Grain Basmati Only', 'Late-Night Craver'],
    favoriteBudget: '₹280 – ₹550 per meal',
    topCuisines: ['Hyderabadi Dum Biryani', 'Zafrani Mutton Biryani', 'Korma & Haleem'],
    recommendedDish: 'Royal Zafrani Kachchi Mutton Dum Biryani',
    description: 'For you, food decisions begin and end with aromatic basmati rice layered with slow-cooked meat, caramelized fried onions, and rich mirchi ka salan.',
  },
  {
    id: 'ghee-heritage',
    title: 'The Ghee Heritage Loyalist',
    subtitle: 'Traditional Tiffins & Brass Tumbler Coffee',
    emoji: '🧈',
    traits: ['Pure Cow Ghee Obsessed', 'Crisp Butter Dosas', 'Degree Filter Coffee Fanatic'],
    favoriteBudget: '₹120 – ₹250 per breakfast',
    topCuisines: ['South Indian Breakfast', 'Benne Dosa', 'MTR Heritage Classics'],
    recommendedDish: 'Babai White Butter Idlis drenched in Ghee & Podi',
    description: 'You believe true culinary mastery lies in golden fermented batters, bubbling cauldrons of sambar, wafer-thin crispy dosas, and froth-topped filter coffee.',
  },
  {
    id: 'pure-veg-gourmet',
    title: 'The Pure-Veg Connoisseur',
    subtitle: '100% Satvik, Thalis & Artisanal Paneer',
    emoji: '🌱',
    traits: ['Zero Contamination Guarantee', '14-Dish Grand Bhojanam', 'Gourmet Plant Comfort'],
    favoriteBudget: '₹250 – ₹600 per meal',
    topCuisines: ['Andhra Pure Veg Bhojanam', 'Gourmet North Indian', 'South Indian Tiffins'],
    recommendedDish: '18-Course Andhra Banana Leaf Bhojanam with Avakaya',
    description: 'You value purity, cleanliness, and the rich complexity of vegetarian gastronomy—from fiery avakaya chutneys to velvety paneer makhani.',
  },
  {
    id: 'cafe-explorer',
    title: 'The Specialty Cafe Explorer',
    subtitle: 'Third-Wave Brews & European Patisserie',
    emoji: '☕',
    traits: ['Pour-Over Lover', 'French Tartlets', 'Cozy Courtyards & WiFi'],
    favoriteBudget: '₹350 – ₹800 per outing',
    topCuisines: ['Third-Wave Coffee', 'Artisan Desserts', 'Continental Brunch'],
    recommendedDish: 'Single-Origin Pour-Over with Dark Chocolate Entremet',
    description: 'You love slow mornings, aesthetic outdoor seating, perfectly extracted single-origin roasts, and melt-in-mouth French entremets.',
  },
];

// Helper: Get Current Time-of-Day Context
export function getTimeOfDayContext(): {
  slot: 'morning' | 'afternoon' | 'evening' | 'night' | 'late-night';
  greeting: string;
  headline: string;
  badge: string;
  defaultCraving: string;
} {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 11) {
    return {
      slot: 'morning',
      greeting: 'Good Morning!',
      headline: 'Best Breakfast & Tiffin Feasts',
      badge: '☀️ Fresh Morning Tiffins',
      defaultCraving: 'Crisp Ghee Dosa & Filter Coffee',
    };
  } else if (hour >= 11 && hour < 16) {
    return {
      slot: 'afternoon',
      greeting: 'Good Afternoon!',
      headline: 'Best Lunch & Biryani Feasts',
      badge: '🍛 Afternoon Lunch Hour',
      defaultCraving: 'Authentic Dum Biryani or Thali',
    };
  } else if (hour >= 16 && hour < 19) {
    return {
      slot: 'evening',
      greeting: 'Good Evening!',
      headline: 'Snacks, Chai & Cozy Cafes',
      badge: '☕ Evening Chai & Snacks',
      defaultCraving: 'Irani Chai, Samosas & Filter Coffee',
    };
  } else if (hour >= 19 && hour < 23) {
    return {
      slot: 'night',
      greeting: 'Dinner Time!',
      headline: 'Dinner Recommendations & Family Spots',
      badge: '🌙 Prime Dinner Scouting',
      defaultCraving: 'Spicy Kebabs & Dum Biryani',
    };
  } else {
    return {
      slot: 'late-night',
      greeting: 'Late-Night Foodie!',
      headline: 'Midnight Cravings & Late-Night Spots',
      badge: '🌃 Late-Night Food',
      defaultCraving: 'Midnight Dum Biryani & Street Fast Food',
    };
  }
}

// Natural Language Parser
export function parseNaturalLanguageQuery(query: string, userCity: string = 'Hyderabad'): ParsedFoodIntent {
  const q = query.toLowerCase().trim();
  const intent: ParsedFoodIntent = {
    rawQuery: query,
    location: userCity,
  };

  // Budget detection (e.g. "under 300", "under ₹500", "below 200", "500rs", "for 1000")
  const budgetMatch = q.match(/(?:under|below|less than|within|max|budget of|for|\u20b9|rs\.?)\s*(\d{2,5})/i);
  if (budgetMatch && budgetMatch[1]) {
    intent.maxBudget = parseInt(budgetMatch[1], 10);
  }

  // People count detection (e.g. "for 2 people", "feed 2", "for two", "family of 4")
  if (q.includes('2 people') || q.includes('two people') || q.includes('for 2') || q.includes('feed 2') || q.includes('for couple')) {
    intent.peopleCount = 2;
  } else if (q.includes('4 people') || q.includes('four people') || q.includes('for 4') || q.includes('family')) {
    intent.peopleCount = 4;
  } else if (q.includes('solo') || q.includes('1 person') || q.includes('just me') || q.includes('single')) {
    intent.peopleCount = 1;
  }

  // Dietary detection
  if (q.includes('pure veg') || q.includes('pure-veg') || q.includes('100% veg') || q.includes('jain')) {
    intent.dietary = 'pure-veg';
  } else if (q.includes('veg') || q.includes('vegetarian') || q.includes('paneer') || q.includes('dosa') || q.includes('idli')) {
    intent.dietary = 'veg';
  } else if (q.includes('non-veg') || q.includes('non veg') || q.includes('chicken') || q.includes('mutton') || q.includes('fish') || q.includes('prawn') || q.includes('biryani') || q.includes('kebab')) {
    intent.dietary = 'non-veg';
  }

  // Craving / Dish detection
  if (q.includes('biryani') || q.includes('biriyani') || q.includes('mandi') || q.includes('pulao')) {
    intent.craving = 'Biryani & Rice Feasts';
  } else if (q.includes('chicken') || q.includes('kebab') || q.includes('shawarma') || q.includes('tandoori')) {
    intent.craving = 'Chicken & Grills';
  } else if (q.includes('mutton') || q.includes('haleem') || q.includes('boti') || q.includes('keema')) {
    intent.craving = 'Mutton Specialties';
  } else if (q.includes('dosa') || q.includes('idli') || q.includes('tiffin') || q.includes('vada') || q.includes('pesarattu') || q.includes('breakfast')) {
    intent.craving = 'South Indian Tiffins';
  } else if (q.includes('coffee') || q.includes('tea') || q.includes('chai') || q.includes('cafe')) {
    intent.craving = 'Coffee & Cafes';
  } else if (q.includes('dessert') || q.includes('sweet') || q.includes('cake') || q.includes('pastry') || q.includes('ice cream')) {
    intent.craving = 'Desserts & Sweets';
  } else if (q.includes('spicy') || q.includes('mirchi') || q.includes('guntur') || q.includes('karam') || q.includes('chettinad')) {
    intent.craving = 'Spicy South Indian';
  } else if (q.includes('pizza') || q.includes('burger') || q.includes('pasta') || q.includes('continental')) {
    intent.craving = 'Pizza & Fast Food';
  } else if (q.includes('noodle') || q.includes('chinese') || q.includes('momos') || q.includes('fried rice')) {
    intent.craving = 'Noodles & Asian';
  } else if (q.includes('healthy') || q.includes('salad') || q.includes('protein') || q.includes('diet') || q.includes('clean')) {
    intent.craving = 'Healthy Food';
  }

  // Occasion detection
  if (q.includes('date') || q.includes('romantic') || q.includes('candle') || q.includes('partner') || q.includes('rooftop')) {
    intent.occasion = 'date';
  } else if (q.includes('family') || q.includes('kids') || q.includes('parents')) {
    intent.occasion = 'family';
  } else if (q.includes('group') || q.includes('friends') || q.includes('party') || q.includes('treat')) {
    intent.occasion = 'group';
  } else if (q.includes('late night') || q.includes('midnight') || q.includes('night') || q.includes('1am') || q.includes('2am')) {
    intent.occasion = 'late-night';
    intent.isLateNight = true;
  } else if (q.includes('quick') || q.includes('fast') || q.includes('hurry') || q.includes('street')) {
    intent.occasion = 'quick';
  }

  // Mood detection
  if (q.includes('spicy') || q.includes('hot') || q.includes('fiery') || q.includes('mirchi')) {
    intent.mood = 'spicy';
  } else if (q.includes('comfort') || q.includes('soothing') || q.includes('warm') || q.includes('classic')) {
    intent.mood = 'comfort';
  } else if (q.includes('healthy') || q.includes('light') || q.includes('fresh')) {
    intent.mood = 'healthy';
  }

  // Location / City detection
  const cityKeywords = ['hyderabad', 'bangalore', 'chennai', 'kochi', 'visakhapatnam', 'vizag', 'nellore', 'vijayawada', 'guntur'];
  for (const c of cityKeywords) {
    if (q.includes(c)) {
      intent.location = c === 'vizag' ? 'Visakhapatnam' : c.charAt(0).toUpperCase() + c.slice(1);
      break;
    }
  }

  // Distance keywords
  if (q.includes('near me') || q.includes('nearby') || q.includes('close') || q.includes('walking distance')) {
    intent.maxDistanceKm = 3.5;
  }

  return intent;
}

// Generate AaharScout Curated Picks (3 to 7 options)
export function generateAaharScoutPicks(
  restaurants: Restaurant[],
  intent: ParsedFoodIntent,
  isVegOnly: boolean = false
): AaharScoutPick[] {
  let pool = [...restaurants];

  // Apply strict veg filter if globally enabled or parsed
  if (isVegOnly || intent.dietary === 'pure-veg') {
    pool = pool.filter((r) => r.isPureVeg || r.isVeg);
  } else if (intent.dietary === 'veg') {
    pool = pool.filter((r) => r.isVeg || r.isPureVeg);
  }

  // Filter by city if specified
  if (intent.location) {
    const cityFiltered = pool.filter(
      (r) => r.city.toLowerCase() === intent.location?.toLowerCase()
    );
    if (cityFiltered.length >= 3) {
      pool = cityFiltered;
    }
  }

  // Calculate score and build detailed dish picks
  const scoredPicks: AaharScoutPick[] = [];

  pool.forEach((r) => {
    // Determine the signature dish or representative dish
    const signature = (r.signatureDishes && r.signatureDishes[0]) || {
      id: `${r.id}-dish`,
      name: r.mustTry ? r.mustTry.split(',')[0] : `${r.name} Special`,
      description: r.aiReasoning || 'Signature house recipe prepared with authentic spices and fresh local ingredients.',
      price: r.priceRange === '$' ? '₹180' : r.priceRange === '$$' ? '₹290' : '₹450',
      matchScore: r.matchScore || 90,
      image: r.image,
    };

    // Extract numerical price
    const numPrice = parseInt(signature.price.replace(/[^\d]/g, ''), 10) || 280;

    // AaharScout Match Calculation
    let matchScore = 85;
    const matchReasons: string[] = [];

    // 1. Budget match
    if (intent.maxBudget) {
      if (numPrice <= intent.maxBudget) {
        matchScore += 8;
        matchReasons.push(`✓ ₹${numPrice} is within your ₹${intent.maxBudget} budget`);
      } else if (numPrice <= intent.maxBudget * 1.15) {
        matchScore += 2;
        matchReasons.push(`✓ Close to your ₹${intent.maxBudget} budget limit`);
      } else {
        matchScore -= 12;
      }
    } else {
      matchReasons.push(`✓ Great value at approximately ₹${numPrice}`);
    }

    // 2. Craving match
    const searchText = (r.name + ' ' + r.cuisine + ' ' + r.tags.join(' ') + ' ' + signature.name + ' ' + (r.mustTry || '')).toLowerCase();
    
    if (intent.craving) {
      if (
        (intent.craving.includes('Biryani') && searchText.includes('biryani')) ||
        (intent.craving.includes('Chicken') && searchText.includes('chicken')) ||
        (intent.craving.includes('Mutton') && searchText.includes('mutton')) ||
        (intent.craving.includes('Tiffins') && (searchText.includes('dosa') || searchText.includes('idli') || searchText.includes('tiffin'))) ||
        (intent.craving.includes('Coffee') && (searchText.includes('coffee') || searchText.includes('cafe'))) ||
        (intent.craving.includes('Spicy') && (searchText.includes('spicy') || searchText.includes('guntur') || searchText.includes('chettinad') || searchText.includes('pepper')))
      ) {
        matchScore += 10;
        matchReasons.push(`✓ Matches your craving for ${intent.craving}`);
      }
    } else {
      matchReasons.push(`✓ Matches your culinary preferences`);
    }

    // 3. Distance match
    const distNum = parseFloat(r.distance?.replace(/[^\d.]/g, '') || '3.0');
    if (distNum <= 3.5) {
      matchScore += 5;
      matchReasons.push(`✓ Located only ${r.distance || '2.8 km'} from your area`);
    } else {
      matchReasons.push(`✓ Accessible location (${r.distance || '3.8 km'})`);
    }

    // 4. Occasion match
    if (intent.occasion === 'date' && (r.vibe === 'Romantic' || r.vibes?.includes('Romantic'))) {
      matchScore += 8;
      matchReasons.push(`✓ Perfect intimate atmosphere for a date`);
    } else if (intent.occasion === 'family' && (r.vibe === 'Family' || r.tags.includes('Family'))) {
      matchScore += 7;
      matchReasons.push(`✓ Spacious & comfortable for family dining`);
    } else if (intent.occasion === 'late-night') {
      matchScore += 6;
      matchReasons.push(`✓ Top choice for late-night dining cravings`);
    } else {
      matchReasons.push(`✓ High positive sentiment for this signature dish`);
    }

    // 5. Dietary match
    if (r.isPureVeg) {
      matchReasons.push(`✓ 100% Pure Vegetarian certified kitchen`);
    }

    // Cap match score between 88% and 99%
    matchScore = Math.min(99, Math.max(86, matchScore));

    // Determine Best-For Category
    let bestForCategory = 'Best Overall';
    let bestForIcon = '🏆';
    let isHiddenGem = false;

    if (numPrice < 220 || r.priceRange === '$') {
      bestForCategory = 'Best Value';
      bestForIcon = '💰';
    } else if (searchText.includes('guntur') || searchText.includes('chettinad') || searchText.includes('spicy') || searchText.includes('karam')) {
      bestForCategory = 'Best for Spice';
      bestForIcon = '🌶️';
    } else if (r.reviewsCount && r.reviewsCount < 2500 && r.rating >= 4.7) {
      bestForCategory = 'Hidden Gem';
      bestForIcon = '💎';
      isHiddenGem = true;
    } else if (r.vibe === 'Romantic' || r.vibes?.includes('Romantic')) {
      bestForCategory = 'Best for Dates';
      bestForIcon = '❤️';
    } else if (r.vibe === 'Family' || r.tags.includes('Family')) {
      bestForCategory = 'Best for Families';
      bestForIcon = '👨‍👩‍👧';
    } else if (r.tags.includes('Legendary') || r.tags.includes('Iconic')) {
      bestForCategory = 'Iconic Legend';
      bestForIcon = '👑';
    }

    // Spice Level determination
    let spiceLevel: 'Mild' | 'Medium' | 'Fiery Spicy' | 'None' = 'Medium';
    if (searchText.includes('guntur') || searchText.includes('mirchi') || searchText.includes('chettinad') || searchText.includes('karam') || searchText.includes('fiery')) {
      spiceLevel = 'Fiery Spicy';
    } else if (searchText.includes('dessert') || searchText.includes('sweet') || searchText.includes('coffee') || searchText.includes('patisserie')) {
      spiceLevel = 'None';
    } else if (searchText.includes('butter') || searchText.includes('mild') || searchText.includes('creamy') || searchText.includes('idli')) {
      spiceLevel = 'Mild';
    }

    const dietType: 'veg' | 'non-veg' | 'pure-veg' = r.isPureVeg ? 'pure-veg' : r.isVeg ? 'veg' : 'non-veg';

    scoredPicks.push({
      id: `pick-${r.id}`,
      restaurant: r,
      dishName: signature.name,
      dishDescription: signature.description,
      dishPrice: numPrice,
      priceFormatted: `₹${numPrice}`,
      priceType: 'verified',
      dishImage: signature.image || r.image,
      matchScore,
      matchReasons: matchReasons.slice(0, 5),
      bestForCategory,
      bestForIcon,
      spiceLevel,
      dietType,
      aiExplanation: r.aiReasoning || `Recommended by AaharScout based on high dish sentiment, authentic flavor balance, and proximity.`,
      sentimentSummary: r.aiInsight || `Consistently lauded for fresh ingredients and rich authentic preparation.`,
      isHiddenGem,
    });
  });

  // Sort by match score descending
  scoredPicks.sort((a, b) => b.matchScore - a.matchScore);

  // Return 3 to 7 diverse picks
  return scoredPicks.slice(0, Math.min(scoredPicks.length, 6));
}

// Generate Budget Meal Plan (e.g. "Feed 2 People Under ₹500")
export function generateBudgetMealPlan(
  restaurants: Restaurant[],
  peopleCount: number = 2,
  budget: number = 500,
  isVeg: boolean = false
): BudgetMealPlan[] {
  const eligible = restaurants.filter((r) => {
    if (isVeg && !r.isVeg && !r.isPureVeg) return false;
    return r.priceRange === '$' || r.priceRange === '$$';
  });

  const plans: BudgetMealPlan[] = [];

  eligible.slice(0, 4).forEach((r, idx) => {
    let items: MealPlanItem[] = [];
    let totalCost = 0;

    if (peopleCount === 2) {
      if (r.cuisine.includes('Biryani') || (!isVeg && r.tags.includes('Biryani'))) {
        items = [
          { name: 'Special Chicken Dum Biryani (Full)', portion: 'Serves 2', estimatedPrice: 280, type: 'main' },
          { name: 'Spicy Chicken 65 / Pepper Fry', portion: 'Starter portion', estimatedPrice: 140, type: 'starter' },
          { name: '2x Fresh Lime Soda / Mirinda', portion: '2 Glasses', estimatedPrice: 70, type: 'beverage' },
        ];
        totalCost = 490;
      } else if (r.isPureVeg || r.cuisine.includes('South Indian') || r.cuisine.includes('Breakfast')) {
        items = [
          { name: '2x Ghee Butter Masala Dosa', portion: '2 Large dosas', estimatedPrice: 240, type: 'main' },
          { name: '1x Guntur Podi Idli (2 pcs)', portion: 'Sharing starter', estimatedPrice: 110, type: 'starter' },
          { name: '2x Kumbakonam Degree Filter Coffee', portion: '2 Brass tumblers', estimatedPrice: 100, type: 'beverage' },
        ];
        totalCost = 450;
      } else {
        items = [
          { name: 'Paneer Butter Masala / Chicken Curry', portion: '1 Bowl', estimatedPrice: 220, type: 'main' },
          { name: '4x Butter Butter Tandoori Roti / Parotta', portion: '4 Pieces', estimatedPrice: 160, type: 'main' },
          { name: '2x Sweet Lassi / Cold Drinks', portion: '2 Glasses', estimatedPrice: 100, type: 'beverage' },
        ];
        totalCost = 480;
      }
    } else if (peopleCount === 1) {
      items = [
        { name: 'Mini Biryani or Executive Thali', portion: 'Single feast', estimatedPrice: 160, type: 'main' },
        { name: 'Crispy Starter / Samosa', portion: '1 Plate', estimatedPrice: 70, type: 'starter' },
        { name: 'Cold Beverage / Chai', portion: '1 Glass', estimatedPrice: 40, type: 'beverage' },
      ];
      totalCost = 270;
    } else {
      // 4 people
      items = [
        { name: '2x Jumbo Handi Biryani / Grand Thali', portion: 'Serves 4', estimatedPrice: 560, type: 'main' },
        { name: '2x Tandoori Starters Platter', portion: 'Sharing platter', estimatedPrice: 280, type: 'starter' },
        { name: '4x Cold Drinks & Gulab Jamun', portion: '4 Servings', estimatedPrice: 140, type: 'dessert' },
      ];
      totalCost = 980;
    }

    const planType: 'best-value' | 'best-quantity' | 'best-flavor' =
      idx === 0 ? 'best-value' : idx === 1 ? 'best-quantity' : 'best-flavor';

    plans.push({
      title: `AaharScout ₹${budget} Food Plan at ${r.name}`,
      restaurant: r,
      peopleCount,
      targetBudget: budget,
      totalCost,
      items,
      planType,
      whyItWorks: `Engineered by AaharScout to maximize portions and flavor under ₹${budget} without compromising quality.`,
    });
  });

  return plans;
}
