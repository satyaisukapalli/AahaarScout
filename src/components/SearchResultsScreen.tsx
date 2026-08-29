import React, { useState, useMemo } from 'react';
import { Restaurant } from '../types';
import { HYDERABAD_MAP_IMAGE } from '../data/restaurants';
import { CrowdMeter } from './CrowdMeter';
import { calculateCrowdInfo, CrowdLevel } from '../utils/crowdMeter';

interface SearchResultsScreenProps {
  restaurants: Restaurant[];
  searchQuery: string;
  onSelectRestaurant: (r: Restaurant) => void;
  onToggleSave: (r: Restaurant) => void;
  savedIds: string[];
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

// Coordinate offsets for realistic pin positioning on map
const PIN_COORDINATES: Record<string, { top: string; left: string }> = {
  'paradise-biryani': { top: '28%', left: '42%' },
  'chutneys': { top: '48%', left: '32%' },
  'roastery-coffee-house': { top: '38%', left: '22%' },
  'concu': { top: '44%', left: '24%' },
  'pista-house': { top: '76%', left: '56%' },
  'bawarchi-restaurant': { top: '36%', left: '54%' },
  'cafe-bahar': { top: '52%', left: '48%' },
  'kumi-modern-japanese': { top: '60%', left: '30%' },
  'ctr-shri-sagar': { top: '30%', left: '40%' },
  'toit-brewpub': { top: '45%', left: '68%' },
  'mavalli-tiffin-room-mtr': { top: '65%', left: '48%' },
  'grasshopper-bangalore': { top: '80%', left: '52%' },
  'murugan-idli-shop': { top: '42%', left: '50%' },
  'dakshin-itc-grand-chola': { top: '68%', left: '42%' },
  'amethyst-wild-garden-cafe': { top: '36%', left: '62%' },
  'paragon-restaurant-kochi': { top: '34%', left: '55%' },
  'kashi-art-cafe': { top: '62%', left: '35%' },
  'dharani-daspalla': { top: '50%', left: '46%' },
  'sea-inn-raju-gari-dhaba': { top: '25%', left: '72%' },
  'murali-krishna-nellore': { top: '38%', left: '50%' },
  'mayuri-chepala-pulusu': { top: '55%', left: '42%' },
  'blue-fox-minerva-nellore': { top: '70%', left: '58%' },
  'komala-vilas-nellore': { top: '32%', left: '60%' },
};

export const SearchResultsScreen: React.FC<SearchResultsScreenProps> = ({
  restaurants,
  searchQuery,
  onSelectRestaurant,
  onToggleSave,
  savedIds,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [priceFilter, setPriceFilter] = useState<string>('All');
  const [vibeFilter, setVibeFilter] = useState<string>('All');
  const [crowdFilter, setCrowdFilter] = useState<string>('All');
  const [simulatedHour, setSimulatedHour] = useState<number | undefined>(undefined);
  const [openNow, setOpenNow] = useState(false);
  const [highlyRated, setHighlyRated] = useState(true);
  const [nonVeg, setNonVeg] = useState(false);
  const [distanceFilter, setDistanceFilter] = useState('All');
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

  // Filter restaurants
  const displayResults = useMemo(() => {
    return restaurants.filter(r => {
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
      if (nonVeg && !r.tags.some(t => ['Biryani', 'Kebabs', 'Dinner', 'Italian'].includes(t))) return false;
      if (distanceFilter !== 'All') {
        const num = parseFloat(r.distance || '99');
        const maxDist = distanceFilter === '2km' ? 3 : 5;
        if (num > maxDist) return false;
      }
      return true;
    });
  }, [restaurants, priceFilter, vibeFilter, crowdFilter, simulatedHour, highlyRated, nonVeg, distanceFilter]);

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
    if (nonVeg) count++;
    return count;
  }, [priceFilter, vibeFilter, crowdFilter, simulatedHour, openNow, highlyRated, distanceFilter, nonVeg]);

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
      case '$$$': return 'Upscale (₹700 – ₹1,500)';
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
    setNonVeg(false);
    setOpenNow(false);
    setDistanceFilter('All');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-6 md:py-10 flex flex-col gap-6 relative">
      {/* Search Header, Title & View Toggle */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-garamond text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1e110d]">
              {searchQuery || 'Top picks for Foodies in Hyderabad...'}
            </h1>
            <p className="font-grotesk text-sm text-[#523932] mt-1 font-medium flex items-center gap-2 flex-wrap">
              <span className="text-[#ff4500] font-bold">{getPriceLabel()}</span>
              <span>•</span>
              <span>Showing {displayResults.length} curated places</span>
            </p>
          </div>

