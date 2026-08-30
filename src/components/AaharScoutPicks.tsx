import React, { useState } from 'react';
import { Restaurant } from '../types';
import { AaharScoutPick } from '../utils/foodDecisionEngine';
import { ShareDecisionModal } from './ShareDecisionModal';
import { 
  Sparkles, CheckCircle2, MapPin, DollarSign, Flame, Heart, 
  Share2, ArrowRight, ShieldCheck, Info, Navigation, Bookmark, BookmarkCheck
} from 'lucide-react';

interface AaharScoutPicksProps {
  picks: AaharScoutPick[];
  onSelectRestaurant: (r: Restaurant) => void;
  onToggleSave?: (r: Restaurant) => void;
  savedIds?: string[];
  title?: string;
  subtitle?: string;
}

export const AaharScoutPicks: React.FC<AaharScoutPicksProps> = ({
  picks,
  onSelectRestaurant,
  onToggleSave,
  savedIds = [],
  title = 'AaharScout Picks',
  subtitle = 'Personalized food decisions matched to your craving, budget, and location.',
}) => {
  const [selectedSharePick, setSelectedSharePick] = useState<AaharScoutPick | null>(null);
  const [expandedWhy, setExpandedWhy] = useState<Record<string, boolean>>({});

  if (!picks || picks.length === 0) return null;

  const toggleWhy = (id: string) => {
    setExpandedWhy((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full flex flex-col gap-6 my-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-gray-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#ff4500] to-[#ad2c00] text-white shadow-2xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI FOOD DECISION ENGINE
            </span>
            <span className="text-xs text-gray-500 font-medium">
              Top {picks.length} Curated Matches
            </span>
          </div>
          <h2 className="font-syne text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-grotesk mt-0.5">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium shrink-0">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Verified Data
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#ff4500]"></span> AI Insight
          </span>
        </div>
      </div>

      {/* Grid of Picks (3–7 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {picks.map((pick) => {
          const isSaved = savedIds.includes(pick.restaurant.id);
          const isWhyOpen = expandedWhy[pick.id] ?? true; // Default open for maximum clarity

          return (
            <div
              key={pick.id}
              id={`aaharscout-pick-${pick.id}`}
              className="bg-white rounded-3xl border border-orange-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group relative"
            >
              {/* Top Banner Tag */}
              <div className="p-4 sm:p-5 pb-0">
                <div className="flex items-center justify-between gap-2 mb-3">
                  {/* Category Pill */}
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-[#ad2c00] border border-orange-200/80 flex items-center gap-1.5 shadow-2xs">
                    <span>{pick.bestForIcon}</span>
                    <span>{pick.bestForCategory}</span>
                  </span>

                  {/* Dietary & Spice Badge */}
                  <div className="flex items-center gap-1.5">
                    {pick.dietType === 'pure-veg' ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        🌱 Pure Veg
                      </span>
                    ) : pick.dietType === 'veg' ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        🟢 Veg
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        🍗 Non-Veg
                      </span>
                    )}

                    {pick.spiceLevel && pick.spiceLevel !== 'None' && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-0.5">
                        <Flame className="w-2.5 h-2.5" />
                        {pick.spiceLevel}
                      </span>
                    )}
                  </div>
                </div>

                {/* Dish Photo + Match Score Overlay */}
                <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-neutral-900 mb-3 shadow-inner">
                  <img
                    src={pick.dishImage}
                    alt={pick.dishName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Match Score Badge */}
                  <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white flex items-center gap-1.5 shadow-lg">
                    <span className="text-[#ff781f] text-sm">🔥</span>
                    <div>
                      <span className="font-syne font-extrabold text-sm sm:text-base text-amber-300">
                        {pick.matchScore}%
                      </span>
                      <span className="text-[10px] text-orange-200 font-grotesk ml-1 font-semibold">
                        AaharScout Match
                      </span>
                    </div>
                  </div>

                  {/* Distance Badge */}
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[11px] font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-orange-400" />
                    <span>{pick.restaurant.distance || '2.8 km away'}</span>
                  </div>

                  {/* Save Quick Action Button */}
                  {onToggleSave && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(pick.restaurant);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors cursor-pointer"
                      title="Save Restaurant"
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-[#ff4500]" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                {/* Dish Name & Restaurant Info */}
                <div className="mb-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-syne font-extrabold text-gray-900 text-lg sm:text-xl leading-tight">
                      {pick.dishName}
                    </h3>
                    <div className="text-right shrink-0">
                      <span className="font-syne font-extrabold text-base sm:text-lg text-[#ad2c00]">
                        {pick.priceFormatted}
                      </span>
                      <span className="block text-[9px] text-gray-400 uppercase tracking-tighter">
                        {pick.priceType === 'verified' ? 'Verified price' : 'Estimated price'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-gray-600 mt-0.5 flex items-center gap-1.5">
                    <span>{pick.restaurant.name}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500 font-normal">{pick.restaurant.neighborhood}, {pick.restaurant.city}</span>
                  </p>
                </div>

                {/* Dish Description Snippet */}
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-3">
                  {pick.dishDescription}
                </p>
              </div>

              {/* "Why AaharScout picked this" Transparent Breakdown */}
              <div className="px-4 sm:px-5 pb-4">
                <div className="bg-orange-50/50 rounded-2xl p-3.5 border border-orange-200/60 mb-4">
                  <div 
                    onClick={() => toggleWhy(pick.id)}
                    className="flex items-center justify-between cursor-pointer mb-2"
                  >
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#ff4500]" />
                      <span className="font-grotesk font-bold text-xs text-gray-900 uppercase tracking-wider">
                        Why AaharScout Picked This
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono font-semibold">
                      {isWhyOpen ? 'Hide ▲' : 'Show ▼'}
                    </span>
                  </div>

                  {isWhyOpen && (
                    <div className="space-y-1.5 pt-1 animate-fadeIn">
                      {pick.matchReasons.map((reason, rIdx) => (
                        <div key={rIdx} className="flex items-start gap-1.5 text-xs text-gray-700 leading-snug">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>{reason.replace(/^✓\s*/, '')}</span>
                        </div>
                      ))}
                      
                      <div className="pt-2 mt-2 border-t border-orange-200/60 flex items-center justify-between text-[10px] text-gray-500">
                        <span className="italic">Personalized recommendation score</span>
                        <span className="font-semibold text-orange-700">AI Verified</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Action Bar */}
                <div className="grid grid-cols-12 gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => onSelectRestaurant(pick.restaurant)}
                    className="col-span-6 py-2.5 px-3 rounded-xl text-xs font-bold bg-[#ad2c00] hover:bg-[#8c2300] text-white shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Restaurant</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${pick.restaurant.name} ${pick.restaurant.address || pick.restaurant.city}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="col-span-4 py-2.5 px-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors flex items-center justify-center gap-1 cursor-pointer text-center"
                    title="Get Directions on Google Maps"
                  >
                    <Navigation className="w-3 h-3 text-blue-600" />
                    <span>Directions</span>
                  </a>

                  <button
                    onClick={() => setSelectedSharePick(pick)}
                    className="col-span-2 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#ad2c00] transition-colors flex items-center justify-center cursor-pointer"
                    title="Share Food Decision Card"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Share Modal Trigger */}
      <ShareDecisionModal
        isOpen={!!selectedSharePick}
        onClose={() => setSelectedSharePick(null)}
        pick={selectedSharePick}
      />
    </div>
  );
};
