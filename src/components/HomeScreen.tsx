import React, { useState } from 'react';
import { Restaurant, ScreenType } from '../types';

interface HomeScreenProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (r: Restaurant) => void;
  onSearch: (query: string, city: string) => void;
  onNavigate: (screen: ScreenType) => void;
}

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

  const quickPrompts = [
    { label: '🍗 Best Biryani', query: 'Best biryani in Hyderabad for family' },
    { label: '🍕 Best Pizza', query: 'Artisanal woodfired pizza in Hyderabad' },
    { label: '🥞 Best Breakfast', query: 'Crispy South Indian dosa breakfast' },
    { label: '☕ Best Coffee', query: 'Specialty cafe and pour over coffee' },
    { label: '❤️ Date Night', query: 'Romantic intimate fine dining for two' },
    { label: '💰 Best Under ₹300', query: 'Best budget food under ₹300' },
  ];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchInput.trim() || 'Best food in Hyderabad';
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

  // Trending in Hyderabad: 4 featured cards
  const trendingRestaurants = restaurants.filter((r) =>
    ['paradise-biryani', 'chutneys', 'roastery-coffee-house', 'concu'].includes(r.id)
  );

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full px-5 sm:px-8 md:px-16 py-12 md:py-20 max-w-7xl mx-auto flex flex-col items-center text-center gap-8 md:gap-10 relative">
        {/* Subtle vibrant ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-[#ff4500]/15 via-[#ff9e1f]/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 self-center bg-gradient-to-r from-[#ffebe4] to-[#fff4ea] border border-[#ffcfc2] px-4 py-1.5 rounded-full text-xs font-grotesk font-bold text-[#e63900] shadow-xs">
            <span className="material-symbols-outlined text-[16px] material-symbols-fill text-[#ff4500]">auto_awesome</span>
            <span>AI-Powered Food Intelligence</span>
          </div>
          <h1 className="font-garamond text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-semibold text-[#1e110d] leading-[1.1] tracking-tight">
            Find the best food in <span className="bg-gradient-to-r from-[#ff3800] via-[#e63900] to-[#ff8c00] bg-clip-text text-transparent">your city.</span>
          </h1>
          <p className="font-grotesk text-base sm:text-lg text-[#523932] max-w-xl mx-auto">
            Tell our AI what you're craving. We'll find the authentic places you'll actually love.
          </p>
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
              placeholder="Try: Best biryani under ₹500 near me..."
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
                className="bg-transparent border-none outline-hidden focus:outline-hidden text-sm font-semibold cursor-pointer text-[#1e110d]"
              >
                <option value="Hyderabad">Hyderabad</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Rome">Rome</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto bg-gradient-to-r from-[#ff4500] via-[#e63900] to-[#ff781f] hover:from-[#e63900] hover:to-[#ff5e1a] text-white px-7 py-3.5 rounded-xl font-grotesk text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap cursor-pointer"
            >
              Find My Food
            </button>
          </div>
        </form>

        {/* Recent Searches (Last 3 Queries for Quick Re-Access) */}
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

        {/* Horizontal Scrollable Cuisine Tags Row */}
        <div className="w-full max-w-4xl flex flex-col gap-2.5 items-start">
          <div className="flex items-center justify-between w-full px-1">
            <div className="flex items-center gap-1.5 text-xs font-grotesk font-bold text-[#523932] uppercase tracking-wider">
              <span className="material-symbols-outlined text-[#ff4500] text-sm material-symbols-fill">restaurant_menu</span>
              <span>Explore by Cuisine</span>
            </div>
            <span className="text-[11px] font-grotesk text-[#785950] font-medium hidden sm:inline">
              Tap any category for instant AI discovery
            </span>
          </div>

          <div className="w-full overflow-x-auto no-scrollbar pb-1.5 pt-0.5 -mx-2 px-2 flex items-center gap-2.5 scroll-smooth">
            {[
              { label: 'Italian', icon: '🍕', query: 'Authentic Italian cuisine pasta and woodfired pizza', count: '12+ Places' },
              { label: 'Indian', icon: '🍛', query: 'Best Indian authentic regional cuisine and curries', count: '28+ Places' },
              { label: 'Vegan', icon: '🌱', query: 'Top vegan plant-based and pure vegetarian dining', count: '15+ Places' },
              { label: 'Biryani & Kebabs', icon: '🍗', query: 'Best authentic Hyderabadi biryani and clay pot kebabs', count: '24+ Places' },
              { label: 'Japanese & Sushi', icon: '🍣', query: 'Artisanal Japanese sushi sashimi and ramen bar', count: '8+ Places' },
              { label: 'Cafes & Bakery', icon: '☕', query: 'Specialty coffee roasters artisan pastries and brunch cafe', count: '18+ Places' },
              { label: 'South Indian', icon: '🥞', query: 'Crispy ghee roast dosa idli and traditional South Indian filter coffee', count: '20+ Places' },
              { label: 'Fine Dining', icon: '🍷', query: 'Luxury fine dining multi-course tasting menu and wine pairing', count: '10+ Places' },
              { label: 'Street Food', icon: '🥟', query: 'Famous iconic street food chaat and local night bites', count: '30+ Places' },
              { label: 'Mediterranean', icon: '🫒', query: 'Fresh Mediterranean mezze grilled seafood and hummus', count: '7+ Places' },
            ].map((cuisine) => (
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

        {/* Quick Prompts */}
        <div className="flex flex-wrap justify-center gap-2 max-w-4xl">
          <span className="text-xs font-grotesk text-[#785950] font-semibold flex items-center gap-1 mr-1 my-auto">
            <span className="material-symbols-outlined text-sm text-[#ff4500]">bolt</span>
            <span>Quick:</span>
          </span>
          {quickPrompts.map((prompt) => (
            <button
              key={prompt.label}
              type="button"
              onClick={() => handlePromptClick(prompt.query)}
              className="bg-gradient-to-r from-[#fff3ee] to-[#fff8f2] border border-[#ffcfc2] text-[#331c15] px-3.5 py-1.5 rounded-full font-grotesk text-xs font-semibold hover:border-[#ff4500] hover:text-[#ff4500] hover:bg-white transition-all shadow-xs cursor-pointer active:scale-95"
            >
              {prompt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Trending in Hyderabad Section */}
      <section className="w-full px-5 sm:px-8 md:px-16 py-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-garamond text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1e110d]">
              Trending in <span className="text-[#ff4500]">{selectedCity}</span>
            </h2>
            <p className="font-grotesk text-sm text-[#523932] mt-1">
              Top curated restaurants with highest community & AI match scores.
            </p>
          </div>
          <button
            onClick={() => onNavigate('city')}
            className="text-sm font-grotesk font-bold text-[#ff4500] hover:text-[#e63900] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Explore City Guide</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              onClick={() => onSelectRestaurant(restaurant)}
              className="bg-white rounded-2xl soft-card-shadow overflow-hidden group cursor-pointer border border-[#ffded4] hover:border-[#ff9e7d] hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
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
              </div>

              <div className="p-4 sm:p-5 flex flex-col gap-1.5 flex-grow justify-between">
                <div>
                  <h3 className="font-garamond text-xl sm:text-2xl font-semibold text-[#1e110d] group-hover:text-[#ff4500] transition-colors">
                    {restaurant.name}
                  </h3>
                  <p className="font-grotesk text-xs sm:text-sm text-[#523932] mt-0.5 font-medium">
                    {restaurant.cuisine}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#ffe4dc] flex items-center justify-between text-xs text-[#523932]">
                  <span className="font-semibold text-[#7c5044]">{restaurant.neighborhood}</span>
                  <span className="text-[#ff4500] font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    View Details <span className="material-symbols-outlined text-xs">chevron_right</span>
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
