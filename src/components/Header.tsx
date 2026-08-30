import React, { useState } from 'react';
import { ScreenType, AuthUser } from '../types';
import { LOGO_URL } from '../data/restaurants';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  savedCount: number;
  isVegOnly: boolean;
  onToggleVegOnly: () => void;
  authUser?: AuthUser | null;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  savedCount,
  isVegOnly,
  onToggleVegOnly,
  authUser,
  onOpenAuth,
  onLogout,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className={`sticky top-0 backdrop-blur-md shadow-xs z-50 transition-colors duration-300 border-b ${
      isVegOnly ? 'bg-[#f4faf4]/95 border-[#b9e6c4]' : 'bg-[#fff9f6]/95 border-[#f3c9be]'
    }`}>
      <div className="flex justify-between items-center w-full px-4 sm:px-8 md:px-16 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-5 md:gap-8">
          <button 
            id="brand-logo-home-btn"
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2.5 hover:opacity-95 transition-all group focus:outline-hidden cursor-pointer"
            aria-label="Go to homepage"
          >
            <div className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl overflow-hidden shadow-xs border-2 bg-white flex items-center justify-center group-hover:shadow-md transition-all ${
              isVegOnly ? 'border-emerald-500/40 group-hover:border-emerald-600' : 'border-[#ff4500]/30 group-hover:border-[#ff4500]'
            }`}>
              <img 
                src={LOGO_URL} 
                alt="Aahaarscout Logo" 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className={`font-syne font-extrabold text-xl sm:text-2xl tracking-tight bg-clip-text text-transparent ${
                isVegOnly
                  ? 'bg-gradient-to-r from-[#166534] via-[#15803d] to-[#10b981]'
                  : 'bg-gradient-to-r from-[#ff3800] via-[#e63900] to-[#ff781f]'
              }`}>
                AaharScout
              </span>
              {isVegOnly && (
                <span className="text-[10px] -mt-1 font-grotesk font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  100% Pure Veg
                </span>
              )}
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-5 lg:gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`font-grotesk text-sm font-semibold transition-all duration-200 pb-1 cursor-pointer ${
                currentScreen === 'home'
                  ? isVegOnly ? 'text-emerald-700 border-b-2 border-emerald-600' : 'text-[#ff4500] border-b-2 border-[#ff4500]'
                  : 'text-[#523932] hover:text-emerald-600'
              }`}
            >
              Discover
            </button>
            <button
              onClick={() => onNavigate('search')}
              className={`font-grotesk text-sm font-semibold transition-all duration-200 pb-1 cursor-pointer ${
                currentScreen === 'search'
                  ? isVegOnly ? 'text-emerald-700 border-b-2 border-emerald-600' : 'text-[#ff4500] border-b-2 border-[#ff4500]'
                  : 'text-[#523932] hover:text-emerald-600'
              }`}
            >
              {isVegOnly ? 'Veg Food' : 'Best Food'}
            </button>
            <button
              onClick={() => onNavigate('city')}
              className={`font-grotesk text-sm font-semibold transition-all duration-200 pb-1 cursor-pointer ${
                currentScreen === 'city'
                  ? isVegOnly ? 'text-emerald-700 border-b-2 border-emerald-600' : 'text-[#ff4500] border-b-2 border-[#ff4500]'
                  : 'text-[#523932] hover:text-emerald-600'
              }`}
            >
              Cities
            </button>
            <button
              onClick={() => onNavigate('collections')}
              className={`font-grotesk text-sm font-semibold transition-all duration-200 pb-1 cursor-pointer ${
                currentScreen === 'collections'
                  ? isVegOnly ? 'text-emerald-700 border-b-2 border-emerald-600' : 'text-[#ff4500] border-b-2 border-[#ff4500]'
                  : 'text-[#523932] hover:text-emerald-600'
              }`}
            >
              Collections
            </button>
            <button
              onClick={() => onNavigate('forum')}
              className={`font-grotesk text-sm font-semibold transition-all duration-200 pb-1 cursor-pointer flex items-center gap-1.5 ${
                currentScreen === 'forum'
                  ? isVegOnly ? 'text-emerald-700 border-b-2 border-emerald-600' : 'text-[#ff4500] border-b-2 border-[#ff4500]'
                  : 'text-[#523932] hover:text-emerald-600'
              }`}
            >
              <span>Forum & Memes</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-amber-100 text-amber-800 uppercase tracking-tighter">
                Live
              </span>
            </button>
            <button
              onClick={() => onNavigate('saved')}
              className={`font-grotesk text-sm font-semibold transition-all duration-200 pb-1 cursor-pointer flex items-center gap-1.5 ${
                currentScreen === 'saved'
                  ? isVegOnly ? 'text-emerald-700 border-b-2 border-emerald-600' : 'text-[#ff4500] border-b-2 border-[#ff4500]'
                  : 'text-[#523932] hover:text-emerald-600'
              }`}
            >
              Saved
              {savedCount > 0 && (
                <span className={`text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs ${
                  isVegOnly ? 'bg-emerald-600' : 'bg-gradient-to-r from-[#ff4500] to-[#ff781f]'
                }`}>
                  {savedCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Vegetarian Mode Global Switch */}
          <button
            onClick={onToggleVegOnly}
            title={isVegOnly ? "Switch to All Options (Veg + Non-Veg)" : "Switch to 100% Vegetarian Only Mode"}
            className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full font-grotesk text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-xs border ${
              isVegOnly
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-400/40 scale-102'
                : 'bg-white hover:bg-[#edf9ee] text-[#1e5828] border-emerald-300/80 hover:border-emerald-500'
            }`}
          >
            <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs transition-transform ${
              isVegOnly ? 'bg-white text-emerald-700 rotate-12 scale-110' : 'bg-emerald-100 text-emerald-700'
            }`}>
              🌱
            </span>
            <span className="whitespace-nowrap hidden sm:inline">
              {isVegOnly ? 'Pure Veg Mode (ON)' : 'Veg Only'}
            </span>
            <span className="whitespace-nowrap sm:hidden">
              {isVegOnly ? 'Veg ON' : 'Veg'}
            </span>
            <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-200 flex items-center ${
              isVegOnly ? 'bg-emerald-900 justify-end' : 'bg-gray-300 justify-start'
            }`}>
              <div className="w-3 h-3 rounded-full bg-white shadow-xs"></div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('ai-assistant')}
            className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full font-grotesk text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-xs ${
              currentScreen === 'ai-assistant'
                ? isVegOnly ? 'bg-emerald-700 text-white shadow-md' : 'bg-gradient-to-r from-[#ff4500] via-[#e63900] to-[#ff781f] text-white shadow-md'
                : isVegOnly ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100' : 'bg-gradient-to-r from-[#fff0eb] to-[#fff6f2] text-[#e63900] hover:from-[#ffe3d8] hover:to-[#ffedd5] border border-[#ffcfc2]'
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] material-symbols-fill ${
              isVegOnly ? 'text-emerald-600' : 'text-[#ff4500]'
            }`}>smart_toy</span>
            <span className="hidden sm:inline">FoodieBot</span>
          </button>

          {/* User Sign In / Profile Section */}
          {authUser ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`flex items-center gap-2 p-1 pl-2.5 rounded-full border transition-all cursor-pointer ${
                  isVegOnly
                    ? 'border-emerald-300 bg-emerald-50/80 hover:bg-emerald-100/90 text-emerald-900'
                    : 'border-[#ffcfc2] bg-[#fff0eb]/80 hover:bg-[#ffe2d6] text-[#281713]'
                }`}
              >
                <span className="text-xs font-grotesk font-bold hidden sm:inline truncate max-w-[100px]">
                  {authUser.name.split(' ')[0]}
                </span>
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white shadow-xs">
                  <img
                    src={authUser.avatar}
                    alt={authUser.name}
                    className="w-full h-full object-cover"
                  />
                  {authUser.provider === 'google' && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-full flex items-center justify-center p-0.5 shadow-2xs">
                      <span className="text-[7px]">🇬</span>
                    </div>
                  )}
                  {authUser.provider === 'facebook' && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#1877f2] text-white rounded-full flex items-center justify-center text-[7px] font-bold">
                      f
                    </div>
                  )}
                </div>
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-fade-in font-grotesk">
                  <div className="p-3 border-b border-gray-100 flex items-center gap-3">
                    <img
                      src={authUser.avatar}
                      alt={authUser.name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <div className="overflow-hidden">
                      <p className="font-bold text-sm text-gray-900 truncate">{authUser.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{authUser.email}</p>
                      <span className="inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-sm bg-gray-100 text-gray-600 uppercase">
                        via {authUser.provider}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onNavigate('profile');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">person</span>
                      My Taste Profile
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onNavigate('saved');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">bookmark</span>
                      Saved Spots ({savedCount})
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onNavigate('forum');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">forum</span>
                      Foodie Forum & Memes
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onNavigate('collections');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">auto_awesome</span>
                      Curated Trails
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        if (onOpenAuth) onOpenAuth();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-orange-600 hover:bg-orange-50 flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">swap_horiz</span>
                      Switch Account / Sign In
                    </button>
                  </div>

                  <div className="pt-1 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        if (onLogout) onLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">logout</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                if (onOpenAuth) onOpenAuth();
                else onNavigate('profile');
              }}
              className={`border-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-grotesk text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isVegOnly
                  ? 'border-emerald-600/40 text-emerald-950 hover:border-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                  : 'border-[#ff4500]/30 text-[#1e110d] hover:border-[#ff4500] hover:text-[#ff4500] hover:bg-[#fff0eb]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
