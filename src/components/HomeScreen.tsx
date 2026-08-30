import React, { useState, useMemo } from 'react';
import { Restaurant, ScreenType } from '../types';
import { CrowdMeter } from './CrowdMeter';
import { 
  getTimeOfDayContext, 
  generateAaharScoutPicks, 
  AaharScoutPick,
  parseNaturalLanguageQuery 
} from '../utils/foodDecisionEngine';
import { AaharScoutPicks } from './AaharScoutPicks';
import { SurpriseMeModal } from './SurpriseMeModal';
import { BudgetChallengeModal } from './BudgetChallengeModal';
import { FoodPersonalityModal } from './FoodPersonalityModal';
import { 
  Sparkles, Dices, DollarSign, UserCheck, Flame, 
  Search, MapPin, ArrowRight, ShieldCheck, Clock, Utensils
} from 'lucide-react';

interface HomeScreenProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (r: Restaurant) => void;
  onSearch: (query: string, city: string) => void;
  onNavigate: (screen: ScreenType) => void;
  isVegOnly: boolean;
  onToggleVegOnly: () => void;
  onToggleSave?: (r: Restaurant) => void;
  savedIds?: string[];
}

interface CityTrendingConfig {
  tagline: string;
  placeholder: string;
  quickPrompts: Array<{ label: string; query: string }>;
  trendingCuisines: Array<{ label: string; icon: string; query: string; count: string }>;
  trendingDishes: string[];
}

