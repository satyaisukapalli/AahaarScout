import React from 'react';
import { ScreenType } from '../types';
import { LOGO_URL } from '../data/restaurants';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate, savedCount }) => {
  return (
    <header className="sticky top-0 bg-[#fff9f6]/95 backdrop-blur-md shadow-xs z-50 border-b border-[#f3c9be]">
      <div className="flex justify-between items-center w-full px-4 sm:px-8 md:px-16 py-3.5 max-w-7xl mx-auto">
        <div className="flex items-center gap-6 md:gap-10">
          <button 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2.5 hover:opacity-95 transition-all group focus:outline-hidden"
          >
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl overflow-hidden shadow-xs border-2 border-[#ff4500]/30 bg-white flex items-center justify-center group-hover:border-[#ff4500] group-hover:shadow-md transition-all">
              <img 
                src={LOGO_URL} 
                alt="Aahaarscout Logo" 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-garamond font-bold text-xl sm:text-2xl bg-gradient-to-r from-[#ff3800] via-[#e63900] to-[#ff781f] bg-clip-text text-transparent tracking-tight">
              Aahaarscout
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`font-grotesk text-sm font-semibold transition-all duration-200 pb-1 cursor-pointer ${
                currentScreen === 'home'
                  ? 'text-[#ff4500] border-b-2 border-[#ff4500]'
                  : 'text-[#523932] hover:text-[#ff4500]'
              }`}
            >
              Discover
            </button>
            <button
              onClick={() => onNavigate('search')}
              className={`font-grotesk text-sm font-semibold transition-all duration-200 pb-1 cursor-pointer ${
                currentScreen === 'search'
                  ? 'text-[#ff4500] border-b-2 border-[#ff4500]'
                  : 'text-[#523932] hover:text-[#ff4500]'
              }`}
            >
              Best Food
            </button>
            <button
              onClick={() => onNavigate('city')}
              className={`font-grotesk text-sm font-semibold transition-all duration-200 pb-1 cursor-pointer ${
                currentScreen === 'city'
                  ? 'text-[#ff4500] border-b-2 border-[#ff4500]'
                  : 'text-[#523932] hover:text-[#ff4500]'
              }`}
            >
              Cities
            </button>
            <button
              onClick={() => onNavigate('collections')}
              className={`font-grotesk text-sm font-semibold transition-all duration-200 pb-1 cursor-pointer ${
                currentScreen === 'collections'
                  ? 'text-[#ff4500] border-b-2 border-[#ff4500]'
                  : 'text-[#523932] hover:text-[#ff4500]'
              }`}
            >
              Collections
            </button>
            <button
              onClick={() => onNavigate('saved')}
              className={`font-grotesk text-sm font-semibold transition-all duration-200 pb-1 cursor-pointer flex items-center gap-1.5 ${
                currentScreen === 'saved'
                  ? 'text-[#ff4500] border-b-2 border-[#ff4500]'
                  : 'text-[#523932] hover:text-[#ff4500]'
              }`}
            >
              Saved
              {savedCount > 0 && (
                <span className="bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => onNavigate('ai-assistant')}
            className={`px-3.5 sm:px-4 py-2 rounded-full font-grotesk text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-xs ${
              currentScreen === 'ai-assistant'
                ? 'bg-gradient-to-r from-[#ff4500] via-[#e63900] to-[#ff781f] text-white shadow-md'
                : 'bg-gradient-to-r from-[#fff0eb] to-[#fff6f2] text-[#e63900] hover:from-[#ffe3d8] hover:to-[#ffedd5] border border-[#ffcfc2]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] material-symbols-fill text-[#ff4500] group-hover:scale-110">smart_toy</span>
            <span>FoodieBot</span>
          </button>
          <button
            onClick={() => onNavigate('profile')}
            className="border-2 border-[#ff4500]/30 text-[#1e110d] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-grotesk text-xs sm:text-sm font-semibold hover:border-[#ff4500] hover:text-[#ff4500] hover:bg-[#fff0eb] transition-all cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
};
