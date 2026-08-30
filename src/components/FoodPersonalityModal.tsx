import React, { useState } from 'react';
import { Restaurant } from '../types';
import { FOOD_PERSONALITIES, FoodPersonality } from '../utils/foodDecisionEngine';
import { UserCheck, Sparkles, X, ArrowRight, Flame, Heart, Coffee, ShieldCheck } from 'lucide-react';

interface FoodPersonalityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchCraving: (craving: string) => void;
}

export const FoodPersonalityModal: React.FC<FoodPersonalityModalProps> = ({
  isOpen,
  onClose,
  onSearchCraving,
}) => {
  const [selectedId, setSelectedId] = useState<string>('spice-hunter');

  if (!isOpen) return null;

  const currentArchetype = FOOD_PERSONALITIES.find((p) => p.id === selectedId) || FOOD_PERSONALITIES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-orange-100 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-orange-50 via-amber-50 to-rose-50">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff4500] to-rose-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
              🎭
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-syne font-bold text-gray-900 text-base sm:text-xl">
                  Your Food Personality
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-200 text-orange-900">
                  AI Taste Archetype
                </span>
              </div>
              <p className="text-xs text-gray-600 font-grotesk">
                AaharScout learns your taste preferences to make instant dining decisions
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

        {/* Archetype Selector Chips */}
        <div className="p-4 sm:p-5 border-b border-gray-100 bg-[#faf7f5] overflow-x-auto no-scrollbar flex items-center gap-2">
          {FOOD_PERSONALITIES.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedId === p.id
                  ? 'bg-[#ad2c00] text-white shadow-sm scale-102'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>{p.emoji}</span>
              <span>{p.title}</span>
            </button>
          ))}
        </div>

        {/* Selected Archetype Deep Dive */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Card Banner */}
          <div className="bg-gradient-to-br from-[#2a140e] to-[#1a0c07] rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-3xl mb-2 block">{currentArchetype.emoji}</span>
                <h4 className="font-syne font-extrabold text-xl sm:text-2xl text-white">
                  {currentArchetype.title}
                </h4>
                <p className="text-xs text-orange-200 font-grotesk mt-0.5">
                  {currentArchetype.subtitle}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-white/10 text-orange-200 text-[11px] font-mono border border-white/15">
                {currentArchetype.favoriteBudget}
              </span>
            </div>

            <p className="text-xs text-orange-100/90 leading-relaxed mt-4 pt-3 border-t border-white/10">
              {currentArchetype.description}
            </p>
          </div>

          {/* Traits & Cuisines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-orange-50/70 p-4 rounded-2xl border border-orange-200/70">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2 font-mono">
                Key Dining Traits:
              </span>
              <ul className="space-y-1.5 text-xs text-gray-800">
                {currentArchetype.traits.map((t, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="text-[#ff4500] font-bold">✓</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-orange-50/70 p-4 rounded-2xl border border-orange-200/70">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2 font-mono">
                Top Cuisines & Styles:
              </span>
              <ul className="space-y-1.5 text-xs text-gray-800">
                {currentArchetype.topCuisines.map((c, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">★</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Signature Dish */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-mono block">
                Recommended Decision For You:
              </span>
              <p className="font-syne font-bold text-sm sm:text-base text-gray-900">
                {currentArchetype.recommendedDish}
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onSearchCraving(currentArchetype.recommendedDish);
              }}
              className="py-2 px-3.5 rounded-xl text-xs font-bold bg-[#ad2c00] hover:bg-[#8c2300] text-white shadow-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Scout This Dish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
