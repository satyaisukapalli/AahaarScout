import React from 'react';
import { LOGO_URL } from '../data/restaurants';
import { ScreenType } from '../types';

interface FooterProps {
  onNavigate?: (screen: ScreenType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#fff1ed] border-t border-[#e5beb3] mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 md:px-16 py-10 gap-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg overflow-hidden border border-[#ad2c00]/20 bg-white flex items-center justify-center">
            <img 
              alt="Aahaarscout Logo" 
              className="h-full w-full object-cover" 
              src={LOGO_URL}
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-garamond font-bold text-xl text-[#ad2c00]">
            Aahaarscout
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm font-grotesk text-[#5c4038]">
          <button onClick={() => onNavigate?.('home')} className="hover:text-[#ad2c00] underline transition-colors cursor-pointer">About</button>
          <button onClick={() => onNavigate?.('home')} className="hover:text-[#ad2c00] underline transition-colors cursor-pointer">Press</button>
          <button onClick={() => onNavigate?.('home')} className="hover:text-[#ad2c00] underline transition-colors cursor-pointer">Contact</button>
          <button onClick={() => onNavigate?.('home')} className="hover:text-[#ad2c00] underline transition-colors cursor-pointer">Privacy</button>
          <button onClick={() => onNavigate?.('home')} className="hover:text-[#ad2c00] underline transition-colors cursor-pointer">Terms</button>
        </div>

        <div className="text-[#5c4038] font-grotesk text-xs sm:text-sm text-center md:text-right">
          © 2026 Aahaarscout AI. Stop scrolling. Start eating.
        </div>
      </div>
    </footer>
  );
};
