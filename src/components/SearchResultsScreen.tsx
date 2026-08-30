import React, { useState, useMemo } from 'react';
import { Restaurant } from '../types';
import { CrowdMeter } from './CrowdMeter';
import { calculateCrowdInfo, CrowdLevel } from '../utils/crowdMeter';
import { GoogleMapView } from './GoogleMapView';
import { 
  parseNaturalLanguageQuery, 
  generateAaharScoutPicks, 
  AaharScoutPick 
} from '../utils/foodDecisionEngine';
import { AaharScoutPicks } from './AaharScoutPicks';
import { SmartDishCategories } from './SmartDishCategories';
import { SurpriseMeModal } from './SurpriseMeModal';
import { BudgetChallengeModal } from './BudgetChallengeModal';
import { Sparkles, Dices, DollarSign, Trophy, ArrowRight, MapPin, Share2, ShieldCheck } from 'lucide-react';

interface SearchResultsScreenProps {
  restaurants: Restaurant[];
  searchQuery: string;
  onSelectRestaurant: (r: Restaurant) => void;
  onToggleSave: (r: Restaurant) => void;
  savedIds: string[];
  isVegOnly?: boolean;
  onToggleVegOnly?: () => void;
}

type ViewMode = 'list' | 'map' | 'split';

const PRICE_TIERS = [
  { label: 'All Prices', value: 'All', name: '' },
  { label: '$', value: '$', name: 'Budget (< ₹400)' },
  { label: '$$', value: '$$', name: 'Moderate (₹400-₹700)' },
  { label: '$$$', value: '$$$', name: 'Upscale (₹700-₹1,500)' },
  { label: '$$$$', value: '$$$$', name: 'Luxury (Fine Dining)' },
];

export const DINING_VIBES = [
  { value: 'All', label: 'All Vibes', icon: 'auto_awesome', emoji: '✨', desc: 'Any Atmosphere' },
  { value: 'Romantic', label: 'Romantic', icon: 'favorite', emoji: '🍷', desc: 'Date Night & Intimate' },
  { value: 'Business', label: 'Business', icon: 'business_center', emoji: '💼', desc: 'Meetings & Refined' },
  { value: 'Casual', label: 'Casual', icon: 'coffee', emoji: '☕', desc: 'Relaxed & Cozy' },
  { value: 'Lively', label: 'Lively', icon: 'celebration', emoji: '🎉', desc: 'Energetic & Bustling' },
];

