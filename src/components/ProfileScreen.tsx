import React, { useState, useEffect } from 'react';
import { ScreenType, AuthUser, DishReview } from '../types';
import { getUserHashtags, ALL_HASHTAG_BADGES } from '../utils/hashtagRewards';

interface ProfileScreenProps {
  savedCount: number;
  onNavigate: (s: ScreenType) => void;
  authUser?: AuthUser | null;
  onOpenAuth?: (reason?: string) => void;
  onLogout?: () => void;
  isVegOnly?: boolean;
  onToggleVegOnly?: () => void;
  reviews?: DishReview[];
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  savedCount,
  onNavigate,
  authUser,
  onOpenAuth,
  onLogout,
  isVegOnly = false,
  onToggleVegOnly,
  reviews = [],
}) => {
  const [spiceLevel, setSpiceLevel] = useState<'Mild' | 'Medium' | 'Andhra Fiery'>('Medium');
  const [favoriteCity, setFavoriteCity] = useState('Hyderabad');
  const [preferredVibes, setPreferredVibes] = useState<string[]>(['Cozy Courtyard', 'Heritage Dining']);
  const [userHashtags, setUserHashtags] = useState<string[]>([]);

  useEffect(() => {
    setUserHashtags(getUserHashtags());
  }, []);

  const toggleVibe = (vibe: string) => {
    setPreferredVibes((prev) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]
    );
  };

  // Find reviews written by this user or recent community reviews
  const myReviews = reviews.filter(
    (r) => r.userId === authUser?.id || r.userName === authUser?.name || r.userId.startsWith('user-satya')
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-5 sm:px-8 py-10 md:py-14 flex flex-col gap-8">
      {/* Top Banner / User Hero */}
      {authUser ? (
        <div
          className={`rounded-3xl p-6 sm:p-8 border shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden ${
            isVegOnly ? 'bg-white border-emerald-200' : 'bg-white border-[#ffded4]'
          }`}
        >
          <div className="relative">
            <img
              src={authUser.avatar}
              alt={authUser.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
            />
            {authUser.provider === 'google' && (
              <div className="absolute -bottom-1 -right-1 bg-white border border-gray-200 rounded-full p-1 shadow-sm flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
              </div>
            )}
            {authUser.provider === 'facebook' && (
              <div className="absolute -bottom-1 -right-1 bg-[#1877F2] text-white rounded-full w-6 h-6 shadow-sm flex items-center justify-center font-bold text-xs">
                f
              </div>
            )}
          </div>

          <div className="text-center sm:text-left flex-grow">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="font-garamond text-2xl sm:text-3xl font-bold text-[#1e110d]">
                {authUser.name}
              </h1>
              <span
                className={`text-[11px] font-grotesk font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  authUser.provider === 'google'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : authUser.provider === 'facebook'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                Verified with {authUser.provider}
              </span>
            </div>

            <p className="font-grotesk text-xs sm:text-sm text-[#523932]">
              {authUser.email} • Verified Culinary Contributor
            </p>

            {/* Active User Hashtags */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-3">
              {userHashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-gradient-to-r from-[#fff0eb] to-[#ffe8e0] text-[#ff4500] text-xs font-bold px-3 py-1 rounded-xl border border-[#ffcfc2] font-grotesk shadow-2xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex sm:flex-col items-center gap-2 mt-2 sm:mt-0">
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-xl border border-red-200 hover:border-red-400 bg-red-50 hover:bg-red-100 text-red-700 font-grotesk text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        /* Unauthenticated Prompt */
        <div
          className={`rounded-3xl p-8 sm:p-10 border shadow-md text-center bg-gradient-to-br ${
            isVegOnly
              ? 'from-emerald-50 via-white to-[#f0faf2] border-emerald-200'
              : 'from-[#fff5f0] via-white to-[#ffebe3] border-[#ffded4]'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <span className="material-symbols-outlined text-3xl text-[#ff4500]">account_circle</span>
          </div>

          <h2 className="font-garamond text-3xl font-bold text-[#1e110d] mb-2">
            Connect Your Taste Account
          </h2>
          <p className="font-grotesk text-sm text-[#523932] max-w-md mx-auto mb-6">
            Sign in through Google or Facebook to sync saved spots, track earned <strong>#HashtagAwards</strong> for your food critiques, and calibrate your AI FoodieBot.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
            <button
              onClick={() => onOpenAuth && onOpenAuth('Sign in with Google')}
              className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-gray-50 text-gray-700 font-grotesk text-sm font-bold py-3 px-5 rounded-2xl border-2 border-gray-200 shadow-sm transition-all active:scale-98 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
              </svg>
              <span>Sign In with Google</span>
            </button>

            <button
              onClick={() => onOpenAuth && onOpenAuth('Sign in with Facebook')}
              className="w-full flex items-center justify-center gap-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white font-grotesk text-sm font-bold py-3 px-5 rounded-2xl shadow-sm transition-all active:scale-98 cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Continue with Facebook</span>
            </button>
          </div>
        </div>
      )}

      {/* HASHTAG BADGES & AWARDS SECTION */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ffded4] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[#ff4500]">
            <span className="material-symbols-outlined text-2xl material-symbols-fill">
              military_tech
            </span>
            <h2 className="font-garamond text-2xl font-bold text-[#1e110d]">
              Foodie Hashtags & Badges
            </h2>
          </div>
          <span className="bg-amber-100 text-amber-900 font-grotesk text-xs font-bold px-3 py-1 rounded-full">
            {userHashtags.length} Badges Earned
          </span>
        </div>
        <p className="font-grotesk text-xs text-[#523932] mb-6">
          Hashtags are awarded when you submit authentic, helpful reviews for dishes across South India. Rate signature food items to unlock more accolades!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {ALL_HASHTAG_BADGES.map((badge) => {
            const isUnlocked = userHashtags.includes(badge.tag);
            return (
              <div
                key={badge.id}
                className={`rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-[#fff7f3] to-[#fff0ea] border-[#ff781f] shadow-xs'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${
                        isUnlocked
                          ? 'bg-gradient-to-tr from-[#ff4500] to-[#ff8c00] text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl material-symbols-fill">
                        {badge.icon}
                      </span>
                    </div>
                    {isUnlocked ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400 font-medium">Locked</span>
                    )}
                  </div>

                  <h3 className="font-garamond font-bold text-base text-[#1e110d] mb-1">
                    {badge.tag}
                  </h3>
                  <p className="font-grotesk text-[11px] text-[#523932] leading-snug">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MY SUBMITTED DISH REVIEWS & REPLIES */}
      {myReviews.length > 0 && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ffded4] shadow-sm">
          <h2 className="font-garamond text-2xl font-bold text-[#1e110d] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff4500]">rate_review</span>
            Your Published Dish Critiques ({myReviews.length})
          </h2>

          <div className="flex flex-col gap-4">
            {myReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#fffdfc] border border-[#ffded4] rounded-2xl p-4 sm:p-5 shadow-2xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-garamond font-bold text-base text-[#1e110d]">
                      {rev.dishName}
                    </h3>
                    <p className="font-grotesk text-xs text-[#ff4500] font-semibold">
                      at {rev.restaurantName}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-[#fff0eb] text-[#ff4500] px-2.5 py-1 rounded-xl text-xs font-bold">
                    <span>★</span>
                    <span>{rev.rating}.0</span>
                  </div>
                </div>

                <p className="font-grotesk text-xs sm:text-sm text-[#2d1811] leading-relaxed my-2">
                  "{rev.comment}"
                </p>

                {rev.awardedHashtag && (
                  <span className="inline-block bg-[#1e110d] text-white text-[10px] font-bold px-2 py-0.5 rounded-md font-grotesk">
                    Awarded {rev.awardedHashtag}
                  </span>
                )}

                {rev.replies && rev.replies.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#ffded4] pl-3 border-l-2">
                    <p className="text-[11px] font-bold text-[#523932] mb-1">
                      {rev.replies.length} Foodies replied to this:
                    </p>
                    {rev.replies.map((reply) => (
                      <p key={reply.id} className="text-xs text-[#3d231b] italic">
                        <strong>{reply.userName}:</strong> "{reply.content}"
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('saved')}
          className="bg-white rounded-2xl p-5 border border-[#ffded4] hover:border-[#ff4500] transition-all flex items-center justify-between text-left shadow-xs hover:shadow-md cursor-pointer group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#fff0eb] text-[#ff4500] flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined">bookmark</span>
            </div>
            <div>
              <h3 className="font-garamond font-bold text-lg text-[#1e110d]">Saved Spots</h3>
              <p className="font-grotesk text-xs text-[#523932]">{savedCount} spots bookmarked</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-gray-400 group-hover:text-[#ff4500] transition-colors">
            chevron_right
          </span>
        </button>

        <button
          onClick={() => onNavigate('collections')}
          className="bg-white rounded-2xl p-5 border border-[#ffded4] hover:border-[#ff4500] transition-all flex items-center justify-between text-left shadow-xs hover:shadow-md cursor-pointer group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <div>
              <h3 className="font-garamond font-bold text-lg text-[#1e110d]">Curated Trails</h3>
              <p className="font-grotesk text-xs text-[#523932]">4 handcrafted food trails</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-gray-400 group-hover:text-[#ff4500] transition-colors">
            chevron_right
          </span>
        </button>

        <button
          onClick={() => onNavigate('ai-assistant')}
          className="bg-white rounded-2xl p-5 border border-[#ffded4] hover:border-[#ff4500] transition-all flex items-center justify-between text-left shadow-xs hover:shadow-md cursor-pointer group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined material-symbols-fill">smart_toy</span>
            </div>
            <div>
              <h3 className="font-garamond font-bold text-lg text-[#1e110d]">AI FoodieBot</h3>
              <p className="font-grotesk text-xs text-[#523932]">Ask culinary concierge</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-gray-400 group-hover:text-[#ff4500] transition-colors">
            chevron_right
          </span>
        </button>
      </div>

      {/* Taste Profile Calibration Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ffded4] shadow-sm">
        <h2 className="font-garamond text-2xl font-bold text-[#1e110d] mb-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ff4500]">tune</span>
          Flavor & Preference Calibration
        </h2>
        <p className="font-grotesk text-xs text-[#523932] mb-6">
          Fine-tune how Aahaarscout sorts and scores culinary spots for your palate.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dietary Mode */}
          <div className="p-4 rounded-2xl bg-[#fff9f6] border border-[#ffded4]">
            <label className="block font-grotesk text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Dietary Mode
            </label>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-[#1e110d]">
                  {isVegOnly ? '100% Pure Vegetarian Mode' : 'All Culinary Options (Veg + Non-Veg)'}
                </p>
                <p className="text-xs text-[#523932] mt-0.5">
                  {isVegOnly
                    ? 'Filtering strictly for eggless, pure vegetarian kitchens & tiffin homes.'
                    : 'Discovering legendary biryanis, seafood pulusus, and heritage veg spots.'}
                </p>
              </div>
              {onToggleVegOnly && (
                <button
                  onClick={onToggleVegOnly}
                  className={`px-3 py-1.5 rounded-full font-grotesk text-xs font-bold cursor-pointer transition-all ${
                    isVegOnly
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {isVegOnly ? 'Veg ON' : 'Veg OFF'}
                </button>
              )}
            </div>
          </div>

          {/* Spice Tolerance */}
          <div className="p-4 rounded-2xl bg-[#fff9f6] border border-[#ffded4]">
            <label className="block font-grotesk text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Spice Calibration
            </label>
            <div className="flex gap-2">
              {(['Mild', 'Medium', 'Andhra Fiery'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSpiceLevel(lvl)}
                  className={`flex-1 py-2 rounded-xl text-xs font-grotesk font-bold transition-all cursor-pointer ${
                    spiceLevel === lvl
                      ? 'bg-[#ff4500] text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {lvl === 'Andhra Fiery' ? '🌶️ Fiery' : lvl === 'Medium' ? '⚖️ Medium' : '🌱 Mild'}
                </button>
              ))}
            </div>
          </div>

          {/* Home City */}
          <div className="p-4 rounded-2xl bg-[#fff9f6] border border-[#ffded4]">
            <label className="block font-grotesk text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Primary City
            </label>
            <select
              value={favoriteCity}
              onChange={(e) => setFavoriteCity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-grotesk font-bold text-gray-800 outline-hidden"
            >
              <option value="Hyderabad">Hyderabad (Telangana)</option>
              <option value="Vijayawada">Vijayawada (Andhra Pradesh)</option>
              <option value="Guntur">Guntur (Andhra Pradesh)</option>
              <option value="Bangalore">Bangalore (Karnataka)</option>
              <option value="Chennai">Chennai (Tamil Nadu)</option>
              <option value="Kochi">Kochi (Kerala)</option>
              <option value="Visakhapatnam">Visakhapatnam (Andhra Pradesh)</option>
              <option value="Nellore">Nellore (Andhra Pradesh)</option>
            </select>
          </div>

          {/* Favorite Ambience */}
          <div className="p-4 rounded-2xl bg-[#fff9f6] border border-[#ffded4]">
            <label className="block font-grotesk text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Atmosphere & Vibes
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['Cozy Courtyard', 'Heritage Dining', 'Lively Street', 'Fine Dining', 'Quiet Cafe'].map((v) => (
                <button
                  key={v}
                  onClick={() => toggleVibe(v)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-grotesk font-bold transition-all cursor-pointer ${
                    preferredVibes.includes(v)
                      ? 'bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white shadow-2xs'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
