import React, { useState, useEffect } from 'react';
import { Restaurant, ScreenType, DishReview, DishReviewReply, AuthUser, HashtagBadge } from './types';
import { RESTAURANTS } from './data/restaurants';
import { getStoredDishReviews, saveStoredDishReviews } from './data/dishReviews';
import { awardHashtagsToUser } from './utils/hashtagRewards';
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
import { CommunityForumScreen } from './components/CommunityForumScreen';
import { BookingModal } from './components/BookingModal';
import { AuthModal } from './components/AuthModal';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [isVegOnly, setIsVegOnly] = useState<boolean>(() => {
    try {
      return localStorage.getItem('aahaarscout_veg_only') === 'true';
    } catch {
      return false;
    }
  });

  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>(() => {
    if (isVegOnly) {
      return RESTAURANTS.find((r) => r.id === 'babai-hotel-vijayawada') || RESTAURANTS.find((r) => r.isPureVeg) || RESTAURANTS[0];
    }
    return RESTAURANTS[0]; // Paradise Biryani default
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('aahaarscout_saved_ids');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aahaarscout_saved_ids', JSON.stringify(savedIds));
    } catch {
      // ignore
    }
  }, [savedIds]);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingRestaurant, setBookingRestaurant] = useState<Restaurant | null>(null);

  // Auth User State - Satya Isukapalli
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('aahaarscout_auth_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.name) return parsed;
      }
    } catch {
      // ignore
    }
    const defaultSatyaUser: AuthUser = {
      id: 'user-satya',
      name: 'Satya Isukapalli',
      email: 'satyaisukapalli@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      provider: 'google',
      connectedAt: 'Aug 2026',
      dietaryPreference: 'all',
      favoriteCity: 'Vijayawada',
      savedSpotsCount: 6,
    };
    try {
      localStorage.setItem('aahaarscout_auth_user', JSON.stringify(defaultSatyaUser));
    } catch {
      // ignore
    }
    return defaultSatyaUser;
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authReason, setAuthReason] = useState<string>('');

  // Dish Reviews State
  const [dishReviews, setDishReviews] = useState<DishReview[]>(() => {
    return getStoredDishReviews();
  });

  useEffect(() => {
    saveStoredDishReviews(dishReviews);
  }, [dishReviews]);

  const handleToggleVegOnly = () => {
    setIsVegOnly((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('aahaarscout_veg_only', String(next));
      } catch {
        // ignore
      }
      if (next) {
        // If current selection is non-veg, switch to an iconic pure veg spot
        if (!selectedRestaurant.isVeg && !selectedRestaurant.isPureVeg) {
          const firstVeg = RESTAURANTS.find((r) => r.id === 'babai-hotel-vijayawada') || RESTAURANTS.find((r) => r.isPureVeg) || RESTAURANTS[0];
          setSelectedRestaurant(firstVeg);
        }
      }
      return next;
    });
  };

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

  const handleOpenAuth = (reason?: string) => {
    setAuthReason(reason || 'rate dishes and personalize your taste');
    setIsAuthOpen(true);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setAuthUser(user);
    try {
      localStorage.setItem('aahaarscout_auth_user', JSON.stringify(user));
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    setAuthUser(null);
    try {
      localStorage.removeItem('aahaarscout_auth_user');
    } catch {
      // ignore
    }
  };

  // Add Dish Review handler with hashtag reward logic
  const handleAddReview = (newReview: DishReview, newHashtags: HashtagBadge[]) => {
    setDishReviews((prev) => [newReview, ...prev]);

    if (newHashtags && newHashtags.length > 0) {
      awardHashtagsToUser(newHashtags.map((h) => h.tag));
    }
  };

  // Add Reply to review handler
  const handleAddReply = (reviewId: string, reply: DishReviewReply) => {
    setDishReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const replies = r.replies ? [...r.replies, reply] : [reply];
          return { ...r, replies };
        }
        return r;
      })
    );
  };

  // Like Review handler
  const handleLikeReview = (reviewId: string) => {
    setDishReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, likes: (r.likes || 0) + 1 } : r))
    );
  };

  // Like Reply handler
  const handleLikeReply = (reviewId: string, replyId: string) => {
    setDishReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId && r.replies) {
          return {
            ...r,
            replies: r.replies.map((rep) =>
              rep.id === replyId ? { ...rep, likes: (rep.likes || 0) + 1 } : rep
            ),
          };
        }
        return r;
      })
    );
  };

  // Filter saved restaurants if in veg only mode
  const savedRestaurants = RESTAURANTS.filter((r) => {
    if (!savedIds.includes(r.id)) return false;
    if (isVegOnly) return r.isVeg || r.isPureVeg;
    return true;
  });

  const tonightPick = isVegOnly
    ? RESTAURANTS.find((r) => r.id === 'babai-hotel-vijayawada') ||
      RESTAURANTS.find((r) => r.id === 'sankar-vilas-guntur') ||
      RESTAURANTS.find((r) => r.id === 'ctr-shri-sagar') ||
      RESTAURANTS[0]
    : RESTAURANTS.find((r) => r.id === 'kumi-modern-japanese') || RESTAURANTS[0];

  return (
    <div
      className={`min-h-screen flex flex-col font-grotesk antialiased transition-colors duration-300 ${
        isVegOnly
          ? 'bg-[#f7fcf8] text-[#132a1c] selection:bg-[#15803d] selection:text-white'
          : 'bg-[#fff8f6] text-[#281713] selection:bg-[#ad2c00] selection:text-white'
      }`}
    >
      {/* Top Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        savedCount={savedRestaurants.length}
        isVegOnly={isVegOnly}
        onToggleVegOnly={handleToggleVegOnly}
        authUser={authUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main View Area */}
      <main className="flex-grow w-full pb-16 md:pb-0">
        {currentScreen === 'home' && (
          <HomeScreen
            restaurants={RESTAURANTS}
            onSelectRestaurant={handleSelectRestaurant}
            onSearch={handleSearch}
            onNavigate={handleNavigate}
            isVegOnly={isVegOnly}
            onToggleVegOnly={handleToggleVegOnly}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentScreen === 'city' && (
          <CityScreen
            restaurants={RESTAURANTS}
            onSelectRestaurant={handleSelectRestaurant}
            onNavigate={handleNavigate}
            isVegOnly={isVegOnly}
            onToggleVegOnly={handleToggleVegOnly}
          />
        )}

        {currentScreen === 'search' && (
          <SearchResultsScreen
            restaurants={RESTAURANTS}
            searchQuery={searchQuery}
            onSelectRestaurant={handleSelectRestaurant}
            onToggleSave={handleToggleSave}
            savedIds={savedIds}
            isVegOnly={isVegOnly}
            onToggleVegOnly={handleToggleVegOnly}
          />
        )}

        {currentScreen === 'ai-assistant' && (
          <AIAssistantScreen
            restaurants={RESTAURANTS}
            reviews={dishReviews}
            onSelectRestaurant={handleSelectRestaurant}
            isVegOnly={isVegOnly}
            onToggleVegOnly={handleToggleVegOnly}
          />
        )}

        {currentScreen === 'tonight-pick' && (
          <TonightPickScreen
            restaurant={tonightPick}
            onNavigate={handleNavigate}
            onBookTable={handleOpenBooking}
            onSelectRestaurant={handleSelectRestaurant}
            isVegOnly={isVegOnly}
          />
        )}

        {currentScreen === 'restaurant-detail' && (
          <RestaurantDetailScreen
            restaurant={selectedRestaurant}
            onBookTable={handleOpenBooking}
            onToggleSave={handleToggleSave}
            isSaved={savedIds.includes(selectedRestaurant.id)}
            isVegOnly={isVegOnly}
            reviews={dishReviews}
            onAddReview={handleAddReview}
            onAddReply={handleAddReply}
            onLikeReview={handleLikeReview}
            onLikeReply={handleLikeReply}
            authUser={authUser}
            onOpenAuth={() => handleOpenAuth('Review Dishes')}
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
            isVegOnly={isVegOnly}
            onToggleVegOnly={handleToggleVegOnly}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen
            savedCount={savedRestaurants.length}
            onNavigate={handleNavigate}
            authUser={authUser}
            onOpenAuth={handleOpenAuth}
            onLogout={handleLogout}
            isVegOnly={isVegOnly}
            onToggleVegOnly={handleToggleVegOnly}
            reviews={dishReviews}
          />
        )}

        {currentScreen === 'forum' && (
          <CommunityForumScreen
            authUser={authUser}
            onRequireAuth={handleOpenAuth}
            isVegOnly={isVegOnly}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Global Booking Modal */}
      <BookingModal
        restaurant={bookingRestaurant}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* Google / Facebook / Email Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        isVegOnly={isVegOnly}
        actionReason={authReason}
        currentAuthUser={authUser}
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        savedCount={savedRestaurants.length}
        isVegOnly={isVegOnly}
        onToggleVegOnly={handleToggleVegOnly}
      />
    </div>
  );
};

export default App;
