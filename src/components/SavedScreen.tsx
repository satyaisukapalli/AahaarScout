import React from 'react';
import { Restaurant, ScreenType } from '../types';

interface SavedScreenProps {
  savedRestaurants: Restaurant[];
  onSelectRestaurant: (r: Restaurant) => void;
  onRemoveSave: (r: Restaurant) => void;
  onNavigate: (s: ScreenType) => void;
}

export const SavedScreen: React.FC<SavedScreenProps> = ({
  savedRestaurants,
  onSelectRestaurant,
  onRemoveSave,
  onNavigate,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-16 py-10 md:py-14 flex flex-col gap-8 min-h-[60vh]">
      <div className="flex justify-between items-end border-b border-[#e5beb3] pb-4">
        <div>
          <h1 className="font-garamond text-3xl sm:text-4xl md:text-5xl font-semibold text-[#281713]">
            Saved Places
          </h1>
          <p className="font-grotesk text-sm text-[#5c4038] mt-1">
            {savedRestaurants.length} restaurants saved for your upcoming dinners
          </p>
        </div>
      </div>

      {savedRestaurants.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center flex flex-col items-center gap-4 soft-card-shadow border border-[#e5beb3]">
          <div className="w-16 h-16 rounded-full bg-[#ffe9e4] text-[#ad2c00] flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">bookmark_border</span>
          </div>
          <h3 className="font-garamond text-2xl font-semibold text-[#281713]">
            No saved restaurants yet
          </h3>
          <p className="font-grotesk text-sm text-[#5c4038] max-w-md">
            Click the bookmark icon on any restaurant or search result to save it to your personal list.
          </p>
          <button
            onClick={() => onNavigate('search')}
            className="mt-2 bg-[#ad2c00] hover:bg-[#872100] text-white px-6 py-2.5 rounded-xl font-grotesk text-sm font-semibold transition-colors cursor-pointer"
          >
            Explore Top Food
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedRestaurants.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl overflow-hidden soft-card-shadow border border-[#e5beb3]/40 flex flex-col group"
            >
              <div className="h-48 w-full relative bg-[#ffe9e4] overflow-hidden">
                <img
                  src={r.image}
                  alt={r.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => onRemoveSave(r)}
                  title="Remove from saved"
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white text-[#ad2c00] p-2 rounded-full shadow-md transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg material-symbols-fill">bookmark</span>
                </button>
              </div>

              <div className="p-5 flex flex-col justify-between flex-grow gap-3">
                <div>
                  <h3
                    onClick={() => onSelectRestaurant(r)}
                    className="font-garamond text-xl font-bold text-[#281713] hover:text-[#ad2c00] transition-colors cursor-pointer"
                  >
                    {r.name}
                  </h3>
                  <p className="font-grotesk text-xs text-[#5c4038] mt-0.5">
                    {r.cuisine} • {r.neighborhood}
                  </p>
                  <p className="font-grotesk text-xs text-[#281713] mt-2 italic line-clamp-2">
                    "{r.aiReasoning}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#fbdcd4] flex gap-2">
                  <button
                    onClick={() => onSelectRestaurant(r)}
                    className="flex-1 bg-[#ad2c00] hover:bg-[#872100] text-white font-grotesk text-xs font-semibold py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
