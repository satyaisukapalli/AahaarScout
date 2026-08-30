import React, { useState } from 'react';
import { Restaurant, DishReview, DishReviewReply, AuthUser, HashtagBadge } from '../types';
import { SOUTH_INDIA_MAP_IMAGE } from '../data/restaurants';
import { CrowdMeter } from './CrowdMeter';
import { GoogleMapView } from './GoogleMapView';
import { DishReviewSection } from './DishReviewSection';

interface RestaurantDetailScreenProps {
  restaurant: Restaurant;
  onBookTable: (r: Restaurant) => void;
  onToggleSave: (r: Restaurant) => void;
  isSaved: boolean;
  isVegOnly?: boolean;
  reviews?: DishReview[];
  onAddReview?: (review: DishReview, newHashtags: HashtagBadge[]) => void;
  onAddReply?: (reviewId: string, reply: DishReviewReply) => void;
  onLikeReview?: (reviewId: string) => void;
  onLikeReply?: (reviewId: string, replyId: string) => void;
  authUser?: AuthUser | null;
  onOpenAuth?: () => void;
}

export const RestaurantDetailScreen: React.FC<RestaurantDetailScreenProps> = ({
  restaurant,
  onBookTable,
  onToggleSave,
  isSaved,
  isVegOnly = false,
  reviews = [],
  onAddReview = () => {},
  onAddReply = () => {},
  onLikeReview = () => {},
  onLikeReply = () => {},
  authUser,
  onOpenAuth,
}) => {
  const [copiedToast, setCopiedToast] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: `${restaurant.name} on Aahaarscout`,
      text: `Check out ${restaurant.name} (${restaurant.cuisine}) in ${restaurant.neighborhood}, ${restaurant.city}! AI Match: ${restaurant.matchScore}%`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Fallback or user canceled
        console.debug('Share dismissed or failed', err);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(
          `${shareData.title} - ${shareData.text} \n${shareData.url}`
        );
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 3000);
      } catch (err) {
        console.error('Clipboard copy failed', err);
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center pb-20 relative">
      {/* Copied to Clipboard Notification Toast */}
      {copiedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1e110d] text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-[#ff781f] flex items-center gap-2.5 animate-bounce font-grotesk text-xs sm:text-sm font-bold">
          <span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
          <span>Restaurant link copied to clipboard!</span>
        </div>
      )}

      {/* Hero Header */}
      <section className="relative w-full h-[45vh] md:h-[55vh] max-h-[550px] bg-[#281713]">
        <div 
          className="absolute inset-0 bg-cover bg-center w-full h-full"
          style={{ backgroundImage: `url('${restaurant.heroImage || restaurant.image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#281713]/90 via-[#281713]/40 to-black/20" />
        
        {/* Floating Quick Action Share Button on Hero */}
        <div className="absolute top-6 right-6 md:right-12 z-20 flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-[#1e110d] hover:text-[#ff4500] backdrop-blur-md font-grotesk text-xs sm:text-sm font-bold shadow-xl border border-white/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Share with Friends"
          >
            <span className="material-symbols-outlined text-base text-[#ff4500]">share</span>
            <span>Share</span>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full px-5 sm:px-8 md:px-16 py-8 max-w-7xl mx-auto left-1/2 -translate-x-1/2 text-white">
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <span className="bg-gradient-to-r from-[#ff4500] to-[#ff8c00] text-white px-3.5 py-1 rounded-full font-grotesk text-xs uppercase tracking-wider font-bold shadow-xs">
              {restaurant.tags[0] || 'Gourmet'}
            </span>
            {(restaurant.vibes || (restaurant.vibe ? [restaurant.vibe] : [])).map((vibe) => (
              <span key={`hero-vibe-${vibe}`} className="font-grotesk text-xs text-white bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                <span className="text-xs">
                  {vibe === 'Romantic' ? '🍷' : vibe === 'Business' ? '💼' : vibe === 'Casual' ? '☕' : '🎉'}
                </span>
                <span>{vibe} Vibe</span>
              </span>
            ))}
            <CrowdMeter restaurant={restaurant} variant="badge" className="bg-white/20 text-white border-white/30 backdrop-blur-md" />
            <span className="font-grotesk text-xs text-[#ffe2da] bg-black/30 px-2.5 py-1 rounded-full">{restaurant.priceRange}</span>
          </div>

          <h1 className="font-garamond text-3xl sm:text-4xl md:text-5xl font-semibold mb-2 drop-shadow-md">
            {restaurant.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-grotesk text-[#ffe9e4]">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold bg-black/40 px-3 py-1 rounded-full backdrop-blur-xs">
              <span className="material-symbols-outlined text-[16px] material-symbols-fill text-amber-400">star</span>
              <span className="font-bold text-white">{restaurant.rating}</span>
              {restaurant.reviewsCount && (
                <span className="text-white/80 font-normal">({restaurant.reviewsCount} reviews)</span>
              )}
            </div>
            <div className="flex items-center gap-1 bg-black/30 px-3 py-1 rounded-full">
              <span className="material-symbols-outlined text-sm text-[#ff781f]">location_on</span>
              <span>{restaurant.neighborhood}, {restaurant.city}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-16 mt-8 md:mt-12 w-full grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="md:col-span-8 flex flex-col gap-8">
          {/* AI Insight Section */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 relative overflow-hidden group border-2 border-[#ffded4] shadow-xl ai-border-gradient">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#ff4500] to-[#ff8c00] flex items-center justify-center shrink-0 text-white shadow-md">
                <span className="material-symbols-outlined text-2xl material-symbols-fill">smart_toy</span>
              </div>
              <div>
                <h3 className="font-garamond text-xl sm:text-2xl font-bold text-[#1e110d] mb-2 flex items-center gap-2">
                  Aahaarscout FoodieBot Insight
                </h3>
                <p className="font-garamond text-base sm:text-lg text-[#3d231b] italic leading-relaxed">
                  "{restaurant.aiInsight || restaurant.aiReasoning}"
                </p>
              </div>
            </div>
          </section>

          {/* Live Crowd Meter Section */}
          <section>
            <CrowdMeter
              restaurant={restaurant}
              variant="detailed"
              showHourlyHistogram={true}
            />
          </section>

          {/* Signature Dishes */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-garamond text-2xl sm:text-3xl font-semibold text-[#1e110d]">
                Signature Dishes
              </h2>
              <span className="text-xs font-grotesk text-[#523932] font-medium">
                Tap any dish to view genuine critiques & ratings
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(restaurant.signatureDishes || []).map((dish) => {
                const dishRevs = reviews.filter((r) => r.dishId === dish.id && r.restaurantId === restaurant.id);
                const dishAvg = dishRevs.length > 0
                  ? (dishRevs.reduce((a, c) => a + c.rating, 0) / dishRevs.length).toFixed(1)
                  : '5.0';

                return (
                  <div key={dish.id} className="bg-white rounded-2xl overflow-hidden soft-card-shadow border border-[#ffded4] hover:border-[#ff9e7d] transition-all flex flex-col group">
                    <div className="h-40 w-full relative bg-[#ffece5]">
                      <img src={dish.image} alt={dish.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-[#ff4500] to-[#ff8c00] text-white font-grotesk text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <span className="material-symbols-outlined text-xs material-symbols-fill">auto_awesome</span>
                        {dish.matchScore}% Match
                      </div>

                      {/* Dish Rating Chip */}
                      <div className="absolute bottom-2.5 left-2.5 bg-[#1e110d]/90 backdrop-blur-xs text-white font-grotesk text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
                        <span className="material-symbols-outlined text-xs text-amber-400 material-symbols-fill">star</span>
                        <span>{dishAvg}</span>
                        {dishRevs.length > 0 && (
                          <span className="text-white/70 font-normal">({dishRevs.length})</span>
                        )}
                      </div>
                    </div>
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="font-garamond text-lg font-bold text-[#1e110d] group-hover:text-[#ff4500] transition-colors mb-1">
                          {dish.name}
                        </h4>
                        <p className="font-grotesk text-xs text-[#523932] leading-relaxed line-clamp-2">
                          {dish.description}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-[#ffded4] flex items-center justify-between font-grotesk">
                        <span className="text-sm font-bold text-[#ff4500]">{dish.price}</span>
                        <a
                          href="#dish-reviews-section"
                          className="text-[11px] font-bold text-[#ff4500] hover:underline flex items-center gap-0.5"
                        >
                          <span>Reviews</span>
                          <span className="material-symbols-outlined text-[13px]">arrow_downward</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Dedicated Food Item Reviews & Ratings Section */}
          <div id="dish-reviews-section">
            <DishReviewSection
              restaurant={restaurant}
              reviews={reviews}
              onAddReview={onAddReview}
              onAddReply={onAddReply}
              onLikeReview={onLikeReview}
              onLikeReply={onLikeReply}
              authUser={authUser}
              onOpenAuth={onOpenAuth}
              isVegOnly={isVegOnly}
            />
          </div>
        </div>

        {/* Right Column / Actions Sidebar */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl flex flex-col gap-4 border border-[#ffded4]">
            <button
              onClick={() => onBookTable(restaurant)}
              className="w-full bg-gradient-to-r from-[#ff4500] via-[#e63900] to-[#ff781f] hover:from-[#e63900] hover:to-[#ff5e1a] text-white font-grotesk text-sm font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Book a Table
            </button>

            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => alert(`Navigating to ${restaurant.name} at ${restaurant.address || restaurant.neighborhood}`)}
                className="flex items-center justify-center gap-1 border border-[#ffcfc2] py-2.5 rounded-xl font-grotesk text-xs font-semibold text-[#1e110d] bg-[#fff5f0] hover:bg-[#ffe3d8] transition-colors cursor-pointer"
                title="Get Directions"
              >
                <span className="material-symbols-outlined text-base text-[#ff4500]">directions</span>
                <span className="hidden sm:inline">Directions</span>
              </button>
              <button
                onClick={() => onToggleSave(restaurant)}
                className={`flex items-center justify-center gap-1 border py-2.5 rounded-xl font-grotesk text-xs font-semibold transition-colors cursor-pointer ${
                  isSaved
                    ? 'bg-[#ff4500] text-white border-[#ff4500]'
                    : 'border-[#ffcfc2] bg-[#fff5f0] text-[#1e110d] hover:bg-[#ffe3d8]'
                }`}
                title="Save Restaurant"
              >
                <span className={`material-symbols-outlined text-base ${isSaved ? 'material-symbols-fill' : 'text-[#ff4500]'}`}>
                  bookmark
                </span>
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-1 border border-[#ffcfc2] py-2.5 rounded-xl font-grotesk text-xs font-semibold text-[#1e110d] bg-[#fff5f0] hover:bg-[#ffe3d8] hover:text-[#ff4500] transition-colors cursor-pointer"
                title="Share with Friends"
              >
                <span className="material-symbols-outlined text-base text-[#ff4500]">share</span>
                <span>Share</span>
              </button>
            </div>

            <hr className="border-[#ffded4] my-1" />

            <div className="flex flex-col gap-3 font-grotesk text-xs sm:text-sm text-[#523932]">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-lg text-[#ff4500] shrink-0">schedule</span>
                <div>
                  <span className="text-[#1e110d] font-bold block">Open Today</span>
                  <span>{restaurant.hours || '11:00 AM - 11:00 PM'}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-lg text-[#ff4500] shrink-0">call</span>
                <span className="text-[#1e110d]">{restaurant.phone || '(040) 2345-6789'}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-lg text-[#ff4500] shrink-0">language</span>
                <span className="text-[#ff4500] font-semibold underline">{restaurant.website || 'aahaarscout.com'}</span>
              </div>
            </div>
          </div>

          {/* Interactive Google Map & Location */}
          <div className="flex flex-col gap-2.5">
            <GoogleMapView
              restaurants={[restaurant]}
              selectedRestaurant={restaurant}
              city={restaurant.city}
              isVegOnly={isVegOnly}
              className="h-56 w-full"
            />

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${restaurant.name} ${restaurant.neighborhood} ${restaurant.city}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white font-grotesk text-xs font-bold shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer text-center"
            >
              <span className="material-symbols-outlined text-sm">directions</span>
              <span>Open in Google Maps / Get Directions</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
