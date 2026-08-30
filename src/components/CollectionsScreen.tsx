import React from 'react';
import { Restaurant, ScreenType } from '../types';

interface CollectionsScreenProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (r: Restaurant) => void;
  onNavigate: (s: ScreenType) => void;
  isVegOnly?: boolean;
  onToggleVegOnly?: () => void;
}

export const CollectionsScreen: React.FC<CollectionsScreenProps> = ({
  restaurants,
  onSelectRestaurant,
  onNavigate,
  isVegOnly = false,
  onToggleVegOnly,
}) => {
  const normalCollections = [
    {
      id: 'biryani-trail',
      title: 'The Royal Biryani Trail',
      subtitle: 'From Nizami dum biryani in Hyderabad to Kozhikode Kaima feasts in Kerala',
      count: '4 spots',
      image: restaurants.find((r) => r.id === 'paradise-biryani')?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwui69H2nqjfTLgjmnr4hgF3_fd2owLCO6kipXwZIXuD1IvjXPmQQCVCQOQmNgZ8dBioAq_TmZq6jSWUc3pA3hAWpmqPfAbyNDzpLNed2H_Migk6IuTn0LY_y7x4nO0uXLFFR8uH9Kpj64sT1i3yt6Vrlwv8QKsyeQ0XDxX859Iv34ai-zi7rs-qp6uviHFDE4Dxj_djw-fA04RKrm8bzFtzNGK3cCiPF00WwYc_U_ps-DlDDx2KWkFQ',
      restaurantIds: ['paradise-biryani', 'bawarchi-restaurant', 'paragon-restaurant-kochi', 'cross-roads-vijayawada'],
    },
    {
      id: 'dosa-filter-coffee',
      title: 'Dosa & Filter Coffee Pilgrimage',
      subtitle: 'Crisp Bangalore benne dosas, Babai butter idlis, Guntur Sankar Vilas dosas & filter coffee',
      count: '4 spots',
      image: restaurants.find((r) => r.id === 'ctr-shri-sagar')?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwui69H2nqjfTLgjmnr4hgF3_fd2owLCO6kipXwZIXuD1IvjXPmQQCVCQOQmNgZ8dBioAq_TmZq6jSWUc3pA3hAWpmqPfAbyNDzpLNed2H_Migk6IuTn0LY_y7x4nO0uXLFFR8uH9Kpj64sT1i3yt6Vrlwv8QKsyeQ0XDxX859Iv34ai-zi7rs-qp6uviHFDE4Dxj_djw-fA04RKrm8bzFtzNGK3cCiPF00WwYc_U_ps-DlDDx2KWkFQ',
      restaurantIds: ['babai-hotel-vijayawada', 'sankar-vilas-guntur', 'ctr-shri-sagar', 'murali-krishna-nellore'],
    },
    {
      id: 'coastal-curries',
      title: 'Coastal Seafood & Claypot Curries',
      subtitle: 'Legendary Nellore Chepala Pulusu, Karimeen Pollichathu & Vizag prawn roasts',
      count: '3 spots',
      image: restaurants.find((r) => r.id === 'mayuri-chepala-pulusu')?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwlAvJp7sw8u4dpcwahZayRcygGCqTRyyo4oWTayr8GjPcS8JcMPDJL5994oBB3Wxlm0T-itPoZm7YCVnTG1UPhhDTTIBSS42ogp9lVZcRwzqYALEdPMVGOzNqOr0RKe-q-y4-LSmEfpa1dJMfRLXZjkR7WhgD7vPK5_Rn12aqWbNgDqC9vQB1uA7FVQuELkHGvgOZN0j7ZdJetBuXp43Nytk2zBF19oyYesA_BuAlHPIl2zQ2lkNjvA',
      restaurantIds: ['mayuri-chepala-pulusu', 'paragon-restaurant-kochi', 'sea-inn-raju-gari-dhaba'],
    },
    {
      id: 'cafes-desserts',
      title: 'Artisanal Roasteries & Pâtisseries',
      subtitle: 'Single-origin courtyard pour overs, Belgian chocolate desserts & art cafes',
      count: '3 spots',
      image: restaurants.find((r) => r.id === 'roastery-coffee-house')?.image || '',
      restaurantIds: ['roastery-coffee-house', 'concu', 'kashi-art-cafe'],
    },
  ];

  const vegCollections = [
    {
      id: 'veg-heritage-tiffins',
      title: 'Iconic South Indian Pure-Veg Tiffins',
      subtitle: '1942 Babai white butter idlis, Guntur Sankar Vilas wafer-thin dosas & CTR benne crispiness',
      count: '4 spots',
      image: restaurants.find((r) => r.id === 'babai-hotel-vijayawada')?.image || '',
      restaurantIds: ['babai-hotel-vijayawada', 'sankar-vilas-guntur', 'ctr-shri-sagar', 'murugan-idli-shop'],
    },
    {
      id: 'veg-andhra-bhojanam',
      title: 'Royal Pure-Veg Andhra Bhojanam & Thalis',
      subtitle: 'Sweet Magic 18-dish festive thali, Sri Krishna Vilas cashew pongal & Dharani Daspalla banana leaf',
      count: '4 spots',
      image: restaurants.find((r) => r.id === 'sweet-magic-vijayawada')?.image || '',
      restaurantIds: ['sweet-magic-vijayawada', 'sri-krishna-vilas-guntur', 'dharani-daspalla', 'komala-vilas-nellore'],
    },
    {
      id: 'veg-dosa-legends',
      title: 'Legendary Crisp & Karam Dosa Trail',
      subtitle: 'Sankar Vilas Ghee Dosa, Nellore Erra Karam Dosa & Chutneys 7-dip Steam Dosa',
      count: '3 spots',
      image: restaurants.find((r) => r.id === 'sankar-vilas-guntur')?.image || '',
      restaurantIds: ['sankar-vilas-guntur', 'murali-krishna-nellore', 'chutneys'],
    },
    {
      id: 'veg-cafes-desserts',
      title: 'Artisanal Roasteries & Vegetarian Patisseries',
      subtitle: 'Fresh roasted filter coffee, French entremets, artisanal sourdough & courtyard cafes',
      count: '3 spots',
      image: restaurants.find((r) => r.id === 'roastery-coffee-house')?.image || '',
      restaurantIds: ['roastery-coffee-house', 'concu', 'kashi-art-cafe'],
    },
  ];

  const collections = isVegOnly ? vegCollections : normalCollections;

  return (
    <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-16 py-10 md:py-14 flex flex-col gap-10">
      <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6 ${
        isVegOnly ? 'border-emerald-200' : 'border-[#ffded4]'
      }`}>
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-grotesk font-bold border ${
              isVegOnly
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-[#fff0eb] border-[#ffcfc2] text-[#e63900]'
            }`}>
              <span className="material-symbols-outlined text-sm material-symbols-fill">
                {isVegOnly ? 'eco' : 'auto_stories'}
              </span>
              <span>{isVegOnly ? '100% Pure Veg Curated Trails' : "Foodie Editor's Choice"}</span>
            </div>

            {onToggleVegOnly && (
              <button
                onClick={onToggleVegOnly}
                className={`px-3 py-1 rounded-full text-xs font-grotesk font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs border ${
                  isVegOnly
                    ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700'
                    : 'bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-300'
                }`}
              >
                <span>{isVegOnly ? '🌿 Veg Mode (Active)' : '🌱 Filter Veg Collections'}</span>
              </button>
            )}
          </div>

          <h1 className="font-garamond text-3xl sm:text-4xl md:text-5xl font-bold text-[#1e110d]">
            {isVegOnly ? 'Pure Vegetarian Culinary Collections' : 'Curated Food Collections'}
          </h1>
          <p className="font-grotesk text-base text-[#523932] mt-2 max-w-2xl font-medium">
            {isVegOnly
              ? 'Hand-scouted 100% pure vegetarian culinary journeys, heritage tiffin icons, and authentic royal thalis across South India.'
              : 'Hand-scouted culinary journeys engineered by our AI taste algorithm and local food experts.'}
          </p>
        </div>

        <button
          onClick={() => onNavigate('tonight-pick')}
          className={`self-start md:self-auto text-white px-5 py-2.5 rounded-xl font-grotesk text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${
            isVegOnly
              ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700'
              : 'bg-gradient-to-r from-[#ff4500] to-[#ff781f]'
          }`}
        >
          <span className="material-symbols-outlined text-base material-symbols-fill">auto_awesome</span>
          <span>{isVegOnly ? "Pick Pure Veg For Tonight" : "Surprise Me Tonight"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {collections.map((col) => (
          <div
            key={col.id}
            className={`bg-white rounded-3xl overflow-hidden soft-card-shadow border-2 flex flex-col group cursor-pointer transition-all duration-300 hover:-translate-y-1.5 ${
              isVegOnly ? 'border-emerald-200 hover:border-emerald-500' : 'border-[#ffded4] hover:border-[#ff9e7d]'
            }`}
          >
            <div className="h-64 relative bg-[#1e110d] overflow-hidden">
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e110d] via-[#1e110d]/40 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className={`text-xs font-grotesk font-bold px-3 py-1 rounded-full shadow-md ${
                  isVegOnly
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
                    : 'bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white'
                }`}>
                  {col.count}
                </span>
                <h3 className="font-garamond text-2xl sm:text-3xl font-bold mt-2.5 leading-tight drop-shadow-sm">
                  {col.title}
                </h3>
              </div>
            </div>

            <div className="p-6 flex flex-col justify-between flex-grow gap-5">
              <p className="font-grotesk text-sm text-[#523932] leading-relaxed font-medium">
                {col.subtitle}
              </p>

              <div className={`flex flex-col gap-2.5 pt-4 border-t ${
                isVegOnly ? 'border-emerald-100' : 'border-[#ffebe4]'
              }`}>
                <span className="text-[11px] font-grotesk font-bold text-[#785950] uppercase tracking-wider">
                  Featured Restaurants:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {col.restaurantIds.map((rid) => {
                    const rest = restaurants.find((r) => r.id === rid);
                    if (!rest) return null;
                    return (
                      <button
                        key={rid}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRestaurant(rest);
                        }}
                        className={`text-left font-grotesk text-xs font-bold px-3 py-2 rounded-xl flex items-center justify-between transition-all cursor-pointer border ${
                          isVegOnly
                            ? 'text-[#1e110d] hover:text-emerald-800 bg-emerald-50/50 hover:bg-emerald-100/70 border-emerald-200 hover:border-emerald-500'
                            : 'text-[#1e110d] hover:text-[#ff4500] bg-[#fff8f5] hover:bg-[#fff0eb] border-[#ffded4] hover:border-[#ff4500]'
                        }`}
                      >
                        <span className="truncate">{rest.name}</span>
                        <span className={`text-xs ml-1 ${isVegOnly ? 'text-emerald-700' : 'text-[#ff4500]'}`}>→</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
