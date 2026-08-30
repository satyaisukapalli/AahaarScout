import React, { useState } from 'react';
import { Restaurant } from '../types';
import { generateBudgetMealPlan, BudgetMealPlan } from '../utils/foodDecisionEngine';
import { DollarSign, Users, X, ArrowRight, CheckCircle2, Sparkles, Utensils } from 'lucide-react';

interface BudgetChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurants: Restaurant[];
  onSelectRestaurant: (r: Restaurant) => void;
  isVegOnly?: boolean;
}

export const BudgetChallengeModal: React.FC<BudgetChallengeModalProps> = ({
  isOpen,
  onClose,
  restaurants,
  onSelectRestaurant,
  isVegOnly = false,
}) => {
  const [peopleCount, setPeopleCount] = useState<number>(2);
  const [budget, setBudget] = useState<number>(500);
  const [dietPref, setDietPref] = useState<'all' | 'veg'>(isVegOnly ? 'veg' : 'all');

  if (!isOpen) return null;

  const plans = generateBudgetMealPlan(restaurants, peopleCount, budget, dietPref === 'veg' || isVegOnly);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-emerald-100 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-teal-50 to-orange-50">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
              💰
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-syne font-bold text-gray-900 text-base sm:text-xl">
                  AaharScout Budget Meal Planner
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                  ₹500 Food Challenge
                </span>
              </div>
              <p className="text-xs text-gray-600 font-grotesk">
                Curated multi-dish meal plans engineered under your exact budget
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

        {/* Filter Controls: People, Budget, Diet */}
        <div className="p-4 sm:p-6 border-b border-gray-100 bg-[#faf7f5] flex flex-wrap items-center justify-between gap-4">
          {/* People Selector */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Dining Group
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setPeopleCount(num);
                    if (num === 1) setBudget(300);
                    if (num === 2) setBudget(500);
                    if (num === 4) setBudget(1000);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    peopleCount === num
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {num === 1 ? 'Solo (1)' : num === 2 ? 'Couple (2)' : 'Family (4)'}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Presets */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Target Budget
            </label>
            <div className="flex items-center gap-1.5">
              {[300, 500, 800, 1000].map((b) => (
                <button
                  key={b}
                  onClick={() => setBudget(b)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    budget === b
                      ? 'bg-[#ad2c00] text-white shadow-xs'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  ₹{b}
                </button>
              ))}
            </div>
          </div>

          {/* Diet Toggle */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Dietary
            </label>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setDietPref('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  dietPref === 'all'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                All (Non-Veg & Veg)
              </button>
              <button
                onClick={() => setDietPref('veg')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  dietPref === 'veg'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                🌱 Veg Only
              </button>
            </div>
          </div>
        </div>

        {/* Meal Plans List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {plans.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-xs">
              No combinations found for this budget. Try increasing budget or adjusting diet.
            </div>
          ) : (
            plans.map((plan, pIdx) => (
              <div
                key={pIdx}
                className="bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 p-4 sm:p-5 shadow-xs transition-all flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {plan.planType === 'best-value' ? '🏆 BEST VALUE' : plan.planType === 'best-quantity' ? '📦 MAX QUANTITY' : '✨ SIGNATURE COMBO'}
                      </span>
                      <span className="text-xs font-bold text-gray-900 font-syne">
                        {plan.restaurant.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {plan.restaurant.neighborhood}, {plan.restaurant.city} • {plan.restaurant.distance || '2.8 km'}
                    </p>
                  </div>

                  <div className="text-right bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0">
                    <span className="text-[10px] text-emerald-800 uppercase font-mono block">
                      Total Calculated Bill
                    </span>
                    <span className="font-syne font-extrabold text-lg text-emerald-700">
                      ₹{plan.totalCost}
                    </span>
                    <span className="text-[9px] text-gray-400 block italic">
                      *Estimated price
                    </span>
                  </div>
                </div>

                {/* Itemized breakdown table */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                    Itemized Food Plan Breakdown:
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {plan.items.map((item, iIdx) => (
                      <div
                        key={iIdx}
                        className="flex items-center justify-between p-2 rounded-xl bg-gray-50 text-xs text-gray-800"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-[10px] text-gray-400">({item.portion})</span>
                        </div>
                        <span className="font-mono font-bold text-gray-700">
                          ₹{item.estimatedPrice}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <p className="text-[11px] text-gray-500 italic max-w-sm">
                    {plan.whyItWorks}
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onSelectRestaurant(plan.restaurant);
                    }}
                    className="py-2 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span>View Restaurant</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
