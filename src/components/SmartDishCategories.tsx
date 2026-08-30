import React, { useState } from 'react';
import { Restaurant } from '../types';
import { AaharScoutPick } from '../utils/foodDecisionEngine';
import { 
  Trophy, DollarSign, Flame, Sparkles, Users, Moon, Heart, 
  ArrowRight, MapPin, CheckCircle2 
} from 'lucide-react';

interface SmartDishCategoriesProps {
  picks: AaharScoutPick[];
  onSelectRestaurant: (r: Restaurant) => void;
  cravingTitle?: string;
}

export const SmartDishCategories: React.FC<SmartDishCategoriesProps> = ({
  picks,
  onSelectRestaurant,
  cravingTitle = 'Best Dish Options',
}) => {
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('all');

  if (!picks || picks.length === 0) return null;

  // Categories mapping
  const categoryDefs = [
    { key: 'all', label: 'All Picks', icon: '✨' },
    { key: 'Best Overall', label: '🥇 Best Overall', icon: '🏆' },
    { key: 'Best Value', label: '💰 Best Value', icon: '💵' },
    { key: 'Best for Spice', label: '🌶️ Best for Spice', icon: '🔥' },
    { key: 'Hidden Gem', label: '💎 Hidden Gem', icon: '✨' },
    { key: 'Best for Families', label: '👨‍👩‍👧 Best for Families', icon: '👨‍👩‍👧' },
    { key: 'Best for Dates', label: '❤️ Best for Dates', icon: '🍷' },
  ];

  const filteredPicks = selectedCategoryKey === 'all'
    ? picks
    : picks.filter((p) => p.bestForCategory === selectedCategoryKey || (selectedCategoryKey === 'Hidden Gem' && p.isHiddenGem));

  return (
    <div className="w-full bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-8 shadow-xs my-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">
              DISH-FIRST DISCOVERY
            </span>
          </div>
          <h3 className="font-syne text-xl sm:text-2xl font-extrabold text-gray-900">
            🏆 {cravingTitle}
          </h3>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categoryDefs.map((cat) => {
            const hasMatches = cat.key === 'all' || picks.some((p) => p.bestForCategory === cat.key || (cat.key === 'Hidden Gem' && p.isHiddenGem));
            if (!hasMatches && cat.key !== 'all') return null;

            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategoryKey(cat.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategoryKey === cat.key
                    ? 'bg-[#ad2c00] text-white shadow-xs scale-102'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Categorized Dish Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPicks.map((pick) => (
          <div
            key={pick.id}
            onClick={() => onSelectRestaurant(pick.restaurant)}
            className="group p-4 rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all bg-white flex items-start gap-4 cursor-pointer relative overflow-hidden"
          >
            <img
              src={pick.dishImage}
              alt={pick.dishName}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-xl object-cover border border-gray-200 group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-100 text-[#ad2c00]">
                  {pick.bestForIcon} {pick.bestForCategory}
                </span>
                <span className="text-[11px] font-bold font-mono text-amber-600">
                  {pick.matchScore}% Match
                </span>
              </div>

              <h4 className="font-syne font-bold text-gray-900 text-sm truncate group-hover:text-[#ff4500] transition-colors">
                {pick.dishName}
              </h4>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {pick.restaurant.name} • {pick.restaurant.neighborhood}
              </p>

              <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-100">
                <span className="font-mono font-bold text-xs text-[#ad2c00]">
                  {pick.priceFormatted}
                </span>
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {pick.restaurant.distance || '2.8 km'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