const CITY_TRENDING_CONFIGS: Record<string, CityTrendingConfig> = {
  Hyderabad: {
    tagline: 'Biryani capital, Nizami heritage & third-wave cafes',
    placeholder: 'Try: "Spicy chicken biryani under ₹300 near me"...',
    quickPrompts: [
      { label: '🍛 Best biryani under ₹300', query: 'Best biryani under ₹300 in Hyderabad' },
      { label: '🌶️ Something spicy for dinner', query: 'Spicy chicken and mutton for dinner in Hyderabad' },
      { label: '🥞 Healthy breakfast near me', query: 'Healthy South Indian breakfast in Hyderabad' },
      { label: '💰 Good food for two under ₹500', query: 'Good food for 2 people under ₹500 in Hyderabad' },
      { label: '☕ Irani Chai & Osmania', query: 'Old city Irani chai with Osmania biscuits' },
    ],
    trendingCuisines: [
      { label: 'Dum Biryani', icon: '🍗', query: 'Best Hyderabadi dum biryani in Hyderabad', count: '18+ Places' },
      { label: 'Nizami Mughlai', icon: '🍲', query: 'Royal Nizami Haleem and mutton curries in Hyderabad', count: '14+ Places' },
      { label: 'South Indian Tiffins', icon: '🥞', query: 'Chutneys 7-dip dosa and ghee idli in Hyderabad', count: '12+ Places' },
      { label: 'Third-Wave Coffee', icon: '☕', query: 'Specialty coffee roastery in Jubilee Hills', count: '10+ Places' },
      { label: 'Artisan Pastries', icon: '🍰', query: 'Conçu European handcrafted desserts', count: '8+ Places' },
      { label: 'Japanese & Omakase', icon: '🍣', query: 'Kumi modern Japanese sushi and robata', count: '6+ Places' },
    ],
    trendingDishes: ['Kachchi Dum Biryani', 'Guntur Mirchi Bajji', 'Mutton Haleem', 'Double Ka Meetha', 'Irani Chai', 'Osmania Biscuits'],
  },
  Bangalore: {
    tagline: 'Craft microbreweries, butter benne dosas & third-wave cafes',
    placeholder: 'Try: "Crispy butter benne dosa under ₹200"...',
    quickPrompts: [
      { label: '🥞 Butter Benne Dosa', query: 'Crispy CTR Benne Masala Dosa and filter coffee' },
      { label: '🍺 Craft Breweries', query: 'Toit Indiranagar craft beer and woodfired pizza' },
      { label: '💰 Good food for two under ₹500', query: 'Best meal for 2 people under ₹500 in Bangalore' },
      { label: '🌿 1924 MTR Classics', query: 'Historic MTR Rava Idli and silver plate thali' },
      { label: '☕ Specialty Roasteries', query: 'Third wave coffee and brunch in Koramangala' },
    ],
    trendingCuisines: [
      { label: 'Benne Dosa & Tiffins', icon: '🥞', query: 'Crispy benne masala dosa and filter coffee in Bangalore', count: '16+ Places' },
      { label: 'Craft Microbreweries', icon: '🍺', query: 'Toit craft beer and woodfired pizza in Bangalore', count: '15+ Places' },
      { label: 'Heritage South Indian', icon: '🌿', query: 'Mavalli Tiffin Room MTR 1924 traditional thali', count: '10+ Places' },
      { label: 'Specialty Cafes', icon: '☕', query: 'Artisan pour over coffee in Indiranagar', count: '20+ Places' },
      { label: 'Mangalore Seafood', icon: '🦐', query: 'Coastal Mangalore ghee roast and kori rotti', count: '9+ Places' },
    ],
    trendingDishes: ['Benne Masala Dosa', 'Tinman Stout & Pizza', 'MTR Rava Idli', 'Filter Coffee', 'Mangalore Ghee Roast', 'Bisi Bele Bath'],
  },
  Chennai: {
    tagline: 'Jasmine-soft idlis, fiery Chettinad feasts & Marina seafood',
    placeholder: 'Try: "Authentic Chettinad pepper chicken for dinner"...',
    quickPrompts: [
      { label: '🥞 Ghee Podi Idli', query: 'Murugan Idli Shop soft idlis with 4 chutneys' },
      { label: '🍗 Chettinad Feasts', query: 'Authentic spicy Chettinad chicken and parotta in Chennai' },
      { label: '☕ Kumbakonam Coffee', query: 'Traditional brass tumbler degree filter coffee in Chennai' },
      { label: '💰 Food for 2 under ₹400', query: 'Budget dinner for two under ₹400 in Chennai' },
    ],
    trendingCuisines: [
      { label: 'Chettinad Spices', icon: '🍗', query: 'Authentic Chettinad spicy chicken and parotta', count: '14+ Places' },
      { label: 'Podi Idli & Tiffins', icon: '🥞', query: 'Murugan idli ghee podi and 4 chutneys', count: '18+ Places' },
      { label: 'Coastal Seafood', icon: '🦐', query: 'Fresh catch fish fry and prawn masala', count: '12+ Places' },
      { label: 'Degree Filter Coffee', icon: '☕', query: 'Traditional Kumbakonam degree filter coffee', count: '22+ Places' },
    ],
    trendingDishes: ['Ghee Podi Idli', 'Chettinad Pepper Chicken', 'Kumbakonam Coffee', 'Vazhaipoo Vadai', 'Malabar Meen Curry'],
  },
  Kochi: {
    tagline: 'Malabar biryani, claypot coastal seafood & colonial art cafes',
    placeholder: 'Try: "Malabar Biryani & Karimeen Pollichathu under ₹400"...',
    quickPrompts: [
      { label: '🐟 Karimeen Pollichathu', query: 'Fresh pearl spot fish roasted in banana leaf in Kochi' },
      { label: '🍗 Malabar Dum Biryani', query: 'Paragon famous Kaima rice Malabar biryani in Kochi' },
      { label: '🎨 Fort Kochi Art Cafes', query: 'Kashi Art Cafe dark chocolate cake and cold brew' },
      { label: '💰 Best food under ₹300', query: 'Best budget food under ₹300 in Kochi' },
    ],
    trendingCuisines: [
      { label: 'Malabar Biryani', icon: '🍗', query: 'Paragon authentic Malabar dum biryani', count: '12+ Places' },
      { label: 'Claypot Seafood', icon: '🐟', query: 'Karimeen pollichathu and coastal fish curry', count: '16+ Places' },
      { label: 'Fort Kochi Art Cafes', icon: '🎨', query: 'Kashi art cafe breakfast and espresso', count: '9+ Places' },
    ],
    trendingDishes: ['Karimeen Pollichathu', 'Malabar Kaima Biryani', 'Kashi Chocolate Cake', 'Appam & Mutton Stew'],
  },
  Visakhapatnam: {
    tagline: 'Fiery Andhra Bhojanam, spicy coastal dhabas & beachside seafood',
    placeholder: 'Try: "14-item Andhra Bhojanam Thali under ₹300"...',
    quickPrompts: [
      { label: '🌿 Andhra Bhojanam', query: 'Authentic 14-dish Andhra Thali with Gongura Pachadi in Vizag' },
      { label: '🦐 Beach Road Prawn Fry', query: 'Raju Gari Dhaba spicy prawn iguru and fry in Vizag' },
      { label: '🥞 MLA Upma Pesarattu', query: 'Crispy green gram pesarattu with ginger chutney in Vizag' },
      { label: '💰 Meal for 2 under ₹500', query: 'Good dinner for 2 under ₹500 in Vizag' },
    ],
    trendingCuisines: [
      { label: 'Andhra Bhojanam', icon: '🍛', query: 'Dharani Daspalla grand Andhra thali in Vizag', count: '14+ Places' },
      { label: 'Coastal Seafood Dhabas', icon: '🦐', query: 'Raju Gari Dhaba prawn iguru and fish fry', count: '15+ Places' },
    ],
    trendingDishes: ['Andhra Bhojanam Thali', 'Royyala Iguru', 'MLA Upma Pesarattu', 'Chepala Vepudu'],
  },
  Nellore: {
    tagline: 'World-famous Chepala Pulusu, Ghee Erra Karam Dosa & claypot seafood',
    placeholder: 'Try: "Claypot Korameenu Chepala Pulusu"...',
    quickPrompts: [
      { label: '🐟 Korameenu Chepala Pulusu', query: 'Authentic claypot Nellore Chepala Pulusu with hot rice' },
      { label: '🥞 Ghee Erra Karam Dosa', query: 'Murali Krishna Special Nellore Ghee Karam Dosa' },
      { label: '🦐 Nellore Royyala Vepudu', query: 'Spicy estuary prawn roast and pepper fry in Nellore' },
    ],
    trendingCuisines: [
      { label: 'Claypot Chepala Pulusu', icon: '🐟', query: 'Hotel Mayuri Korameenu Chepala Pulusu in Nellore', count: '10+ Places' },
      { label: 'Ghee Erra Karam Dosa', icon: '🥞', query: 'Murali Krishna Nellore ghee karam dosa', count: '12+ Places' },
    ],
    trendingDishes: ['Korameenu Chepala Pulusu', 'Ghee Erra Karam Dosa', 'Royyala Vepudu'],
  },
  Vijayawada: {
    tagline: 'Legendary Babai Butter Idlis, Krishna delta feasts & Ulavacharu biryani',
    placeholder: 'Try: "Babai White Butter Idli drenched in ghee"...',
    quickPrompts: [
      { label: '🧈 Babai White Butter Idli', query: 'Babai Hotel authentic white butter venna idli in Vijayawada' },
      { label: '🍲 Ulavacharu Biryani', query: 'Blue Fox Minerva Grand Ulavacharu Chicken Biryani in Vijayawada' },
      { label: '🌿 Andhra Pure Veg Bhojanam', query: 'Sweet Magic grand 18-course vegetarian thali in Vijayawada' },
    ],
    trendingCuisines: [
      { label: 'Babai Heritage Tiffins', icon: '🧈', query: 'Babai Hotel white butter idlis and ghee dosas in Vijayawada', count: '14+ Places' },
      { label: 'Ulavacharu Biryani', icon: '🍲', query: 'Minerva Grand authentic Ulavacharu biryani in Vijayawada', count: '12+ Places' },
    ],
    trendingDishes: ['Babai White Butter Idli', 'Ulavacharu Biryani', 'Sweet Magic Pure Veg Thali'],
  },
  Guntur: {
    tagline: '1950s Sankar Vilas Ghee Dosas, world-famous fiery chillies & gongura mutton',
    placeholder: 'Try: "Sankar Vilas wafer-thin crisp Ghee Masala Dosa"...',
    quickPrompts: [
      { label: '🥞 Sankar Vilas Ghee Dosa', query: 'Sankar Vilas Hotel Brodipet crispy ghee masala dosa' },
      { label: '🌶️ Guntur Gongura Mutton', query: 'Viceroy authentic fiery Guntur gongura mutton biryani' },
      { label: '🌿 Cashew Ghee Pongal', query: 'Sri Krishna Vilas hot ghee pongal and crispy medu vada' },
    ],
    trendingCuisines: [
      { label: 'Brodipet Ghee Dosas', icon: '🥞', query: 'Sankar Vilas authentic crispy ghee masala dosa in Guntur', count: '15+ Places' },
      { label: 'Fiery Gongura Biryani', icon: '🌶️', query: 'Viceroy spicy Guntur red chilli biryanis and mutton', count: '12+ Places' },
    ],
    trendingDishes: ['Sankar Vilas Ghee Dosa', 'Guntur Gongura Mutton Biryani', 'Sri Krishna Vilas Ghee Pongal'],
  },
};

