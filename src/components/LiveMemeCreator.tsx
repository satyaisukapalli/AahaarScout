import React, { useState, useRef, useEffect } from 'react';
import { MemeTemplate } from '../types';
import { POPULAR_MEME_TEMPLATES } from '../data/memeTemplates';
import { validateContent } from '../utils/contentModerator';
import { Sparkles, Download, Send, RefreshCw, Upload, AlertCircle, CheckCircle, Smile } from 'lucide-react';

interface LiveMemeCreatorProps {
  onPostMemeToForum: (memeData: {
    imageUrl: string;
    title: string;
    memeTopText: string;
    memeBottomText: string;
    category: string;
  }) => void;
  isVegOnly?: boolean;
}

const FOOD_STICKERS = ['🔥', '🤤', '🍛', '☕', '🧈', '🌶️', '🥞', '🍗', '👑', '🤌', '✨', '❤️'];

export const LiveMemeCreator: React.FC<LiveMemeCreatorProps> = ({
  onPostMemeToForum,
  isVegOnly = false
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate>(POPULAR_MEME_TEMPLATES[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [topText, setTopText] = useState(POPULAR_MEME_TEMPLATES[0].defaultTopText);
  const [bottomText, setBottomText] = useState(POPULAR_MEME_TEMPLATES[0].defaultBottomText);
  const [fontSize, setFontSize] = useState<number>(32);
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [isUppercase, setIsUppercase] = useState<boolean>(true);
  const [selectedSticker, setSelectedSticker] = useState<string>('🤤');
  const [showSticker, setShowSticker] = useState<boolean>(true);
  const [stickerPosition, setStickerPosition] = useState<'top-right' | 'bottom-right' | 'center'>('top-right');
  
  // Moderation state
  const [moderationError, setModerationError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate meme text live against vulgarity / obscenity
  useEffect(() => {
    const topCheck = validateContent(topText, 'meme top text');
    if (!topCheck.isValid) {
      setModerationError(topCheck.reason || 'Prohibited vulgarity detected in top text.');
      return;
    }
    const bottomCheck = validateContent(bottomText, 'meme bottom text');
    if (!bottomCheck.isValid) {
      setModerationError(bottomCheck.reason || 'Prohibited vulgarity detected in bottom text.');
      return;
    }
    setModerationError(null);
  }, [topText, bottomText]);

  // Render meme on HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = customImage || selectedTemplate.imageUrl;

    img.onload = () => {
      // Set canvas dimensions
      const targetWidth = 600;
      const scale = targetWidth / img.width;
      const targetHeight = img.height * scale;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Draw background image
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Dark gradient overlays at top and bottom for text legibility
      const topGrad = ctx.createLinearGradient(0, 0, 0, 100);
      topGrad.addColorStop(0, 'rgba(0,0,0,0.7)');
      topGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, targetWidth, 100);

      const botGrad = ctx.createLinearGradient(0, targetHeight - 110, 0, targetHeight);
      botGrad.addColorStop(0, 'rgba(0,0,0,0)');
      botGrad.addColorStop(1, 'rgba(0,0,0,0.75)');
      ctx.fillStyle = botGrad;
      ctx.fillRect(0, targetHeight - 110, targetWidth, 110);

      // Typography Setup
      ctx.fillStyle = textColor;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = Math.max(4, fontSize / 7);
      ctx.textAlign = 'center';
      ctx.font = `900 ${fontSize}px "Impact", "Arial Black", sans-serif`;
      ctx.lineJoin = 'round';

      // Draw Top Text
      const renderTop = isUppercase ? topText.toUpperCase() : topText;
      if (renderTop) {
        wrapText(ctx, renderTop, targetWidth / 2, fontSize + 15, targetWidth - 40, fontSize * 1.15);
      }

      // Draw Bottom Text
      const renderBottom = isUppercase ? bottomText.toUpperCase() : bottomText;
      if (renderBottom) {
        wrapText(ctx, renderBottom, targetWidth / 2, targetHeight - 25, targetWidth - 40, fontSize * 1.15, true);
      }

      // Draw Optional Food Sticker/Emoji Badge
      if (showSticker && selectedSticker) {
        ctx.font = '48px serif';
        let sx = targetWidth - 45;
        let sy = 55;
        if (stickerPosition === 'bottom-right') {
          sx = targetWidth - 45;
          sy = targetHeight - 35;
        } else if (stickerPosition === 'center') {
          sx = targetWidth / 2;
          sy = targetHeight / 2;
        }
        ctx.fillText(selectedSticker, sx, sy);
      }

      // Watermark
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.textAlign = 'left';
      ctx.fillText('Aahaarscout Live Meme Studio', 12, targetHeight - 10);
    };

    img.onerror = () => {
      // Fallback if image fails to load
      canvas.width = 600;
      canvas.height = 400;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 600, 400);
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Template Preview', 300, 200);
    };
  }, [selectedTemplate, customImage, topText, bottomText, fontSize, textColor, isUppercase, showSticker, selectedSticker, stickerPosition]);

  // Multi-line wrap helper
  function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    isBottom = false
  ) {
    const words = text.split(' ');
    let line = '';
    const lines: string[] = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line.trim());
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());

    if (isBottom) {
      // Offset starting Y so last line sits at bottom
      const startY = y - (lines.length - 1) * lineHeight;
      for (let k = 0; k < lines.length; k++) {
        ctx.strokeText(lines[k], x, startY + k * lineHeight);
        ctx.fillText(lines[k], x, startY + k * lineHeight);
      }
    } else {
      for (let k = 0; k < lines.length; k++) {
        ctx.strokeText(lines[k], x, y + k * lineHeight);
        ctx.fillText(lines[k], x, y + k * lineHeight);
      }
    }
  }

  const handleTemplateSelect = (tmpl: MemeTemplate) => {
    setSelectedTemplate(tmpl);
    setCustomImage(null);
    setTopText(tmpl.defaultTopText);
    setBottomText(tmpl.defaultBottomText);
    setModerationError(null);
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (JPG/PNG).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadMeme = () => {
    if (moderationError) {
      alert('Cannot download meme: ' + moderationError);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Aahaarscout-Food-Meme-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handlePostMeme = () => {
    if (moderationError) {
      alert('Cannot post meme: ' + moderationError);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onPostMemeToForum({
        imageUrl: dataUrl,
        title: topText ? `${topText} 🤤😂` : 'Live Foodie Meme',
        memeTopText: topText,
        memeBottomText: bottomText,
        category: 'memes-humor'
      });
    }, 600);
  };

  return (
    <div id="live-meme-studio" className="bg-white rounded-2xl border border-[#e5beb3]/60 shadow-lg p-5 sm:p-7 max-w-6xl mx-auto my-6">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-[#ff4500] text-white shadow-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              LIVE MEME STUDIO
            </span>
            <span className="text-xs text-gray-500 font-medium">Family-Friendly Foodie Humor</span>
          </div>
          <h2 className="font-syne text-xl sm:text-2xl font-bold text-gray-900">
            Create & Post Live Food Memes
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Select authentic South Indian templates, add witty captions, and post directly to the discussion forum!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCustomImageUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl text-xs font-bold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Custom Image
          </button>
          <button
            onClick={() => {
              setTopText('');
              setBottomText('');
            }}
            className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all cursor-pointer"
            title="Reset Text"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 mt-6">
        {/* Left Column: Template Carousel & Controls (5 Cols) */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          {/* Template Selection */}
          <div>
            <label className="block font-grotesk text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5">
              1. Choose Food Meme Template
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {POPULAR_MEME_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => handleTemplateSelect(tmpl)}
                  className={`p-1.5 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                    selectedTemplate.id === tmpl.id && !customImage
                      ? 'border-[#ff4500] ring-2 ring-[#ff4500]/30 shadow-md bg-orange-50/50'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="h-16 rounded-lg overflow-hidden relative mb-1.5 bg-gray-200">
                    <img
                      src={tmpl.imageUrl}
                      alt={tmpl.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="text-[11px] font-bold text-gray-800 line-clamp-1">
                    {tmpl.name}
                  </p>
                  <span className="text-[9px] text-gray-500 block truncate">
                    {tmpl.category}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Text Captions Input */}
          <div className="flex flex-col gap-3.5 bg-[#fff8f6] p-4 rounded-xl border border-[#e5beb3]/60">
            <label className="font-grotesk text-xs font-bold uppercase tracking-wider text-[#ad2c00]">
              2. Meme Captions (Top & Bottom)
            </label>

            <div>
              <span className="text-[11px] font-bold text-gray-700 block mb-1">Top Caption</span>
              <input
                type="text"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="TOP CAPTION (e.g. ME COMMITTED TO DIET)"
                className="w-full px-3.5 py-2 text-xs font-bold rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#ff4500] bg-white text-gray-900"
              />
            </div>

            <div>
              <span className="text-[11px] font-bold text-gray-700 block mb-1">Bottom Caption</span>
              <input
                type="text"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="BOTTOM CAPTION (e.g. BUT GHEE DOSA ARRIVES)"
                className="w-full px-3.5 py-2 text-xs font-bold rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#ff4500] bg-white text-gray-900"
              />
            </div>

            {/* Moderation Alert Banner */}
            {moderationError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Content Blocked: </span>
                  {moderationError}
                </div>
              </div>
            )}
          </div>

          {/* Customization Styling Row */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-3">
            <span className="font-grotesk text-xs font-bold uppercase tracking-wider text-gray-700">
              3. Text Size & Sticker Overlay
            </span>
            
            <div className="grid grid-cols-2 gap-3 items-center">
              <div>
                <span className="text-[10px] font-bold text-gray-600 block mb-1">Font Size: {fontSize}px</span>
                <input
                  type="range"
                  min="20"
                  max="46"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-[#ff4500] cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsUppercase(!isUppercase)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    isUppercase ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  ALL CAPS
                </button>
                
                <button
                  onClick={() => setTextColor(textColor === '#ffffff' ? '#fbbf24' : '#ffffff')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-300 bg-white text-gray-800 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-gray-400" style={{ backgroundColor: textColor }}></span>
                  {textColor === '#ffffff' ? 'White' : 'Yellow'}
                </button>
              </div>
            </div>

            {/* Food Sticker Chips */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-gray-600">Add Emoji / Food Badge</span>
                <button 
                  onClick={() => setShowSticker(!showSticker)}
                  className="text-[10px] font-semibold text-[#ad2c00] hover:underline cursor-pointer"
                >
                  {showSticker ? 'Hide Badge' : 'Show Badge'}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {FOOD_STICKERS.map((stk) => (
                  <button
                    key={stk}
                    onClick={() => {
                      setSelectedSticker(stk);
                      setShowSticker(true);
                    }}
                    className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center border transition-all cursor-pointer ${
                      selectedSticker === stk && showSticker
                        ? 'bg-amber-100 border-amber-500 scale-110 shadow-xs'
                        : 'bg-white border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {stk}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Canvas Preview & Publish Actions (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-between bg-neutral-900 p-4 sm:p-6 rounded-2xl border border-neutral-800 shadow-inner">
          <div className="w-full flex items-center justify-between text-neutral-300 text-xs mb-3 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              LIVE CANVAS PREVIEW
            </span>
            <span className="text-neutral-500">600 x Auto Height</span>
          </div>

          {/* HTML5 Canvas */}
          <div className="w-full max-w-[480px] rounded-xl overflow-hidden shadow-2xl border-2 border-neutral-700 bg-black flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-auto object-contain block"
            />
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row items-center gap-3 mt-6">
            <button
              onClick={handleDownloadMeme}
              disabled={!!moderationError}
              className="w-full sm:w-1/2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold border border-neutral-700 text-neutral-200 bg-neutral-800 hover:bg-neutral-700 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <Download className="w-4 h-4" />
              Download PNG
            </button>

            <button
              onClick={handlePostMeme}
              disabled={!!moderationError || isSuccess}
              className={`w-full sm:w-1/2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                isVegOnly
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700'
                  : 'bg-gradient-to-r from-[#ff4500] to-[#ad2c00] hover:from-[#e03d00] hover:to-[#8c2300]'
              }`}
            >
              {isSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 animate-bounce" />
                  Meme Shared to Forum!
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Post Meme to Forum
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
