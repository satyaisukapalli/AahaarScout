import React, { useState } from 'react';
import { AaharScoutPick } from '../utils/foodDecisionEngine';
import { CheckCircle2, Copy, Share2, Sparkles, X, MessageCircle, Twitter, Instagram } from 'lucide-react';

interface ShareDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  pick: AaharScoutPick | null;
}

export const ShareDecisionModal: React.FC<ShareDecisionModalProps> = ({
  isOpen,
  onClose,
  pick,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !pick) return null;

  const shareText = `🍛 AAHARSCOUT PICK\n\nBest ${pick.dishName}\n📍 ${pick.restaurant.name}, ${pick.restaurant.city}\n💰 ${pick.priceFormatted}\n🔥 ${pick.matchScore}% AaharScout Match\n\n"Tonight's food decision is solved on AaharScout!"`;

  const handleCopy = () => {
    navigator.clipboard?.writeText?.(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n\n' + window.location.href)}`;
    window.open(url, '_blank');
  };

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-orange-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-[#faf7f5]">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-orange-100 text-[#ff4500] flex items-center justify-center font-bold text-sm">
              ✨
            </span>
            <div>
              <h3 className="font-syne font-bold text-gray-900 text-base sm:text-lg leading-tight">
                Share Food Decision Card
              </h3>
              <p className="text-[11px] text-gray-500">
                Share this personalized recommendation with friends or social media
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shareable Card Canvas Visual Preview */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#2a140e] via-[#3a1a11] to-[#1a0c07] text-white p-6 shadow-xl border border-orange-800/40">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff4500]/20 rounded-full blur-2xl pointer-events-none"></div>

            {/* Card Badge */}
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff4500] text-white text-[11px] font-bold shadow-xs">
                <Sparkles className="w-3 h-3" />
                <span>AAHARSCOUT PICK</span>
              </div>
              <span className="text-xs font-bold text-orange-200/90 font-mono">
                {pick.restaurant.city}
              </span>
            </div>

            {/* Dish Image + Title */}
            <div className="relative z-10 flex items-center gap-4 mb-4">
              <img
                src={pick.dishImage}
                alt={pick.dishName}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-xl object-cover border-2 border-white/20 shadow-md shrink-0"
              />
              <div>
                <span className="text-[11px] font-bold text-orange-300 uppercase tracking-wider block">
                  {pick.bestForCategory}
                </span>
                <h4 className="font-syne text-lg sm:text-xl font-extrabold text-white leading-tight">
                  {pick.dishName}
                </h4>
                <p className="text-xs text-orange-100/80 font-grotesk mt-0.5">
                  @ {pick.restaurant.name}
                </p>
              </div>
            </div>

            {/* Match & Details Strip */}
            <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 mb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-orange-200 block uppercase font-mono">
                  Personalized Score
                </span>
                <span className="font-syne font-extrabold text-lg text-amber-300">
                  🔥 {pick.matchScore}% Match
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-orange-200 block uppercase font-mono">
                  Approx Price
                </span>
                <span className="font-syne font-extrabold text-lg text-white">
                  {pick.priceFormatted}
                </span>
              </div>
            </div>

            {/* Decision Quote */}
            <div className="relative z-10 text-center border-t border-white/10 pt-3">
              <p className="text-xs italic text-orange-200/90">
                “Tonight's food decision is solved on AaharScout.”
              </p>
            </div>
          </div>

          {/* Share Action Buttons */}
          <div className="mt-5 space-y-2.5">
            <button
              onClick={handleShareWhatsApp}
              className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#25D366] hover:bg-[#20ba59] text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              Share to WhatsApp
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleShareTwitter}
                className="py-2.5 px-4 rounded-xl text-xs font-bold bg-black hover:bg-neutral-800 text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Twitter className="w-4 h-4" />
                Share on X
              </button>

              <button
                onClick={handleCopy}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  copied
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                    : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50'
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Card Text</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
