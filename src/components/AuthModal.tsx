import React, { useState } from 'react';
import { AuthUser } from '../types';
import { Sparkles, User, Mail, Lock, MapPin, Check, RefreshCw, LogIn, UserPlus } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  isVegOnly?: boolean;
  actionReason?: string; // e.g. "Save restaurants", "Book a table", "Post in Foodie Forum"
  currentAuthUser?: AuthUser | null;
}

// Pre-registered South Indian foodie profiles for quick switching & testing
const PRESET_REGISTERED_FOODIES: Array<{
  name: string;
  email: string;
  avatar: string;
  badge: string;
  city: string;
  diet: 'all' | 'veg' | 'non-veg';
}> = [
  {
    name: 'Satya Isukapalli',
    email: 'satyaisukapalli@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    badge: '👑 Top Food Critic',
    city: 'Vijayawada',
    diet: 'all',
  },
  {
    name: 'Rohit Varma',
    email: 'rohit.varma@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    badge: '🌶️ Hyderabad Biryani Connoisseur',
    city: 'Hyderabad',
    diet: 'non-veg',
  },
  {
    name: 'Ananya Raman',
    email: 'ananya.raman@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    badge: '🌟 Chennai Dosa & Seafood Critic',
    city: 'Chennai',
    diet: 'all',
  },
  {
    name: 'Kavitha N',
    email: 'kavitha.n@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    badge: '☕ Bangalore Filter Coffee Sommelier',
    city: 'Bangalore',
    diet: 'veg',
  },
  {
    name: 'Manoj Kumar',
    email: 'manoj.guntur@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    badge: '🔥 Guntur Mirchi & Vepudu King',
    city: 'Guntur',
    diet: 'non-veg',
  },
];