          {/* View Mode Toggle Segmented Control */}
          <div className="flex items-center self-start sm:self-auto bg-[#fff0eb] p-1.5 rounded-2xl border border-[#ffcfc2] shadow-xs">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-grotesk font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white shadow-sm'
                  : 'text-[#523932] hover:text-[#ff4500] hover:bg-white/60'
              }`}
              title="List View"
            >
              <span className="material-symbols-outlined text-base">view_list</span>
              <span>List</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-grotesk font-bold transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white shadow-sm'
                  : 'text-[#523932] hover:text-[#ff4500] hover:bg-white/60'
              }`}
              title="Map View"
            >
              <span className="material-symbols-outlined text-base">map</span>
              <span>Map</span>
            </button>

            <button
              onClick={() => setViewMode('split')}
              className={`hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-grotesk font-bold transition-all cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white shadow-sm'
                  : 'text-[#523932] hover:text-[#ff4500] hover:bg-white/60'
              }`}
              title="Split View (List & Map side-by-side)"
            >
              <span className="material-symbols-outlined text-base">splitscreen</span>
              <span>Split</span>
            </button>
          </div>
        </div>

        {/* Filters Container with Active Filters Badge */}
        <div className="flex flex-col gap-3 p-3.5 sm:p-5 rounded-2xl bg-gradient-to-br from-[#fff8f5] via-[#fff5f0] to-[#fffbf7] border-2 border-[#ffded4] shadow-xs">
          {/* Filters Container Header with Active Filter Count Badge */}
          <div className="flex items-center justify-between pb-2 border-b border-[#ffded4]/70">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-grotesk font-bold text-[#1e110d] uppercase tracking-wider">
                <span className="material-symbols-outlined text-[#ff4500] text-base material-symbols-fill">tune</span>
                <span>Filters</span>
              </div>
              
              {/* Active Filter Count Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-grotesk font-bold transition-all shadow-2xs ${
                  activeFilterCount > 0
                    ? 'bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white shadow-sm ring-2 ring-[#ff4500]/20'
                    : 'bg-[#fff0eb] text-[#785950] border border-[#ffcfc2]'
                }`}
                title={`${activeFilterCount} active filters`}
              >
                {activeFilterCount > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
                <span>{activeFilterCount}</span>
                <span className="text-[11px] font-semibold opacity-90">
                  {activeFilterCount === 1 ? 'Active' : 'Active'}
                </span>
              </span>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-grotesk font-bold text-[#ff4500] hover:text-[#e63900] hover:underline cursor-pointer flex items-center gap-1 px-2 py-0.5 rounded-lg hover:bg-[#ffece5] transition-colors"
              >
                <span>Reset all ({activeFilterCount})</span>
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            )}
          </div>

          {/* Dining Vibe Filter Chips Row */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-grotesk font-bold text-[#523932]">
                <span className="material-symbols-outlined text-[#ff4500] text-sm material-symbols-fill">mood</span>
                <span>Dining Vibe</span>
                <span className="text-[10px] text-[#785950] font-normal hidden sm:inline">
                  (Filter by mood & ambiance)
                </span>
              </div>
              {vibeFilter !== 'All' && (
                <button
                  onClick={() => setVibeFilter('All')}
                  className="text-[11px] font-grotesk font-bold text-[#ff4500] hover:text-[#e63900] hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  <span>Clear Vibe</span>
                  <span className="material-symbols-outlined text-xs">close</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-0.5 pb-0.5">
              {DINING_VIBES.map((vibe) => {
                const isSelected = vibeFilter === vibe.value;
                const matchCount = vibe.value === 'All'
                  ? restaurants.length
                  : restaurants.filter(r => 
                      (r.vibes && r.vibes.some(v => v.toLowerCase() === vibe.value.toLowerCase())) ||
                      (r.vibe && r.vibe.toLowerCase() === vibe.value.toLowerCase()) ||
                      r.tags.some(t => t.toLowerCase().includes(vibe.value.toLowerCase()))
                    ).length;

                return (
                  <button
                    key={vibe.value}
                    onClick={() => setVibeFilter(vibe.value)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-grotesk transition-all cursor-pointer whitespace-nowrap shadow-2xs active:scale-95 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white border-[#ff4500] font-bold shadow-sm'
                        : 'bg-white border-[#ffcfc2] text-[#331c15] hover:border-[#ff4500] hover:text-[#ff4500] font-semibold hover:bg-[#fff5f0]'
                    }`}
                    title={vibe.desc}
                  >
                    <span className="text-sm">{vibe.emoji}</span>
                    <span className={vibe.value !== 'All' ? 'font-bold' : 'font-semibold'}>
                      {vibe.label}
                    </span>
                    {vibe.value !== 'All' && (
                      <span className={`text-[11px] hidden md:inline opacity-80 ${isSelected ? 'text-white' : 'text-[#523932]'}`}>
                        ({vibe.desc})
                      </span>
                    )}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isSelected 
                        ? 'bg-white/25 text-white' 
                        : 'bg-[#fff0eb] text-[#e63900] border border-[#ffded4]'
                    }`}>
                      {matchCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter Chips Row */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-grotesk font-bold text-[#523932]">
                <span className="material-symbols-outlined text-[#ff4500] text-sm material-symbols-fill">payments</span>
                <span>Price Range</span>
              </div>
              {priceFilter !== 'All' && (
                <button
                  onClick={() => setPriceFilter('All')}
                  className="text-[11px] font-grotesk font-bold text-[#ff4500] hover:text-[#e63900] hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  <span>Clear</span>
                  <span className="material-symbols-outlined text-xs">close</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-0.5 pb-0.5">
              {PRICE_TIERS.map((tier) => {
                const isSelected = priceFilter === tier.value;
                const matchCount = tier.value === 'All' 
                  ? restaurants.length 
                  : restaurants.filter(r => r.priceRange === tier.value).length;

                return (
                  <button
                    key={tier.value}
                    onClick={() => setPriceFilter(tier.value)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-grotesk transition-all cursor-pointer whitespace-nowrap shadow-2xs active:scale-95 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white border-[#ff4500] font-bold shadow-sm'
                        : 'bg-white border-[#ffcfc2] text-[#331c15] hover:border-[#ff4500] hover:text-[#ff4500] font-semibold hover:bg-[#fff5f0]'
                    }`}
                  >
                    <span className={tier.value !== 'All' ? 'font-black tracking-tight' : 'font-bold'}>
                      {tier.label}
                    </span>
                    {tier.name && (
                      <span className={`text-[11px] hidden sm:inline ${isSelected ? 'text-white/90' : 'text-[#523932]'}`}>
                        {tier.name}
                      </span>
                    )}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isSelected 
                        ? 'bg-white/25 text-white' 
                        : 'bg-[#fff0eb] text-[#e63900] border border-[#ffded4]'
                    }`}>
                      {matchCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Crowd Meter Busyness Filter & Time Simulator */}
          <div className="flex flex-col gap-2 pt-1 border-t border-[#ffded4]/70">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-xs font-grotesk font-bold text-[#523932]">
                <span className="material-symbols-outlined text-[#ff4500] text-sm material-symbols-fill">people</span>
                <span>Crowd Meter Busyness</span>
                <span className="text-[10px] text-[#785950] font-normal hidden sm:inline">
                  (Simulated by time of day)
                </span>
              </div>

              {/* Time of Day Simulation Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-grotesk font-semibold text-[#785950] flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-[#ff4500]">schedule</span>
                  Simulate Time:
                </span>
                <select
                  value={simulatedHour === undefined ? 'realtime' : String(simulatedHour)}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSimulatedHour(val === 'realtime' ? undefined : parseInt(val, 10));
                  }}
                  className="bg-white border border-[#ffcfc2] text-[#1e110d] text-xs font-grotesk font-bold px-2.5 py-1 rounded-lg outline-hidden cursor-pointer shadow-2xs hover:border-[#ff4500]"
                >
                  <option value="realtime">⏰ Current Real Time</option>
                  <option value="8">🍳 8:30 AM (Breakfast Rush)</option>
                  <option value="13">🍛 1:30 PM (Peak Lunch Feasts)</option>
                  <option value="16">☕ 4:30 PM (Cozy Cafe & Tea)</option>
                  <option value="20">🍷 8:30 PM (Peak Dinner Rush)</option>
                  <option value="22">🌙 10:30 PM (Late Night Tiffins)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-0.5 pb-0.5">
              {[
                { value: 'All', label: 'All Crowds', emoji: '👥', desc: 'Any density' },
                { value: 'low', label: 'Low (< 45%)', emoji: '🟢', desc: 'Walk-in ready • No wait' },
                { value: 'medium', label: 'Medium (45-75%)', emoji: '🟡', desc: 'Moderate buzz • 5-10 min' },
                { value: 'high', label: 'High (75%+)', emoji: '🔴', desc: 'Peak rush • 15-25 min' },
              ].map((crowd) => {
                const isSelected = crowdFilter === crowd.value;
                const matchCount = crowd.value === 'All'
                  ? restaurants.length
                  : restaurants.filter((r) => calculateCrowdInfo(r, simulatedHour).level === crowd.value).length;

                return (
                  <button
                    key={crowd.value}
                    onClick={() => setCrowdFilter(crowd.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-grotesk transition-all cursor-pointer whitespace-nowrap shadow-2xs active:scale-95 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white border-[#ff4500] font-bold shadow-sm'
                        : 'bg-white border-[#ffcfc2] text-[#331c15] hover:border-[#ff4500] hover:text-[#ff4500] font-semibold hover:bg-[#fff5f0]'
                    }`}
                    title={crowd.desc}
                  >
                    <span>{crowd.emoji}</span>
                    <span>{crowd.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isSelected ? 'bg-white/25 text-white' : 'bg-[#fff0eb] text-[#e63900] border border-[#ffded4]'
                    }`}>
                      {matchCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Quick Filter Pills */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              onClick={() => setOpenNow(!openNow)}
              className={`px-3.5 py-1.5 rounded-full border text-xs font-grotesk font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 ${
                openNow
                  ? 'border-[#ff4500] bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white shadow-sm'
                  : 'border-[#ffcfc2] bg-white text-[#331c15] hover:border-[#ff4500] hover:text-[#ff4500]'
              }`}
            >
              <span>Open Now</span>
              {openNow && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
            <button
              onClick={() => setHighlyRated(!highlyRated)}
              className={`px-3.5 py-1.5 rounded-full border text-xs font-grotesk font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 ${
                highlyRated
                  ? 'border-[#ff4500] bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white shadow-sm'
                  : 'border-[#ffcfc2] bg-white text-[#331c15] hover:border-[#ff4500] hover:text-[#ff4500]'
              }`}
            >
              <span>Highly Rated (4.6+)</span>
              {highlyRated && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
            <div className="relative">
              <select
                value={distanceFilter}
                onChange={(e) => setDistanceFilter(e.target.value)}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-grotesk font-bold outline-hidden cursor-pointer shadow-2xs transition-all ${
                  distanceFilter !== 'All'
                    ? 'border-[#ff4500] bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white'
                    : 'border-[#ffcfc2] bg-white text-[#331c15] hover:border-[#ff4500] hover:text-[#ff4500]'
                }`}
              >
                <option value="All" className="text-[#1e110d] bg-white">Distance: All</option>
                <option value="2km" className="text-[#1e110d] bg-white">&lt; 3 km</option>
                <option value="5km" className="text-[#1e110d] bg-white">&lt; 5 km</option>
              </select>
            </div>
            <button
              onClick={() => setNonVeg(!nonVeg)}
              className={`px-3.5 py-1.5 rounded-full border text-xs font-grotesk font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 ${
                nonVeg
                  ? 'border-[#ff4500] bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white shadow-sm'
                  : 'border-[#ffcfc2] bg-white text-[#331c15] hover:border-[#ff4500] hover:text-[#ff4500]'
              }`}
            >
              <span>Non-Veg / Biryani</span>
              {nonVeg && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area based on ViewMode */}
      {viewMode === 'map' ? (
        /* FULL MAP VIEW */
        <section className="relative w-full h-[calc(100vh-220px)] min-h-[580px] rounded-3xl overflow-hidden border-2 border-[#ffded4] shadow-xl bg-[#fff5f0]">
          <img
            src={HYDERABAD_MAP_IMAGE}
            alt="Hyderabad Interactive Food Map"
            className="w-full h-full object-cover opacity-90 filter brightness-95"
          />

          {/* Interactive Map Overlay Header */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#ffcfc2] shadow-lg flex items-center gap-2.5 pointer-events-auto">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-garamond font-bold text-base text-[#1e110d]">
                Hyderabad Culinary Map
              </span>
              <span className="bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white text-xs px-2.5 py-0.5 rounded-full font-grotesk font-bold">
                {displayResults.length} Places Pinned
              </span>
            </div>

            <button
              onClick={() => setViewMode('list')}
              className="bg-white/95 backdrop-blur-md hover:bg-white text-[#ff4500] font-grotesk text-xs sm:text-sm font-bold px-4 py-2.5 rounded-2xl border border-[#ffcfc2] shadow-lg flex items-center gap-1.5 pointer-events-auto cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined text-base">view_list</span>
              <span>Back to List</span>
            </button>
          </div>

          {/* Interactive Map Pins */}
          {displayResults.map((r, index) => {
            const coords = PIN_COORDINATES[r.id] || {
              top: `${30 + (index * 12) % 50}%`,
              left: `${25 + (index * 15) % 55}%`,
            };
            const isSelected = activeRestaurant?.id === r.id;

            return (
              <div
                key={r.id}
                style={{ top: coords.top, left: coords.left }}
                onClick={() => setSelectedPinId(r.id)}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              >
                <div
                  className={`transition-all duration-300 transform ${
                    isSelected ? 'scale-115 z-30' : 'hover:scale-110'
                  }`}
                >
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-xl border-2 transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white border-white ring-4 ring-[#ff4500]/30 font-bold'
                        : 'bg-white text-[#1e110d] border-[#ffcfc2] hover:border-[#ff4500] font-semibold'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm text-amber-500 material-symbols-fill">
                      star
                    </span>
                    <span className="font-grotesk text-xs">{r.rating}</span>
                    <span className="text-[11px] opacity-75 font-normal">| {r.priceRange}</span>
                  </div>
                  {/* Pin Pointer Tail */}
                  <div
                    className={`w-2.5 h-2.5 mx-auto -mt-1 rotate-45 border-r border-b ${
                      isSelected
                        ? 'bg-[#ff781f] border-white'
                        : 'bg-white border-[#ffcfc2]'
                    }`}
                  />
                </div>
              </div>
            );
          })}

          {/* Selected Restaurant Floating Card Overlay */}
          {activeRestaurant && (
            <div className="absolute bottom-6 left-4 right-4 md:left-6 md:right-auto md:w-96 z-30">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border-2 border-[#ffded4] shadow-2xl transition-all">
                <div className="flex gap-3.5 items-start">
                  <img
                    src={activeRestaurant.image}
                    alt={activeRestaurant.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 bg-[#ffece5] border border-[#ffded4]"
                  />
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3
                        onClick={() => onSelectRestaurant(activeRestaurant)}
                        className="font-garamond text-lg font-bold text-[#1e110d] truncate hover:text-[#ff4500] cursor-pointer"
                      >
                        {activeRestaurant.name}
                      </h3>
                      <button
                        onClick={() => onToggleSave(activeRestaurant)}
                        className="text-[#ff4500] hover:scale-110 transition-transform"
                      >
                        <span className={`material-symbols-outlined text-lg ${savedIds.includes(activeRestaurant.id) ? 'material-symbols-fill' : ''}`}>
                          bookmark
                        </span>
                      </button>
                    </div>
                    <p className="font-grotesk text-xs text-[#523932] truncate">
                      {activeRestaurant.cuisine} • {activeRestaurant.neighborhood}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <CrowdMeter restaurant={activeRestaurant} variant="compact" simulatedHour={simulatedHour} />
                      <span className="inline-flex items-center gap-1 bg-[#fff0eb] text-[#ff4500] text-xs px-2 py-0.5 rounded-md font-grotesk font-bold border border-[#ffcfc2]">
                        <span className="material-symbols-outlined text-xs material-symbols-fill text-amber-500">star</span>
                        {activeRestaurant.rating}
                      </span>
                      {activeRestaurant.vibe && (
                        <span className="inline-flex items-center gap-1 bg-[#ffe4dc] text-[#b82900] text-[10px] px-2 py-0.5 rounded-md font-grotesk font-bold border border-[#ffbca8]">
                          <span>{activeRestaurant.vibe} Vibe</span>
                        </span>
                      )}
                      <span className="text-[11px] font-grotesk text-[#523932] font-semibold">
                        {activeRestaurant.priceForTwo || activeRestaurant.priceRange}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[#ffded4] flex gap-2">
                  <button
                    onClick={() => onSelectRestaurant(activeRestaurant)}
                    className="flex-1 bg-gradient-to-r from-[#ff4500] to-[#ff781f] hover:from-[#e63900] hover:to-[#ff5e1a] text-white font-grotesk text-xs font-bold py-2 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer text-center"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => alert(`Directions to ${activeRestaurant.name}`)}
                    className="p-2 bg-[#fff0eb] hover:bg-[#ffe3d8] border border-[#ffcfc2] text-[#ff4500] rounded-xl transition-colors cursor-pointer flex items-center justify-center"
                    title="Get Directions"
                  >
                    <span className="material-symbols-outlined text-base">directions</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Horizontal Carousel for Quick Map Browsing */}
          <div className="absolute bottom-6 right-6 hidden lg:flex items-center gap-2.5 z-20 max-w-lg overflow-x-auto no-scrollbar py-1">
            {displayResults.slice(0, 4).map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedPinId(r.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-grotesk font-bold whitespace-nowrap shadow-md backdrop-blur-md transition-all cursor-pointer ${
                  activeRestaurant?.id === r.id
                    ? 'bg-[#ff4500] text-white border-2 border-white'
                    : 'bg-white/90 text-[#1e110d] hover:bg-white border border-[#ffcfc2]'
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </section>
      ) : (
        /* LIST / SPLIT VIEW */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className={`flex flex-col gap-6 ${viewMode === 'split' ? 'col-span-1 md:col-span-8' : 'col-span-1 md:col-span-12'}`}>
            {/* Results List or Empty State */}
            <section className="flex flex-col gap-6">
              {displayResults.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border-2 border-dashed border-[#ffded4] flex flex-col items-center justify-center gap-3 shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-[#fff0eb] text-[#ff4500] flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl">filter_alt_off</span>
                  </div>
                  <h3 className="font-garamond text-2xl font-bold text-[#1e110d]">No matching restaurants found</h3>
                  <p className="font-grotesk text-sm text-[#523932] max-w-md">
                    We couldn't find any places matching your current price and filter combination. Try selecting a different price range or resetting your filters.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4500] to-[#ff781f] hover:from-[#e63900] hover:to-[#ff5e1a] text-white font-grotesk text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                displayResults.map((r) => (
                  <article
                    key={r.id}
                    className="bg-white rounded-2xl soft-card-shadow overflow-hidden flex flex-col sm:flex-row group border border-[#ffded4] hover:border-[#ff9e7d] transition-all duration-300"
                  >
                    <div className="w-full sm:w-2/5 h-52 sm:h-auto relative bg-[#ffece5]">
                      <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md border border-amber-200">
                        <span className="material-symbols-outlined text-amber-500 text-sm material-symbols-fill">star</span>
                        <span className="font-grotesk text-xs font-bold text-[#1e110d]">{r.rating}</span>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 flex flex-col justify-between w-full sm:w-3/5 gap-3.5">
                      <div>
                        <div className="flex justify-between items-start">
                          <h2 
                            onClick={() => onSelectRestaurant(r)}
                            className="font-garamond text-2xl font-semibold text-[#1e110d] group-hover:text-[#ff4500] transition-colors cursor-pointer"
                          >
                            {r.name}
                          </h2>
                          {r.distance && (
                            <span className="font-grotesk text-xs font-semibold text-[#e63900] bg-[#fff0eb] border border-[#ffcfc2] px-2.5 py-1 rounded-md">
                              {r.distance}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                          <p className="font-grotesk text-xs sm:text-sm text-[#523932] font-medium">
                            {r.cuisine} • {r.priceForTwo || r.priceRange}
                          </p>
                          <CrowdMeter restaurant={r} variant="compact" simulatedHour={simulatedHour} />
                        </div>

                        {/* AI Match Box */}
                        <div className="ai-border-gradient rounded-xl p-3.5 mb-3 bg-gradient-to-br from-[#fff5f0] to-[#fffbf7]">
                          <div className="flex items-center gap-1.5 mb-1 text-[#e63900] font-grotesk text-xs font-bold">
                            <span className="material-symbols-outlined text-sm text-[#ff4500] material-symbols-fill">auto_awesome</span>
                            <span className="bg-gradient-to-r from-[#ff4500] to-[#ff8c00] bg-clip-text text-transparent">AI Match: {r.matchScore}%</span>
                          </div>
                          <p className="font-grotesk text-xs sm:text-sm text-[#1e110d] italic leading-relaxed">
                            "{r.aiReasoning}"
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {(r.vibes || (r.vibe ? [r.vibe] : [])).map((vibe) => (
                            <span 
                              key={`vibe-${vibe}`} 
                              onClick={(e) => {
                                e.stopPropagation();
                                setVibeFilter(vibe);
                              }}
                              className="font-grotesk text-xs font-bold text-[#b82900] bg-[#ffe4dc] border border-[#ffbca8] hover:border-[#ff4500] px-2.5 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
                              title={`Filter by ${vibe} vibe`}
                            >
                              <span className="material-symbols-outlined text-[13px] text-[#ff4500]">
                                {vibe === 'Romantic' ? 'favorite' : vibe === 'Business' ? 'business_center' : vibe === 'Casual' ? 'coffee' : 'celebration'}
                              </span>
                              <span>{vibe} Vibe</span>
                            </span>
                          ))}
                          {r.tags.map((tag) => (
                            <span key={tag} className="font-grotesk text-xs font-medium text-[#e63900] bg-[#fff0eb] border border-[#ffded4] px-2.5 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {r.mustTry && (
                          <p className="font-grotesk text-xs text-[#523932]">
                            <strong className="text-[#1e110d]">Must Try:</strong> {r.mustTry}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2.5 pt-2">
                        <button
                          onClick={() => onSelectRestaurant(r)}
                          className="flex-1 bg-gradient-to-r from-[#ff4500] via-[#e63900] to-[#ff781f] hover:from-[#e63900] hover:to-[#ff5e1a] text-white font-grotesk text-xs sm:text-sm font-bold py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                        >
                          View Details
                        </button>
                        <button 
                          onClick={() => onSelectRestaurant(r)}
                          title="Get Directions"
                          className="p-2.5 bg-[#fff0eb] hover:bg-[#ffe3d8] border border-[#ffcfc2] text-[#ff4500] rounded-xl transition-colors cursor-pointer flex items-center justify-center shadow-xs"
                        >
                          <span className="material-symbols-outlined text-lg">directions</span>
                        </button>
                        <button
                          onClick={() => onToggleSave(r)}
                          title="Save Restaurant"
                          className={`p-2.5 border rounded-xl transition-colors cursor-pointer flex items-center justify-center shadow-xs ${
                            savedIds.includes(r.id)
                              ? 'bg-[#ff4500] text-white border-[#ff4500]'
                              : 'bg-[#fff0eb] hover:bg-[#ffe3d8] border-[#ffcfc2] text-[#ff4500]'
                          }`}
                        >
                          <span className={`material-symbols-outlined text-lg ${savedIds.includes(r.id) ? 'material-symbols-fill' : ''}`}>
                            bookmark
                          </span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </section>
          </div>

          {/* Sidebar Map in Split View */}
          {viewMode === 'split' && (
            <aside className="hidden md:block col-span-4 sticky top-24 h-[calc(100vh-140px)] rounded-2xl overflow-hidden soft-card-shadow border-2 border-[#ffded4]">
              <div className="w-full h-full relative bg-[#fff5f0]">
                <img src={HYDERABAD_MAP_IMAGE} alt="Hyderabad map" className="w-full h-full object-cover opacity-90" />
                
                {/* Interactive Pins on Sidebar Map */}
                {displayResults.map((r, index) => {
                  const coords = PIN_COORDINATES[r.id] || {
                    top: `${25 + (index * 14) % 55}%`,
                    left: `${20 + (index * 16) % 60}%`,
                  };
                  const isSelected = activeRestaurant?.id === r.id;

                  return (
                    <div
                      key={r.id}
                      style={{ top: coords.top, left: coords.left }}
                      onClick={() => {
                        setSelectedPinId(r.id);
                        onSelectRestaurant(r);
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                      title={r.name}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-xl border-2 border-white transition-all transform hover:scale-125 ${
                        isSelected 
                          ? 'bg-gradient-to-tr from-[#ff4500] to-[#ff8c00] scale-110 animate-bounce' 
                          : 'bg-gradient-to-tr from-[#f59e0b] to-[#fbbf24]'
                      }`}>
                        <span className="material-symbols-outlined text-sm">restaurant</span>
                      </div>
                    </div>
                  );
                })}

                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-[#ffcfc2] shadow-lg flex items-center justify-between">
                  <div>
                    <p className="font-garamond font-bold text-[#1e110d] text-sm">Hyderabad Food Map</p>
                    <p className="font-grotesk text-xs text-[#523932]">{displayResults.length} pins active</p>
                  </div>
                  <button
                    onClick={() => setViewMode('map')}
                    className="bg-gradient-to-r from-[#ff4500] to-[#ff781f] hover:from-[#e63900] hover:to-[#ff5e1a] text-white text-xs px-3 py-1.5 rounded-xl font-grotesk font-bold shadow-xs cursor-pointer flex items-center gap-1 transition-all"
                  >
                    <span className="material-symbols-outlined text-xs">open_in_full</span>
                    <span>Expand Map</span>
                  </button>
                </div>
              </div>
            </aside>
          )}
        </div>
      )}

      {/* Floating Bottom Quick View Toggle for Mobile & Quick Action */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 md:hidden">
        <button
          onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#1e110d] to-[#331c15] text-white font-grotesk text-sm font-bold shadow-2xl border-2 border-[#ff781f] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg text-[#ff781f]">
            {viewMode === 'map' ? 'view_list' : 'map'}
          </span>
          <span>{viewMode === 'map' ? 'Show List View' : 'Show Map View'}</span>
        </button>
      </div>
    </div>
  );
};

