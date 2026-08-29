import React from 'react';
import { Restaurant, ScreenType } from '../types';

interface CityScreenProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (r: Restaurant) => void;
  onNavigate: (s: ScreenType) => void;
}

export const CityScreen: React.FC<CityScreenProps> = ({
  restaurants,
  onSelectRestaurant,
  onNavigate,
}) => {
  const cityRestaurants = restaurants.filter(r =>
    ['paradise-biryani', 'pista-house', 'chutneys', 'roastery-coffee-house'].includes(r.id)
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-16 py-10 md:py-14 flex flex-col gap-12">
      <header className="text-center md:text-left">
        <h1 className="font-garamond text-4xl sm:text-5xl md:text-6xl font-semibold text-[#281713] mb-4">
          Best Food in Hyderabad
        </h1>
        <p className="font-grotesk text-base sm:text-lg text-[#5c4038] max-w-2xl">
          A definitive guide to the city's culinary landscape, powered by AI and curated by experts. From legendary biryani houses to modern cafes, discover the true taste of Hyderabad.
        </p>
      </header>

      {/* Trending Now */}
      <section>
        <div className="flex justify-between items-end mb-6 border-b border-[#ffded4] pb-3">
          <h2 className="font-garamond text-2xl sm:text-3xl font-semibold text-[#1e110d] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff4500] material-symbols-fill animate-pulse">local_fire_department</span>
            Trending Now
          </h2>
          <button 
            onClick={() => onNavigate('search')}
            className="font-grotesk text-sm font-bold text-[#ff4500] hover:text-[#e63900] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cityRestaurants.map((r) => (
            <article
              key={r.id}
              onClick={() => onSelectRestaurant(r)}
              className="bg-white rounded-2xl overflow-hidden soft-card-shadow hover:-translate-y-1.5 transition-all cursor-pointer border border-[#ffded4] hover:border-[#ff9e7d] flex flex-col group"
            >
              <div className="h-48 w-full relative bg-[#ffece5]">
                <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 bg-gradient-to-r from-[#ff4500] to-[#ff8c00] text-white font-grotesk text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <span className="material-symbols-outlined text-[13px] material-symbols-fill text-yellow-200">star</span>
                  <span>{r.rating}</span>
                </div>
              </div>
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="font-garamond text-xl font-semibold text-[#1e110d] group-hover:text-[#ff4500] transition-colors mb-1">{r.name}</h3>
                  <p className="font-grotesk text-xs text-[#523932] uppercase tracking-wider mb-3 font-semibold">
                    {r.cuisine.split('•')[0]} • {r.neighborhood}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {r.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-[#fff0eb] text-[#e63900] border border-[#ffcfc2] text-xs rounded-md font-grotesk font-semibold">
                      {tag}
                    </span>
                  ))}
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
              Can't Decide?
              <span className="material-symbols-outlined text-[#ff4500] text-3xl animate-pulse">auto_awesome</span>
            </h2>
            <p className="font-grotesk text-base text-[#523932] font-medium">
              Let FoodieBot curate a dining experience tailored to your exact cravings, location, and budget.
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
