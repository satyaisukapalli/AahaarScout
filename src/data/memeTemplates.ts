import { MemeTemplate } from '../types';

export const POPULAR_MEME_TEMPLATES: MemeTemplate[] = [
  {
    id: 'drake-foodie',
    name: 'Drake Preference (Biryani vs Diet)',
    category: 'Food Debates',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    defaultTopText: 'EATING SALAD FOR DINNER',
    defaultBottomText: 'ORDERING HYDERABADI DUM BIRYANI AT MIDNIGHT',
    description: 'Reject ordinary salads, embrace rich royal biryani.'
  },
  {
    id: 'distracted-foodie',
    name: 'Distracted Foodie (Ghee Roast Dosa)',
    category: 'Relatable Foodie',
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80',
    defaultTopText: 'ME COMMITTED TO MY LOW-CARB DIET',
    defaultBottomText: 'CRISPY GHEE PODI ROAST DOSA WITH THREE CHUTNEYS',
    description: 'When the aroma of hot melted ghee makes you forget your diet.'
  },
  {
    id: 'two-buttons-coffee',
    name: 'The Ultimate Morning Dilemma',
    category: 'Beverage Battles',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    defaultTopText: 'DEGREE FILTER COFFEE OR IRANI CHAI?',
    defaultBottomText: 'FOODIE BRAIN OVERHEATING AT 7:00 AM',
    description: 'The impossible choice between South Indian filter coffee and Irani chai.'
  },
  {
    id: 'spicy-andhra-mirchi',
    name: 'Spicy Level: Extreme Andhra',
    category: 'Spicy Challenges',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    defaultTopText: 'WAITER: "ARE YOU SURE? THIS GUNTUR CHICKEN IS SPICY"',
    defaultBottomText: 'ME: "I WAS BORN READY" (REACHES FOR WATER 5 SECS LATER)',
    description: 'Overconfidence meets fiery Rayalaseema & Guntur spices.'
  },
  {
    id: 'chef-kiss-sambar',
    name: 'Pure Culinary Perfection',
    category: 'Taste Test',
    imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80',
    defaultTopText: 'WHEN THE SAMBAR HAS THE PERFECT DRUMSTICK & SHALLOT RATIO',
    defaultBottomText: '*CHEF KISS INTENSIFIES*',
    description: 'That euphoric moment when the morning tiffin sambar hits just right.'
  },
  {
    id: 'buff-heritage-vs-fusion',
    name: 'Heritage Tiffins vs Modern Fusion',
    category: 'Tradition vs Modern',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    defaultTopText: '60-YEAR OLD OLD-CITY TIFFIN SPOT (STANDING ONLY)',
    defaultBottomText: 'FANCY ₹800 FUSION DOSA WITH MAYONNAISE',
    description: 'Heritage street flavors vs overcomplicated modern fusion.'
  }
];

export interface CuratedGif {
  id: string;
  title: string;
  category: string;
  url: string;
  tags: string[];
}

export const CURATED_FOOD_GIFS: CuratedGif[] = [
  {
    id: 'gif-biryani-steam',
    title: 'Steaming Dum Biryani Handi',
    category: 'Biryani',
    url: 'https://media.giphy.com/media/xT1R9SzXOQn7lfhsFq/giphy.gif',
    tags: ['biryani', 'steam', 'hyderabad', 'dum', 'drool']
  },
  {
    id: 'gif-ghee-dosa',
    title: 'Ghee Pouring on Crisp Dosa',
    category: 'South Indian',
    url: 'https://media.giphy.com/media/l41lO3n0gI0z9Yh3a/giphy.gif',
    tags: ['dosa', 'ghee', 'crispy', 'breakfast', 'tiffins']
  },
  {
    id: 'gif-filter-coffee',
    title: 'Meter Filter Coffee Froth Pour',
    category: 'Coffee & Chai',
    url: 'https://media.giphy.com/media/3o7TKTDnUxE0gpnk0o/giphy.gif',
    tags: ['coffee', 'filter coffee', 'morning', 'froth', 'chai']
  },
  {
    id: 'gif-chef-kiss',
    title: 'Chef Kiss / Delicious',
    category: 'Reactions',
    url: 'https://media.giphy.com/media/3o7qDWp7hxhi1N87F6/giphy.gif',
    tags: ['delicious', 'chef kiss', 'perfection', 'yummy', 'reaction']
  },
  {
    id: 'gif-nom-nom',
    title: 'Eating Feast Nom Nom',
    category: 'Humor',
    url: 'https://media.giphy.com/media/12uXi1GXBibALC/giphy.gif',
    tags: ['eating', 'foodie', 'hungry', 'devour', 'buffet']
  },
  {
    id: 'gif-fire-spicy',
    title: 'Fire Spicy Reaction',
    category: 'Reactions',
    url: 'https://media.giphy.com/media/l41JRsph73VokN6ik/giphy.gif',
    tags: ['spicy', 'hot', 'fire', 'andhra', 'mirchi']
  }
];

export interface CuratedShortVideo {
  id: string;
  title: string;
  restaurantName: string;
  city: string;
  durationSeconds: number;
  videoUrl: string;
  posterUrl: string;
  creatorName: string;
  creatorAvatar: string;
  likesCount: number;
  tags: string[];
}

export const SAMPLE_15S_VIDEOS: CuratedShortVideo[] = [
  {
    id: 'video-1',
    title: 'Unboxing 40-Year Old Hyderabadi Dum Handi! 🤤🔥',
    restaurantName: 'Shah Ghouse Cafe',
    city: 'Hyderabad',
    durationSeconds: 12,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-frying-diced-vegetables-in-a-pan-43285-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    creatorName: 'Aarav Sharma',
    creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    likesCount: 1420,
    tags: ['Biryani', 'Hyderabad', 'DumCooking', '15sFoodShorts']
  },
  {
    id: 'video-2',
    title: 'Golden Ghee MLA Pesarattu live on cast iron tawa! 🧈',
    restaurantName: 'Minerva Coffee Shop',
    city: 'Hyderabad',
    durationSeconds: 14,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-preparing-food-in-a-kitchen-43288-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80',
    creatorName: 'Priya Iyer',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    likesCount: 980,
    tags: ['PureVeg', 'Tiffins', 'GheeRoast', 'BreakfastReels']
  },
  {
    id: 'video-3',
    title: 'Meter Filter Coffee froth pour in brass tumbler! ☕✨',
    restaurantName: "Brahmin's Coffee Bar",
    city: 'Bangalore',
    durationSeconds: 10,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-milk-into-coffee-42998-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    creatorName: 'Karthik Rao',
    creatorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    likesCount: 2310,
    tags: ['BangaloreEats', 'FilterCoffee', 'MorningRitual', 'Shorts']
  }
];
