import React, { useState } from 'react';
import { Restaurant, ScreenType } from '../types';
import { GoogleMapView } from './GoogleMapView';

interface CityScreenProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (r: Restaurant) => void;
  onNavigate: (s: ScreenType) => void;
  isVegOnly: boolean;
  onToggleVegOnly: () => void;
}

const SOUTH_INDIAN_CITIES = [
  { 
    name: 'Hyderabad', 
    state: 'Telangana', 
    desc: 'Biryani capital, Nizami heritage, spicy curries & third-wave cafes',
    vegDesc: 'Chutneys 7-dip butter dosas, Tatva gourmet pure veg fine dining & Irani chai with Osmania biscuits',
  },
  { 
    name: 'Bangalore', 
    state: 'Karnataka', 
    desc: 'Craft microbreweries, butter benne dosas & cosmopolitan food culture',
    vegDesc: 'Legendary CTR Benne Masala Dosas, 1924 MTR Rava Idlis & authentic degree filter coffee',
  },
  { 
    name: 'Chennai', 
    state: 'Tamil Nadu', 
    desc: 'Chettinad feasts, coastal seafood, filter coffee & jasmine-soft idlis',
    vegDesc: 'Murugan Ghee Podi Idlis with 4 chutneys, Mylapore pure veg thalis & brass tumbler filter coffee',
  },
  { 
    name: 'Kochi', 
    state: 'Kerala', 
    desc: 'Malabar biryani, karimeen pollichathu, coconut curries & art cafes',
    vegDesc: 'Grand 22-dish Kerala Sadyas on banana leaf, lacy appams with coconut stew & Fort Kochi art cafes',
  },
  { 
    name: 'Visakhapatnam', 
    state: 'Andhra Pradesh', 
    desc: 'Fiery Andhra bhojanam, coastal prawn iguru & beachside dhabas',
    vegDesc: 'Dharani Daspalla 14-dish Pure Veg Andhra Bhojanam, MLA Upma Pesarattu & Bellam Pootharekulu',
  },
  { 
    name: 'Nellore', 
    state: 'Andhra Pradesh', 
    desc: 'World-famous Nellore Chepala Pulusu, Ghee Erra Karam Dosa & claypot seafood',
    vegDesc: 'Murali Krishna Nellore Ghee Erra Karam Dosa, Komala Vilas heritage tiffins & Malai Kaja',
  },
  { 
    name: 'Vijayawada', 
    state: 'Andhra Pradesh', 
    desc: 'Legendary Babai Butter Idlis, Krishna delta feasts, Ulavacharu biryani & MG Road sweets',
    vegDesc: '1942 Babai Hotel White Butter (Venna) Idlis, Sweet Magic 18-dish Pure Veg Thali & Pootharekulu',
  },
  { 
    name: 'Guntur', 
    state: 'Andhra Pradesh', 
    desc: '1950s Sankar Vilas Ghee Dosas, world-famous fiery chillies, gongura mutton & ragi sangati',
    vegDesc: 'Sankar Vilas wafer-thin Ghee Masala Dosa, Sri Krishna Vilas cashew ghee pongal & Brodipet punugulu',
  },
];

