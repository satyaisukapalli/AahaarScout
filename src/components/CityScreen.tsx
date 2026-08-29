import React, { useState } from 'react';
import { Restaurant, ScreenType } from '../types';

interface CityScreenProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (r: Restaurant) => void;
  onNavigate: (s: ScreenType) => void;
}

const SOUTH_INDIAN_CITIES = [
  { name: 'Hyderabad', state: 'Telangana', desc: 'Biryani capital, Nizami heritage, spicy curries & third-wave cafes' },
  { name: 'Bangalore', state: 'Karnataka', desc: 'Craft microbreweries, butter benne dosas & cosmopolitan food culture' },
  { name: 'Chennai', state: 'Tamil Nadu', desc: 'Chettinad feasts, coastal seafood, filter coffee & jasmine-soft idlis' },
  { name: 'Kochi', state: 'Kerala', desc: 'Malabar biryani, karimeen pollichathu, coconut curries & art cafes' },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', desc: 'Fiery Andhra bhojanam, coastal prawn iguru & beachside dhabas' },
  { name: 'Nellore', state: 'Andhra Pradesh', desc: 'World-famous Nellore Chepala Pulusu, Ghee Erra Karam Dosa & claypot seafood' },
];

export const CityScreen: React.FC<CityScreenProps> = ({
  restaurants,
  onSelectRestaurant,
  onNavigate,
}) => {
  const [activeCity, setActiveCity] = useState('Hyderabad');

  const cityRestaurants = restaurants.filter(r =>
    r.city.toLowerCase() === activeCity.toLowerCase()
  );

  const currentCityInfo = SOUTH_INDIAN_CITIES.find(c => c.name === activeCity) || SOUTH_INDIAN_CITIES[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-16 py-10 md:py-14 flex flex-col gap-10">
      <header className="text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff0eb] border border-[#ffcfc2] text-[#e63900] text-xs font-grotesk font-bold mb-3">
            <span className="material-symbols-outlined text-sm material-symbols-fill text-[#ff4500]">location_city</span>
            <span>South India Culinary Hubs</span>
          </div>
          <h1 className="font-garamond text-4xl sm:text-5xl md:text-6xl font-semibold text-[#281713] mb-3">
            Best Food in <span className="text-[#ff4500]">{activeCity}</span>
          </h1>
          <p className="font-grotesk text-base sm:text-lg text-[#5c4038] max-w-2xl font-medium">
            {currentCityInfo.desc}
          </p>
        </div>

        {/* City Filter Pills */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-end">
          {SOUTH_INDIAN_CITIES.map((c) => {
            const isSelected = activeCity === c.name;
            return (
              <button
                key={c.name}
                onClick={() => setActiveCity(c.name)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-grotesk font-bold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white border border-[#ff4500] shadow-sm scale-105'
                    : 'bg-white border border-[#ffded4] text-[#331c15] hover:border-[#ff4500] hover:text-[#ff4500]'
                }`}
              >
                <span>{c.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-[#fff0eb] text-[#e63900]'
                }`}>
                  {restaurants.filter(r => r.city.toLowerCase() === c.name.toLowerCase()).length}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Trending in selected city */}
      <section>
        <div className="flex justify-between items-end mb-6 border-b border-[#ffded4] pb-3">
          <h2 className="font-garamond text-2xl sm:text-3xl font-semibold text-[#1e110d] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff4500] material-symbols-fill animate-pulse">local_fire_department</span>
            <span>Top Curated in {activeCity}</span>
          </h2>
          <button 
            onClick={() => onNavigate('search')}
            className="font-grotesk text-sm font-bold text-[#ff4500] hover:text-[#e63900] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Search All in {activeCity}</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cityRestaurants.map((r) => (
            <article
              key={r.id}
              onClick={() => onSelectRestaurant(r)}
              className="bg-white rounded-2xl overflow-hidden soft-card-shadow hover:-translate-y-1.5 transition-all cursor-pointer border border-[#ffded4] hover:border-[#ff9e7d] flex flex-col group"
            >
              <div className="h-48 w-full relative bg-[#ffece5] overflow-hidden">
                <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 bg-gradient-to-r from-[#ff4500] to-[#ff8c00] text-white font-grotesk text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <span className="material-symbols-outlined text-[13px] material-symbols-fill text-yellow-200">star</span>
                  <span>{r.rating}</span>
                </div>
                {r.vibe && (
                  <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white font-grotesk text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20">
                    {r.vibe} Vibe
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="font-garamond text-xl font-semibold text-[#1e110d] group-hover:text-[#ff4500] transition-colors mb-1">{r.name}</h3>
                  <p className="font-grotesk text-xs text-[#523932] uppercase tracking-wider mb-2 font-semibold">
                    {r.cuisine.split('•')[0]} • {r.neighborhood}
                  </p>
                  <p className="font-grotesk text-xs text-[#785950] line-clamp-2 mb-3">
                    {r.aiInsight || r.aiReasoning}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#ffebe4] flex items-center justify-between">
                  <span className="text-xs font-grotesk font-bold text-[#e63900]">{r.priceForTwo || r.priceRange}</span>
                  <span className="text-xs font-grotesk font-bold text-[#ff4500] group-hover:translate-x-0.5 transition-transform flex items-center">
                    Explore <span className="material-symbols-outlined text-xs">chevron_right</span>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Decide for Me Banner */}
      <section>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#fff0eb] via-[#fff5ee] to-[#fff0eb] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-xl border-2 border-[#ffded4]">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-gradient-to-tr from-[#ff4500]/20 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">
            <h2 className="font-garamond text-3xl md:text-4xl font-semibold text-[#1e110d] mb-2 flex items-center gap-3">
              Can't Decide in {activeCity}?
              <span className="material-symbols-outlined text-[#ff4500] text-3xl animate-pulse">auto_awesome</span>
            </h2>
            <p className="font-grotesk text-base text-[#523932] font-medium">
              Let FoodieBot curate a dining experience tailored to your exact cravings, location in {activeCity}, and budget.
            </p>
          </div>
          <div className="relative z-10">
            <button
              onClick={() => onNavigate('tonight-pick')}
              className="bg-gradient-to-r from-[#ff4500] via-[#e63900] to-[#ff781f] hover:from-[#e63900] hover:to-[#ff5e1a] text-white font-grotesk text-sm font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined">restaurant</span>
              Decide for Me
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