export const SearchResultsScreen: React.FC<SearchResultsScreenProps> = ({
  restaurants,
  searchQuery,
  onSelectRestaurant,
  onToggleSave,
  savedIds,
  isVegOnly = false,
  onToggleVegOnly,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [priceFilter, setPriceFilter] = useState<string>('All');
  const [vibeFilter, setVibeFilter] = useState<string>('All');
  const [crowdFilter, setCrowdFilter] = useState<string>('All');
  const [simulatedHour, setSimulatedHour] = useState<number | undefined>(undefined);
  const [openNow, setOpenNow] = useState(false);
  const [highlyRated, setHighlyRated] = useState(false);
  const [pureVegOnlyStrict, setPureVegOnlyStrict] = useState(false);
  const [distanceFilter, setDistanceFilter] = useState('All');
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);

  // Parse natural language intent from the search query
  const parsedIntent = useMemo(() => {
    return parseNaturalLanguageQuery(searchQuery || 'best food', 'Hyderabad');
  }, [searchQuery]);

  // Base pool filtered by isVegOnly
  const effectiveRestaurants = useMemo(() => {
    if (isVegOnly) {
      return restaurants.filter(r => r.isVeg || r.isPureVeg);
    }
    return restaurants;
  }, [restaurants, isVegOnly]);

  // Generate AaharScout Picks for this search
  const aaharScoutPicks = useMemo(() => {
    return generateAaharScoutPicks(effectiveRestaurants, parsedIntent, isVegOnly);
  }, [effectiveRestaurants, parsedIntent, isVegOnly]);

  // Filter restaurants
  const displayResults = useMemo(() => {
    return effectiveRestaurants.filter(r => {
      if (priceFilter !== 'All' && r.priceRange !== priceFilter) return false;
      if (vibeFilter !== 'All') {
        const matchesVibe = 
          (r.vibes && r.vibes.some(v => v.toLowerCase() === vibeFilter.toLowerCase())) ||
          (r.vibe && r.vibe.toLowerCase() === vibeFilter.toLowerCase()) ||
          r.tags.some(t => t.toLowerCase().includes(vibeFilter.toLowerCase()));
        if (!matchesVibe) return false;
      }
      if (crowdFilter !== 'All') {
        const crowdInfo = calculateCrowdInfo(r, simulatedHour);
        if (crowdInfo.level !== crowdFilter) return false;
      }
      if (highlyRated && r.rating < 4.6) return false;
      if (pureVegOnlyStrict && !r.isPureVeg) return false;
      if (distanceFilter !== 'All') {
        const num = parseFloat(r.distance || '99');
        const maxDist = distanceFilter === '2km' ? 3 : 5;
        if (num > maxDist) return false;
      }
      return true;
    });
  }, [effectiveRestaurants, priceFilter, vibeFilter, crowdFilter, simulatedHour, highlyRated, pureVegOnlyStrict, distanceFilter]);

  // Active filters count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (priceFilter !== 'All') count++;
    if (vibeFilter !== 'All') count++;
    if (crowdFilter !== 'All') count++;
    if (simulatedHour !== undefined) count++;
    if (openNow) count++;
    if (highlyRated) count++;
    if (distanceFilter !== 'All') count++;
    if (pureVegOnlyStrict) count++;
    return count;
  }, [priceFilter, vibeFilter, crowdFilter, simulatedHour, openNow, highlyRated, distanceFilter, pureVegOnlyStrict]);

  // Set default pin when displayResults changes
  const activeRestaurant = useMemo(() => {
    if (selectedPinId) {
      const found = displayResults.find(r => r.id === selectedPinId);
      if (found) return found;
    }
    return displayResults[0] || null;
  }, [displayResults, selectedPinId]);

  const getPriceLabel = () => {
    switch (priceFilter) {
      case '$': return 'Budget Friendly (< ₹400)';
      case '$$': return 'Moderate (₹400 – ₹700)';
      case '$$$' : return 'Upscale (₹700 – ₹1,500)';
      case '$$$$': return 'Luxury Fine Dining (₹1,500+)';
      default: return 'All Price Ranges';
    }
  };

  const handleResetFilters = () => {
    setPriceFilter('All');
    setVibeFilter('All');
    setCrowdFilter('All');
    setSimulatedHour(undefined);
    setHighlyRated(false);
    setPureVegOnlyStrict(false);
    setOpenNow(false);
    setDistanceFilter('All');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-6 md:py-10 flex flex-col gap-6 relative">
      {/* Top Food Decision Intent Banner */}
      <section className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 rounded-3xl p-5 sm:p-6 border border-orange-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#ad2c00] text-white flex items-center gap-1 shadow-2xs">
              <Sparkles className="w-3 h-3" />
              AAHARSCOUT FOOD DECISION ENGINE
            </span>
            {parsedIntent.maxBudget && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Budget: Under ₹{parsedIntent.maxBudget}
              </span>
            )}
            {parsedIntent.craving && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Craving: {parsedIntent.craving}
              </span>
            )}
          </div>
          <h1 className="font-syne text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
            {searchQuery || (isVegOnly ? 'Top Pure Vegetarian Food Decisions' : 'Top Curated Food Decisions')}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 font-grotesk mt-0.5">
            Personalized dish recommendations matched to your taste, budget, and location.
          </p>
        </div>

        {/* Quick Decision Action Triggers */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsSurpriseOpen(true)}
            className="py-2.5 px-4 rounded-2xl bg-white hover:bg-orange-50 text-gray-800 border border-orange-200 text-xs font-bold shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Dices className="w-4 h-4 text-[#ff4500]" />
            <span>Surprise Me</span>
          </button>

          <button
            onClick={() => setIsBudgetOpen(true)}
            className="py-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <DollarSign className="w-4 h-4" />
            <span>Feed 2 Under ₹500</span>
          </button>
        </div>
      </section>

      {/* AaharScout Picks Section (Curated 3-7 Dish-First Cards) */}
      <AaharScoutPicks
        picks={aaharScoutPicks}
        onSelectRestaurant={onSelectRestaurant}
        onToggleSave={onToggleSave}
        savedIds={savedIds}
        title="AaharScout Picks"
        subtitle="Our AI-ranked signature dish options with transparent match breakdowns."
      />

      {/* Smart Dish-First Categorization Section */}
      <SmartDishCategories
        picks={aaharScoutPicks}
        onSelectRestaurant={onSelectRestaurant}
        cravingTitle={parsedIntent.craving ? `Best ${parsedIntent.craving} by Category` : 'Best Dishes by Category'}
      />

      {/* Restaurant Directory View Controls Header */}
      <section className="flex flex-col gap-4 border-t border-gray-200/80 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-syne text-xl sm:text-2xl font-extrabold text-gray-900">
              All Matching Restaurants & Dining Spots
            </h2>
            <p className="font-grotesk text-xs sm:text-sm text-gray-600 mt-0.5">
              Showing {displayResults.length} restaurants matching your criteria ({getPriceLabel()})
            </p>
          </div>

          {/* View Mode Toggle Segmented Control */}
          <div className={`flex items-center self-start sm:self-auto p-1.5 rounded-2xl border shadow-xs ${
            isVegOnly ? 'bg-emerald-50 border-emerald-200' : 'bg-[#fff0eb] border-[#ffcfc2]'
          }`}>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-grotesk font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[#ad2c00] text-white shadow-xs'
                  : 'text-gray-700 hover:text-[#ff4500]'
              }`}
            >
              <span className="material-symbols-outlined text-base">view_list</span>
              <span>List</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-grotesk font-bold transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-[#ad2c00] text-white shadow-xs'
                  : 'text-gray-700 hover:text-[#ff4500]'
              }`}
            >
              <span className="material-symbols-outlined text-base">map</span>
              <span>Map</span>
            </button>

            <button
              onClick={() => setViewMode('split')}
              className={`hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-grotesk font-bold transition-all cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-[#ad2c00] text-white shadow-xs'
                  : 'text-gray-700 hover:text-[#ff4500]'
              }`}
            >
              <span className="material-symbols-outlined text-base">splitscreen</span>
              <span>Split</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col gap-3 p-4 sm:p-5 rounded-2xl border-2 border-orange-100 bg-white shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="font-grotesk font-bold text-xs text-gray-900 uppercase tracking-wider">
                Refine Directory
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-[#ad2c00]">
                {activeFilterCount} Active Filters
              </span>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-[#ff4500] hover:underline cursor-pointer"
              >
                Reset all
              </button>
            )}
          </div>

          {/* Dining Vibe Filter Chips Row */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            <span className="text-xs font-bold text-gray-500 whitespace-nowrap mr-1">Vibe:</span>
            {DINING_VIBES.map((vibe) => (
              <button
                key={vibe.value}
                onClick={() => setVibeFilter(vibe.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  vibeFilter === vibe.value
                    ? 'bg-[#ad2c00] text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{vibe.emoji} {vibe.label}</span>
              </button>
            ))}
          </div>

          {/* Price Filter Chips Row */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            <span className="text-xs font-bold text-gray-500 whitespace-nowrap mr-1">Price:</span>
            {PRICE_TIERS.map((tier) => (
              <button
                key={tier.value}
                onClick={() => setPriceFilter(tier.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  priceFilter === tier.value
                    ? 'bg-[#ad2c00] text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{tier.label} {tier.name && `(${tier.name})`}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area based on ViewMode */}
      {viewMode === 'map' ? (
        <section className="relative w-full h-[calc(100vh-220px)] min-h-[580px] rounded-3xl overflow-hidden shadow-xl">
          <GoogleMapView
            restaurants={displayResults}
            selectedRestaurant={activeRestaurant}
            onSelectRestaurant={(r) => {
              setSelectedPinId(r.id);
            }}
            isVegOnly={isVegOnly}
            className="w-full h-full"
          />
        </section>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className={`flex flex-col gap-6 ${viewMode === 'split' ? 'col-span-1 md:col-span-8' : 'col-span-1 md:col-span-12'}`}>
            <section className="flex flex-col gap-6">
              {displayResults.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3">
                  <h3 className="font-syne text-xl font-bold text-gray-900">No matching restaurants found</h3>
                  <p className="text-xs text-gray-500 max-w-md">
                    Try adjusting your filters or resetting to see all spots.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-2 px-5 py-2.5 rounded-xl bg-[#ad2c00] text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                displayResults.map((r) => (
                  <article
                    key={r.id}
                    className="bg-white rounded-3xl border border-gray-200 hover:border-orange-300 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col sm:flex-row group"
                  >
                    <div className="w-full sm:w-2/5 h-52 sm:h-auto relative bg-neutral-900">
                      <img
                        src={r.image}
                        alt={r.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1 text-white text-xs font-bold">
                        <span className="text-amber-400">★</span>
                        <span>{r.rating}</span>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 flex flex-col justify-between w-full sm:w-3/5 gap-3">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3
                            onClick={() => onSelectRestaurant(r)}
                            className="font-syne text-xl font-extrabold text-gray-900 group-hover:text-[#ff4500] cursor-pointer"
                          >
                            {r.name}
                          </h3>
                          <span className="font-mono text-xs font-bold text-[#ad2c00] bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                            {r.distance || '2.8 km'}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 font-semibold mt-1">
                          {r.cuisine} • {r.priceForTwo || r.priceRange}
                        </p>

                        <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                          {r.aiInsight || r.aiReasoning}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <button
                          onClick={() => onSelectRestaurant(r)}
                          className="py-2 px-4 rounded-xl text-xs font-bold bg-[#ad2c00] hover:bg-[#8c2300] text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onToggleSave(r)}
                          className="p-2 rounded-xl text-gray-400 hover:text-[#ff4500] hover:bg-orange-50 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-lg">
                            {savedIds.includes(r.id) ? 'bookmark' : 'bookmark_border'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </section>
          </div>

          {/* Split View Map Sidebar */}
          {viewMode === 'split' && (
            <div className="hidden md:block col-span-4 h-[calc(100vh-200px)] sticky top-24 rounded-3xl overflow-hidden shadow-lg border border-gray-200">
              <GoogleMapView
                restaurants={displayResults}
                selectedRestaurant={activeRestaurant}
                onSelectRestaurant={(r) => setSelectedPinId(r.id)}
                isVegOnly={isVegOnly}
                className="w-full h-full"
              />
            </div>
          )}
        </div>
      )}

      {/* Surprise Me & Budget Modals */}
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
    </div>
  );
};
