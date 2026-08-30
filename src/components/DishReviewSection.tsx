import React, { useState } from 'react';
import { Restaurant, Dish, DishReview, DishReviewReply, AuthUser, HashtagBadge } from '../types';
import { evaluateReviewForHashtags, getUserHashtags, saveUserHashtags, ALL_HASHTAG_BADGES } from '../utils/hashtagRewards';

interface DishReviewSectionProps {
  restaurant: Restaurant;
  reviews: DishReview[];
  onAddReview: (review: DishReview, newHashtags: HashtagBadge[]) => void;
  onAddReply: (reviewId: string, reply: DishReviewReply) => void;
  onLikeReview: (reviewId: string) => void;
  onLikeReply: (reviewId: string, replyId: string) => void;
  authUser?: AuthUser | null;
  onOpenAuth?: () => void;
  isVegOnly?: boolean;
}

const TASTE_TAG_OPTIONS = [
  'Pure Desi Ghee',
  'Melt in Mouth',
  'Authentic Recipe',
  'Super Crispy',
  'Spicy & Fiery',
  'Aromatic Saffron',
  'Piping Hot & Fresh',
  'Generous Portion',
  'Must Order',
  'Wholesome Sattvic',
];

export const DishReviewSection: React.FC<DishReviewSectionProps> = ({
  restaurant,
  reviews,
  onAddReview,
  onAddReply,
  onLikeReview,
  onLikeReply,
  authUser,
  onOpenAuth,
  isVegOnly = false,
}) => {
  const [selectedDishFilter, setSelectedDishFilter] = useState<string>('all');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // Review Form State
  const [selectedDishId, setSelectedDishId] = useState<string>(
    restaurant.signatureDishes?.[0]?.id || 'custom'
  );
  const [customDishName, setCustomDishName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Pure Desi Ghee', 'Authentic Recipe']);
  const [authorName, setAuthorName] = useState(authUser?.name || 'Fellow Foodie');

  // Inline Reply state: mapping reviewId -> text string
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [activeReplyBoxId, setActiveReplyBoxId] = useState<string | null>(null);

  // Celebration Modal state
  const [celebrationBadges, setCelebrationBadges] = useState<HashtagBadge[] | null>(null);

  // Filter reviews for this restaurant
  const restaurantReviews = reviews.filter((r) => r.restaurantId === restaurant.id);
  const filteredReviews =
    selectedDishFilter === 'all'
      ? restaurantReviews
      : restaurantReviews.filter((r) => r.dishId === selectedDishFilter);

  // Calculate average rating
  const avgRating =
    restaurantReviews.length > 0
      ? (
          restaurantReviews.reduce((acc, curr) => acc + curr.rating, 0) /
          restaurantReviews.length
        ).toFixed(1)
      : restaurant.rating.toString();

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const getTargetDishName = (dishId: string) => {
    if (dishId === 'custom') return customDishName || 'Signature Specialty';
    const found = restaurant.signatureDishes?.find((d) => d.id === dishId);
    return found ? found.name : 'Specialty Dish';
  };

  // Preview the hashtag that will be awarded
  const livePreviewBadges = evaluateReviewForHashtags(
    {
      dishName: getTargetDishName(selectedDishId),
      comment,
      rating,
      tasteTags: selectedTags,
    },
    restaurant
  );

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const dishName = getTargetDishName(selectedDishId);
    const existingHashtags = getUserHashtags();

    // Evaluate newly awarded hashtags
    const awardedBadges = evaluateReviewForHashtags(
      {
        dishName,
        comment,
        rating,
        tasteTags: selectedTags,
      },
      restaurant
    );

    const awardedTagNames = awardedBadges.map((b) => b.tag);
    const updatedUserHashtags = Array.from(new Set([...existingHashtags, ...awardedTagNames]));
    saveUserHashtags(updatedUserHashtags);

    const newReview: DishReview = {
      id: `rev-${Date.now()}`,
      dishId: selectedDishId,
      dishName,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      userId: authUser?.id || `user-${Date.now()}`,
      userName: authUser?.name || authorName || 'Aahaarscout Critic',
      userAvatar:
        authUser?.avatar ||
        `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(authorName || 'foodie')}`,
      userHashtags: updatedUserHashtags.slice(0, 3),
      rating,
      comment: comment.trim(),
      tasteTags: selectedTags,
      awardedHashtag: awardedTagNames[0],
      isVerifiedFoodie: true,
      createdAt: 'Just now',
      likesCount: 1,
      isLikedByMe: true,
      replies: [],
    };

    onAddReview(newReview, awardedBadges);
    setCelebrationBadges(awardedBadges);
    setIsWriteModalOpen(false);
    setComment('');
    setCustomDishName('');
  };

  const handleSendReply = (reviewId: string) => {
    const text = replyInputs[reviewId]?.trim();
    if (!text) return;

    const existingHashtags = getUserHashtags();
    const newReply: DishReviewReply = {
      id: `rep-${Date.now()}`,
      reviewId,
      userId: authUser?.id || `user-${Date.now()}`,
      userName: authUser?.name || 'Helpful Foodie',
      userAvatar:
        authUser?.avatar ||
        `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(authUser?.name || 'reply')}`,
      userHashtags: existingHashtags.slice(0, 2),
      content: text,
      createdAt: 'Just now',
      likesCount: 0,
      isLikedByMe: false,
    };

    onAddReply(reviewId, newReply);
    setReplyInputs((prev) => ({ ...prev, [reviewId]: '' }));
    setActiveReplyBoxId(null);
  };

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#ffded4] shadow-xl relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#ffefe9]/60 to-transparent pointer-events-none rounded-full blur-3xl" />

      {/* Header & Quick Stat */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#ffded4]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#ff4500] material-symbols-fill text-2xl">
              rate_review
            </span>
            <h3 className="font-garamond text-2xl sm:text-3xl font-bold text-[#1e110d]">
              Food Item Reviews & Ratings
            </h3>
          </div>
          <p className="font-grotesk text-xs sm:text-sm text-[#523932]">
            Detailed community dish critiques & threaded replies. Earn genuine{' '}
            <span className="font-bold text-[#ff4500]">#HashtagAwards</span> with every review!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#fff5f0] border border-[#ffcfc2] px-4 py-2 rounded-2xl shadow-xs">
            <div className="flex text-amber-500">
              <span className="material-symbols-outlined text-xl material-symbols-fill">star</span>
            </div>
            <div>
              <span className="font-garamond font-bold text-lg text-[#1e110d] leading-none">
                {avgRating}
              </span>
              <span className="text-xs text-[#523932] font-grotesk block">
                {restaurantReviews.length} Community Reviews
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="bg-gradient-to-r from-[#ff4500] to-[#ff781f] hover:from-[#e63900] hover:to-[#ff5e1a] text-white font-grotesk text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">edit_note</span>
            <span>Rate a Food Item</span>
          </button>
        </div>
      </div>

      {/* Dish Filter Tabs */}
      <div className="relative z-10 my-6 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setSelectedDishFilter('all')}
          className={`px-4 py-2 rounded-full font-grotesk text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
            selectedDishFilter === 'all'
              ? 'bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white shadow-xs'
              : 'bg-[#fff5f0] text-[#523932] border border-[#ffded4] hover:border-[#ff4500]'
          }`}
        >
          🍽️ All Dishes ({restaurantReviews.length})
        </button>

        {(restaurant.signatureDishes || []).map((dish) => {
          const count = restaurantReviews.filter((r) => r.dishId === dish.id).length;
          return (
            <button
              key={dish.id}
              onClick={() => setSelectedDishFilter(dish.id)}
              className={`px-4 py-2 rounded-full font-grotesk text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs flex items-center gap-1.5 ${
                selectedDishFilter === dish.id
                  ? 'bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white shadow-xs'
                  : 'bg-[#fff5f0] text-[#523932] border border-[#ffded4] hover:border-[#ff4500]'
              }`}
            >
              <span>{dish.name}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    selectedDishFilter === dish.id
                      ? 'bg-white/25 text-white'
                      : 'bg-[#ffded4] text-[#ff4500]'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Reviews List */}
      <div className="relative z-10 flex flex-col gap-6">
        {filteredReviews.length === 0 ? (
          <div className="bg-[#fff9f6] border border-dashed border-[#ffcfc2] rounded-2xl p-8 text-center flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-[#ff781f] mb-2">reviews</span>
            <h4 className="font-garamond text-xl font-bold text-[#1e110d] mb-1">
              Be the First to Review This Dish!
            </h4>
            <p className="font-grotesk text-xs text-[#523932] max-w-md mb-4">
              Share your genuine feedback on flavors, crunch, spices, or authentic heritage recipes and earn your exclusive Foodie Hashtag Badges!
            </p>
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white text-xs font-bold font-grotesk px-5 py-2.5 rounded-xl shadow-xs hover:shadow-md cursor-pointer transition-all"
            >
              Write First Review & Unlock Hashtag
            </button>
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#fffdfc] border border-[#ffded4] hover:border-[#ffcfc2] rounded-2xl p-5 sm:p-6 transition-all shadow-xs"
            >
              {/* Reviewer Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.userAvatar}
                    alt={rev.userName}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#ff781f] shadow-xs shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-garamond font-bold text-base text-[#1e110d]">
                        {rev.userName}
                      </span>
                      {rev.isVerifiedFoodie && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[12px] material-symbols-fill">
                            verified
                          </span>
                          Verified Foodie
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                      <span className="text-[11px] font-grotesk text-[#523932]">
                        {rev.createdAt}
                      </span>
                      <span className="text-[#ffcfc2]">•</span>
                      <div className="flex items-center gap-1">
                        {rev.userHashtags.map((h, i) => (
                          <span
                            key={i}
                            className="bg-gradient-to-r from-[#fff0eb] to-[#ffe5db] text-[#ff4500] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#ffcfc2] font-grotesk"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="flex items-center gap-1 bg-[#fff0eb] text-[#ff4500] border border-[#ffcfc2] px-2.5 py-1 rounded-xl font-grotesk font-bold text-xs shrink-0">
                  <span className="material-symbols-outlined text-amber-500 material-symbols-fill text-sm">
                    star
                  </span>
                  <span>{rev.rating}.0</span>
                </div>
              </div>

              {/* Reviewed Dish Tag & Awarded Hashtag Banner */}
              <div className="my-3 flex flex-wrap items-center gap-2">
                <span className="bg-[#1e110d] text-white text-xs font-grotesk font-semibold px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs">
                  <span className="material-symbols-outlined text-xs text-[#ff781f]">restaurant</span>
                  <span>{rev.dishName}</span>
                </span>

                {rev.awardedHashtag && (
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-grotesk font-bold px-3 py-1 rounded-lg flex items-center gap-1 shadow-2xs">
                    <span className="material-symbols-outlined text-xs material-symbols-fill">
                      military_tech
                    </span>
                    <span>Earned {rev.awardedHashtag}</span>
                  </span>
                )}
              </div>

              {/* Comment Content */}
              <p className="font-grotesk text-sm text-[#2d1811] leading-relaxed my-3 font-normal">
                {rev.comment}
              </p>

              {/* Taste Tags */}
              {rev.tasteTags && rev.tasteTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 my-2">
                  {rev.tasteTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-[#fff2ed] text-[#523932] text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-[#ffded4]"
                    >
                      ✨ {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions: Helpful / Like, Reply count, Reply button */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#ffded4] text-xs font-grotesk">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onLikeReview(rev.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      rev.isLikedByMe
                        ? 'bg-[#ff4500] text-white shadow-xs font-bold'
                        : 'bg-[#fff5f0] text-[#523932] hover:bg-[#ffe6dc] font-semibold'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm material-symbols-fill">
                      thumb_up
                    </span>
                    <span>Helpful ({rev.likesCount})</span>
                  </button>

                  <button
                    onClick={() =>
                      setActiveReplyBoxId((prev) => (prev === rev.id ? null : rev.id))
                    }
                    className="flex items-center gap-1.5 text-[#ff4500] font-bold hover:underline cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">reply</span>
                    <span>
                      {rev.replies?.length > 0
                        ? `Replies (${rev.replies.length})`
                        : 'Reply to this review'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Threaded Replies List */}
              {rev.replies && rev.replies.length > 0 && (
                <div className="mt-4 pl-4 sm:pl-6 border-l-2 border-[#ffded4] flex flex-col gap-3">
                  {rev.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="bg-[#fff9f6] rounded-xl p-3.5 border border-[#ffded4]"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <img
                            src={reply.userAvatar}
                            alt={reply.userName}
                            className="w-7 h-7 rounded-full object-cover border border-[#ff781f]"
                          />
                          <span className="font-garamond font-bold text-sm text-[#1e110d]">
                            {reply.userName}
                          </span>
                          {reply.userHashtags && reply.userHashtags[0] && (
                            <span className="bg-[#fff0eb] text-[#ff4500] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#ffded4]">
                              {reply.userHashtags[0]}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#523932] font-grotesk">
                          {reply.createdAt}
                        </span>
                      </div>

                      <p className="font-grotesk text-xs text-[#3d231b] leading-relaxed">
                        {reply.content}
                      </p>

                      <div className="mt-2 flex items-center justify-end">
                        <button
                          onClick={() => onLikeReply(rev.id, reply.id)}
                          className={`text-[11px] flex items-center gap-1 font-grotesk cursor-pointer transition-colors ${
                            reply.isLikedByMe
                              ? 'text-[#ff4500] font-bold'
                              : 'text-[#523932] hover:text-[#ff4500]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[13px]">favorite</span>
                          <span>{reply.likesCount > 0 ? reply.likesCount : 'Like'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Inline Reply Box */}
              {activeReplyBoxId === rev.id && (
                <div className="mt-4 pt-3 border-t border-[#ffded4] flex items-center gap-2">
                  <input
                    type="text"
                    value={replyInputs[rev.id] || ''}
                    onChange={(e) =>
                      setReplyInputs((prev) => ({ ...prev, [rev.id]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendReply(rev.id);
                    }}
                    placeholder={`Reply to ${rev.userName}'s review on ${rev.dishName}...`}
                    className="flex-grow bg-[#fff5f0] border border-[#ffcfc2] rounded-xl px-3.5 py-2 font-grotesk text-xs text-[#1e110d] placeholder:text-[#523932]/70 outline-hidden focus:border-[#ff4500] focus:bg-white"
                  />
                  <button
                    onClick={() => handleSendReply(rev.id)}
                    disabled={!replyInputs[rev.id]?.trim()}
                    className="bg-gradient-to-r from-[#ff4500] to-[#ff781f] hover:from-[#e63900] hover:to-[#ff5e1a] disabled:opacity-50 text-white font-grotesk text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    Reply
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* WRITE REVIEW MODAL */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-[#ffded4] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#fff5f0] text-[#523932] hover:text-[#ff4500] hover:bg-[#ffe3d8] flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            <div className="flex items-center gap-2.5 mb-1 text-[#ff4500]">
              <span className="material-symbols-outlined text-2xl material-symbols-fill">
                auto_awesome
              </span>
              <h3 className="font-garamond text-2xl font-bold text-[#1e110d]">
                Review a Food Item
              </h3>
            </div>
            <p className="font-grotesk text-xs text-[#523932] mb-5">
              Reviewing at <strong className="text-[#1e110d]">{restaurant.name}</strong> ({restaurant.city})
            </p>

            <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
              {/* Dish Selector */}
              <div>
                <label className="block font-grotesk text-xs font-bold text-[#1e110d] mb-1.5">
                  Select Food Item to Review
                </label>
                <select
                  value={selectedDishId}
                  onChange={(e) => setSelectedDishId(e.target.value)}
                  className="w-full bg-[#fff5f0] border border-[#ffcfc2] rounded-xl px-3.5 py-2.5 font-grotesk text-xs sm:text-sm text-[#1e110d] outline-hidden focus:border-[#ff4500] focus:bg-white"
                >
                  {(restaurant.signatureDishes || []).map((dish) => (
                    <option key={dish.id} value={dish.id}>
                      {dish.name} ({dish.price})
                    </option>
                  ))}
                  <option value="custom">✍️ Other Food Item (Specify Below)</option>
                </select>
              </div>

              {selectedDishId === 'custom' && (
                <div>
                  <label className="block font-grotesk text-xs font-bold text-[#1e110d] mb-1">
                    Dish Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customDishName}
                    onChange={(e) => setCustomDishName(e.target.value)}
                    placeholder="e.g. Pootharekulu, Guntur Mirchi Bajji, Filter Coffee"
                    className="w-full bg-[#fff5f0] border border-[#ffcfc2] rounded-xl px-3.5 py-2 font-grotesk text-xs sm:text-sm text-[#1e110d] outline-hidden focus:border-[#ff4500] focus:bg-white"
                  />
                </div>
              )}

              {/* Star Rating Picker */}
              <div>
                <label className="block font-grotesk text-xs font-bold text-[#1e110d] mb-1.5">
                  Your Rating
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-2xl transition-transform hover:scale-125 cursor-pointer"
                      >
                        <span
                          className={`material-symbols-outlined ${
                            (hoverRating || rating) >= star
                              ? 'text-amber-400 material-symbols-fill'
                              : 'text-zinc-300'
                          }`}
                        >
                          star
                        </span>
                      </button>
                    ))}
                  </div>
                  <span className="font-grotesk text-xs font-bold text-[#ff4500] ml-2">
                    {rating === 5
                      ? '5.0 (Exceptional!)'
                      : rating === 4
                      ? '4.0 (Very Good)'
                      : rating === 3
                      ? '3.0 (Average)'
                      : '2.0 (Needs Improvement)'}
                  </span>
                </div>
              </div>

              {/* Reviewer Name */}
              <div>
                <label className="block font-grotesk text-xs font-bold text-[#1e110d] mb-1">
                  Your Reviewer Name
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Satya Murthy"
                  className="w-full bg-[#fff5f0] border border-[#ffcfc2] rounded-xl px-3.5 py-2 font-grotesk text-xs sm:text-sm text-[#1e110d] outline-hidden focus:border-[#ff4500] focus:bg-white"
                />
              </div>

              {/* Taste Tags */}
              <div>
                <label className="block font-grotesk text-xs font-bold text-[#1e110d] mb-1.5">
                  Taste & Texture Highlights (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {TASTE_TAG_OPTIONS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className={`text-xs font-grotesk px-3 py-1 rounded-full border transition-all cursor-pointer ${
                        selectedTags.includes(tag)
                          ? 'bg-[#ff4500] text-white border-[#ff4500] font-bold shadow-2xs'
                          : 'bg-[#fff5f0] text-[#523932] border-[#ffded4] hover:border-[#ff4500]'
                      }`}
                    >
                      {selectedTags.includes(tag) ? '✓ ' : '+ '}
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detailed Comment Input */}
              <div>
                <label className="block font-grotesk text-xs font-bold text-[#1e110d] mb-1">
                  Detailed Food Review (Flavors, Spices, Ghee, Crispness)
                </label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe your authentic experience: Was the butter fresh? Were the spices balanced? Would you recommend this to fellow foodies?"
                  className="w-full bg-[#fff5f0] border border-[#ffcfc2] rounded-xl px-3.5 py-2 font-grotesk text-xs sm:text-sm text-[#1e110d] placeholder:text-[#523932]/70 outline-hidden focus:border-[#ff4500] focus:bg-white"
                />
              </div>

              {/* Real-time Hashtag Award Preview Banner */}
              {livePreviewBadges && livePreviewBadges.length > 0 && (
                <div className="bg-gradient-to-r from-[#fff0eb] to-[#fff8f2] border-2 border-dashed border-[#ff781f] rounded-2xl p-3.5 flex items-center gap-3 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff4500] to-[#ff8c00] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-xl material-symbols-fill">
                      {livePreviewBadges[0].icon}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff4500] font-grotesk block">
                      Hashtag Reward You Will Unlock
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                      {livePreviewBadges.map((b) => (
                        <span
                          key={b.id}
                          className="bg-[#1e110d] text-white text-xs font-bold px-2.5 py-0.5 rounded-md font-grotesk shadow-xs"
                        >
                          {b.tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!comment.trim()}
                className="w-full bg-gradient-to-r from-[#ff4500] via-[#e63900] to-[#ff781f] hover:from-[#e63900] hover:to-[#ff5e1a] disabled:opacity-50 text-white font-grotesk text-sm font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span className="material-symbols-outlined text-lg">military_tech</span>
                <span>Publish Review & Claim Hashtags</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CELEBRATION HASHTAG AWARDED MODAL */}
      {celebrationBadges && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border-4 border-amber-400 text-center relative overflow-hidden">
            {/* Animated Celebration Background */}
            <div className="absolute -top-16 -right-16 w-44 h-44 bg-gradient-to-br from-amber-400/30 to-orange-500/30 rounded-full blur-2xl pointer-events-none animate-pulse" />
            <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-gradient-to-tr from-red-500/30 to-pink-500/30 rounded-full blur-2xl pointer-events-none animate-pulse" />

            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-[#ff4500] via-amber-500 to-[#ff8c00] text-white flex items-center justify-center shadow-xl border-4 border-white animate-bounce">
                <span className="material-symbols-outlined text-4xl material-symbols-fill">
                  military_tech
                </span>
              </div>

              <span className="bg-amber-100 text-amber-900 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider font-grotesk shadow-2xs">
                ✨ Genuine Foodie Award Unlocked!
              </span>

              <h3 className="font-garamond text-3xl font-bold text-[#1e110d] mt-3 mb-1">
                Congratulations!
              </h3>
              <p className="font-grotesk text-xs sm:text-sm text-[#523932] mb-6">
                Your genuine culinary review on <strong>{restaurant.name}</strong> was recognized by the community! You've been awarded:
              </p>

              <div className="flex flex-col gap-2.5 mb-6">
                {celebrationBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-gradient-to-r from-[#fff0eb] to-[#fff5ee] border-2 border-[#ff781f] p-3 rounded-2xl flex items-center gap-3 text-left shadow-md"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#1e110d] text-amber-400 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xl material-symbols-fill">
                        {badge.icon}
                      </span>
                    </div>
                    <div>
                      <span className="font-garamond font-bold text-base text-[#ff4500] block">
                        {badge.tag}
                      </span>
                      <span className="font-grotesk text-[11px] text-[#523932] block">
                        {badge.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setCelebrationBadges(null)}
                className="w-full bg-gradient-to-r from-[#ff4500] to-[#ff781f] hover:from-[#e63900] hover:to-[#ff5e1a] text-white font-grotesk text-sm font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                Awesome! View My Review
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
