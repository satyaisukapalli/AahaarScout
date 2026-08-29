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
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>(RESTAURANTS[0]); // Paradise Biryani default
  const [searchQuery, setSearchQuery] = useState('Best biryani in Hyderabad for family');
  const [savedIds, setSavedIds] = useState<string[]>(['paradise-biryani', 'roastery-coffee-house', 'ctr-shri-sagar', 'paragon-restaurant-kochi']);
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