const AVAILABLE_CITIES = [
  'Vijayawada',
  'Hyderabad',
  'Bangalore',
  'Chennai',
  'Guntur',
  'Nellore',
  'Visakhapatnam',
  'Kochi',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  isVegOnly = false,
  actionReason,
  currentAuthUser,
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'switch'>('signin');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState(AVAILABLE_CITIES[0]);
  const [dietaryPref, setDietaryPref] = useState<'all' | 'veg' | 'non-veg'>(isVegOnly ? 'veg' : 'all');
  
  const [isLoading, setIsLoading] = useState(false);
  const [providerLoading, setProviderLoading] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof PRESET_REGISTERED_FOODIES[0]) => {
    setIsLoading(true);
    setTimeout(() => {
      const user: AuthUser = {
        id: `user-${preset.email.split('@')[0]}`,
        name: preset.name,
        email: preset.email,
        avatar: preset.avatar,
        provider: 'google',
        connectedAt: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
        dietaryPreference: preset.diet,
        favoriteCity: preset.city,
        savedSpotsCount: 4,
      };

      try {
        localStorage.setItem('aahaarscout_auth_user', JSON.stringify(user));
      } catch {
        // ignore
      }

      setIsLoading(false);
      onLoginSuccess(user);
      onClose();
    }, 350);
  };

  const handleGoogleSignIn = () => {
    setProviderLoading('google');
    setIsLoading(true);

    setTimeout(() => {
      // Default Google account
      const googleUser: AuthUser = {
        id: `google-${Date.now()}`,
        name: 'Satya Isukapalli',
        email: 'satyaisukapalli@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        provider: 'google',
        connectedAt: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
        dietaryPreference: isVegOnly ? 'veg' : 'all',
        favoriteCity: 'Vijayawada',
        savedSpotsCount: 6,
      };

      try {
        localStorage.setItem('aahaarscout_auth_user', JSON.stringify(googleUser));
      } catch {
        // ignore
      }

      setIsLoading(false);
      setProviderLoading(null);
      onLoginSuccess(googleUser);
      onClose();
    }, 450);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setTimeout(() => {
      const resolvedName = name.trim() || email.split('@')[0] || 'Registered Foodie';
      const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(resolvedName)}`;

      const user: AuthUser = {
        id: `user-${Date.now()}`,
        name: resolvedName,
        email: email.trim().toLowerCase(),
        avatar: avatarUrl,
        provider: 'email',
        connectedAt: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
        dietaryPreference: dietaryPref,
        favoriteCity: city,
        savedSpotsCount: 0,
      };

      try {
        localStorage.setItem('aahaarscout_auth_user', JSON.stringify(user));
      } catch {
        // ignore
      }

      setIsLoading(false);
      onLoginSuccess(user);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration bar */}
        <div className={`h-2.5 w-full ${
          isVegOnly
            ? 'bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500'
            : 'bg-gradient-to-r from-[#ff4500] via-[#ff781f] to-[#ffaa40]'
        }`} />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors cursor-pointer z-10 font-bold"
        >
          ✕
        </button>

        <div className="p-6 sm:p-7 overflow-y-auto">
          {/* Logo & Heading */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-2 mb-1.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-garamond font-bold text-xl shadow-md ${
                isVegOnly ? 'bg-gradient-to-br from-emerald-600 to-green-700' : 'bg-gradient-to-br from-[#ff4500] to-[#ff781f]'
              }`}>
                A
              </div>
              <span className="font-garamond text-2xl font-bold tracking-tight text-[#1e110d]">
                Aahaar<span className={isVegOnly ? 'text-emerald-700' : 'text-[#ff4500]'}>scout</span>
              </span>
            </div>

            <h3 className="font-garamond text-xl font-bold text-[#1e110d]">
              {activeTab === 'signin' && 'Sign In to Your Foodie Account'}
              {activeTab === 'signup' && 'Register New Foodie Profile'}
              {activeTab === 'switch' && 'Switch Active Foodie Account'}
            </h3>

            <p className="font-grotesk text-xs text-[#523932] mt-1">
              {actionReason
                ? `Sign in to ${actionReason.toLowerCase()} with your verified credentials.`
                : 'Upload forum posts, live memes, vote on polls, and review iconic dishes under your name.'}
            </p>
          </div>

          {/* Current User Pill if available */}
          {currentAuthUser && (
            <div className="mb-4 bg-orange-50/80 border border-orange-200/70 rounded-2xl p-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={currentAuthUser.avatar}
                  alt={currentAuthUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-orange-300 shrink-0"
                />
                <div className="truncate">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    Currently signed in: <span className="text-[#ff4500]">{currentAuthUser.name}</span>
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">{currentAuthUser.email}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-white text-orange-800 px-2 py-0.5 rounded-full border border-orange-200 shrink-0">
                Active
              </span>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="grid grid-cols-3 gap-1 bg-gray-100/90 p-1 rounded-2xl mb-5 font-grotesk text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('signin')}
              className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'signin'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'signup'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('switch')}
              className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'switch'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Switch User</span>
            </button>
          </div>

          {/* TAB 1 & 2: SIGN IN / SIGN UP */}
          {(activeTab === 'signin' || activeTab === 'signup') && (
            <div className="space-y-4">
              {/* One-Click Google Authentication */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-grotesk text-xs sm:text-sm font-bold py-2.5 px-4 rounded-2xl border border-gray-300 shadow-2xs transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
              >
                {providerLoading === 'google' ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-[#4285F4] rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                )}
                <span>Continue with Google (Satya Isukapalli)</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-gray-200 w-full" />
                <span className="bg-white px-3 font-grotesk text-[10px] font-bold text-gray-400 uppercase tracking-wider absolute">
                  or enter credentials
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-3 font-grotesk">
                {activeTab === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <User className="w-3 h-3 text-gray-400" />
                      <span>Full Name / Foodie Handle</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya Reddy"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-[#ff4500] focus:ring-1 focus:ring-[#ff4500] outline-hidden text-xs sm:text-sm font-medium text-gray-800"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-gray-400" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. foodie@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-[#ff4500] focus:ring-1 focus:ring-[#ff4500] outline-hidden text-xs sm:text-sm font-medium text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-gray-400" />
                    <span>Password</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-[#ff4500] focus:ring-1 focus:ring-[#ff4500] outline-hidden text-xs sm:text-sm font-medium text-gray-800"
                  />
                </div>

                {activeTab === 'signup' && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>Home Food City</span>
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-800 bg-white"
                      >
                        {AVAILABLE_CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Dietary Preference
                      </label>
                      <select
                        value={dietaryPref}
                        onChange={(e) => setDietaryPref(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-800 bg-white"
                      >
                        <option value="all">🍛 All Foodie Delights</option>
                        <option value="veg">🌱 100% Pure Vegetarian</option>
                        <option value="non-veg">🍗 Biryani & Non-Veg Explorer</option>
                      </select>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2.5 rounded-xl font-grotesk text-xs sm:text-sm font-bold text-white shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-50 mt-2 ${
                    isVegOnly
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700'
                      : 'bg-gradient-to-r from-[#ff4500] to-[#ff781f] hover:from-[#e63900] hover:to-[#ff6a00]'
                  }`}
                >
                  {isLoading
                    ? 'Authenticating...'
                    : activeTab === 'signin'
                    ? 'Sign In with Email'
                    : 'Create Profile & Start Posting'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: SWITCH TO PRESET REGISTERED FOODIE */}
          {activeTab === 'switch' && (
            <div className="space-y-2.5">
              <p className="text-xs text-gray-500 font-grotesk mb-2">
                Click any registered community member to sign in as them and post in the forum or write dish reviews:
              </p>

              {PRESET_REGISTERED_FOODIES.map((preset) => {
                const isSelected = currentAuthUser?.email === preset.email;
                return (
                  <button
                    key={preset.email}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    disabled={isLoading}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#ff4500] bg-orange-50/70 shadow-xs'
                        : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={preset.avatar}
                        alt={preset.name}
                        className="w-10 h-10 rounded-full object-cover border border-white shadow-xs shrink-0"
                      />
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                            {preset.name}
                          </p>
                          {isSelected && (
                            <span className="text-[9px] bg-[#ff4500] text-white px-1.5 py-0.2 rounded-full font-bold">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 truncate">{preset.email}</p>
                        <p className="text-[10px] text-amber-700 font-semibold mt-0.5">
                          {preset.badge} • 📍 {preset.city}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-500">
                      {isSelected ? (
                        <Check className="w-4 h-4 text-[#ff4500]" />
                      ) : (
                        <LogIn className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Footer note */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-grotesk text-gray-500">
            <span>🛡️ Verified Sign-in & Safe Community</span>
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'signin' ? 'signup' : 'signin')}
              className={`font-bold hover:underline cursor-pointer ${
                isVegOnly ? 'text-emerald-700' : 'text-[#ff4500]'
              }`}
            >
              {activeTab === 'signin' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
