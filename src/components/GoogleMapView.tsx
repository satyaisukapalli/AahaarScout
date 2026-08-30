import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { Restaurant } from '../types';
import { CITY_COORDINATES } from '../data/restaurants';

interface GoogleMapViewProps {
  restaurants: Restaurant[];
  selectedRestaurant?: Restaurant | null;
  onSelectRestaurant?: (r: Restaurant) => void;
  onBookTable?: (r: Restaurant) => void;
  city?: string;
  className?: string;
  isVegOnly?: boolean;
  center?: { lat: number; lng: number };
  zoom?: number;
  showControls?: boolean;
}

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  restaurants,
  selectedRestaurant,
  onSelectRestaurant,
  onBookTable,
  city = 'All Cities',
  className = 'h-[500px] w-full',
  isVegOnly = false,
  center: customCenter,
  zoom: customZoom,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(selectedRestaurant || null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(() => {
    if (customCenter) return customCenter;
    if (selectedRestaurant?.coordinates) return selectedRestaurant.coordinates;
    const cityCoord = CITY_COORDINATES[city] || CITY_COORDINATES['Hyderabad'];
    return { lat: cityCoord.lat, lng: cityCoord.lng };
  });
  const [mapZoom, setMapZoom] = useState<number>(() => {
    if (customZoom) return customZoom;
    if (selectedRestaurant?.coordinates) return 15;
    const cityCoord = CITY_COORDINATES[city] || CITY_COORDINATES['Hyderabad'];
    return cityCoord.zoom;
  });

  useEffect(() => {
    if (selectedRestaurant?.coordinates) {
      setActiveRestaurant(selectedRestaurant);
      setMapCenter(selectedRestaurant.coordinates);
      setMapZoom(15);
    }
  }, [selectedRestaurant]);

  useEffect(() => {
    if (city && CITY_COORDINATES[city]) {
      setMapCenter({ lat: CITY_COORDINATES[city].lat, lng: CITY_COORDINATES[city].lng });
      setMapZoom(CITY_COORDINATES[city].zoom);
    }
  }, [city]);

  // If no API key is provided, we still render a graceful interactive maps fallback with clear directions & setup prompt
  const hasValidApiKey = Boolean(apiKey && apiKey.length > 5);

  return (
    <div className={`relative rounded-3xl overflow-hidden border-2 shadow-sm ${
      isVegOnly ? 'border-emerald-200' : 'border-[#ffded4]'
    } ${className}`}>
      {hasValidApiKey ? (
        <APIProvider apiKey={apiKey}>
          <Map
            style={{ width: '100%', height: '100%' }}
            center={mapCenter}
            zoom={mapZoom}
            mapId="DEMO_MAP_ID"
            gestureHandling="greedy"
            disableDefaultUI={false}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          >
            {restaurants.map((rest) => {
              if (!rest.coordinates) return null;
              const isSelected = activeRestaurant?.id === rest.id;
              const isVeg = rest.isVeg || rest.isPureVeg;

              return (
                <AdvancedMarker
                  key={rest.id}
                  position={rest.coordinates}
                  onClick={() => {
                    setActiveRestaurant(rest);
                    if (onSelectRestaurant) onSelectRestaurant(rest);
                  }}
                  title={rest.name}
                >
                  <Pin
                    background={
                      isSelected
                        ? '#e63900'
                        : isVeg
                        ? '#16a34a'
                        : '#ff4500'
                    }
                    borderColor="#ffffff"
                    glyphColor="#ffffff"
                    scale={isSelected ? 1.3 : 1.0}
                  />
                </AdvancedMarker>
              );
            })}

            {activeRestaurant && activeRestaurant.coordinates && (
              <InfoWindow
                position={activeRestaurant.coordinates}
                onCloseClick={() => setActiveRestaurant(null)}
                pixelOffset={[0, -35]}
              >
                <div className="p-1 max-w-[260px] text-left font-grotesk">
                  <div className="relative h-24 rounded-lg overflow-hidden mb-2">
                    <img
                      src={activeRestaurant.image}
                      alt={activeRestaurant.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 right-1.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
                      ⭐ {activeRestaurant.rating}
                    </div>
                    {(activeRestaurant.isVeg || activeRestaurant.isPureVeg) && (
                      <div className="absolute bottom-1.5 left-1.5 bg-emerald-700/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
                        🌱 Pure Veg
                      </div>
                    )}
                  </div>

                  <h4 className="font-garamond text-base font-bold text-gray-900 leading-tight">
                    {activeRestaurant.name}
                  </h4>
                  <p className="text-[11px] text-gray-600 truncate mt-0.5">
                    {activeRestaurant.cuisine} • {activeRestaurant.neighborhood}
                  </p>
                  {activeRestaurant.mustTry && (
                    <p className="text-[10px] text-amber-900 font-medium line-clamp-1 mt-1 bg-amber-50 px-1.5 py-0.5 rounded-sm">
                      Must Try: {activeRestaurant.mustTry}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-1.5 mt-2.5 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        if (onSelectRestaurant) onSelectRestaurant(activeRestaurant);
                      }}
                      className="flex-1 bg-[#ff4500] hover:bg-[#e63900] text-white text-[10px] font-bold py-1.5 px-2 rounded-md transition-colors cursor-pointer text-center"
                    >
                      View Details
                    </button>
                    {onBookTable && (
                      <button
                        onClick={() => onBookTable(activeRestaurant)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-1.5 px-2 rounded-md transition-colors cursor-pointer"
                      >
                        Book Table
                      </button>
                    )}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${activeRestaurant.name} ${activeRestaurant.neighborhood} ${activeRestaurant.city}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold p-1.5 rounded-md transition-colors flex items-center justify-center"
                      title="Open in Google Maps"
                    >
                      🗺️
                    </a>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      ) : (
        /* Dynamic interactive map view when key is pending or loading */
        <div className="w-full h-full min-h-[360px] bg-gradient-to-br from-[#fff7f4] via-[#fbf3ef] to-[#edf6ee] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
          {/* Subtle grid pattern resembling Google Maps tiles */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ff4500_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          <div className="relative z-10 max-w-md bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-[#ffded4] shadow-lg">
            <div className="w-12 h-12 rounded-full bg-[#fff0eb] text-[#ff4500] flex items-center justify-center mx-auto mb-3 shadow-inner">
              <span className="material-symbols-outlined text-2xl">location_on</span>
            </div>

            <h3 className="font-garamond text-2xl font-bold text-[#1e110d] mb-1">
              Google Maps Interactive View
            </h3>
            <p className="font-grotesk text-xs text-[#523932] mb-4">
              Explore {restaurants.length} curated culinary spots across {city} with real-time GPS pins, directions, and pure-veg badges.
            </p>

            {/* Quick interactive restaurant pins list */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-4 max-h-32 overflow-y-auto p-1">
              {restaurants.slice(0, 6).map((r) => (
                <button
                  key={r.id}
                  onClick={() => onSelectRestaurant && onSelectRestaurant(r)}
                  className={`text-[11px] font-grotesk font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                    r.isVeg || r.isPureVeg
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                      : 'bg-[#fff0eb] border-[#ffcfc2] text-[#ad2c00] hover:bg-[#ffe5dc]'
                  }`}
                >
                  <span>{r.isVeg || r.isPureVeg ? '🌱' : '📍'}</span>
                  <span>{r.name}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2">
              {selectedRestaurant && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${selectedRestaurant.name} ${selectedRestaurant.neighborhood} ${selectedRestaurant.city}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white text-xs font-grotesk font-bold shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">directions</span>
                  <span>Open in Google Maps</span>
                </a>
              )}
            </div>

            <div className="mt-3 text-[10px] text-gray-500 font-grotesk">
              💡 Provide <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">VITE_GOOGLE_MAPS_API_KEY</code> in settings or use Maps Demo Key to enable the in-app Google Maps canvas.
            </div>
          </div>
        </div>
      )}

      {/* Floating map badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-200 shadow-sm text-xs font-grotesk font-bold text-[#1e110d]">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>{city} Google Maps • {restaurants.length} Spots</span>
      </div>
    </div>
  );
};
