import React from 'react';
import { ScreenType } from '../types';

interface MobileBottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  savedCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentScreen,
  onNavigate,
  savedCount
}) => {
  return (
    <nav className="fixed md:hidden bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2.5 pb-[max(env(safe-area-inset-bottom),12px)] bg-[#fff8f6]/95 backdrop-blur-lg border-t border-[#e5beb3] shadow-[0px_-4px_20px_rgba(40,23,19,0.06)]">
      <button
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
          currentScreen === 'home' || currentScreen === 'search'
            ? 'bg-[#ad2c00] text-white px-4 py-1.5 shadow-sm'
            : 'text-[#5c4038] hover:text-[#ad2c00]'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">search</span>
        <span className="font-grotesk text-[11px] font-medium mt-0.5">Search</span>
      </button>

      <button
        onClick={() => onNavigate('saved')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl relative transition-colors cursor-pointer ${
          currentScreen === 'saved'
            ? 'bg-[#ad2c00] text-white px-4 py-1.5 shadow-sm'
            : 'text-[#5c4038] hover:text-[#ad2c00]'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">bookmark</span>
        <span className="font-grotesk text-[11px] font-medium mt-0.5">Saved</span>
        {savedCount > 0 && currentScreen !== 'saved' && (
          <span className="absolute top-1 right-2 bg-[#ad2c00] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            {savedCount}
          </span>
        )}
      </button>

      <button
        onClick={() => onNavigate('ai-assistant')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
          currentScreen === 'ai-assistant' || currentScreen === 'tonight-pick'
            ? 'bg-[#ad2c00] text-white px-4 py-1.5 shadow-sm'
            : 'text-[#5c4038] hover:text-[#ad2c00]'
        }`}
      >
        <span className="material-symbols-outlined text-[20px] material-symbols-fill">smart_toy</span>
        <span className="font-grotesk text-[11px] font-medium mt-0.5">AI Assistant</span>
      </button>

      <button
        onClick={() => onNavigate('profile')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors cursor-pointer ${
          currentScreen === 'profile'
            ? 'bg-[#ad2c00] text-white px-4 py-1.5 shadow-sm'
            : 'text-[#5c4038] hover:text-[#ad2c00]'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">person</span>
        <span className="font-grotesk text-[11px] font-medium mt-0.5">Profile</span>
      </button>
    </nav>
  );
};