const CRAVING_CHIPS = [
  { label: 'Biryani', icon: '🍛', query: 'Best Biryani' },
  { label: 'Chicken', icon: '🍗', query: 'Best Chicken Feasts' },
  { label: 'Mutton', icon: '🥩', query: 'Best Mutton Dishes' },
  { label: 'Pizza', icon: '🍕', query: 'Woodfired Pizza' },
  { label: 'Burgers', icon: '🍔', query: 'Juicy Burgers' },
  { label: 'Spicy Food', icon: '🌶️', query: 'Fiery Spicy Food' },
  { label: 'Noodles', icon: '🍜', query: 'Asian Noodles' },
  { label: 'South Indian', icon: '🥘', query: 'South Indian Tiffins & Meals' },
  { label: 'Coffee', icon: '☕', query: 'Specialty Coffee & Cafes' },
  { label: 'Desserts', icon: '🍰', query: 'Artisan Desserts & Sweets' },
  { label: 'Healthy Food', icon: '🥗', query: 'Clean Healthy Food' },
  { label: 'Surprise Me', icon: '🎲', query: 'surprise' },
];

const ALL_CITIES = ['Hyderabad', 'Bangalore', 'Chennai', 'Kochi', 'Visakhapatnam', 'Nellore', 'Vijayawada', 'Guntur'];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  restaurants,
  onSelectRestaurant,
  onSearch,
  onNavigate,
  isVegOnly,
  onToggleVegOnly,
  onToggleSave,
  savedIds = [],
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('Hyderabad');
  const [searchInput, setSearchInput] = useState<string>('');
  const [isSurpriseOpen, setIsSurpriseOpen] = useState<boolean>(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState<boolean>(false);
  const [isPersonalityOpen, setIsPersonalityOpen] = useState<boolean>(false);

  const timeCtx = getTimeOfDayContext();
  const currentCityConfig = CITY_TRENDING_CONFIGS[selectedCity] || CITY_TRENDING_CONFIGS['Hyderabad'];

  // Generate homepage AaharScout Picks for the current city
  const homePicks = useMemo(() => {
    const parsed = parseNaturalLanguageQuery(searchInput || 'best food', selectedCity);
    return generateAaharScoutPicks(restaurants, parsed, isVegOnly);
  }, [restaurants, selectedCity, searchInput, isVegOnly]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchInput.trim() || `Best food in ${selectedCity}`;
    onSearch(query, selectedCity);
  };

  const handleCravingClick = (chip: typeof CRAVING_CHIPS[0]) => {
    if (chip.label === 'Surprise Me') {
      setIsSurpriseOpen(true);
      return;
    }
    const query = `${chip.query} in ${selectedCity}`;
    setSearchInput(query);
    onSearch(query, selectedCity);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Decision Engine Section */}
      <section className="w-full px-5 sm:px-8 md:px-16 pt-8 pb-12 max-w-7xl mx-auto flex flex-col items-center text-center gap-6 relative">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[340px] rounded-full blur-3xl pointer-events-none -z-10 bg-gradient-to-tr from-[#ff4500]/15 via-[#ff8c00]/15 to-transparent" />

        {/* Top Badges: Positioning & Time Context */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold shadow-2xs border bg-orange-50 border-orange-200 text-[#ad2c00]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AaharScout — Find what to eat, not just where to eat.</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100/90 text-amber-900 border border-amber-300 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>{timeCtx.badge}</span>
          </div>

          <button
            type="button"
            onClick={onToggleVegOnly}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs border ${
              isVegOnly
                ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700'
                : 'bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-300'
            }`}
          >
            <span>{isVegOnly ? '🌿 Pure Veg Active' : '🌱 Pure Veg Mode'}</span>
          </button>
        </div>

        {/* Main Headings */}
        <div className="max-w-4xl flex flex-col gap-3">
          <h1 className="font-syne text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.08] tracking-tight">
            Stop Searching. <span className="bg-gradient-to-r from-[#ff4500] via-[#e63900] to-[#ff781f] bg-clip-text text-transparent">Start Eating.</span>
          </h1>
          <p className="font-grotesk text-base sm:text-lg text-gray-700 max-w-2xl mx-auto font-medium">
            AaharScout helps you decide what to eat based on your craving, budget, mood, and location.
          </p>
        </div>

        {/* City Switcher Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl">
          <span className="text-xs font-bold text-gray-500 mr-1 hidden sm:inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#ff4500]" />
            <span>City:</span>
          </span>
          {ALL_CITIES.map((city) => {
            const isSelected = selectedCity === city;
            return (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#ad2c00] text-white border border-[#ad2c00] shadow-xs scale-105'
                    : 'bg-white hover:bg-orange-50 border border-orange-200/80 text-gray-800'
                }`}
              >
                <span>{city}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </button>
            );
          })}
        </div>

        {/* Natural Language Decision Search Box */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-3 flex flex-col md:flex-row items-center gap-3 border-2 border-orange-200/80 hover:border-[#ff4500] transition-colors"
        >
          <div className="flex-grow flex items-center w-full px-4 py-3.5 rounded-2xl bg-[#fff5f0] border border-orange-200/60">
            <Search className="w-5 h-5 text-[#ff4500] mr-3 shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder='Tell AaharScout what you’re craving (e.g. "Spicy chicken biryani under ₹300 near me")...'
              className="w-full bg-transparent border-none outline-hidden text-gray-900 placeholder:text-gray-400 font-grotesk text-sm sm:text-base font-medium"
            />
          </div>

          <div className="flex items-center justify-between gap-2.5 w-full md:w-auto">
            <button
              type="submit"
              className="w-full md:w-auto text-white px-7 py-3.5 rounded-2xl font-grotesk text-sm font-bold bg-[#ad2c00] hover:bg-[#8c2300] shadow-md transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Find My Food</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick Conversational Prompts */}
        <div className="flex flex-wrap justify-center gap-2 max-w-3xl">
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1 mr-1 my-auto">
            <span>Try:</span>
          </span>
          {currentCityConfig.quickPrompts.map((prompt) => (
            <button
              key={prompt.label}
              type="button"
              onClick={() => {
                setSearchInput(prompt.query);
                onSearch(prompt.query, selectedCity);
              }}
              className="px-3 py-1.5 rounded-full font-grotesk text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95 bg-white hover:bg-orange-50 border border-orange-200/80 text-gray-800"
            >
              {prompt.label}
            </button>
          ))}
        </div>

        {/* Prominent "🍽️ What are you craving?" Section */}
        <div className="w-full max-w-4xl bg-white rounded-3xl border border-orange-100 shadow-sm p-6 sm:p-8 mt-2 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🍽️</span>
                <h3 className="font-syne font-extrabold text-xl sm:text-2xl text-gray-900">
                  What are you craving?
                </h3>
              </div>
              <p className="text-xs text-gray-500 font-grotesk">
                Select your craving or tap Surprise Me for an instant decision
              </p>
            </div>

            <button
              onClick={() => setIsSurpriseOpen(true)}
              className="py-2 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Dices className="w-4 h-4" />
              <span>🎲 Surprise Me</span>
            </button>
          </div>

          {/* Craving Chips Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {CRAVING_CHIPS.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => handleCravingClick(chip)}
                className="group flex flex-col items-center justify-center p-3.5 rounded-2xl bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-300 transition-all cursor-pointer shadow-2xs hover:shadow-sm active:scale-95 text-center"
              >
                <span className="text-2xl mb-1.5 group-hover:scale-115 transition-transform">
                  {chip.icon}
                </span>
                <span className="font-syne font-bold text-xs text-gray-900 group-hover:text-[#ff4500]">
                  {chip.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Feature Triggers Strip: ₹500 Challenge & Food Personality */}
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {/* ₹500 Food Challenge Box */}
          <div 
            onClick={() => setIsBudgetOpen(true)}
            className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white border border-emerald-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm group-hover:scale-105 transition-transform">
                💰
              </span>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider font-mono block">
                  Budget Meal Planner
                </span>
                <h4 className="font-syne font-extrabold text-base sm:text-lg text-gray-900">
                  Feed 2 Under ₹500
                </h4>
                <p className="text-xs text-gray-600">
                  Curated multi-dish combo plans
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform shrink-0" />
          </div>

          {/* Food Personality Box */}
          <div 
            onClick={() => setIsPersonalityOpen(true)}
            className="p-5 rounded-3xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-white border border-orange-200 hover:border-orange-400 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-[#ad2c00] text-white flex items-center justify-center font-bold text-2xl shadow-sm group-hover:scale-105 transition-transform">
                🎭
              </span>
              <div>
                <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider font-mono block">
                  Personalized Taste Match
                </span>
                <h4 className="font-syne font-extrabold text-base sm:text-lg text-gray-900">
                  Your Food Personality
                </h4>
                <p className="text-xs text-gray-600">
                  Discover your dining archetype
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#ad2c00] group-hover:translate-x-1 transition-transform shrink-0" />
          </div>
        </div>
      </section>

      {/* AaharScout Picks Section (Curated 3-7 Dish-First Cards) */}
      <section className="w-full px-5 sm:px-8 md:px-16 py-8 max-w-7xl mx-auto border-t border-gray-200/80">
        <AaharScoutPicks
          picks={homePicks}
          onSelectRestaurant={onSelectRestaurant}
          onToggleSave={onToggleSave}
          savedIds={savedIds}
          title={`AaharScout Picks in ${selectedCity}`}
          subtitle={`Curated dish recommendations for ${selectedCity} based on authentic taste sentiment, budget, and quality.`}
        />
      </section>

      {/* Community Forum & Live Meme Studio Spotlight Section */}
      <section className="w-full px-5 sm:px-8 md:px-16 py-12 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-br from-[#20110b] via-[#35180f] to-[#1a0c07] text-white p-6 sm:p-10 relative overflow-hidden shadow-2xl border border-orange-900/40">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#ff4500]/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#ad2c00] text-white shadow-xs">
                  💬 FOODIE DISCUSSION FORUM & MEMES
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/90 text-emerald-400 border border-emerald-500/30">
                  🛡️ Family Friendly • Zero Vulgarity
                </span>
              </div>

              <h2 className="font-syne text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                Debate Biryanis, Share 15s Video Shorts & Create Live Memes!
              </h2>

              <p className="text-sm sm:text-base text-orange-200/90 leading-relaxed font-grotesk">
                Join 14,000+ registered South Indian food lovers. Settle the legendary Biryani debates, 
                watch sizzling 15-second street food clips, vote in live foodie polls, and design viral memes with our canvas studio!
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => onNavigate('forum')}
                  className="px-6 py-3 rounded-2xl text-sm font-bold bg-[#ad2c00] hover:bg-[#8c2300] text-white shadow-lg transition-all flex items-center gap-2 cursor-pointer font-grotesk"
                >
                  <span className="material-symbols-outlined text-base">forum</span>
                  <span>Join Discussion Forum</span>
                </button>
                <button
                  onClick={() => onNavigate('forum')}
                  className="px-6 py-3 rounded-2xl text-sm font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer font-grotesk"
                >
                  <span className="text-amber-400">✨</span>
                  <span>Open Live Meme Studio</span>
                </button>
              </div>
            </div>

            {/* Visual Teaser Cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              <div 
                onClick={() => onNavigate('forum')}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all cursor-pointer flex flex-col justify-between backdrop-blur-xs group"
              >
                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🍲</span>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white mb-0.5">Biryani Wars</h4>
                  <p className="text-[11px] text-orange-200/70">Hyderabadi vs Dindigul vs Ambur</p>
                </div>
              </div>

              <div 
                onClick={() => onNavigate('forum')}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all cursor-pointer flex flex-col justify-between backdrop-blur-xs group"
              >
                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📹</span>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white mb-0.5">15s Sizzling Shorts</h4>
                  <p className="text-[11px] text-orange-200/70">Short video reviews & sizzlers</p>
                </div>
              </div>

              <div 
                onClick={() => onNavigate('forum')}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all cursor-pointer flex flex-col justify-between backdrop-blur-xs group"
              >
                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">😂</span>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white mb-0.5">Live Meme Studio</h4>
                  <p className="text-[11px] text-orange-200/70">Generate & share custom memes</p>
                </div>
              </div>

              <div 
                onClick={() => onNavigate('forum')}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all cursor-pointer flex flex-col justify-between backdrop-blur-xs group"
              >
                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</span>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white mb-0.5">Live Foodie Polls</h4>
                  <p className="text-[11px] text-orange-200/70">Cast your vote on taste verdicts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Modals */}
      <SurpriseMeModal
        isOpen={isSurpriseOpen}
        onClose={() => setIsSurpriseOpen(false)}
        restaurants={restaurants}
        onSelectRestaurant={onSelectRestaurant}
        isVegOnly={isVegOnly}
      />

      <BudgetChallengeModal
        isOpen={isBudgetOpen}
        onClose={() => setIsBudgetOpen(false)}
        restaurants={restaurants}
        onSelectRestaurant={onSelectRestaurant}
        isVegOnly={isVegOnly}
      />

      <FoodPersonalityModal
        isOpen={isPersonalityOpen}
        onClose={() => setIsPersonalityOpen(false)}
        onSearchCraving={(craving) => {
          setSearchInput(craving);
          onSearch(craving, selectedCity);
        }}
      />
    </div>
  );
};
