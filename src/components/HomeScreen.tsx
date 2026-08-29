import React, { useState, useMemo } from 'react';
import { Restaurant, ScreenType } from '../types';
import { CrowdMeter } from './CrowdMeter';

interface HomeScreenProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (r: Restaurant) => void;
  onSearch: (query: string, city: string) => void;
  onNavigate: (screen: ScreenType) => void;
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
    placeholder: 'Try: Best authentic Hyderabadi Dum Biryani under ₹500...',
    quickPrompts: [
      { label: '🍗 Hyderabadi Dum Biryani', query: 'Authentic mutton dum biryani in Hyderabad' },
      { label: '🥘 Haleem & Kebabs', query: 'Spicy Nizami mutton haleem and seekh kebabs' },
      { label: '☕ Irani Chai & Osmania', query: 'Old city Irani chai with Osmania biscuits' },
      { label: '🍰 French Pâtisserie', query: 'Artisanal desserts and pastries in Jubilee Hills' },
      { label: '❤️ Romantic Rooftop', query: 'Romantic candlelit dinner in Banjara Hills' },
      { label: '💰 Best Under ₹300', query: 'Best budget food under ₹300 in Hyderabad' },
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
    placeholder: 'Try: Crispy butter benne dosa in Malleshwaram...',
    quickPrompts: [
      { label: '🥞 Butter Benne Dosa', query: 'Crispy CTR Benne Masala Dosa and filter coffee' },
      { label: '🍺 Craft Breweries', query: 'Toit Indiranagar craft beer and woodfired pizza' },
      { label: '☕ Specialty Roasteries', query: 'Third wave coffee and brunch in Koramangala' },
      { label: '🌿 1924 MTR Classics', query: 'Historic MTR Rava Idli and silver plate thali' },
      { label: '❤️ Alfresco Date Night', query: 'Romantic dining at Grasshopper Bannerghatta' },
      { label: '💰 Best Under ₹300', query: 'Best budget tiffin rooms in Malleshwaram' },
    ],
    trendingCuisines: [
      { label: 'Benne Dosa & Tiffins', icon: '🥞', query: 'Crispy benne masala dosa and filter coffee in Bangalore', count: '16+ Places' },
      { label: 'Craft Microbreweries', icon: '🍺', query: 'Toit craft beer and woodfired pizza in Bangalore', count: '15+ Places' },
      { label: 'Heritage South Indian', icon: '🌿', query: 'Mavalli Tiffin Room MTR 1924 traditional thali', count: '10+ Places' },
      { label: 'Artisan European', icon: '🍷', query: 'Grasshopper fine dining multi-course meal in Bangalore', count: '7+ Places' },
      { label: 'Specialty Cafes', icon: '☕', query: 'Artisan pour over coffee in Indiranagar', count: '20+ Places' },
      { label: 'Mangalore Seafood', icon: '🦐', query: 'Coastal Mangalore ghee roast and kori rotti', count: '9+ Places' },
    ],
    trendingDishes: ['Benne Masala Dosa', 'Tinman Stout & Pizza', 'MTR Rava Idli', 'Filter Coffee', 'Mangalore Ghee Roast', 'Bisi Bele Bath'],
  },
  Chennai: {
    tagline: 'Jasmine-soft idlis, fiery Chettinad feasts & Marina seafood',
    placeholder: 'Try: Murugan Idli with 4 signature chutneys in T. Nagar...',
    quickPrompts: [
      { label: '🥞 Ghee Podi Idli', query: 'Murugan Idli Shop soft idlis with 4 chutneys' },
      { label: '🍗 Chettinad Feasts', query: 'Authentic spicy Chettinad chicken and parotta in Chennai' },
      { label: '☕ Kumbakonam Coffee', query: 'Traditional brass tumbler degree filter coffee in Chennai' },
      { label: '🦐 Marina Beach Seafood', query: 'Fresh coastal seafood and fish fry in Chennai' },
      { label: '🏛️ Royal South Indian', query: 'Luxury dining at Dakshin ITC Grand Chola' },
      { label: '💰 Best Under ₹300', query: 'Famous budget mess and tiffins in Mylapore' },
    ],
    trendingCuisines: [
      { label: 'Chettinad Spices', icon: '🍗', query: 'Authentic Chettinad spicy chicken and parotta', count: '14+ Places' },
      { label: 'Podi Idli & Tiffins', icon: '🥞', query: 'Murugan idli ghee podi and 4 chutneys', count: '18+ Places' },
      { label: 'Coastal Seafood', icon: '🦐', query: 'Fresh catch fish fry and prawn masala', count: '12+ Places' },
      { label: 'Degree Filter Coffee', icon: '☕', query: 'Traditional Kumbakonam degree filter coffee', count: '22+ Places' },
      { label: 'Heritage Fine Dining', icon: '🏛️', query: 'Dakshin ITC Grand Chola royal feast', count: '6+ Places' },
      { label: 'Garden Cafes', icon: '🌿', query: 'Amethyst Wild Garden cafe continental bites', count: '8+ Places' },
    ],
    trendingDishes: ['Ghee Podi Idli', 'Chettinad Pepper Chicken', 'Kumbakonam Coffee', 'Vazhaipoo Vadai', 'Malabar Meen Curry', 'Kothu Parotta'],
  },
  Kochi: {
    tagline: 'Malabar biryani, claypot coastal seafood & colonial art cafes',
    placeholder: 'Try: World-famous Malabar Biryani & Karimeen Pollichathu...',
    quickPrompts: [
      { label: '🐟 Karimeen Pollichathu', query: 'Fresh pearl spot fish roasted in banana leaf in Kochi' },
      { label: '🍗 Malabar Dum Biryani', query: 'Paragon famous Kaima rice Malabar biryani in Kochi' },
      { label: '🎨 Fort Kochi Art Cafes', query: 'Kashi Art Cafe dark chocolate cake and cold brew' },
      { label: '🥥 Appam & Coconut Stew', query: 'Crisp-lacy appams with creamy vegetable stew in Kochi' },
      { label: '❤️ Sunset Seafood', query: 'Romantic waterfront seafood grill in Fort Kochi' },
      { label: '💰 Best Under ₹300', query: 'Authentic local seafood and spicy fish curry in Kochi' },
    ],
    trendingCuisines: [
      { label: 'Malabar Biryani', icon: '🍗', query: 'Paragon authentic Malabar dum biryani', count: '12+ Places' },
      { label: 'Claypot Seafood', icon: '🐟', query: 'Karimeen pollichathu and coastal fish curry', count: '16+ Places' },
      { label: 'Fort Kochi Art Cafes', icon: '🎨', query: 'Kashi art cafe breakfast and espresso', count: '9+ Places' },
      { label: 'Kerala Sadya & Stew', icon: '🥥', query: 'Traditional Kerala sadya and appam stew', count: '11+ Places' },
      { label: 'Syrian Christian', icon: '🥩', query: 'Kerala beef fry and parotta', count: '14+ Places' },
      { label: 'Sunset Grills', icon: '🦐', query: 'Beachfront grilled tiger prawns in Kochi', count: '7+ Places' },
    ],
    trendingDishes: ['Karimeen Pollichathu', 'Malabar Kaima Biryani', 'Kashi Chocolate Cake', 'Appam & Mutton Stew', 'Kerala Beef Roast', 'Kappa Meen Curry'],
  },
  Visakhapatnam: {
    tagline: 'Fiery Andhra Bhojanam, spicy coastal dhabas & beachside seafood',
    placeholder: 'Try: Authentic 14-item Andhra Bhojanam Thali at Daspalla...',
    quickPrompts: [
      { label: '🌿 Andhra Bhojanam', query: 'Authentic 14-dish Andhra Thali with Gongura Pachadi in Vizag' },
      { label: '🦐 Beach Road Prawn Fry', query: 'Raju Gari Dhaba spicy prawn iguru and fry in Vizag' },
      { label: '🏖️ Sea-View Dining', query: 'Rushikonda beachside dining and seafood' },
      { label: '🥞 MLA Upma Pesarattu', query: 'Crispy green gram pesarattu with ginger chutney in Vizag' },
      { label: '❤️ Oceanfront Romance', query: 'Candlelit seaside dinner on Vizag Beach Road' },
      { label: '💰 Best Under ₹300', query: 'Spicy Andhra lunch and meals under ₹250 in Vizag' },
    ],
    trendingCuisines: [
      { label: 'Andhra Bhojanam', icon: '🍛', query: 'Dharani Daspalla grand Andhra thali in Vizag', count: '14+ Places' },
      { label: 'Coastal Seafood Dhabas', icon: '🦐', query: 'Raju Gari Dhaba prawn iguru and fish fry', count: '15+ Places' },
      { label: 'Gongura & Spices', icon: '🌿', query: 'Authentic fiery Gongura chicken and mutton', count: '10+ Places' },
      { label: 'Beachside Cafes', icon: '☕', query: 'Seaside coffee and sunset snack bites in Vizag', count: '8+ Places' },
      { label: 'MLA Pesarattu', icon: '🥞', query: 'Hot pesarattu with upma and allam chutney', count: '12+ Places' },
      { label: 'Coastal Biryanis', icon: '🍲', query: 'Andhra spiced pot biryani and pulao in Vizag', count: '16+ Places' },
    ],
    trendingDishes: ['Andhra Bhojanam Thali', 'Royyala Iguru (Prawn)', 'MLA Upma Pesarattu', 'Gongura Mamsam', 'Chepala Vepudu', 'Avakaya Annam'],
  },
  Nellore: {
    tagline: 'World-famous Chepala Pulusu, Ghee Erra Karam Dosa & claypot seafood',
    placeholder: 'Try: Authentic Korameenu Nellore Chepala Pulusu in clay pots...',
    quickPrompts: [
      { label: '🐟 Korameenu Chepala Pulusu', query: 'Authentic claypot Nellore Chepala Pulusu with hot rice' },
      { label: '🥞 Ghee Erra Karam Dosa', query: 'Murali Krishna Special Nellore Ghee Karam Dosa' },
      { label: '🦐 Nellore Royyala Vepudu', query: 'Spicy estuary prawn roast and pepper fry in Nellore' },
      { label: '🌿 Pure Ghee Tiffins', query: 'Komala Vilas heritage pesarattu upma and coffee in Nellore' },
      { label: '🏛️ Minerva Grand Fine Dining', query: 'Blue Fox upscale dining and coastal feasts in Nellore' },
      { label: '💰 Best Under ₹300', query: 'Nellore iconic breakfast tiffins under ₹200' },
    ],
    trendingCuisines: [
      { label: 'Claypot Chepala Pulusu', icon: '🐟', query: 'Hotel Mayuri Korameenu Chepala Pulusu in Nellore', count: '10+ Places' },
      { label: 'Ghee Erra Karam Dosa', icon: '🥞', query: 'Murali Krishna Nellore ghee karam dosa', count: '12+ Places' },
      { label: 'Royyala Estuary Seafood', icon: '🦐', query: 'Nellore spiced prawn vepudu and curry', count: '8+ Places' },
      { label: 'Heritage Pure Veg', icon: '🌿', query: 'Komala Vilas authentic Andhra tiffins', count: '9+ Places' },
      { label: 'Natukodi & Biryani', icon: '🍗', query: 'Nellore spicy country chicken and biryani', count: '11+ Places' },
      { label: 'Trunk Road Street Bites', icon: '🥟', query: 'Famous Nellore evening snack stalls', count: '14+ Places' },
    ],
    trendingDishes: ['Korameenu Chepala Pulusu', 'Ghee Erra Karam Dosa', 'Royyala Vepudu', 'Ghee Pesarattu Upma', 'Nellore Natukodi Pulusu', 'Malai Kaja'],
  },
};

