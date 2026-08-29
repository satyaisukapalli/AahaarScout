import React, { useState } from 'react';
import { Restaurant } from '../types';

interface AIAssistantScreenProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (r: Restaurant) => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  suggestedAction?: {
    label: string;
    restaurantId: string;
  };
}

export const AIAssistantScreen: React.FC<AIAssistantScreenProps> = ({
  restaurants,
  onSelectRestaurant,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I'm your Aahaarscout FoodieBot. I can help you find hidden culinary gems, book quiet romantic tables, or find the best authentic dum biryani in town. What are you in the mood for tonight?",
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedReplies = [
    '✨ Romantic date night spot with low noise level',
    '🌶️ Famous Nellore Chepala Pulusu & Ghee Karam Dosa',
    '🥞 Crispy Benne Dosa & Filter Coffee in Bangalore',
    '🍗 Best authentic Dum Biryani under ₹500 in Hyderabad',
    '🦐 Coastal Karimeen Pollichathu & Seafood in Kerala',
    '🌿 Authentic Andhra Thali & Gongura Pachadi in Vizag',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      let targetRest = restaurants[0];

      const lower = text.toLowerCase();
      if (lower.includes('nellore') || lower.includes('chepala') || lower.includes('pulusu') || lower.includes('erra karam') || lower.includes('karam dosa')) {
        targetRest = restaurants.find((r) => r.id === 'mayuri-chepala-pulusu') || restaurants.find((r) => r.id === 'murali-krishna-nellore') || restaurants[0];
        replyText = `In Nellore, **${targetRest.name}** is legendary! Famous for authentic claypot Korameenu Chepala Pulusu and iconic Ghee Erra Karam Dosas with a 99% AI match score.`;
      } else if (lower.includes('bangalore') || lower.includes('benne') || lower.includes('ctr') || lower.includes('dosa')) {
        targetRest = restaurants.find((r) => r.id === 'ctr-shri-sagar') || restaurants[0];
        replyText = `In Bangalore, **${targetRest.name}** in Malleshwaram is legendary! Famous for golden, butter-crisp Benne Masala Dosa and piping hot filter coffee with a 99% AI match score.`;
      } else if (lower.includes('kochi') || lower.includes('kerala') || lower.includes('seafood') || lower.includes('karimeen') || lower.includes('fish')) {
        targetRest = restaurants.find((r) => r.id === 'paragon-restaurant-kochi') || restaurants[0];
        replyText = `For phenomenal coastal seafood and Malabar delights, **${targetRest.name}** in Kochi is world-renowned. Their Karimeen Pollichathu and short-grain Kaima biryani are unmatched!`;
      } else if (lower.includes('chennai') || lower.includes('idli') || lower.includes('chettinad') || lower.includes('murugan')) {
        targetRest = restaurants.find((r) => r.id === 'murugan-idli-shop') || restaurants[0];
        replyText = `In Chennai, **${targetRest.name}** in T. Nagar serves cloud-like jasmine soft idlis on fresh banana leaves with pure country ghee and 4 signature chutneys.`;
      } else if (lower.includes('vizag') || lower.includes('visakhapatnam') || lower.includes('andhra') || lower.includes('thali') || lower.includes('gongura')) {
        targetRest = restaurants.find((r) => r.id === 'dharani-daspalla') || restaurants[0];
        replyText = `In Visakhapatnam, **${targetRest.name}** delivers the royal authentic 14-item Andhra Bhojanam Thali with fiery gongura pachadi and fragrant ghee podi.`;
      } else if (lower.includes('romantic') || lower.includes('date') || lower.includes('quiet') || lower.includes('japan')) {
        targetRest = restaurants.find((r) => r.id === 'kumi-modern-japanese') || restaurants.find((r) => r.id === 'grasshopper-bangalore') || restaurants[0];
        replyText = `Based on your desire for a quiet, romantic atmosphere with refined dining, I strongly recommend **${targetRest.name}** in ${targetRest.neighborhood}, ${targetRest.city}. It boasts an intimate mood, stellar tasting menu, and low ambient noise.`;
      } else if (lower.includes('biryani') || lower.includes('bawarchi') || lower.includes('spicy')) {
        targetRest = restaurants.find((r) => r.id === 'bawarchi-restaurant') || restaurants.find((r) => r.id === 'paradise-biryani') || restaurants[0];
        replyText = `For phenomenal dum biryani with family packs and rich spice layers, **${targetRest.name}** at ${targetRest.neighborhood}, ${targetRest.city} is the crowd favorite!`;
      } else if (lower.includes('coffee') || lower.includes('work') || lower.includes('cafe')) {
        targetRest = restaurants.find((r) => r.id === 'roastery-coffee-house') || restaurants.find((r) => r.id === 'kashi-art-cafe') || restaurants[0];
        replyText = `**${targetRest.name}** in ${targetRest.city} is ideal! Housed in an airy courtyard with single-origin beans and artisanal roasts.`;
      } else {
        targetRest = restaurants.find((r) => r.id === 'paradise-biryani') || restaurants[0];
        replyText = `I have analyzed top regional reviews across South India for "${text}". **${targetRest.name}** in ${targetRest.city} stands out with consistent high marks for flavor profile and hospitality.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: replyText,
          suggestedAction: {
            label: `View ${targetRest.name}`,
            restaurantId: targetRest.id,
          },
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  // Matched recommendations
  const liveMatches = restaurants.slice(0, 3);

  return (
    <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-16 py-8 md:py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Chat Area */}
      <section className="col-span-1 md:col-span-8 flex flex-col h-[calc(100vh-180px)] min-h-[550px] bg-white rounded-2xl shadow-xl border-2 border-[#ffded4] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#ffded4] bg-gradient-to-r from-[#fff5f0] to-[#fff9f4] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff4500] to-[#ff8c00] text-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined material-symbols-fill">smart_toy</span>
            </div>
            <div>
              <h2 className="font-garamond text-xl font-bold text-[#1e110d]">
                FoodieBot AI Assistant
              </h2>
              <p className="font-grotesk text-xs text-[#523932] flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-xs" />
                Live Reasoning Engine Active
              </p>
            </div>
          </div>
          <span className="bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs font-grotesk">
            AI Sommelier
          </span>
        </div>

        {/* Messages */}
        <div className="flex-grow p-4 sm:p-6 overflow-y-auto flex flex-col gap-4 bg-[#fffcfb]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm font-grotesk leading-relaxed shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-[#ff4500] via-[#e63900] to-[#ff781f] text-white rounded-br-none font-medium'
                    : 'bg-[#fff5f0] text-[#1e110d] border border-[#ffcfc2] rounded-bl-none font-medium'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>

                {m.suggestedAction && (
                  <div className="mt-3 pt-3 border-t border-[#ffded4]">
                    <button
                      onClick={() => {
                        const r = restaurants.find((item) => item.id === m.suggestedAction?.restaurantId);
                        if (r) onSelectRestaurant(r);
                      }}
                      className="bg-white hover:bg-[#fff0eb] text-[#ff4500] border-2 border-[#ff4500]/40 text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                      <span>{m.suggestedAction.label}</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#fff5f0] text-[#523932] rounded-2xl rounded-bl-none p-3.5 border border-[#ffcfc2] flex items-center gap-2 text-xs font-grotesk font-semibold">
                <span className="material-symbols-outlined text-sm animate-spin text-[#ff4500]">
                  progress_activity
                </span>
                <span>FoodieBot is scouting menus & tasting notes...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Quick Replies */}
        <div className="p-3 bg-[#fff5f0] border-t border-[#ffded4] flex gap-2 overflow-x-auto no-scrollbar">
          {suggestedReplies.map((r, i) => (
            <button
              key={i}
              onClick={() => handleSend(r)}
              className="whitespace-nowrap px-3.5 py-1.5 rounded-full bg-white border border-[#ffcfc2] text-xs font-grotesk font-semibold text-[#331c15] hover:border-[#ff4500] hover:text-[#ff4500] hover:bg-[#fff0eb] transition-all cursor-pointer shrink-0 shadow-2xs"
            >
              {r}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 bg-white border-t border-[#ffded4] flex gap-2.5 items-center"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Tell me what you're craving or the occasion..."
            className="flex-grow bg-[#fff5f0] border border-[#ffcfc2] rounded-xl px-4 py-2.5 font-grotesk text-sm text-[#1e110d] placeholder:text-[#523932]/70 outline-hidden focus:border-[#ff4500] focus:bg-white transition-colors"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="bg-gradient-to-r from-[#ff4500] to-[#ff781f] hover:from-[#e63900] hover:to-[#ff5e1a] disabled:opacity-50 text-white p-2.5 rounded-xl font-grotesk font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center shrink-0"
          >
            <span className="material-symbols-outlined text-lg">send</span>
          </button>
        </form>
      </section>

      {/* Live Matches Rail */}
      <aside className="col-span-1 md:col-span-4 flex flex-col gap-4">
        <div className="bg-gradient-to-br from-[#fff0eb] to-[#fff8f2] rounded-2xl p-5 border-2 border-[#ffded4] shadow-xl">
          <div className="flex items-center gap-2 mb-3 text-[#ff4500]">
            <span className="material-symbols-outlined text-xl material-symbols-fill">recommend</span>
            <h3 className="font-garamond text-xl font-bold text-[#1e110d]">
              Live Recommendations
            </h3>
          </div>
          <p className="font-grotesk text-xs text-[#523932] mb-4 font-medium">
            Curated in real time based on your conversation context and taste preferences.
          </p>

          <div className="flex flex-col gap-3">
            {liveMatches.map((r) => (
              <div
                key={r.id}
                onClick={() => onSelectRestaurant(r)}
                className="bg-white rounded-xl p-3 border border-[#ffded4] hover:border-[#ff4500] transition-all cursor-pointer flex gap-3 items-center group shadow-xs hover:shadow-md"
              >
                <img
                  src={r.image}
                  alt={r.name}
                  className="w-14 h-14 rounded-lg object-cover bg-[#ffece5] shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-center">
                    <h4 className="font-garamond font-bold text-sm text-[#1e110d] truncate group-hover:text-[#ff4500]">
                      {r.name}
                    </h4>
                    <span className="text-[11px] font-grotesk font-bold text-white bg-gradient-to-r from-[#ff4500] to-[#ff8c00] px-2 py-0.5 rounded-full shadow-2xs">
                      {r.matchScore}%
                    </span>
                  </div>
                  <p className="text-[11px] font-grotesk text-[#523932] truncate font-medium">{r.cuisine}</p>
                  <p className="text-[10px] font-grotesk text-amber-600 font-bold mt-0.5 flex items-center gap-1">
                    <span>★ {r.rating}</span> • <span className="text-[#523932] font-normal">{r.neighborhood}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};
