import React, { useState, useEffect } from 'react';
import { Restaurant } from '../types';
import { getTimeOfDayContext, generateAaharScoutPicks } from '../utils/foodDecisionEngine';
import { Dices, Sparkles, X, ArrowRight, MapPin, DollarSign, Flame, RefreshCw } from 'lucide-react';

interface SurpriseMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurants: Restaurant[];
  onSelectRestaurant: (r: Restaurant) => void;
  isVegOnly?: boolean;
}

export const SurpriseMeModal: React.FC<SurpriseMeModalProps> = ({
  isOpen,
  onClose,
  restaurants,
  onSelectRestaurant,
  isVegOnly = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const timeCtx = getTimeOfDayContext();

  const eligible = restaurants.filter((r) => {
    if (isVegOnly && !r.isVeg && !r.isPureVeg) return false;
    return true;
  });

  const picks = generateAaharScoutPicks(eligible, { rawQuery: 'surprise craving' }, isVegOnly);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.floor(Math.random() * Math.max(1, picks.length)));
    }
  }, [isOpen]);

  if (!isOpen || picks.length === 0) return null;

  const currentPick = picks[currentIndex % picks.length];

  const handleSpinAnother = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % picks.length);
      setIsSpinning(false);
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-orange-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-2xl bg-[#ff4500] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              🎲
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-syne font-bold text-gray-900 text-base sm:text-lg">
                  Surprise Me!
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                  {timeCtx.badge}
                </span>
              </div>
              <p className="text-xs text-gray-600 font-grotesk">
                Food decision made easy — zero decision fatigue
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pick Body */}
        <div className={`p-5 sm:p-6 overflow-y-auto transition-opacity duration-300 ${isSpinning ? 'opacity-30 scale-98' : 'opacity-100 scale-100'}`}>
          {/* Card Hero */}
          <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-neutral-900 mb-4 shadow-lg">
            <img
              src={currentPick.dishImage}
              alt={currentPick.dishName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#ff4500] text-white text-xs font-bold shadow-md flex items-center gap-1">
              <span>🎲</span>
              <span>AaharScout Surprise Pick</span>
            </div>

            <div className="absolute bottom-3 left-3 text-white">
              <span className="text-xs text-amber-300 font-bold block">
                {currentPick.bestForIcon} {currentPick.bestForCategory}
              </span>
              <h3 className="font-syne font-extrabold text-xl sm:text-2xl leading-tight">
                {currentPick.dishName}
              </h3>
            </div>
          </div>

          {/* Restaurant Details */}
          <div className="bg-orange-50/70 rounded-2xl p-4 border border-orange-200/70 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-syne font-bold text-gray-900 text-base">
                {currentPick.restaurant.name}
              </h4>
              <span className="font-syne font-extrabold text-[#ad2c00] text-base">
                {currentPick.priceFormatted}
              </span>
            </div>

            <p className="text-xs text-gray-600 mb-3">
              {currentPick.dishDescription}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
              <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-orange-100">
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span className="truncate">{currentPick.restaurant.distance || '2.8 km away'}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-orange-100">
                <Flame className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{currentPick.spiceLevel}</span>
              </div>
            </div>
          </div>

          {/* Why this pick right now */}
          <div className="bg-white rounded-2xl p-3.5 border border-gray-200 text-xs space-y-1.5 mb-2">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Why AaharScout picked this right now</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Based on the current time of day ({timeCtx.slot}), authentic dish ratings in {currentPick.restaurant.city}, 
              and strong local foodie reviews.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
          <button
            onClick={handleSpinAnother}
            className="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-[#ff4500] ${isSpinning ? 'animate-spin' : ''}`} />
            <span>Show Another</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onSelectRestaurant(currentPick.restaurant);
            }}
            className="flex-1 py-3 px-5 rounded-xl text-xs sm:text-sm font-bold bg-[#ad2c00] hover:bg-[#8c2300] text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View Restaurant</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
