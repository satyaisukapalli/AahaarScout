import React from 'react';
import { Restaurant, ScreenType } from '../types';
import { CrowdMeter } from './CrowdMeter';

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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#ffded4] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff0eb] border border-[#ffcfc2] text-[#e63900] text-xs font-grotesk font-bold mb-2">
            <span className="material-symbols-outlined text-sm material-symbols-fill text-[#ff4500]">bookmark</span>
            <span>Personal Food Wishlist</span>
          </div>
          <h1 className="font-garamond text-3xl sm:text-4xl md:text-5xl font-bold text-[#1e110d]">
            Saved Places
          </h1>
          <p className="font-grotesk text-base text-[#523932] mt-1 font-medium">
            {savedRestaurants.length} {savedRestaurants.length === 1 ? 'place' : 'places'} curated for your upcoming food outings
          </p>
        </div>

        {savedRestaurants.length > 0 && (
          <button
            onClick={() => onNavigate('tonight-pick')}
            className="self-start sm:self-auto bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white px-4 py-2 rounded-xl font-grotesk text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            Decide Among Saved
          </button>
        )}
      </div>

      {savedRestaurants.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center flex flex-col items-center gap-5 soft-card-shadow border-2 border-[#ffded4] max-w-xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#ffebe4] to-[#fff3eb] border-2 border-[#ffcfc2] text-[#ff4500] flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-4xl material-symbols-fill">bookmark_border</span>
          </div>
          <h3 className="font-garamond text-2xl sm:text-3xl font-bold text-[#1e110d]">
            No saved restaurants yet
          </h3>
          <p className="font-grotesk text-sm sm:text-base text-[#523932] max-w-md font-medium leading-relaxed">
            Click the bookmark icon on any restaurant or search result to save it to your personal food wishlist.
          </p>
          <button
            onClick={() => onNavigate('search')}
            className="mt-2 bg-gradient-to-r from-[#ff4500] via-[#e63900] to-[#ff781f] hover:from-[#e63900] hover:to-[#ff5e1a] text-white px-7 py-3 rounded-xl font-grotesk text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            Explore Top Food
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedRestaurants.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl overflow-hidden soft-card-shadow border-2 border-[#ffded4] hover:border-[#ff9e7d] flex flex-col group transition-all duration-300 hover:-translate-y-1.5"
            >
              <div className="h-48 w-full relative bg-[#ffece5] overflow-hidden">
                <img
                  src={r.image}
                  alt={r.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={() => onRemoveSave(r)}
                  title="Remove from saved"
                  className="absolute top-3 right-3 bg-white/95 hover:bg-white text-[#ff4500] p-2 rounded-full shadow-md transition-all hover:scale-110 cursor-pointer border border-[#ffcfc2]"
                >
                  <span className="material-symbols-outlined text-lg material-symbols-fill">bookmark</span>
                </button>
                <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white font-grotesk text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                  {r.city}
                </div>
              </div>

              <div className="p-5 flex flex-col justify-between flex-grow gap-3">
                <div>
                  <h3
                    onClick={() => onSelectRestaurant(r)}
                    className="font-garamond text-xl font-bold text-[#1e110d] hover:text-[#ff4500] transition-colors cursor-pointer"
                  >
                    {r.name}
                  </h3>
                  <p className="font-grotesk text-xs text-[#523932] mt-0.5 font-semibold">
                    {r.cuisine.split('•')[0]} • {r.neighborhood}
                  </p>
                  <p className="font-grotesk text-xs text-[#785950] mt-2 italic line-clamp-2">
                    "{r.aiReasoning || r.aiInsight}"
                  </p>
                  <div className="mt-2.5">
                    <CrowdMeter restaurant={r} variant="compact" />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#ffebe4] flex items-center justify-between gap-2">
                  <span className="font-grotesk text-xs font-bold text-[#e63900]">{r.priceForTwo || r.priceRange}</span>
                  <button
                    onClick={() => onSelectRestaurant(r)}
                    className="bg-gradient-to-r from-[#ff4500] to-[#ff781f] hover:from-[#e63900] hover:to-[#ff5e1a] text-white font-grotesk text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
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
