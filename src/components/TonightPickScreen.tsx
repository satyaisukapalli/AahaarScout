import React, { useEffect, useRef } from 'react';
import { Restaurant, ScreenType } from '../types';
import { CrowdMeter } from './CrowdMeter';

interface TonightPickScreenProps {
  restaurant: Restaurant;
  onNavigate: (s: ScreenType) => void;
  onBookTable: (r: Restaurant) => void;
  onSelectRestaurant: (r: Restaurant) => void;
  isVegOnly?: boolean;
}

export const TonightPickScreen: React.FC<TonightPickScreenProps> = ({
  restaurant,
  onNavigate,
  onBookTable,
  onSelectRestaurant,
  isVegOnly = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      r: number;
      dx: number;
      dy: number;
      color: string;
      tilt: number;
      tiltAngleInc: number;
      tiltAngle: number;
    }

    const particles: Particle[] = [];
    const colors = ['#ff4500', '#ff8c00', '#fbbf24', '#ffffff', '#ff6b35', '#10b981'];

    for (let i = 0; i < 110; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() * 260 - 130),
        y: canvas.height * 0.4,
        r: Math.random() * 4.5 + 2,
        dx: Math.random() * 14 - 7,
        dy: Math.random() * -16 - 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 12) - 12,
        tiltAngleInc: Math.random() * 0.08 + 0.05,
        tiltAngle: 0,
      });
    }

    let animationId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, index) => {
        p.tiltAngle += p.tiltAngleInc;
        p.y += (Math.cos(p.tiltAngle) + 1 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle) * 2;
        p.dy += 0.22;
        p.x += p.dx;
        p.y += p.dy;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
        ctx.stroke();

        if (p.y > canvas.height) {
          particles.splice(index, 1);
        }
      });

      if (particles.length > 0) {
        animationId = requestAnimationFrame(draw);
      }
    };

    const timer = setTimeout(() => {
      draw();
    }, 200);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center min-h-[calc(100vh-140px)] pb-16">
      {/* Full Bleed Hero Section */}
      <section className="relative w-full h-[55vh] md:h-[65vh] max-h-[700px] bg-[#281713] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-75"
          style={{ backgroundImage: `url('${restaurant.image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#281713] via-[#281713]/40 to-black/30" />
        
        {/* Confetti canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

        <div className="relative z-20 flex flex-col items-center text-center px-6 mt-auto pb-12">
          <div className={`mb-4 inline-flex items-center gap-2 backdrop-blur-md border px-5 py-2 rounded-full shadow-xl ${
            isVegOnly
              ? 'bg-gradient-to-r from-emerald-600/90 to-green-600/90 border-emerald-300/40 text-white'
              : 'bg-gradient-to-r from-[#ff4500]/90 to-[#ff8c00]/90 border-white/40 text-white'
          }`}>
            <span className="text-xl">{isVegOnly ? '🌱' : '✨'}</span>
            <span className="font-grotesk text-xs font-bold text-white tracking-widest uppercase">
              {isVegOnly ? "Tonight's Pure-Veg Masterpiece" : "Tonight's Curated Pick"}
            </span>
          </div>

          <h1 className="font-garamond text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-2 drop-shadow-lg">
            {restaurant.name}
          </h1>

          <div className="flex items-center justify-center gap-3 text-[#ffece5] font-grotesk text-sm font-semibold flex-wrap">
            <span>{restaurant.cuisine}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff781f]" />
            <span>{restaurant.priceRange}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff781f]" />
            <span className="flex items-center gap-1 text-amber-300 font-bold bg-black/40 px-3 py-1 rounded-full backdrop-blur-xs">
              <span className="material-symbols-outlined text-[16px] material-symbols-fill text-amber-400">star</span>
              {restaurant.rating}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff781f]" />
            <CrowdMeter restaurant={restaurant} variant="badge" className="bg-white/20 text-white border-white/30 backdrop-blur-md" />
          </div>
        </div>
      </section>

      {/* Content Bento Grid */}
      <section className="w-full max-w-5xl mx-auto px-5 sm:px-8 md:px-12 -mt-10 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* AI Reasoning Bento Card */}
          <div className="col-span-1 md:col-span-8 bg-white rounded-2xl shadow-xl p-6 sm:p-8 ai-border-gradient flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff4500] to-[#ff8c00] text-white flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined material-symbols-fill">auto_awesome</span>
                </div>
                <h2 className="font-garamond text-2xl font-semibold text-[#1e110d]">
                  Why this is your perfect match
                </h2>
              </div>

              <p className="font-garamond italic text-lg sm:text-xl text-[#3d231b] mb-6 leading-relaxed">
                "{restaurant.aiReasoning}"
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-4 border-t border-[#ffded4]">
              {restaurant.tags.map((tag) => (
                <div
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#fff0eb] text-[#e63900] font-grotesk text-xs font-bold border border-[#ffcfc2] shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#ff4500]">check_circle</span>
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Cards */}
          <div className="col-span-1 md:col-span-4 flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4 border border-[#ffded4]">
              <div className="flex items-center justify-between text-xs font-grotesk text-[#523932] pb-2 border-b border-[#ffe4dc]">
                <span className="font-medium">Table for 2</span>
                <span className="font-bold text-[#ff4500] bg-[#fff0eb] px-2.5 py-1 rounded-full border border-[#ffcfc2]">Tonight, 7:30 PM</span>
              </div>

              <button
                onClick={() => onBookTable(restaurant)}
                className="w-full bg-gradient-to-r from-[#ff4500] via-[#e63900] to-[#ff781f] hover:from-[#e63900] hover:to-[#ff5e1a] text-white font-grotesk text-sm font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                Book a Table
              </button>

              <button
                onClick={() => onSelectRestaurant(restaurant)}
                className="w-full bg-white border-2 border-[#ff4500]/30 text-[#1e110d] hover:border-[#ff4500] hover:text-[#ff4500] hover:bg-[#fff0eb] font-grotesk text-sm font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px] text-[#ff4500]">restaurant_menu</span>
                View Menu & Dishes
              </button>
            </div>

            <button
              onClick={() => onNavigate('home')}
              className="w-full py-3 text-[#523932] hover:text-[#ff4500] font-grotesk text-sm font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              Start Over with New Craving
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
