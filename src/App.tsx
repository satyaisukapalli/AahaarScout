import React, { useState } from 'react';
import { Restaurant, ScreenType } from './types';
import { RESTAURANTS } from './data/restaurants';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomeScreen } from './components/HomeScreen';
import { CityScreen } from './components/CityScreen';
import { SearchResultsScreen } from './components/SearchResultsScreen';
import { AIAssistantScreen } from './components/AIAssistantScreen';
import { TonightPickScreen } from './components/TonightPickScreen';
import { RestaurantDetailScreen } from './components/RestaurantDetailScreen';
import { SavedScreen } from './components/SavedScreen';
import { CollectionsScreen } from './components/CollectionsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { BookingModal } from './components/BookingModal';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>(RESTAURANTS[7]); // L'Osteria Moderna default
  const [searchQuery, setSearchQuery] = useState('Best biryani in Hyderabad for family');
  const [savedIds, setSavedIds] = useState<string[]>(['paradise-biryani', 'roastery-coffee-house', 'l-osteria-moderna']);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingRestaurant, setBookingRestaurant] = useState<Restaurant | null>(null);

  const handleNavigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRestaurant = (r: Restaurant) => {
    setSelectedRestaurant(r);
    setCurrentScreen('restaurant-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string, city?: string) => {
    setSearchQuery(query);
    setCurrentScreen('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSave = (r: Restaurant) => {
    setSavedIds((prev) =>
      prev.includes(r.id) ? prev.filter((id) => id !== r.id) : [...prev, r.id]
    );
  };

  const handleOpenBooking = (r: Restaurant) => {
    setBookingRestaurant(r);
    setIsBookingOpen(true);
  };

  const savedRestaurants = RESTAURANTS.filter((r) => savedIds.includes(r.id));
  const tonightPick = RESTAURANTS.find((r) => r.id === 'kumi-modern-japanese') || RESTAURANTS[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f6] text-[#281713] font-grotesk antialiased selection:bg-[#ad2c00] selection:text-white">
      {/* Top Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        savedCount={savedIds.length}
      />

      {/* Screen Switcher Bar for fast preview of all 6 core mockups */}
      <div className="w-full bg-[#fff1ed] border-b border-[#e5beb3]/60 px-4 py-2 flex items-center justify-between text-xs font-grotesk overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 shrink-0 text-[#5c4038]">
          <span className="material-symbols-outlined text-sm text-[#ad2c00]">grid_view</span>
          <span className="font-semibold hidden sm:inline">Mockup Screens:</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => handleNavigate('home')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              currentScreen === 'home' ? 'bg-[#ad2c00] text-white font-bold' : 'hover:bg-[#ffe2da] text-[#5c4038]'
            }`}
          >
            Home & Search
          </button>
          <button
            onClick={() => handleNavigate('city')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              currentScreen === 'city' ? 'bg-[#ad2c00] text-white font-bold' : 'hover:bg-[#ffe2da] text-[#5c4038]'
            }`}
          >
            City Guide
          </button>
          <button
            onClick={() => handleNavigate('search')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              currentScreen === 'search' ? 'bg-[#ad2c00] text-white font-bold' : 'hover:bg-[#ffe2da] text-[#5c4038]'
            }`}
          >
            Results & Map
          </button>
          <button
            onClick={() => handleNavigate('ai-assistant')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              currentScreen === 'ai-assistant' ? 'bg-[#ad2c00] text-white font-bold' : 'hover:bg-[#ffe2da] text-[#5c4038]'
            }`}
          >
            FoodieBot
          </button>
          <button
            onClick={() => handleNavigate('tonight-pick')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              currentScreen === 'tonight-pick' ? 'bg-[#ad2c00] text-white font-bold' : 'hover:bg-[#ffe2da] text-[#5c4038]'
            }`}
          >
            Tonight's Pick
          </button>
          <button
            onClick={() => {
              setSelectedRestaurant(RESTAURANTS[7]); // L'Osteria Moderna
              handleNavigate('restaurant-detail');
            }}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              currentScreen === 'restaurant-detail' ? 'bg-[#ad2c00] text-white font-bold' : 'hover:bg-[#ffe2da] text-[#5c4038]'
            }`}
          >
            Restaurant Detail
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <main className="flex-grow w-full pb-16 md:pb-0">
        {currentScreen === 'home' && (
          <HomeScreen
            restaurants={RESTAURANTS}
            onSelectRestaurant={handleSelectRestaurant}
            onSearch={handleSearch}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'city' && (
          <CityScreen
            restaurants={RESTAURANTS}
            onSelectRestaurant={handleSelectRestaurant}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'search' && (
          <SearchResultsScreen
            restaurants={RESTAURANTS}
            searchQuery={searchQuery}
            onSelectRestaurant={handleSelectRestaurant}
            onToggleSave={handleToggleSave}
            savedIds={savedIds}
          />
        )}

        {currentScreen === 'ai-assistant' && (
          <AIAssistantScreen
            restaurants={RESTAURANTS}
            onSelectRestaurant={handleSelectRestaurant}
          />
        )}

        {currentScreen === 'tonight-pick' && (
          <TonightPickScreen
            restaurant={tonightPick}
            onNavigate={handleNavigate}
            onBookTable={handleOpenBooking}
            onSelectRestaurant={handleSelectRestaurant}
          />
        )}

        {currentScreen === 'restaurant-detail' && (
          <RestaurantDetailScreen
            restaurant={selectedRestaurant}
            onBookTable={handleOpenBooking}
            onToggleSave={handleToggleSave}
            isSaved={savedIds.includes(selectedRestaurant.id)}
          />
        )}

        {currentScreen === 'saved' && (
          <SavedScreen
            savedRestaurants={savedRestaurants}
            onSelectRestaurant={handleSelectRestaurant}
            onRemoveSave={handleToggleSave}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'collections' && (
          <CollectionsScreen
            restaurants={RESTAURANTS}
            onSelectRestaurant={handleSelectRestaurant}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen
            savedCount={savedIds.length}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Global Booking Modal */}
      <BookingModal
        restaurant={bookingRestaurant}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        savedCount={savedIds.length}
      />
    </div>
  );
};

export default App;
