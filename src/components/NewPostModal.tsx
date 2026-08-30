import React, { useState, useRef } from 'react';
import { AuthUser, ForumCategory, ForumPost, MediaAttachment, ForumPoll } from '../types';
import { validateForumPostInput, validateVideoDuration } from '../utils/contentModerator';
import { CURATED_FOOD_GIFS, SAMPLE_15S_VIDEOS } from '../data/memeTemplates';
import { 
  X, Image as ImageIcon, Video, Smile, BarChart2, AlertCircle, 
  Send, Sparkles, Check, Play, Pause, Film, FileText, Hash
} from 'lucide-react';

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (newPost: ForumPost) => void;
  authUser: AuthUser | null;
  onRequireAuth: (reason: string) => void;
  isVegOnly?: boolean;
  initialCategory?: ForumCategory;
  initialMemeData?: {
    imageUrl: string;
    title: string;
    memeTopText: string;
    memeBottomText: string;
    category: string;
  } | null;
}

export const NewPostModal: React.FC<NewPostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
  authUser,
  onRequireAuth,
  isVegOnly = false,
  initialCategory = 'spicy-street',
  initialMemeData = null,
}) => {
  const [title, setTitle] = useState(initialMemeData?.title || '');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<ForumCategory>(
    (initialMemeData?.category as ForumCategory) || initialCategory
  );
  const [tagsInput, setTagsInput] = useState('#FoodieDebate #SouthIndia');

  // Media Tab
  const [activeMediaTab, setActiveMediaTab] = useState<'none' | 'photo' | 'video' | 'gif' | 'meme' | 'poll'>(
    initialMemeData ? 'meme' : 'none'
  );

  // Photo
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoTitle, setPhotoTitle] = useState('');

  // Video (15s limit)
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDuration, setVideoDuration] = useState<number>(12);
  const [videoTitle, setVideoTitle] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // GIF
  const [selectedGifUrl, setSelectedGifUrl] = useState('');

  // Meme
  const [memeUrl, setMemeUrl] = useState(initialMemeData?.imageUrl || '');
  const [memeTopText, setMemeTopText] = useState(initialMemeData?.memeTopText || '');
  const [memeBottomText, setMemeBottomText] = useState(initialMemeData?.memeBottomText || '');

  // Poll
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

  // Moderation & Error state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please select a valid image file (PNG/JPG/WEBP).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
          setErrorMessage(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setErrorMessage('Please upload an MP4 or WebM video file.');
        return;
      }

      // Check video duration via video element metadata
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoElement.src);
        const duration = videoElement.duration;
        const durCheck = validateVideoDuration(duration);
        if (!durCheck.isValid) {
          setErrorMessage(durCheck.message || 'Video exceeds 15 seconds limit.');
          return;
        }
        setVideoDuration(Math.round(duration));
        setErrorMessage(null);
      };

      const objectUrl = URL.createObjectURL(file);
      videoElement.src = objectUrl;
      setVideoUrl(objectUrl);
    }
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const updatePollOption = (index: number, text: string) => {
    const updated = [...pollOptions];
    updated[index] = text;
    setPollOptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Registered User Check
    if (!authUser) {
      onRequireAuth('Join Discussion & Post Media');
      return;
    }

    if (!title.trim()) {
      setErrorMessage('Please add a descriptive title for your post.');
      return;
    }

    if (!content.trim()) {
      setErrorMessage('Please provide some details or description.');
      return;
    }

    // 2. Parse Tags
    const tags = tagsInput
      .split(/[\s,]+/)
      .filter((t) => t.trim().length > 0)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    // 3. Strict Vulgarity & Obscenity Check
    const moderation = validateForumPostInput({
      title,
      content,
      memeTopText: activeMediaTab === 'meme' ? memeTopText : undefined,
      memeBottomText: activeMediaTab === 'meme' ? memeBottomText : undefined,
      tags,
      pollQuestion: activeMediaTab === 'poll' ? pollQuestion : undefined,
      pollOptions: activeMediaTab === 'poll' ? pollOptions.filter((o) => o.trim().length > 0) : undefined,
    });

    if (!moderation.isValid) {
      setErrorMessage(moderation.reason || 'Content violates family-friendly community guidelines.');
      return;
    }

    // 4. Assemble Media Attachments
    const mediaList: MediaAttachment[] = [];

    if (activeMediaTab === 'photo' && photoUrl) {
      mediaList.push({
        id: `med-${Date.now()}`,
        type: 'photo',
        url: photoUrl,
        title: photoTitle || title,
      });
    } else if (activeMediaTab === 'video' && videoUrl) {
      mediaList.push({
        id: `med-${Date.now()}`,
        type: 'video',
        url: videoUrl,
        durationSeconds: Math.min(15, videoDuration || 12),
        title: videoTitle || title,
      });
    } else if (activeMediaTab === 'gif' && selectedGifUrl) {
      mediaList.push({
        id: `med-${Date.now()}`,
        type: 'gif',
        url: selectedGifUrl,
        title: 'Food GIF',
      });
    } else if (activeMediaTab === 'meme' && memeUrl) {
      mediaList.push({
        id: `med-${Date.now()}`,
        type: 'meme',
        url: memeUrl,
        memeTopText,
        memeBottomText,
        title: title || 'Live Food Meme',
      });
    }

    // 5. Assemble Poll if active
    let pollObj: ForumPoll | undefined = undefined;
    if (activeMediaTab === 'poll' && pollQuestion.trim()) {
      const validOptions = pollOptions.filter((o) => o.trim().length > 0);
      if (validOptions.length < 2) {
        setErrorMessage('Please provide at least 2 poll choices.');
        return;
      }
      pollObj = {
        question: pollQuestion,
        totalVotes: 1,
        hasVoted: true,
        options: validOptions.map((opt, idx) => ({
          id: `opt-${Date.now()}-${idx}`,
          text: opt,
          votes: idx === 0 ? 1 : 0,
          votedUserIds: idx === 0 ? [authUser.id] : [],
        })),
      };
    }

    setIsSubmitting(true);

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      authorId: authUser.id,
      authorName: authUser.name,
      authorAvatar: authUser.avatar,
      authorBadge: authUser.dietaryPreference === 'veg' ? '🌱 Pure Veg Foodie' : '👑 Verified Foodie',
      authorCity: authUser.favoriteCity || 'South India',
      category,
      title: title.trim(),
      content: content.trim(),
      tags,
      media: mediaList.length > 0 ? mediaList : undefined,
      poll: pollObj,
      createdAt: 'Just now',
      likesCount: 1,
      reactions: {
        spicy: 0,
        drool: 1,
        laugh: category === 'memes-humor' ? 1 : 0,
        heart: 1,
      },
      userReaction: 'drool',
      isLikedByMe: true,
      viewsCount: 12,
      repliesCount: 0,
      replies: [],
      moderationStatus: 'approved',
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onPostCreated(newPost);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[#ff4500]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-syne font-bold text-gray-900 text-lg">
                Create Foodie Discussion Post
              </h3>
              <p className="text-xs text-gray-500">
                Share foodie debates, live memes, gifs, and 15s video clips
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Identity Banner */}
        {authUser ? (
          <div className="px-6 py-2.5 bg-orange-50/70 border-b border-orange-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={authUser.avatar}
                alt={authUser.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover border border-orange-300 shrink-0"
              />
              <div className="truncate">
                <span className="text-xs font-bold text-gray-900 truncate">
                  Posting as <span className="text-[#ff4500] font-extrabold">{authUser.name}</span>
                </span>
                <span className="text-[11px] text-gray-500 ml-1.5 hidden sm:inline truncate">
                  ({authUser.email}) • 📍 {authUser.favoriteCity || 'South India'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onRequireAuth('Switch Account to Post')}
              className="text-[11px] font-bold text-[#ff4500] hover:underline cursor-pointer ml-2 shrink-0"
            >
              Switch User
            </button>
          </div>
        ) : (
          <div className="px-6 py-3 bg-amber-50 border-b border-amber-200 flex items-center justify-between text-xs text-amber-800">
            <span>You must be signed in with your foodie account to post.</span>
            <button
              type="button"
              onClick={() => onRequireAuth('Post to Foodie Forum')}
              className="font-bold text-[#ff4500] underline hover:opacity-80 cursor-pointer"
            >
              Sign In / Register
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {/* Moderation Alert Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Content Blocked: </span>
                {errorMessage}
              </div>
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ForumCategory)}
              className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#ff4500] bg-white text-gray-900 cursor-pointer"
            >
              <option value="biryani-wars">🍲 Biryani & Rice Wars</option>
              <option value="spicy-street">🌶️ Spicy & Street Food Adventures</option>
              <option value="tiffins-coffee">☕ South Indian Tiffins & Filter Coffee</option>
              <option value="pure-veg">🌱 100% Pure Veg Haven</option>
              <option value="memes-humor">😂 Food Memes & Humour</option>
              <option value="shorts-15s">📹 15s Sizzling Food Shorts</option>
              <option value="recommendations">💡 Restaurant Recommendations</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Title / Debate Question *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="e.g. Is Brahmin's filter coffee better than Chennai degree coffee?"
              className="w-full px-4 py-2.5 text-sm font-bold rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#ff4500] bg-white text-gray-900"
              required
            />
          </div>

          {/* Description / Body */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Content & Details *
            </label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="Share the taste breakdown, spice levels, aroma, memories or reason behind your pick..."
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#ff4500] bg-white text-gray-900 resize-none"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Hash className="w-3.5 h-3.5" />
              Hashtag Tags
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="#HyderabadBiryani #FilterCoffee #AndhraSpicy"
              className="w-full px-4 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#ff4500] bg-white text-gray-900 font-mono"
            />
          </div>

          {/* Media Attachments Selector */}
          <div className="border border-gray-200 rounded-xl p-3.5 bg-gray-50/50">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Attach Media / Interactive Element
            </label>

            {/* Media Type Tabs */}
            <div className="grid grid-cols-6 gap-1.5 p-1 bg-gray-200 rounded-xl mb-3 text-xs font-bold text-gray-700">
              <button
                type="button"
                onClick={() => setActiveMediaTab('none')}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeMediaTab === 'none' ? 'bg-white text-black shadow-xs' : 'hover:text-black'
                }`}
              >
                None
              </button>
              <button
                type="button"
                onClick={() => setActiveMediaTab('photo')}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeMediaTab === 'photo' ? 'bg-white text-black shadow-xs' : 'hover:text-black'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Photo
              </button>
              <button
                type="button"
                onClick={() => setActiveMediaTab('video')}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeMediaTab === 'video' ? 'bg-white text-[#ad2c00] shadow-xs' : 'hover:text-black'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                15s Video
              </button>
              <button
                type="button"
                onClick={() => setActiveMediaTab('gif')}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeMediaTab === 'gif' ? 'bg-white text-black shadow-xs' : 'hover:text-black'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                GIF
              </button>
              <button
                type="button"
                onClick={() => setActiveMediaTab('meme')}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeMediaTab === 'meme' ? 'bg-white text-[#ff4500] shadow-xs' : 'hover:text-black'
                }`}
              >
                <Smile className="w-3.5 h-3.5" />
                Meme
              </button>
              <button
                type="button"
                onClick={() => setActiveMediaTab('poll')}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeMediaTab === 'poll' ? 'bg-white text-indigo-700 shadow-xs' : 'hover:text-black'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                Poll
              </button>
            </div>

            {/* TAB: Photo */}
            {activeMediaTab === 'photo' && (
              <div className="space-y-2.5 animate-fadeIn">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 rounded-lg text-xs font-bold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    Upload from Device
                  </button>
                  <span className="text-[11px] text-gray-500">or paste image URL:</span>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 bg-white"
                  />
                </div>
                {photoUrl && (
                  <div className="h-36 rounded-xl overflow-hidden relative border border-gray-200 bg-black flex items-center justify-center">
                    <img
                      src={photoUrl}
                      alt="Upload preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB: 15s Video Clip */}
            {activeMediaTab === 'video' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                      ⚡ STRICT 15-SECOND CAP
                    </span>
                    Bite-sized Food Reel
                  </span>
                  <input
                    type="file"
                    ref={videoInputRef}
                    onChange={handleVideoUpload}
                    accept="video/mp4,video/webm"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer shadow-xs"
                  >
                    Upload Video File
                  </button>
                </div>

                {/* Instant Sample Video Selector */}
                <div>
                  <span className="text-[11px] font-semibold text-gray-600 block mb-1.5">
                    Or select high-energy 15-second food clip:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {SAMPLE_15S_VIDEOS.map((vid) => (
                      <button
                        key={vid.id}
                        type="button"
                        onClick={() => {
                          setVideoUrl(vid.videoUrl);
                          setVideoDuration(vid.durationSeconds);
                          setVideoTitle(vid.title);
                        }}
                        className={`p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                          videoUrl === vid.videoUrl
                            ? 'border-red-500 ring-2 ring-red-400/30 bg-red-50/50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="h-14 rounded-lg overflow-hidden relative mb-1 bg-black">
                          <img
                            src={vid.posterUrl}
                            alt={vid.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded-md bg-black/70 text-white text-[9px] font-mono">
                            {vid.durationSeconds}s
                          </span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-800 line-clamp-1">
                          {vid.title}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Video Player Preview */}
                {videoUrl && (
                  <div className="relative rounded-xl overflow-hidden bg-black aspect-video max-h-48 flex items-center justify-center">
                    <video
                      ref={videoPlayerRef}
                      src={videoUrl}
                      controls
                      autoPlay
                      loop
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                      15s Reel Active
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: GIF */}
            {activeMediaTab === 'gif' && (
              <div className="space-y-2.5 animate-fadeIn">
                <span className="text-xs font-bold text-gray-700 block">
                  Select Animated Food GIF:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {CURATED_FOOD_GIFS.map((gif) => (
                    <button
                      key={gif.id}
                      type="button"
                      onClick={() => setSelectedGifUrl(gif.url)}
                      className={`p-1 rounded-xl border transition-all cursor-pointer ${
                        selectedGifUrl === gif.url
                          ? 'border-[#ff4500] ring-2 ring-[#ff4500]/30 bg-orange-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="h-16 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={gif.url}
                          alt={gif.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-[10px] font-bold text-gray-800 line-clamp-1 mt-1">
                        {gif.title}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Meme */}
            {activeMediaTab === 'meme' && (
              <div className="space-y-3 animate-fadeIn">
                {memeUrl ? (
                  <div className="rounded-xl overflow-hidden border border-gray-300 relative max-h-48 bg-black flex items-center justify-center">
                    <img
                      src={memeUrl}
                      alt="Meme"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setMemeUrl('')}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                    Use the <strong>Live Meme Studio</strong> on the forum page to generate custom memes, or paste an image URL below:
                    <input
                      type="url"
                      value={memeUrl}
                      onChange={(e) => setMemeUrl(e.target.value)}
                      placeholder="Meme Image URL..."
                      className="w-full mt-2 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs"
                    />
                  </div>
                )}
              </div>
            )}

            {/* TAB: Poll */}
            {activeMediaTab === 'poll' && (
              <div className="space-y-3 animate-fadeIn">
                <div>
                  <span className="text-[11px] font-bold text-gray-700 block mb-1">
                    Poll Question *
                  </span>
                  <input
                    type="text"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    placeholder="e.g. Best Biryani Accompaniment?"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-gray-700 block">
                    Options (2 to 4)
                  </span>
                  {pollOptions.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => updatePollOption(i, e.target.value)}
                        placeholder={`Option ${i + 1} (e.g. Mirchi Ka Salan)`}
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white"
                      />
                      {pollOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removePollOption(i)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {pollOptions.length < 4 && (
                    <button
                      type="button"
                      onClick={addPollOption}
                      className="text-xs font-bold text-[#ff4500] hover:underline cursor-pointer"
                    >
                      + Add Option
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${
                isVegOnly
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700'
                  : 'bg-gradient-to-r from-[#ff4500] to-[#ad2c00] hover:from-[#e03d00] hover:to-[#8c2300]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Publish Discussion
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
