import React from 'react';
import { Restaurant, ScreenType } from '../types';

interface CollectionsScreenProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (r: Restaurant) => void;
  onNavigate: (s: ScreenType) => void;
}

export const CollectionsScreen: React.FC<CollectionsScreenProps> = ({
  restaurants,
  onSelectRestaurant,
  onNavigate,
}) => {
  const collections = [
    {
      id: 'biryani-trail',
      title: 'The Legendary Biryani Trail',
      subtitle: 'From 1953 classics to spicy midnight favorites',
      count: '4 spots',
      image: restaurants.find((r) => r.id === 'paradise-biryani')?.image || '',
      restaurantIds: ['paradise-biryani', 'bawarchi-restaurant', 'cafe-bahar'],
    },
    {
      id: 'romantic-dining',
      title: 'Romantic & Intimate Dinners',
      subtitle: 'Low ambient noise, candlelit tables and signature wine pairings',
      count: '3 spots',
      image: restaurants.find((r) => r.id === 'l-osteria-moderna')?.image || '',
      restaurantIds: ['l-osteria-moderna', 'kumi-modern-japanese'],
    },
    {
      id: 'coffee-desserts',
      title: 'Artisanal Roasteries & Pâtisseries',
      subtitle: 'Single-origin pour overs and French handcrafted delicacies',
      count: '2 spots',
      image: restaurants.find((r) => r.id === 'concu')?.image || '',
      restaurantIds: ['roastery-coffee-house', 'concu'],
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-16 py-10 md:py-14 flex flex-col gap-10">
      <div>
        <h1 className="font-garamond text-3xl sm:text-4xl md:text-5xl font-semibold text-[#281713]">
          Curated Food Collections
        </h1>
        <p className="font-grotesk text-sm sm:text-base text-[#5c4038] mt-1">
          Hand-scouted culinary journeys engineered by our AI taste algorithm.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className="bg-white rounded-2xl overflow-hidden soft-card-shadow border border-[#e5beb3]/40 flex flex-col group cursor-pointer"
          >
            <div className="h-56 relative bg-[#281713] overflow-hidden">
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="bg-[#ad2c00] text-xs font-grotesk font-semibold px-2.5 py-1 rounded-full">
                  {col.count}
                </span>
                <h3 className="font-garamond text-2xl font-bold mt-2 leading-tight">
                  {col.title}
                </h3>
              </div>
            </div>

            <div className="p-5 flex flex-col justify-between flex-grow gap-4">
              <p className="font-grotesk text-xs sm:text-sm text-[#5c4038]">
                {col.subtitle}
              </p>

              <div className="flex flex-col gap-2 pt-2 border-t border-[#fbdcd4]">
                {col.restaurantIds.map((rid) => {
                  const rest = restaurants.find((r) => r.id === rid);
                  if (!rest) return null;
                  return (
                    <button
                      key={rid}
                      onClick={() => onSelectRestaurant(rest)}
                      className="text-left font-grotesk text-xs font-semibold text-[#281713] hover:text-[#ad2c00] flex items-center justify-between py-1 group/item cursor-pointer"
                    >
                      <span>• {rest.name}</span>
                      <span className="text-[11px] text-[#ad2c00] opacity-0 group-hover/item:opacity-100 transition-opacity">
                        View &rarr;
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
