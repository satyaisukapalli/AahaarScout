import React, { useState } from 'react';
import { AuthUser, ForumCategory, ForumPost, ForumPostReply } from '../types';
import { INITIAL_FORUM_POSTS } from '../data/forumPosts';
import { LiveMemeCreator } from './LiveMemeCreator';
import { NewPostModal } from './NewPostModal';
import { validateContent } from '../utils/contentModerator';
import { 
  MessageSquare, Sparkles, Flame, Heart, Smile, Video, Image as ImageIcon, 
  Film, Plus, Search, Filter, ShieldCheck, CheckCircle2, 
  Send, Share2, Flag, BarChart3, AlertCircle, Play, Pause, 
  Volume2, VolumeX, Award, ArrowUpRight, TrendingUp, Users
} from 'lucide-react';

interface CommunityForumScreenProps {
  authUser: AuthUser | null;
  onRequireAuth: (reason: string) => void;
  isVegOnly?: boolean;
  onNavigateHome: () => void;
}

const CATEGORY_ITEMS: { id: ForumCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'All Feeds', icon: '✨' },
  { id: 'biryani-wars', label: 'Biryani Wars', icon: '🍲' },
  { id: 'spicy-street', label: 'Spicy & Street', icon: '🌶️' },
  { id: 'tiffins-coffee', label: 'Tiffins & Coffee', icon: '☕' },
  { id: 'pure-veg', label: 'Pure Veg Haven', icon: '🌱' },
  { id: 'memes-humor', label: 'Food Memes & Humour', icon: '😂' },
  { id: 'shorts-15s', label: '15s Video Shorts', icon: '📹' },
  { id: 'recommendations', label: 'Foodie Recommendations', icon: '💡' },
];