export const CityScreen: React.FC<CityScreenProps> = ({
  restaurants,
  onSelectRestaurant,
  onNavigate,
  isVegOnly,
  onToggleVegOnly,
}) => {
  const [activeCity, setActiveCity] = useState('Hyderabad');
  const [cityViewMode, setCityViewMode] = useState<'grid' | 'map'>('grid');

  const pool = isVegOnly ? restaurants.filter(r => r.isVeg || r.isPureVeg) : restaurants;

  const cityRestaurants = pool.filter(r =>
    r.city.toLowerCase() === activeCity.toLowerCase()
  );

  const currentCityInfo = SOUTH_INDIAN_CITIES.find(c => c.name === activeCity) || SOUTH_INDIAN_CITIES[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-16 py-10 md:py-14 flex flex-col gap-10">
      <header className="text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-grotesk font-bold border ${
              isVegOnly
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-[#fff0eb] border-[#ffcfc2] text-[#e63900]'
            }`}>
              <span className="text-sm">{isVegOnly ? '🌱' : '📍'}</span>
              <span>{isVegOnly ? '100% Pure Veg Culinary Guide' : 'South India Culinary Hubs'}</span>
            </div>

            <button
              onClick={onToggleVegOnly}
              className={`px-3 py-1 rounded-full text-xs font-grotesk font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs border ${
                isVegOnly
                  ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700'
                  : 'bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}
            >
              <span>{isVegOnly ? '🌿 Veg Mode (Active)' : '🌱 Show Only Veg'}</span>
            </button>
          </div>

          <h1 className="font-garamond text-4xl sm:text-5xl md:text-6xl font-semibold text-[#281713] mb-3">
            {isVegOnly ? 'Pure Veg Food in ' : 'Best Food in '}
            <span className={isVegOnly ? 'text-emerald-700' : 'text-[#ff4500]'}>{activeCity}</span>
          </h1>
          <p className="font-grotesk text-base sm:text-lg text-[#5c4038] max-w-2xl font-medium">
            {isVegOnly ? currentCityInfo.vegDesc : currentCityInfo.desc}
          </p>
        </div>

        {/* City Filter Pills */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-end">
          {SOUTH_INDIAN_CITIES.map((c) => {
            const isSelected = activeCity === c.name;
            const count = pool.filter(r => r.city.toLowerCase() === c.name.toLowerCase()).length;
            return (
              <button
                key={c.name}
                onClick={() => setActiveCity(c.name)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-grotesk font-bold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5 ${
                  isSelected
                    ? isVegOnly
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white border border-emerald-600 shadow-sm scale-105'
                      : 'bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white border border-[#ff4500] shadow-sm scale-105'
                    : isVegOnly
                      ? 'bg-white border border-emerald-200 text-[#1e110d] hover:border-emerald-500 hover:text-emerald-700'
                      : 'bg-white border border-[#ffded4] text-[#331c15] hover:border-[#ff4500] hover:text-[#ff4500]'
                }`}
              >
                <span>{c.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                  isSelected 
                    ? 'bg-white/25 text-white' 
                    : isVegOnly 
                      ? 'bg-emerald-50 text-emerald-800' 
                      : 'bg-[#fff0eb] text-[#e63900]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Trending in selected city */}
      <section>
        <div className={`flex flex-col sm:flex-row justify-between sm:items-end gap-3 mb-6 border-b pb-3 ${
          isVegOnly ? 'border-emerald-200' : 'border-[#ffded4]'
        }`}>
          <div>
            <h2 className="font-garamond text-2xl sm:text-3xl font-semibold text-[#1e110d] flex items-center gap-2">
              <span className={`material-symbols-outlined material-symbols-fill animate-pulse ${
                isVegOnly ? 'text-emerald-600' : 'text-[#ff4500]'
              }`}>
                {isVegOnly ? 'eco' : 'local_fire_department'}
              </span>
              <span>{isVegOnly ? 'Top Pure Veg Spots' : 'Top Curated'} in {activeCity}</span>
            </h2>
            <span className="text-xs font-grotesk text-[#785950] font-medium">
              Showing {cityRestaurants.length} {isVegOnly ? 'verified pure vegetarian restaurants' : 'restaurants'} in {activeCity}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Grid vs Map Toggle */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setCityViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-grotesk font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  cityViewMode === 'grid'
                    ? isVegOnly ? 'bg-emerald-600 text-white shadow-xs' : 'bg-[#ff4500] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="material-symbols-outlined text-sm">grid_view</span>
                <span>Cards</span>
              </button>
              <button
                onClick={() => setCityViewMode('map')}
                className={`px-3 py-1.5 rounded-lg text-xs font-grotesk font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  cityViewMode === 'map'
                    ? isVegOnly ? 'bg-emerald-600 text-white shadow-xs' : 'bg-[#ff4500] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="material-symbols-outlined text-sm">map</span>
                <span>Google Map</span>
              </button>
            </div>

            <button 
              onClick={() => onNavigate('search')}
              className={`font-grotesk text-sm font-bold hover:underline cursor-pointer flex items-center gap-1 ${
                isVegOnly ? 'text-emerald-700 hover:text-emerald-800' : 'text-[#ff4500] hover:text-[#e63900]'
              }`}
            >
              <span>Search All</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>

        {cityViewMode === 'map' ? (
          <div className="mb-6">
            <GoogleMapView
              restaurants={cityRestaurants}
              city={activeCity}
              isVegOnly={isVegOnly}
              onSelectRestaurant={onSelectRestaurant}
              className="h-[520px] w-full"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cityRestaurants.map((r) => (
              <article
                key={r.id}
                onClick={() => onSelectRestaurant(r)}
                className={`bg-white rounded-2xl overflow-hidden soft-card-shadow hover:-translate-y-1.5 transition-all cursor-pointer border flex flex-col group ${
                  isVegOnly
                    ? 'border-emerald-200 hover:border-emerald-500'
                    : 'border-[#ffded4] hover:border-[#ff9e7d]'
                }`}
              >
                <div className="h-48 w-full relative bg-[#ffece5] overflow-hidden">
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className={`absolute top-3 right-3 text-white font-grotesk text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md ${
                    isVegOnly
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600'
                      : 'bg-gradient-to-r from-[#ff4500] to-[#ff8c00]'
                  }`}>
                    <span className="material-symbols-outlined text-[13px] material-symbols-fill text-yellow-200">star</span>
                    <span>{r.rating}</span>
                  </div>
                  {(r.isPureVeg || r.isVeg) && (
                    <div className="absolute top-3 left-3 bg-emerald-700/90 backdrop-blur-xs text-white font-grotesk text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300/40 flex items-center gap-1 shadow-xs">
                      <span>🌱</span>
                      <span>Pure Veg</span>
                    </div>
                  )}
                  {r.vibe && (
                    <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white font-grotesk text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20">
                      {r.vibe} Vibe
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className={`font-garamond text-xl font-semibold text-[#1e110d] transition-colors mb-1 ${
                      isVegOnly ? 'group-hover:text-emerald-700' : 'group-hover:text-[#ff4500]'
                    }`}>{r.name}</h3>
                    <p className="font-grotesk text-xs text-[#523932] uppercase tracking-wider mb-2 font-semibold">
                      {r.cuisine.split('•')[0]} • {r.neighborhood}
                    </p>
                    <p className="font-grotesk text-xs text-[#785950] line-clamp-2 mb-3">
                      {r.aiInsight || r.aiReasoning}
                    </p>
                  </div>
                  <div className={`pt-2 border-t flex items-center justify-between ${
                    isVegOnly ? 'border-emerald-100' : 'border-[#ffebe4]'
                  }`}>
                    <span className={`text-xs font-grotesk font-bold ${
                      isVegOnly ? 'text-emerald-800' : 'text-[#e63900]'
                    }`}>{r.priceForTwo || r.priceRange}</span>
                    <span className={`text-xs font-grotesk font-bold group-hover:translate-x-0.5 transition-transform flex items-center ${
                      isVegOnly ? 'text-emerald-700' : 'text-[#ff4500]'
                    }`}>
                      Explore <span className="material-symbols-outlined text-xs">chevron_right</span>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Decide for Me Banner */}
      <section>
        <div className={`relative overflow-hidden rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-xl border-2 ${
          isVegOnly
            ? 'bg-gradient-to-r from-[#edf9ef] via-[#f4faf4] to-[#edf9ef] border-emerald-300'
            : 'bg-gradient-to-r from-[#fff0eb] via-[#fff5ee] to-[#fff0eb] border-[#ffded4]'
        }`}>
          <div className={`absolute -right-10 -bottom-10 w-60 h-60 rounded-full blur-2xl pointer-events-none ${
            isVegOnly ? 'bg-gradient-to-tr from-emerald-500/20 to-transparent' : 'bg-gradient-to-tr from-[#ff4500]/20 to-transparent'
          }`} />
          <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">
            <h2 className="font-garamond text-3xl md:text-4xl font-semibold text-[#1e110d] mb-2 flex items-center gap-3">
              {isVegOnly ? `Craving Pure Veg in ${activeCity}?` : `Can't Decide in ${activeCity}?`}
              <span className={`material-symbols-outlined text-3xl animate-pulse ${
                isVegOnly ? 'text-emerald-600' : 'text-[#ff4500]'
              }`}>auto_awesome</span>
            </h2>
            <p className="font-grotesk text-base text-[#523932] font-medium">
              {isVegOnly
                ? `Let FoodieBot instantly curate the perfect 100% pure vegetarian dining spot, crisp ghee dosa, or sattvic thali in ${activeCity}.`
                : `Let FoodieBot curate a dining experience tailored to your exact cravings, location in ${activeCity}, and budget.`}
            </p>
          </div>
          <div className="relative z-10">
            <button
              onClick={() => onNavigate('tonight-pick')}
              className={`text-white font-grotesk text-sm font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 cursor-pointer active:scale-95 ${
                isVegOnly
                  ? 'bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700'
                  : 'bg-gradient-to-r from-[#ff4500] via-[#e63900] to-[#ff781f] hover:from-[#e63900] hover:to-[#ff5e1a]'
              }`}
            >
              <span className="material-symbols-outlined">{isVegOnly ? 'eco' : 'restaurant'}</span>
              {isVegOnly ? 'Pick Pure Veg For Me' : 'Decide for Me'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
