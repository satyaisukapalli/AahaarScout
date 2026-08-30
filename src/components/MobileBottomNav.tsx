import React from 'react';
import { ScreenType } from '../types';

interface MobileBottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  savedCount: number;
  isVegOnly?: boolean;
  onToggleVegOnly?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentScreen,
  onNavigate,
  savedCount,
  isVegOnly = false,
  onToggleVegOnly,
}) => {
  const activeClass = isVegOnly
    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-1.5 shadow-sm'
    : 'bg-[#ad2c00] text-white px-4 py-1.5 shadow-sm';

  const inactiveClass = isVegOnly
    ? 'text-[#2a4d38] hover:text-emerald-700'
    : 'text-[#5c4038] hover:text-[#ad2c00]';

  return (
    <nav className={`fixed md:hidden bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2.5 pb-[max(env(safe-area-inset-bottom),12px)] backdrop-blur-lg border-t shadow-[0px_-4px_20px_rgba(40,23,19,0.06)] ${
      isVegOnly ? 'bg-[#f4faf4]/95 border-[#b9e6c4]' : 'bg-[#fff8f6]/95 border-[#e5beb3]'
    }`}>
      <button
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
          currentScreen === 'home' || currentScreen === 'search'
            ? activeClass
            : inactiveClass
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">search</span>
        <span className="font-grotesk text-[11px] font-medium mt-0.5">Explore</span>
      </button>

      <button
        onClick={() => onNavigate('city')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
          currentScreen === 'city'
            ? activeClass
            : inactiveClass
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">location_city</span>
        <span className="font-grotesk text-[11px] font-medium mt-0.5">Cities</span>
      </button>

      <button
        onClick={() => onNavigate('saved')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl relative transition-colors cursor-pointer ${
          currentScreen === 'saved'
            ? activeClass
            : inactiveClass
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">bookmark</span>
        <span className="font-grotesk text-[11px] font-medium mt-0.5">Saved</span>
        {savedCount > 0 && currentScreen !== 'saved' && (
          <span className={`absolute top-1 right-2 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold ${
            isVegOnly ? 'bg-emerald-600' : 'bg-[#ad2c00]'
          }`}>
            {savedCount}
          </span>
        )}
      </button>

      <button
        onClick={() => onNavigate('forum')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
          currentScreen === 'forum'
            ? activeClass
            : inactiveClass
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">forum</span>
        <span className="font-grotesk text-[11px] font-medium mt-0.5">Forum</span>
      </button>

      <button
        onClick={() => onNavigate('ai-assistant')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
          currentScreen === 'ai-assistant' || currentScreen === 'tonight-pick'
            ? activeClass
            : inactiveClass
        }`}
      >
        <span className="material-symbols-outlined text-[20px] material-symbols-fill">smart_toy</span>
        <span className="font-grotesk text-[11px] font-medium mt-0.5">AI Scout</span>
      </button>

      {onToggleVegOnly && (
        <button
          onClick={onToggleVegOnly}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer border ${
            isVegOnly
              ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
              : 'bg-white/80 border-gray-300 text-gray-700'
          }`}
          title="Toggle Vegetarian Only"
        >
          <span className="text-[16px]">🌱</span>
          <span className="font-grotesk text-[10px] font-bold mt-0.5">
            {isVegOnly ? 'Veg ON' : 'Veg OFF'}
          </span>
        </button>
      )}
    </nav>
  );
};