export const CommunityForumScreen: React.FC<CommunityForumScreenProps> = ({
  authUser,
  onRequireAuth,
  isVegOnly = false,
  onNavigateHome,
}) => {
  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_FORUM_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'feed' | 'meme-studio' | 'shorts'>('feed');
  
  // Modals & Creation
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [initialMemeData, setInitialMemeData] = useState<{
    imageUrl: string;
    title: string;
    memeTopText: string;
    memeBottomText: string;
    category: string;
  } | null>(null);

  // Active Expanded Comments
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({
    'post-1': true,
    'post-2': true,
  });

  // Reply Drafts per post
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [replyErrors, setReplyErrors] = useState<Record<string, string | null>>({});

  // Video Playing States
  const [playingVideos, setPlayingVideos] = useState<Record<string, boolean>>({});
  const [mutedVideos, setMutedVideos] = useState<Record<string, boolean>>({});

  // Report Feedback
  const [reportedPosts, setReportedPosts] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    if (post.isReported && reportedPosts[post.id]) return false;

    // Veg Only Filter
    if (isVegOnly && post.category !== 'pure-veg' && post.category !== 'tiffins-coffee') {
      const lowerText = (post.title + ' ' + post.content + ' ' + post.tags.join(' ')).toLowerCase();
      if (lowerText.includes('mutton') || lowerText.includes('chicken') || lowerText.includes('fish') || lowerText.includes('prawn')) {
        return false;
      }
    }

    // Category Filter
    if (selectedCategory !== 'all' && post.category !== selectedCategory) {
      return false;
    }

    // Shorts Tab
    if (activeTab === 'shorts') {
      const hasVideo = post.media?.some((m) => m.type === 'video');
      if (!hasVideo && post.category !== 'shorts-15s') return false;
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchContent = post.content.toLowerCase().includes(q);
      const matchTag = post.tags.some((t) => t.toLowerCase().includes(q));
      const matchAuthor = post.authorName.toLowerCase().includes(q);
      if (!matchTitle && !matchContent && !matchTag && !matchAuthor) return false;
    }

    return true;
  });

  // Handle Post Creation
  const handlePostCreated = (newPost: ForumPost) => {
    setPosts([newPost, ...posts]);
    setActiveTab('feed');
    showToast('🎉 Your discussion post is live on the Aahaarscout forum!');
  };

  // Handle Meme Post from Meme Creator
  const handlePostMemeFromStudio = (memeData: {
    imageUrl: string;
    title: string;
    memeTopText: string;
    memeBottomText: string;
    category: string;
  }) => {
    if (!authUser) {
      setInitialMemeData(memeData);
      onRequireAuth('Publish Live Meme to Forum');
      return;
    }

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      authorId: authUser.id,
      authorName: authUser.name,
      authorAvatar: authUser.avatar,
      authorBadge: '😂 Chief Meme Chef',
      authorCity: authUser.favoriteCity || 'South India',
      category: 'memes-humor',
      title: memeData.title || 'Live Foodie Meme',
      content: `Freshly created in Aahaarscout Live Meme Studio! ${memeData.memeTopText} 🤤`,
      tags: ['#LiveFoodMeme', '#AahaarscoutHumor', '#RelatableFoodie'],
      media: [
        {
          id: `med-${Date.now()}`,
          type: 'meme',
          url: memeData.imageUrl,
          memeTopText: memeData.memeTopText,
          memeBottomText: memeData.memeBottomText,
          title: memeData.title,
        },
      ],
      createdAt: 'Just now',
      likesCount: 1,
      reactions: {
        spicy: 0,
        drool: 1,
        laugh: 2,
        heart: 1,
      },
      userReaction: 'laugh',
      isLikedByMe: true,
      viewsCount: 1,
      repliesCount: 0,
      replies: [],
      moderationStatus: 'approved',
    };

    setPosts([newPost, ...posts]);
    setActiveTab('feed');
    showToast('✨ Live Food Meme published to Forum successfully!');
  };

  // Reactions Handler
  const handleReaction = (postId: string, reactionType: 'spicy' | 'drool' | 'laugh' | 'heart') => {
    if (!authUser) {
      onRequireAuth('React to Forum Discussions');
      return;
    }

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;

        const currentReaction = p.userReaction;
        const newReactions = { ...p.reactions };

        if (currentReaction === reactionType) {
          // Untoggle
          newReactions[reactionType] = Math.max(0, newReactions[reactionType] - 1);
          return {
            ...p,
            userReaction: null,
            reactions: newReactions,
            likesCount: Math.max(0, p.likesCount - 1),
            isLikedByMe: false,
          };
        } else {
          // If had prior reaction, decrement it
          if (currentReaction) {
            newReactions[currentReaction] = Math.max(0, newReactions[currentReaction] - 1);
          }
          newReactions[reactionType] = (newReactions[reactionType] || 0) + 1;
          return {
            ...p,
            userReaction: reactionType,
            reactions: newReactions,
            likesCount: p.isLikedByMe ? p.likesCount : p.likesCount + 1,
            isLikedByMe: true,
          };
        }
      })
    );
  };

  // Poll Voting Handler
  const handlePollVote = (postId: string, optionId: string) => {
    if (!authUser) {
      onRequireAuth('Vote on Community Polls');
      return;
    }

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId || !p.poll) return p;

        const poll = p.poll;
        if (poll.hasVoted) return p; // prevent double vote

        const updatedOptions = poll.options.map((opt) => {
          if (opt.id === optionId) {
            return {
              ...opt,
              votes: opt.votes + 1,
              votedUserIds: [...opt.votedUserIds, authUser.id],
            };
          }
          return opt;
        });

        return {
          ...p,
          poll: {
            ...poll,
            options: updatedOptions,
            totalVotes: poll.totalVotes + 1,
            hasVoted: true,
          },
        };
      })
    );
    showToast('✓ Your vote has been recorded!');
  };

  // Submit Reply with Strict Content Moderation
  const handleAddReply = (postId: string) => {
    if (!authUser) {
      onRequireAuth('Reply to Forum Discussions');
      return;
    }

    const draft = replyDrafts[postId] || '';
    if (!draft.trim()) return;

    // Strict vulgarity / obscenity validation
    const moderation = validateContent(draft, 'comment reply');
    if (!moderation.isValid) {
      setReplyErrors({
        ...replyErrors,
        [postId]: moderation.reason || 'Prohibited vulgarity detected in reply.',
      });
      return;
    }

    const newReply: ForumPostReply = {
      id: `rep-${Date.now()}`,
      postId,
      userId: authUser.id,
      userName: authUser.name,
      userAvatar: authUser.avatar,
      userBadge: authUser.dietaryPreference === 'veg' ? '🌱 Pure Veg' : '🍴 Foodie',
      content: draft.trim(),
      createdAt: 'Just now',
      likesCount: 0,
      isLikedByMe: false,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          repliesCount: p.repliesCount + 1,
          replies: [...p.replies, newReply],
        };
      })
    );

    // Clear Draft
    setReplyDrafts({ ...replyDrafts, [postId]: '' });
    setReplyErrors({ ...replyErrors, [postId]: null });
    showToast('💬 Reply posted to discussion!');
  };

  // Report Post
  const handleReportPost = (postId: string) => {
    setReportedPosts({ ...reportedPosts, [postId]: true });
    showToast('🛡️ Post flagged and submitted to safety moderation.');
  };

  return (
    <div className="min-h-screen bg-[#faf7f5] pb-24 pt-4 sm:pt-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Forum Hero Header */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#2a1810] via-[#3a1d13] to-[#1a0f0a] text-white p-6 sm:p-10 mb-8 shadow-xl border border-orange-900/30">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#ff4500] text-white shadow-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  FOODIE COMMUNITY FORUM
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  100% Family Friendly • Zero Vulgarity Policy
                </span>
              </div>

              <h1 className="font-syne text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
                Debates, Memes, GIFs & 15s Shorts
              </h1>
              <p className="text-sm sm:text-base text-orange-200/90 leading-relaxed">
                Connect with registered food lovers across South India. Share authentic taste verdicts, 
                generate live memes, post delicious clips, and discover hidden regional gems!
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-5 text-xs text-orange-300">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#ff781f]" />
                  <span><strong>14,800+</strong> Registered Foodies</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-[#ff4500]" />
                  <span><strong>2,400+</strong> Active Food Debates</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>AI Pre-Moderated</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <button
                onClick={() => {
                  if (!authUser) {
                    onRequireAuth('Create Discussion or Post');
                    return;
                  }
                  setIsNewPostModalOpen(true);
                }}
                className="py-3 px-5 rounded-2xl text-sm font-bold bg-gradient-to-r from-[#ff4500] to-[#ad2c00] hover:from-[#ff5714] hover:to-[#be3100] text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer scale-100 hover:scale-102"
              >
                <Plus className="w-4 h-4" />
                Start Discussion / Post
              </button>

              <button
                onClick={() => setActiveTab('meme-studio')}
                className="py-3 px-5 rounded-2xl text-sm font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Smile className="w-4 h-4 text-amber-400" />
                Open Live Meme Studio
              </button>
            </div>
          </div>
        </div>

        {/* Active Account / Sign-in Status Banner */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 mb-6 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {authUser ? (
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={authUser.avatar}
                alt={authUser.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border-2 border-orange-300 shadow-xs shrink-0"
              />
              <div className="min-w-0 truncate">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-syne font-bold text-sm text-gray-900 truncate">
                    {authUser.name}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#ff4500]">
                    {authUser.dietaryPreference === 'veg' ? '🌱 Pure Veg Foodie' : '👑 Verified Foodie'}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">
                    📍 {authUser.favoriteCity || 'South India'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">
                  Signed in as <span className="text-gray-700 font-medium">{authUser.email}</span> • Posts, live memes & comments will be published under this account
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                👤
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-gray-900">
                  Join the Community as a Registered Foodie
                </p>
                <p className="text-xs text-gray-500">
                  Sign in with your Google or Email account to upload posts, memes, and comments with your credentials.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {authUser ? (
              <button
                type="button"
                onClick={() => onRequireAuth('Switch Account to Post')}
                className="px-3.5 py-1.5 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 text-xs font-bold text-gray-700 hover:text-[#ff4500] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Switch / Sign In as Another User</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onRequireAuth('Sign In to Post in Forum')}
                className="px-4 py-2 rounded-xl bg-[#ff4500] hover:bg-[#e63e00] text-xs font-bold text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Sign In or Register</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs (Feed, Meme Studio, 15s Shorts) */}
        <div className="flex items-center justify-between border-b border-gray-200 mb-6 overflow-x-auto pb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'feed'
                  ? 'bg-white text-[#ad2c00] shadow-sm border border-gray-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Discussions & Media Feed
            </button>

            <button
              onClick={() => setActiveTab('meme-studio')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'meme-studio'
                  ? 'bg-white text-[#ff4500] shadow-sm border border-orange-200 ring-2 ring-orange-400/20'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Live Meme Studio
            </button>

            <button
              onClick={() => setActiveTab('shorts')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'shorts'
                  ? 'bg-white text-red-600 shadow-sm border border-red-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
              }`}
            >
              <Video className="w-4 h-4 text-red-500" />
              15s Video Shorts
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[200px] sm:min-w-[280px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, memes, #tags..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#ff4500] bg-white text-gray-900 shadow-2xs"
            />
          </div>
        </div>

        {/* LIVE MEME STUDIO SECTION (If activeTab === 'meme-studio') */}
        {activeTab === 'meme-studio' && (
          <div className="mb-10 animate-fadeIn">
            <LiveMemeCreator
              onPostMemeToForum={handlePostMemeFromStudio}
              isVegOnly={isVegOnly}
            />
          </div>
        )}

        {/* Category Filter Chips (Horizontal Scrollable) */}
        {activeTab !== 'meme-studio' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
            {CATEGORY_ITEMS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                  selectedCategory === cat.id
                    ? isVegOnly
                      ? 'bg-emerald-600 text-white shadow-sm scale-102'
                      : 'bg-[#ad2c00] text-white shadow-sm scale-102'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Main Grid: Forum Feed & Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left / Center: Forum Posts Feed (8 Columns) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Empty State */}
            {filteredPosts.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-[#ff4500] mb-3 text-2xl">
                  🍜
                </div>
                <h3 className="font-syne font-bold text-gray-900 text-lg mb-1">
                  No discussions found
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mb-4">
                  Be the first foodie to spark a debate or share a sizzling 15-second clip in this category!
                </p>
                <button
                  onClick={() => setIsNewPostModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#ad2c00] text-white shadow-md cursor-pointer hover:bg-[#8c2300]"
                >
                  Start First Discussion
                </button>
              </div>
            )}

            {/* Posts Feed */}
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                id={`forum-post-${post.id}`}
                className="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Post Header: Author, Badge, Time & Category */}
                <div className="p-4 sm:p-5 pb-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-orange-200"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-grotesk font-bold text-gray-900 text-sm">
                          {post.authorName}
                        </span>
                        {post.authorBadge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60">
                            {post.authorBadge}
                          </span>
                        )}
                        {post.authorCity && (
                          <span className="text-[10px] text-gray-400 font-medium">
                            • {post.authorCity}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400 block">
                        {post.createdAt}
                      </span>
                    </div>
                  </div>

                  {/* Category Pill & Flag Menu */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 capitalize">
                      {post.category.replace('-', ' ')}
                    </span>
                    <button
                      onClick={() => handleReportPost(post.id)}
                      title="Report / Flag Post for Vulgarity"
                      className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Post Title & Content */}
                <div className="px-4 sm:px-5 pb-3">
                  <h3 className="font-syne font-bold text-gray-900 text-base sm:text-lg mb-1.5 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  {/* Hashtags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {post.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          onClick={() => setSearchQuery(tag.replace('#', ''))}
                          className="text-[11px] font-medium text-[#ad2c00] hover:underline cursor-pointer"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Interactive Poll Component (If attached) */}
                {post.poll && (
                  <div className="mx-4 sm:mx-5 mb-4 p-4 rounded-xl bg-orange-50/60 border border-orange-200/80">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 className="w-4 h-4 text-[#ff4500]" />
                      <span className="font-grotesk text-xs font-bold uppercase tracking-wider text-gray-900">
                        {post.poll.question}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {post.poll.options.map((opt) => {
                        const total = post.poll?.totalVotes || 1;
                        const pct = Math.round((opt.votes / total) * 100);
                        const hasVotedThis = authUser && opt.votedUserIds?.includes(authUser.id);

                        return (
                          <button
                            key={opt.id}
                            onClick={() => handlePollVote(post.id, opt.id)}
                            className={`w-full text-left p-3 rounded-xl border relative overflow-hidden transition-all cursor-pointer ${
                              hasVotedThis
                                ? 'border-[#ff4500] ring-1 ring-[#ff4500] bg-orange-100/40'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            {/* Animated progress bar fill */}
                            <div
                              className="absolute left-0 top-0 bottom-0 bg-orange-200/40 transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            ></div>

                            <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-gray-900">
                              <span className="flex items-center gap-1.5">
                                {hasVotedThis && <span className="text-[#ff4500]">✓</span>}
                                {opt.text}
                              </span>
                              <span className="font-mono text-gray-600">
                                {pct}% ({opt.votes})
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-2.5 text-[10px] text-gray-500 font-mono flex items-center justify-between">
                      <span>Total Votes: {post.poll.totalVotes}</span>
                      <span>{post.poll.hasVoted ? '✓ You voted' : 'Click any option to vote'}</span>
                    </div>
                  </div>
                )}

                {/* Media Attachment Renderers (Photo, 15s Video, GIF, Meme) */}
                {post.media && post.media.length > 0 && (
                  <div className="px-4 sm:px-5 pb-3">
                    {post.media.map((med) => (
                      <div
                        key={med.id}
                        className="rounded-xl overflow-hidden border border-gray-200 bg-neutral-950 relative"
                      >
                        {/* 15-SECOND VIDEO PLAYER */}
                        {med.type === 'video' && (
                          <div className="relative aspect-video max-h-[380px] w-full flex items-center justify-center bg-black">
                            <video
                              src={med.url}
                              poster={med.thumbnailUrl}
                              playsInline
                              loop
                              muted={mutedVideos[med.id] !== false}
                              autoPlay={playingVideos[med.id] ?? false}
                              controls
                              className="w-full h-full object-contain"
                            />

                            {/* 15s Video Badge */}
                            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1.5 border border-white/20 shadow-md">
                              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                              ⚡ 15s FOOD SHORT
                            </div>
                          </div>
                        )}

                        {/* LIVE MEME / PHOTO / GIF */}
                        {med.type !== 'video' && (
                          <div className="relative max-h-[420px] w-full overflow-hidden flex items-center justify-center bg-neutral-900">
                            <img
                              src={med.url}
                              alt={med.title || 'Attached Media'}
                              referrerPolicy="no-referrer"
                              className="w-full h-auto max-h-[420px] object-contain"
                            />
                            {med.type === 'gif' && (
                              <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold font-mono">
                                GIF
                              </span>
                            )}
                            {med.type === 'meme' && (
                              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold shadow-xs">
                                😂 LIVE MEME
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 4-Way Reaction Bar & Comments Toggle */}
                <div className="px-4 sm:px-5 py-3 bg-gray-50/70 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  {/* Reactions */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Spicy 🔥 */}
                    <button
                      onClick={() => handleReaction(post.id, 'spicy')}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                        post.userReaction === 'spicy'
                          ? 'bg-red-100 border-red-400 text-red-700 shadow-2xs scale-105'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>🔥</span>
                      <span>{post.reactions.spicy || 0}</span>
                    </button>

                    {/* Drool 🤤 */}
                    <button
                      onClick={() => handleReaction(post.id, 'drool')}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                        post.userReaction === 'drool'
                          ? 'bg-amber-100 border-amber-400 text-amber-800 shadow-2xs scale-105'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>🤤</span>
                      <span>{post.reactions.drool || 0}</span>
                    </button>

                    {/* Laugh 😂 */}
                    <button
                      onClick={() => handleReaction(post.id, 'laugh')}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                        post.userReaction === 'laugh'
                          ? 'bg-yellow-100 border-yellow-400 text-yellow-800 shadow-2xs scale-105'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>😂</span>
                      <span>{post.reactions.laugh || 0}</span>
                    </button>

                    {/* Love ❤️ */}
                    <button
                      onClick={() => handleReaction(post.id, 'heart')}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                        post.userReaction === 'heart'
                          ? 'bg-pink-100 border-pink-400 text-pink-700 shadow-2xs scale-105'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>❤️</span>
                      <span>{post.reactions.heart || 0}</span>
                    </button>
                  </div>

                  {/* Right Actions: Comments Count & Share */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setExpandedComments({
                          ...expandedComments,
                          [post.id]: !expandedComments[post.id],
                        })
                      }
                      className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      <span>{post.repliesCount || post.replies.length} Replies</span>
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText?.(window.location.href);
                        showToast('🔗 Discussion link copied to clipboard!');
                      }}
                      className="text-gray-400 hover:text-gray-700 cursor-pointer p-1"
                      title="Share Discussion"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* EXPANDABLE COMMENT REPLIES SECTION */}
                {expandedComments[post.id] && (
                  <div className="px-4 sm:px-5 py-4 bg-gray-50/50 border-t border-gray-200 animate-fadeIn">
                    {/* Existing Replies List */}
                    <div className="space-y-3 mb-4">
                      {post.replies.map((rep) => (
                        <div
                          key={rep.id}
                          className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-start gap-3"
                        >
                          <img
                            src={rep.userAvatar}
                            alt={rep.userName}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-full object-cover border border-orange-200 shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xs text-gray-900">
                                  {rep.userName}
                                </span>
                                {rep.userBadge && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-orange-50 text-[#ad2c00]">
                                    {rep.userBadge}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-gray-400 font-mono">
                                {rep.createdAt}
                              </span>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed">
                              {rep.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Reply Input Box */}
                    <div className="flex flex-col gap-2">
                      {replyErrors[post.id] && (
                        <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{replyErrors[post.id]}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={replyDrafts[post.id] || ''}
                          onChange={(e) => {
                            setReplyDrafts({ ...replyDrafts, [post.id]: e.target.value });
                            setReplyErrors({ ...replyErrors, [post.id]: null });
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddReply(post.id);
                          }}
                          placeholder={
                            authUser
                              ? 'Write a respectful foodie reply...'
                              : 'Sign in to participate in discussion...'
                          }
                          className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#ff4500] bg-white text-gray-900 shadow-2xs"
                        />
                        <button
                          onClick={() => handleAddReply(post.id)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#ad2c00] hover:bg-[#8c2300] text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Sidebar: Rules, Live Meme Teaser & Foodie Leaderboard (4 Columns) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Community Safety & Strict Anti-Vulgarity Policy Card */}
            <div className="bg-white rounded-2xl border border-emerald-200/80 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-syne font-bold text-gray-900 text-sm">
                  Zero Vulgarity Community Policy
                </h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                Aahaarscout is an inclusive, family-friendly food discovery network.
              </p>
              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>15s video clips, gifs, memes and respectful foodie banter are warmly welcome.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✗</span>
                  <span>Profanity, obscenity, slurs, and abusive language are automatically blocked.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>All community flags are reviewed instantaneously.</span>
                </li>
              </ul>
            </div>

            {/* Live Meme Studio Widget Teaser */}
            <div className="rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-[#ff4500] text-white p-5 shadow-md flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold mb-2 inline-block">
                  CREATIVE HUB
                </span>
                <h3 className="font-syne font-bold text-lg mb-1">
                  Live Meme Studio
                </h3>
                <p className="text-xs text-white/90 leading-relaxed mb-4">
                  Turn hilarious South Indian dining moments into viral memes with custom captions and stickers!
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveTab('meme-studio');
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-white text-gray-900 hover:bg-orange-50 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer font-grotesk"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ff4500]" />
                Launch Live Meme Studio
              </button>
            </div>

            {/* Trending Food Hashtags */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-[#ff4500]" />
                <h3 className="font-syne font-bold text-gray-900 text-sm">
                  Trending Debates This Week
                </h3>
              </div>
              <div className="space-y-2.5">
                {[
                  { tag: '#BiryaniWars', posts: '1,240 foodies talking' },
                  { tag: '#GheeRoastDosa', posts: '890 debates' },
                  { tag: '#FilterCoffeeCult', posts: '670 discussions' },
                  { tag: '#GunturMirchiChallenge', posts: '530 hot takes' },
                  { tag: '#PureVegHavens', posts: '410 recommendations' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchQuery(item.tag.replace('#', ''));
                      setActiveTab('feed');
                    }}
                    className="w-full text-left flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-xs"
                  >
                    <span className="font-bold text-[#ad2c00]">{item.tag}</span>
                    <span className="text-[11px] text-gray-400 font-mono">{item.posts}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Top Foodie Contributors */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-amber-500" />
                <h3 className="font-syne font-bold text-gray-900 text-sm">
                  Top Foodie Critics
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Satya Isukapalli', badge: '👑 Top Food Critic', city: 'Vijayawada', score: '984 pts', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
                  { name: 'Rohit Varma', badge: '🌶️ Spice Master', city: 'Hyderabad', score: '820 pts', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
                  { name: 'Priya Narayanan', badge: '🌱 Pure Veg Guide', city: 'Chennai', score: '760 pts', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
                ].map((critic, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={critic.img}
                        alt={critic.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover border border-orange-200"
                      />
                      <div>
                        <span className="font-bold text-xs text-gray-900 block">
                          {critic.name}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {critic.badge} • {critic.city}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#ad2c00]">
                      {critic.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      <NewPostModal
        isOpen={isNewPostModalOpen}
        onClose={() => {
          setIsNewPostModalOpen(false);
          setInitialMemeData(null);
        }}
        onPostCreated={handlePostCreated}
        authUser={authUser}
        onRequireAuth={onRequireAuth}
        isVegOnly={isVegOnly}
        initialMemeData={initialMemeData}
      />
    </div>
  );
};