const ALL_CITIES = ['Hyderabad', 'Bangalore', 'Chennai', 'Kochi', 'Visakhapatnam', 'Nellore'];

const DEFAULT_RECENT_SEARCHES = [
  'Best biryani in Hyderabad for family',
  'Artisanal woodfired pizza in Hyderabad',
  'Specialty cafe and pour over coffee',
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  restaurants,
  onSelectRestaurant,
  onSearch,
  onNavigate,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedCity, setSelectedCity] = useState('Hyderabad');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('aahaarscout_recent_searches');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, 3);
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_RECENT_SEARCHES;
  });

  const currentCityConfig = useMemo(() => {
    return CITY_TRENDING_CONFIGS[selectedCity] || CITY_TRENDING_CONFIGS.Hyderabad;
  }, [selectedCity]);

  const saveRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const updated = [trimmed, ...prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase())].slice(0, 3);
      try {
        localStorage.setItem('aahaarscout_recent_searches', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleClearRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem('aahaarscout_recent_searches');
    } catch {
      // ignore
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchInput.trim() || `Best food in ${selectedCity}`;
    saveRecentSearch(query);
    onSearch(query, selectedCity);
  };

  const handleRecentClick = (query: string) => {
    setSearchInput(query);
    saveRecentSearch(query);
    onSearch(query, selectedCity);
  };

  const handlePromptClick = (query: string) => {
    setSearchInput(query);
    saveRecentSearch(query);
    onSearch(query, selectedCity);
  };

  const handleDishClick = (dish: string) => {
    const query = `Best ${dish} in ${selectedCity}`;
    setSearchInput(query);
    saveRecentSearch(query);
    onSearch(query, selectedCity);
  };

  // Trending in selected city: up to 4 featured cards
  const trendingRestaurants = useMemo(() => {
    const cityMatches = restaurants.filter((r) => r.city.toLowerCase() === selectedCity.toLowerCase());
    if (cityMatches.length > 0) {
      return cityMatches.slice(0, 4);
    }
    return restaurants.slice(0, 4);
  }, [restaurants, selectedCity]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full px-5 sm:px-8 md:px-16 py-10 md:py-16 max-w-7xl mx-auto flex flex-col items-center text-center gap-6 md:gap-8 relative">
        {/* Subtle vibrant ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-[#ff4500]/15 via-[#ff9e1f]/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 self-center bg-gradient-to-r from-[#ffebe4] to-[#fff4ea] border border-[#ffcfc2] px-4 py-1.5 rounded-full text-xs font-grotesk font-bold text-[#e63900] shadow-xs">
            <span className="material-symbols-outlined text-[16px] material-symbols-fill text-[#ff4500]">auto_awesome</span>
            <span>Live Food Discovery • {selectedCity}</span>
          </div>
          <h1 className="font-garamond text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold text-[#1e110d] leading-[1.1] tracking-tight">
            Find the best food in <span className="bg-gradient-to-r from-[#ff3800] via-[#e63900] to-[#ff8c00] bg-clip-text text-transparent">{selectedCity}.</span>
          </h1>
          <p className="font-grotesk text-base sm:text-lg text-[#523932] max-w-xl mx-auto font-medium">
            {currentCityConfig.tagline}
          </p>
        </div>

        {/* Quick City Switcher Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl pt-1">
          <span className="text-xs font-grotesk font-bold text-[#785950] mr-1 hidden sm:inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-[#ff4500]">location_on</span>
            <span>Switch City:</span>
          </span>
          {ALL_CITIES.map((city) => {
            const isSelected = selectedCity === city;
            return (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-grotesk font-bold transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white border border-[#ff4500] shadow-xs scale-105'
                    : 'bg-white/90 hover:bg-[#fff0eb] border border-[#ffded4] text-[#331c15] hover:text-[#ff4500] hover:border-[#ff4500]'
                }`}
              >
                <span>{city}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* AI Search Box */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full max-w-4xl bg-white rounded-2xl ai-border-gradient shadow-xl p-2.5 flex flex-col md:flex-row items-center gap-2.5"
        >
          <div className="flex-grow flex items-center w-full bg-[#fff5f0] px-4 py-3.5 rounded-xl border border-[#ffddce]/60 focus-within:border-[#ff4500] transition-colors">
            <span className="material-symbols-outlined text-[#ff4500] mr-3 text-2xl material-symbols-fill animate-pulse">
              smart_toy
            </span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={currentCityConfig.placeholder}
              className="w-full bg-transparent border-none outline-hidden focus:outline-hidden text-[#1e110d] placeholder:font-garamond placeholder:italic placeholder:text-[#523932]/70 font-grotesk text-base sm:text-lg font-medium"
            />
          </div>

          <div className="flex items-center justify-between gap-3 w-full md:w-auto px-2 md:px-0">
            <div className="flex items-center text-[#523932] font-grotesk text-sm font-semibold hover:text-[#ff4500] transition-colors py-2 px-3 rounded-lg hover:bg-[#fff5f0]">
              <span className="material-symbols-outlined text-lg mr-1 text-[#ff4500]">location_on</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                aria-label="Select City"
                className="bg-transparent border-none outline-hidden focus:outline-hidden text-sm font-bold cursor-pointer text-[#1e110d]"
              >
                {ALL_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto bg-gradient-to-r from-[#ff4500] via-[#e63900] to-[#ff781f] hover:from-[#e63900] hover:to-[#ff5e1a] text-white px-7 py-3.5 rounded-xl font-grotesk text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap cursor-pointer"
            >
              Find in {selectedCity}
            </button>
          </div>
        </form>

        {/* Dynamic Trending Dishes & Specialties in selected city */}
        <div className="w-full max-w-4xl flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="text-xs font-grotesk font-bold text-[#e63900] flex items-center gap-1 mr-1 my-auto">
            <span className="material-symbols-outlined text-sm material-symbols-fill text-[#ff4500] animate-pulse">local_fire_department</span>
            <span>Trending in {selectedCity}:</span>
          </span>
          {currentCityConfig.trendingDishes.map((dish) => (
            <button
              key={dish}
              type="button"
              onClick={() => handleDishClick(dish)}
              className="bg-white hover:bg-[#fff0eb] border border-[#ffded4] hover:border-[#ff4500] text-[#1e110d] hover:text-[#ff4500] px-3 py-1 rounded-full font-grotesk text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <span>{dish}</span>
              <span className="text-[10px] text-[#ff781f]">↗</span>
            </button>
          ))}
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="w-full max-w-4xl bg-white/90 backdrop-blur-xs border border-[#ffded4] rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col gap-2.5 items-start text-left transition-all">
            <div className="flex items-center justify-between w-full px-1">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs font-grotesk font-bold text-[#1e110d] uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[#ff4500] text-sm material-symbols-fill">history</span>
                  <span>Recent Searches</span>
                </div>
                <span className="bg-[#fff0eb] text-[#e63900] border border-[#ffcfc2] text-[10px] font-grotesk font-bold px-2 py-0.5 rounded-full">
                  {recentSearches.length} {recentSearches.length === 1 ? 'query' : 'queries'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleClearRecent}
                className="text-[11px] font-grotesk font-semibold text-[#785950] hover:text-[#ff4500] flex items-center gap-1 hover:underline cursor-pointer transition-colors"
                title="Clear recent searches"
              >
                <span>Clear history</span>
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
              {recentSearches.map((query, index) => (
                <button
                  key={`${query}-${index}`}
                  type="button"
                  onClick={() => handleRecentClick(query)}
                  className="group flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#fff8f5] hover:bg-[#fff0eb] border border-[#ffded4] hover:border-[#ff4500] text-left transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-sm active:scale-98"
                  title={`Re-run search: "${query}"`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="material-symbols-outlined text-base text-[#ff781f] group-hover:text-[#ff4500] shrink-0 transition-colors">
                      search
                    </span>
                    <span className="font-grotesk text-xs font-bold text-[#1e110d] group-hover:text-[#ff4500] transition-colors truncate">
                      {query}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-xs text-[#785950] group-hover:text-[#ff4500] group-hover:translate-x-0.5 transition-all shrink-0">
                    arrow_forward
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Horizontal Scrollable Trending Cuisine & Food Categories for selected city */}
        <div className="w-full max-w-4xl flex flex-col gap-2.5 items-start">
          <div className="flex items-center justify-between w-full px-1">
            <div className="flex items-center gap-1.5 text-xs font-grotesk font-bold text-[#523932] uppercase tracking-wider">
              <span className="material-symbols-outlined text-[#ff4500] text-sm material-symbols-fill">restaurant_menu</span>
              <span>Trending Categories in {selectedCity}</span>
            </div>
            <span className="text-[11px] font-grotesk text-[#785950] font-medium hidden sm:inline">
              Tap any category for instant AI discovery in {selectedCity}
            </span>
          </div>

          <div className="w-full overflow-x-auto no-scrollbar pb-1.5 pt-0.5 -mx-2 px-2 flex items-center gap-2.5 scroll-smooth">
            {currentCityConfig.trendingCuisines.map((cuisine) => (
              <button
                key={cuisine.label}
                type="button"
                onClick={() => {
                  setSearchInput(cuisine.query);
                  onSearch(cuisine.query, selectedCity);
                }}
                className="group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-[#fff0eb] border-2 border-[#ffded4] hover:border-[#ff4500] shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer shrink-0 active:scale-95"
              >
                <span className="text-lg group-hover:scale-115 transition-transform duration-200">
                  {cuisine.icon}
                </span>
                <div className="flex flex-col text-left">
                  <span className="font-grotesk text-xs sm:text-sm font-bold text-[#1e110d] group-hover:text-[#ff4500] transition-colors leading-tight">
                    {cuisine.label}
                  </span>
                  <span className="text-[10px] font-grotesk text-[#785950] font-medium leading-none mt-0.5">
                    {cuisine.count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* City-Specific Quick Prompts */}
        <div className="flex flex-wrap justify-center gap-2 max-w-4xl">
          <span className="text-xs font-grotesk text-[#785950] font-semibold flex items-center gap-1 mr-1 my-auto">
            <span className="material-symbols-outlined text-sm text-[#ff4500]">bolt</span>
            <span>Quick in {selectedCity}:</span>
          </span>
          {currentCityConfig.quickPrompts.map((prompt) => (
            <button
              key={prompt.label}
              type="button"
              onClick={() => handlePromptClick(prompt.query)}
              className="bg-gradient-to-r from-[#fff3ee] to-[#fff8f2] border border-[#ffcfc2] text-[#331c15] px-3.5 py-1.5 rounded-full font-grotesk text-xs font-bold hover:border-[#ff4500] hover:text-[#ff4500] hover:bg-white transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
            >
              {prompt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Trending in Selected City Section */}
      <section className="w-full px-5 sm:px-8 md:px-16 py-10 md:py-14 max-w-7xl mx-auto border-t border-[#ffded4]/60">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#fff0eb] border border-[#ffcfc2] text-[#e63900] text-xs font-grotesk font-bold mb-2">
              <span className="material-symbols-outlined text-xs material-symbols-fill text-[#ff4500]">local_fire_department</span>
              <span>{selectedCity} Hotspots</span>
            </div>
            <h2 className="font-garamond text-3xl sm:text-4xl font-bold text-[#1e110d]">
              Trending in <span className="text-[#ff4500]">{selectedCity}</span>
            </h2>
            <p className="font-grotesk text-sm sm:text-base text-[#523932] mt-1 font-medium">
              Top curated restaurants with highest community reviews & AI taste match scores in {selectedCity}.
            </p>
          </div>
          <button
            onClick={() => onNavigate('city')}
            className="self-start sm:self-auto text-sm font-grotesk font-bold text-[#ff4500] hover:text-[#e63900] hover:underline flex items-center gap-1 cursor-pointer bg-white px-4 py-2 rounded-xl border border-[#ffded4] shadow-2xs"
          >
            <span>Explore All Cities</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              onClick={() => onSelectRestaurant(restaurant)}
              className="bg-white rounded-3xl soft-card-shadow overflow-hidden group cursor-pointer border-2 border-[#ffded4] hover:border-[#ff9e7d] hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
            >
              <div className="relative w-full aspect-[3/2] overflow-hidden bg-[#ffece5]">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-gradient-to-r from-[#ff4500] to-[#ff8c00] text-white px-3 py-1 rounded-full font-grotesk text-xs font-bold flex items-center gap-1 shadow-md">
                  <span className="material-symbols-outlined text-[13px] material-symbols-fill text-yellow-200">
                    star
                  </span>
                  <span>{restaurant.matchScore}% Match</span>
                </div>
                {restaurant.vibe && (
                  <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white font-grotesk text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20">
                    {restaurant.vibe}
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-5 flex flex-col gap-1.5 flex-grow justify-between">
                <div>
                  <h3 className="font-garamond text-xl sm:text-2xl font-bold text-[#1e110d] group-hover:text-[#ff4500] transition-colors">
                    {restaurant.name}
                  </h3>
                  <p className="font-grotesk text-xs sm:text-sm text-[#523932] mt-0.5 font-semibold">
                    {restaurant.cuisine.split('•')[0]}
                  </p>
                  <p className="font-grotesk text-xs text-[#785950] mt-1.5 line-clamp-2">
                    {restaurant.aiInsight || restaurant.aiReasoning}
                  </p>
                </div>

                <div className="my-1">
                  <CrowdMeter restaurant={restaurant} variant="compact" />
                </div>

                <div className="pt-3 border-t border-[#ffebe4] flex items-center justify-between text-xs text-[#523932]">
                  <span className="font-bold text-[#e63900]">{restaurant.priceForTwo || restaurant.priceRange}</span>
                  <span className="text-[#ff4500] font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    Explore <span className="material-symbols-outlined text-xs">chevron_right</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

