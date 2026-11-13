import React, { useState } from 'react';
import { Star, CheckCircle2, Quote, Pause, Play } from 'lucide-react';

export const CustomerReviews = () => {
  const [isPaused, setIsPaused] = useState(false);

  const reviews = [
    {
      quote: "The Ethiopian Yirgacheffe has completely changed my morning routine. Sparkling jasmine floral aromas and zero bitterness.",
      author: "Sarah M.",
      location: "Seattle, WA",
      role: "Verified Customer",
      rating: 5
    },
    {
      quote: "The roast arrived incredibly fresh within 48 hours. The flavor notes of caramel and red apple were exactly as described.",
      author: "Daniel R.",
      location: "Austin, TX",
      role: "Verified Customer",
      rating: 5
    },
    {
      quote: "Direct-trade coffee that actually tastes like specialty coffee. Unbeatable subscription value and instant delivery updates.",
      author: "Alex T.",
      location: "Chicago, IL",
      role: "Verified Customer",
      rating: 5
    },
    {
      quote: "The Panama Geisha is pure magic in a V60. Bright peach sweetness and elegant bergamot finish.",
      author: "Elena R.",
      location: "San Francisco, CA",
      role: "Verified Customer",
      rating: 5
    },
    {
      quote: "As a home barista, Brewly's roast consistency is top-tier. Crema on the espresso roast is thick and velvety.",
      author: "Marcus K.",
      location: "Brooklyn, NY",
      role: "Verified Customer",
      rating: 5
    },
    {
      quote: "Switched our entire office subscription to Brewly. Everyone loves the dark roast chocolate notes!",
      author: "Hannah L.",
      location: "Denver, CO",
      role: "Verified Customer",
      rating: 5
    }
  ];

  // Double the list for infinite looping marquee scroll
  const marqueeList = [...reviews, ...reviews];

  return (
    <section className="py-16 bg-cream-100 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 max-w-5xl mx-auto">
          <div className="text-center sm:text-left space-y-2">
            <span className="text-xs uppercase font-mono font-bold tracking-widest text-forest-700">
              VERIFIED COFFEE DRINKERS
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-espresso-900">
              Real Coffee. Real Experiences.
            </h2>
          </div>

          {/* Pause / Play Controls */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-2 bg-cream-200 border border-cream-300 hover:bg-cream-300 text-espresso-900 px-4 py-2 rounded-full text-xs font-semibold shadow-sm transition-all shrink-0 cursor-pointer"
            title={isPaused ? "Resume Auto Scroll" : "Pause Auto Scroll"}
          >
            {isPaused ? <Play size={14} className="fill-espresso-900" /> : <Pause size={14} className="fill-espresso-900" />}
            <span>{isPaused ? 'Resume Motion' : 'Pause Motion'}</span>
          </button>
        </div>

      </div>

      {/* Infinite Horizontal Auto-Scrolling Track */}
      <div className="relative w-full overflow-hidden py-2">
        {/* Left Edge Gradient Blur */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-cream-100 to-transparent z-10 pointer-events-none"></div>

        {/* Right Edge Gradient Blur */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-cream-100 to-transparent z-10 pointer-events-none"></div>

        <div
          className="animate-marquee-scroll flex gap-6"
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        >
          {marqueeList.map((rev, idx) => (
            <div
              key={idx}
              className="w-[320px] sm:w-[380px] shrink-0 bg-cream-200/70 border border-cream-300 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all relative flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-3">
                {/* Stars */}
                <div className="flex text-amberGold-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-amberGold-500 text-amberGold-500" />
                  ))}
                </div>

                <Quote size={28} className="text-forest-700/30" />

                <blockquote className="text-sm font-serif italic text-espresso-900 leading-relaxed">
                  "{rev.quote}"
                </blockquote>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-cream-300/80 flex items-center justify-between">
                <div>
                  <div className="font-serif font-bold text-base text-espresso-900">{rev.author}</div>
                  <div className="text-[11px] text-espresso-900/60">{rev.location}</div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-forest-700 bg-cream-100 px-2.5 py-1 rounded-full border border-cream-300">
                  <CheckCircle2 size={12} className="text-amberGold-500" />
                  <span>{rev.role}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
