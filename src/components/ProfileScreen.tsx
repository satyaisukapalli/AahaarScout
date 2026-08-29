import React from 'react';
import { ScreenType } from '../types';

interface ProfileScreenProps {
  savedCount: number;
  onNavigate: (s: ScreenType) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ savedCount, onNavigate }) => {
  return (
    <div className="w-full max-w-3xl mx-auto px-5 sm:px-8 py-10 md:py-14 flex flex-col gap-8">
      <div className="bg-white rounded-2xl p-6 sm:p-8 soft-card-shadow border border-[#e5beb3]/50 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-[#ad2c00] text-white flex items-center justify-center text-3xl font-garamond font-bold shadow-md">
          AS
        </div>
        <div className="text-center sm:text-left flex-grow">
          <h1 className="font-garamond text-2xl sm:text-3xl font-bold text-[#281713]">
            Aahaarscout Member
          </h1>
          <p className="font-grotesk text-xs sm:text-sm text-[#5c4038]">
            foodie.explorer@example.com • Taste Profile: Explorer
          </p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
            <span className="px-2.5 py-1 bg-[#ffe9e4] text-[#ad2c00] text-xs font-semibold rounded-full font-grotesk">
              🔥 Biryani Enthusiast
            </span>
            <span className="px-2.5 py-1 bg-[#ffe9e4] text-[#ad2c00] text-xs font-semibold rounded-full font-grotesk">
              ☕ Specialty Coffee
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('saved')}
          className="bg-white rounded-2xl p-5 border border-[#e5beb3]/50 hover:border-[#ad2c00] transition-colors flex items-center justify-between text-left soft-card-shadow cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#fff1ed] text-[#ad2c00] flex items-center justify-center">
              <span className="material-symbols-outlined">bookmark</span>
            </div>
            <div>
              <h3 className="font-garamond font-bold text-lg text-[#281713]">Saved Places</h3>
              <p className="font-grotesk text-xs text-[#5c4038]">{savedCount} restaurants bookmarked</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#5c4038]">chevron_right</span>
        </button>

        <button
          onClick={() => onNavigate('ai-assistant')}
          className="bg-white rounded-2xl p-5 border border-[#e5beb3]/50 hover:border-[#ad2c00] transition-colors flex items-center justify-between text-left soft-card-shadow cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#fff1ed] text-[#ad2c00] flex items-center justify-center">
              <span className="material-symbols-outlined material-symbols-fill">smart_toy</span>
            </div>
            <div>
              <h3 className="font-garamond font-bold text-lg text-[#281713]">AI Taste Preferences</h3>
              <p className="font-grotesk text-xs text-[#5c4038]">Customize flavor calibration</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#5c4038]">chevron_right</span>
        </button>
      </div>
    </div>
  );
};
