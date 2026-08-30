import React, { useState, useEffect, useRef } from 'react';
import { Restaurant, Dish, DishReview } from '../types';

interface AIAssistantScreenProps {
  restaurants: Restaurant[];
  reviews?: DishReview[];
  onSelectRestaurant: (r: Restaurant) => void;
  isVegOnly?: boolean;
  onToggleVegOnly?: () => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  highlightDish?: {
    name: string;
    description: string;
    price: string;
    image: string;
    rating?: number;
    matchScore?: number;
    awardedHashtag?: string;
  };
  suggestedAction?: {
    label: string;
    restaurantId: string;
  };
  followUps?: string[];
}

export const AIAssistantScreen: React.FC<AIAssistantScreenProps> = ({
  restaurants,
  reviews = [],
  onSelectRestaurant,
  isVegOnly = false,
  onToggleVegOnly,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: isVegOnly
        ? "Namaste! I'm your Aahaarscout Pure-Veg FoodieBot 🌱. I'm connected to live regional menus, verified community dish critiques, and heritage recipes across Vijayawada, Guntur, Hyderabad, Bangalore, Chennai, Vizag & Nellore. What pure-vegetarian craving can I scout for you?"
        : "Hello! I'm your Aahaarscout FoodieBot 🤖. I have real-time access to South Indian culinary rankings, dish-specific ratings, crowd meters, and authentic reviewer hashtags (#BiryaniGrandmaster, #GunturSpiceConnoisseur, etc.). What are you craving today?",
      followUps: isVegOnly
        ? [
            '🥞 1942 Babai Hotel White Butter Idli in Vijayawada',
            '🌶️ Sankar Vilas Wafer-Thin Ghee Dosa in Guntur',
            '🧈 CTR Butter Benne Masala Dosa in Bangalore',
            '🌿 18-Dish Pure Veg Andhra Thali in Vizag',
          ]
        : [
            '🍗 Best authentic Dum Biryani with Zafrani spices',
            '🥞 1942 Babai Hotel White Butter Idli in Vijayawada',
            '🌶️ Sankar Vilas Wafer-Thin Ghee Dosa in Guntur',
            '☕ Degree Filter Coffee & Ghee Podi Idlis',
            '✨ Romantic quiet dinner spot with low noise',
          ],
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeCityContext, setActiveCityContext] = useState<string>('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: isVegOnly
          ? "Namaste! I'm your Aahaarscout Pure-Veg FoodieBot 🌱. The entire guide is now configured for 100% pure vegetarian cuisine across South India. What would you like to taste?"
          : "Hello! I'm your Aahaarscout FoodieBot 🤖. Ready to scout top dining spots, authentic dishes, and real foodie reviews across South India. What's on your mind?",
        followUps: isVegOnly
          ? [
              '🥞 1942 Babai Hotel White Butter Idlis',
              '🌶️ Sankar Vilas Wafer-Thin Ghee Dosa in Guntur',
              '🧈 CTR Golden Benne Masala Dosa in Bangalore',
              '🌿 18-Dish Pure Veg Andhra Bhojanam',
            ]
          : [
              '🍗 Authentic Chicken Dum Biryani in Hyderabad',
              '🥞 1942 Babai Hotel White Butter Idlis in Vijayawada',
              '🌶️ Sankar Vilas Wafer-Thin Ghee Dosa in Guntur',
              '☕ Frothy Degree Filter Coffee in Chennai',
            ],
      },
    ]);
  }, [isVegOnly]);

  const currentPool = isVegOnly
    ? restaurants.filter((r) => r.isVeg || r.isPureVeg)
    : restaurants;

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

    const query = text.toLowerCase();

    // Natural Language Processing & Context Analyzer
    setTimeout(() => {
      let matchedRest: Restaurant | undefined;
      let matchedDish: Dish | undefined;
      let replyText = '';
      let awardedHashtag = '#TopTasteAuthority';
      let followUps: string[] = [];

      // Detect city mention or inherit context
      let detectedCity = activeCityContext;
      if (query.includes('vijayawada')) detectedCity = 'Vijayawada';
      else if (query.includes('guntur')) detectedCity = 'Guntur';
      else if (query.includes('hyderabad') || query.includes('secunderabad')) detectedCity = 'Hyderabad';
      else if (query.includes('bangalore') || query.includes('bengaluru')) detectedCity = 'Bangalore';
      else if (query.includes('chennai') || query.includes('madras')) detectedCity = 'Chennai';
      else if (query.includes('vizag') || query.includes('visakhapatnam')) detectedCity = 'Visakhapatnam';
      else if (query.includes('nellore')) detectedCity = 'Nellore';
      else if (query.includes('kochi') || query.includes('cochin')) detectedCity = 'Kochi';

      if (detectedCity) setActiveCityContext(detectedCity);

      // Search matching restaurant & dishes in pool
      const cityPool = detectedCity
        ? currentPool.filter((r) => r.city.toLowerCase() === detectedCity.toLowerCase())
        : currentPool;
      const effectivePool = cityPool.length > 0 ? cityPool : currentPool;

      // Check specific dish / cravings queries
      if (query.includes('babai') || query.includes('white butter') || query.includes('venna idli')) {
        matchedRest = currentPool.find((r) => r.id === 'babai-hotel-vijayawada') || effectivePool[0];
        matchedDish = matchedRest.signatureDishes?.[0];
        awardedHashtag = '#HeritageFoodHunter';
        replyText = `In Vijayawada, **Babai Hotel (Since 1942)** is legendary! Foodies award it **#HeritageFoodHunter** for its iconic cloud-like steaming idlis crowned with fresh homemade white butter (venna) and fragrant spicy gun powder.\n\n⭐ Community Dish Rating: **5.0/5** • "A melting spiritual experience on the tongue."`;
        followUps = [
          '🌶️ What else is good at Babai Hotel?',
          '🚗 How do I reach Babai Hotel in Vijayawada?',
          '🧈 Compare with CTR Benne Dosa in Bangalore',
        ];
      } else if (query.includes('sankar vilas') || (query.includes('guntur') && (query.includes('dosa') || query.includes('tiffin')))) {
        matchedRest = currentPool.find((r) => r.id === 'sankar-vilas-guntur') || effectivePool[0];
        matchedDish = matchedRest.signatureDishes?.[0];
        awardedHashtag = '#GunturSpiceConnoisseur';
        replyText = `In Guntur, **Sankar Vilas (Since 1950)** on Station Road is unmatched for its **Wafer-Thin Ghee Masala Dosa** roasted crisp on heavy iron tawas. Foodies rate it with **#GunturSpiceConnoisseur** for the signature spicy ginger (allam) chutney and rich aroma!`;
        followUps = [
          '☕ Tell me about the filter coffee at Sankar Vilas',
          '🔥 Are there spicy non-veg places in Guntur?',
          '🥞 Show pure veg options in Vijayawada',
        ];
      } else if (query.includes('biryani') || query.includes('dum biryani') || query.includes('mandi')) {
        matchedRest = isVegOnly
          ? currentPool.find((r) => r.name.toLowerCase().includes('biryani') || r.cuisine.toLowerCase().includes('thali')) || currentPool[0]
          : currentPool.find((r) => r.id === 'paradise-biryani') || currentPool.find((r) => r.cuisine.includes('Biryani')) || currentPool[0];
        matchedDish = matchedRest.signatureDishes?.[0];
        awardedHashtag = '#BiryaniGrandmaster';
        replyText = isVegOnly
          ? `For vegetarian saffron-infused rice and rich vegetable biryanis, **${matchedRest.name}** in ${matchedRest.city} prepares fragrant basmati rice with whole roasted spices and rich dry fruit garnish.`
          : `For quintessential Hyderabadi Dum Biryani, **${matchedRest.name}** is the world benchmark. Layered with long-grain Zafrani basmati and succulent meat slow-cooked in dum style. Verified foodies award it **#BiryaniGrandmaster**!`;
        followUps = [
          '🌶️ Is the biryani spicy or mild?',
          '🍽️ What side dishes like Mirchi ka Salan come with it?',
          '✨ Show quiet romantic dining spots',
        ];
      } else if (query.includes('benne') || query.includes('ctr') || (query.includes('bangalore') && query.includes('dosa'))) {
        matchedRest = currentPool.find((r) => r.id === 'ctr-shri-sagar') || effectivePool[0];
        matchedDish = matchedRest.signatureDishes?.[0];
        awardedHashtag = '#DosaWhisperer';
        replyText = `In Bangalore, **CTR (Shri Sagar)** in Malleshwaram holds the gold standard for **Butter Benne Masala Dosa**. Thick, golden-crispy on the exterior, melt-in-mouth soft inside, slathered with pure butter. Rated **#DosaWhisperer** by the community!`;
        followUps = [
          '☕ What is the best coffee near CTR?',
          '🥞 How does CTR compare with MTR?',
          '🌱 Show 100% pure veg restaurants in Bangalore',
        ];
      } else if (query.includes('thali') || query.includes('bhojanam') || query.includes('sweet magic') || query.includes('dharani')) {
        matchedRest = currentPool.find((r) => r.id === 'sweet-magic-vijayawada') || currentPool.find((r) => r.id === 'dharani-daspalla') || effectivePool[0];
        matchedDish = matchedRest.signatureDishes?.[0];
        awardedHashtag = '#SattvicGourmet';
        replyText = `For a royal **Pure Veg Andhra Bhojanam Thali**, **${matchedRest.name}** in ${matchedRest.city} serves a 16+ course feast with fiery Gongura pachadi, pure ghee gunpowder podi, majjiga pulusu, and Bellam sweets. Awarded **#SattvicGourmet**!`;
        followUps = [
          '🍬 What sweets are available for takeaway?',
          '🌶️ How spicy is the Gongura pachadi?',
          '📍 What are the operating hours today?',
        ];
      } else if (query.includes('coffee') || query.includes('filter coffee') || query.includes('chai') || query.includes('tea')) {
        matchedRest = currentPool.find((r) => r.id === 'murugan-idli-shop') || currentPool.find((r) => r.id === 'roastery-coffee-house') || effectivePool[0];
        matchedDish = matchedRest.signatureDishes?.[0];
        awardedHashtag = '#FilterCoffeeSommelier';
        replyText = `For pure aromatic indulgence, **${matchedRest.name}** in ${matchedRest.city} prepares authentic first-decoction Degree Filter Coffee served frothing in classic brass/steel dabarah sets. Awarded **#FilterCoffeeSommelier**!`;
        followUps = [
          '🥞 What tiffins pair best with filter coffee?',
          '🌿 Show pure-veg breakfast spots',
          '📍 Find coffee spots in Hyderabad',
        ];
      } else if (query.includes('romantic') || query.includes('date') || query.includes('quiet') || query.includes('vibe')) {
        matchedRest = currentPool.find((r) => r.vibes?.includes('Romantic') || r.vibe === 'Romantic') || effectivePool[0];
        matchedDish = matchedRest.signatureDishes?.[0];
        awardedHashtag = '#TopTasteAuthority';
        replyText = `For a tranquil romantic dining experience with low noise levels and intimate ambiance, **${matchedRest.name}** in ${matchedRest.neighborhood}, ${matchedRest.city} is highly recommended. Excellent hospitality and curated pairings.`;
        followUps = [
          '📅 Book a table for tonight',
          '🍷 View full menu and price for two',
          '🌿 Is there a pure veg romantic option?',
        ];
      } else if (query.includes('guntur') || query.includes('spicy') || query.includes('mirchi')) {
        matchedRest = currentPool.find((r) => r.city === 'Guntur') || effectivePool[0];
        matchedDish = matchedRest.signatureDishes?.[0];
        awardedHashtag = '#GunturSpiceConnoisseur';
        replyText = `In Guntur, the capital of Andhra spice, **${matchedRest.name}** is celebrated for its fearless flavors, authentic red chili tadka, and signature accompaniments. Community badge: **#GunturSpiceConnoisseur**!`;
        followUps = [
          '🌶️ Sankar Vilas Wafer-Thin Ghee Dosa',
          '🥞 1942 Babai Hotel in nearby Vijayawada',
          '☕ Filter Coffee spots in Guntur',
        ];
      } else if (query.includes('vijayawada') || query.includes('bezawada')) {
        matchedRest = currentPool.find((r) => r.city === 'Vijayawada') || effectivePool[0];
        matchedDish = matchedRest.signatureDishes?.[0];
        awardedHashtag = '#HeritageFoodHunter';
        replyText = `Vijayawada boasts some of Andhra's greatest culinary landmarks. **${matchedRest.name}** is a top choice with high community ratings for authentic local preparations and genuine ingredients.`;
        followUps = [
          '🥞 1942 Babai Hotel White Butter Idlis',
          '🌿 18-Dish Pure Veg Andhra Thali at Sweet Magic',
          '🚗 Distance from Vijayawada Railway Station',
        ];
      } else {
        // Broad search based on keywords
        matchedRest =
          effectivePool.find(
            (r) =>
              r.name.toLowerCase().includes(query) ||
              r.cuisine.toLowerCase().includes(query) ||
              r.tags.some((t) => t.toLowerCase().includes(query)) ||
              r.signatureDishes?.some((d) => d.name.toLowerCase().includes(query))
          ) || effectivePool[0];
        matchedDish = matchedRest.signatureDishes?.[0];
        replyText = isVegOnly
          ? `I searched 100% pure vegetarian culinary records for "${text}". **${matchedRest.name}** (${matchedRest.city}) stands out with a **${matchedRest.matchScore}% Match Score** for pure-veg authenticity and high diner satisfaction.`
          : `I analyzed South Indian dining ratings and community critiques for "${text}". **${matchedRest.name}** in ${matchedRest.city} is your best match with a **${matchedRest.matchScore}% AI Confidence Score** and a **${matchedRest.rating}★** rating.`;
        followUps = [
          `⭐ What do foodies say about ${matchedRest.name}?`,
          `🍽️ View signature dishes at ${matchedRest.name}`,
          `📍 Get directions to ${matchedRest.neighborhood}, ${matchedRest.city}`,
        ];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: replyText,
          highlightDish: matchedDish
            ? {
                name: matchedDish.name,
                description: matchedDish.description,
                price: matchedDish.price,
                image: matchedDish.image,
                rating: 5.0,
                matchScore: matchedDish.matchScore,
                awardedHashtag,
              }
            : undefined,
          suggestedAction: {
            label: `Explore ${matchedRest.name} (${matchedRest.city})`,
            restaurantId: matchedRest.id,
          },
          followUps,
        },
      ]);
      setIsTyping(false);
    }, 550);
  };

  // Matched recommendations side rail
  const liveMatches = currentPool.slice(0, 4);

  return (
    <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-16 py-8 md:py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Main Chat Area */}
      <section className="col-span-1 md:col-span-8 flex flex-col h-[calc(100vh-170px)] min-h-[580px] bg-white rounded-3xl shadow-xl border-2 border-[#ffded4] overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 sm:p-5 border-b border-[#ffded4] bg-gradient-to-r from-[#fff5f0] via-[#fff9f4] to-[#fff5f0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#ff4500] to-[#ff8c00] text-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined material-symbols-fill text-2xl">smart_toy</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-garamond text-xl sm:text-2xl font-bold text-[#1e110d]">
                  FoodieBot AI Culinary Sommelier
                </h2>
                {isVegOnly && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                    🌱 Pure Veg
                  </span>
                )}
              </div>
              <p className="font-grotesk text-xs text-[#523932] flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-xs" />
                <span>Live Dish Reasoning & #Hashtag Critique Engine Active</span>
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs font-grotesk">
              Accurate AI v2.4
            </span>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-grow p-4 sm:p-6 overflow-y-auto flex flex-col gap-5 bg-[#fffcfb]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-4 text-sm font-grotesk leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-[#ff4500] via-[#e63900] to-[#ff781f] text-white rounded-br-none font-medium shadow-md'
                    : 'bg-[#fff5f0] text-[#1e110d] border border-[#ffcfc2] rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>

                {/* Highlighted Dish Card inside AI Response */}
                {m.highlightDish && (
                  <div className="mt-3.5 bg-white rounded-2xl p-3 border border-[#ffded4] shadow-sm flex flex-col sm:flex-row gap-3 items-center">
                    <img
                      src={m.highlightDish.image}
                      alt={m.highlightDish.name}
                      className="w-full sm:w-24 h-24 rounded-xl object-cover bg-[#ffece5] shrink-0"
                    />
                    <div className="flex-grow min-w-0 w-full text-left">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <h4 className="font-garamond font-bold text-base text-[#1e110d] truncate">
                          {m.highlightDish.name}
                        </h4>
                        <span className="text-xs font-bold text-[#ff4500]">
                          {m.highlightDish.price}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#523932] line-clamp-2 mt-0.5">
                        {m.highlightDish.description}
                      </p>

                      <div className="mt-2 flex items-center justify-between flex-wrap gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px] material-symbols-fill text-amber-500">
                              star
                            </span>
                            5.0 Rating
                          </span>
                          {m.highlightDish.awardedHashtag && (
                            <span className="bg-[#1e110d] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                              {m.highlightDish.awardedHashtag}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Direct Action Button */}
                {m.suggestedAction && (
                  <div className="mt-3 pt-3 border-t border-[#ffded4] flex items-center justify-between flex-wrap gap-2">
                    <button
                      onClick={() => {
                        const r = restaurants.find((item) => item.id === m.suggestedAction?.restaurantId);
                        if (r) onSelectRestaurant(r);
                      }}
                      className="bg-white hover:bg-[#fff0eb] text-[#ff4500] border-2 border-[#ff4500]/40 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      <span className="material-symbols-outlined text-sm">restaurant</span>
                      <span>{m.suggestedAction.label}</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Dynamic Follow-up Suggestions Chips */}
              {m.followUps && m.followUps.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[90%] sm:max-w-[80%]">
                  {m.followUps.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(chip)}
                      className="text-[11px] font-grotesk font-semibold text-[#523932] bg-[#fff5f0] hover:bg-[#ffe3d8] hover:text-[#ff4500] border border-[#ffcfc2] px-3 py-1.5 rounded-full transition-all cursor-pointer shadow-2xs text-left"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#fff5f0] text-[#523932] rounded-2xl rounded-bl-none p-3.5 border border-[#ffcfc2] flex items-center gap-2.5 text-xs font-grotesk font-semibold shadow-xs">
                <span className="material-symbols-outlined text-base animate-spin text-[#ff4500]">
                  progress_activity
                </span>
                <span>FoodieBot is analyzing regional dish reviews & flavor notes...</span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
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
            placeholder="Ask about a specific dish, spice level, city, or dietary craving..."
            className="flex-grow bg-[#fff5f0] border border-[#ffcfc2] rounded-xl px-4 py-2.5 font-grotesk text-xs sm:text-sm text-[#1e110d] placeholder:text-[#523932]/70 outline-hidden focus:border-[#ff4500] focus:bg-white transition-colors"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="bg-gradient-to-r from-[#ff4500] to-[#ff781f] hover:from-[#e63900] hover:to-[#ff5e1a] disabled:opacity-50 text-white p-2.5 sm:px-5 sm:py-2.5 rounded-xl font-grotesk font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1 shrink-0"
          >
            <span className="hidden sm:inline text-xs font-bold">Ask Bot</span>
            <span className="material-symbols-outlined text-lg">send</span>
          </button>
        </form>
      </section>

      {/* Live Culinary Recommendations Rail */}
      <aside className="col-span-1 md:col-span-4 flex flex-col gap-4">
        <div className="bg-gradient-to-br from-[#fff0eb] via-[#fff5ee] to-[#fff8f2] rounded-3xl p-5 border-2 border-[#ffded4] shadow-xl">
          <div className="flex items-center gap-2 mb-2 text-[#ff4500]">
            <span className="material-symbols-outlined text-2xl material-symbols-fill">recommend</span>
            <h3 className="font-garamond text-xl font-bold text-[#1e110d]">
              Live Recommendations
            </h3>
          </div>
          <p className="font-grotesk text-xs text-[#523932] mb-4">
            Curated in real time from community dish ratings & authentic reviewer awards.
          </p>

          <div className="flex flex-col gap-3">
            {liveMatches.map((r) => (
              <div
                key={r.id}
                onClick={() => onSelectRestaurant(r)}
                className="bg-white rounded-2xl p-3 border border-[#ffded4] hover:border-[#ff4500] transition-all cursor-pointer flex gap-3 items-center group shadow-xs hover:shadow-md"
              >
                <img
                  src={r.image}
                  alt={r.name}
                  className="w-16 h-16 rounded-xl object-cover bg-[#ffece5] shrink-0 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-center">
                    <h4 className="font-garamond font-bold text-sm text-[#1e110d] truncate group-hover:text-[#ff4500]">
                      {r.name}
                    </h4>
                    <span className="text-[10px] font-grotesk font-bold text-white bg-gradient-to-r from-[#ff4500] to-[#ff8c00] px-2 py-0.5 rounded-full shadow-2xs">
                      {r.matchScore}% Match
                    </span>
                  </div>
                  <p className="text-[11px] font-grotesk text-[#523932] truncate mt-0.5">
                    {r.neighborhood}, {r.city}
                  </p>
                  <div className="text-[10px] font-grotesk text-amber-600 font-bold mt-1 flex items-center justify-between">
                    <span>★ {r.rating}</span>
                    <span className="text-[#ff4500] font-semibold">{r.priceForTwo || r.priceRange}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};
