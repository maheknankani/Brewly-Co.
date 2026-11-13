import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const CoffeeFinderSection = () => {
  const { setCurrentPage, setSelectedProductDetail, products } = useStore();

  const featuredMatch = products[0] || {
    name: "Ethiopian Yirgacheffe",
    bagImage: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=600&q=80",
    roastLevel: "Light Roast",
    flavorNotes: ["Floral", "Citrus", "Peach"]
  };

  return (
    <section id="coffee-finder" className="py-20 bg-espresso-900 text-cream-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-espresso-800/80 border border-espresso-700 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-amberGold-500/20 text-amberGold-400 border border-amberGold-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={14} />
                <span>INTELLIGENT COFFEE RECOMMENDATION</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-cream-100 tracking-tight leading-tight">
                Not Sure Which Coffee Is Yours?
              </h2>

              <p className="text-base sm:text-lg text-cream-200/80 font-sans leading-relaxed max-w-lg">
                Tell us how you brew, what flavor notes you love, and how bold you like it. We'll find your perfect match in under 60 seconds.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => {
                    const quizEl = document.getElementById('coffee-quiz');
                    if (quizEl) {
                      quizEl.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      setCurrentPage('shop');
                    }
                  }}
                  className="bg-amberGold-500 hover:bg-amberGold-600 text-espresso-900 font-bold text-sm px-8 py-4 rounded-full transition-all shadow-lg flex items-center gap-2"
                >
                  <span>Find My Coffee</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Right Visual Preview Card */}
            <div className="lg:col-span-6 bg-espresso-900/90 border border-espresso-700 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative">
              
              <div className="flex items-center justify-between border-b border-espresso-700 pb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-amberGold-400">
                  YOUR PERFECT MATCH
                </span>
                <span className="bg-forest-700 text-cream-100 text-xs font-bold font-mono px-3 py-1 rounded-full border border-forest-600 flex items-center gap-1">
                  <CheckCircle2 size={13} className="text-amberGold-400" />
                  <span>94% MATCH</span>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <img
                  src={featuredMatch.bagImage}
                  alt={featuredMatch.name}
                  className="w-36 h-44 object-cover rounded-xl shadow-lg border border-espresso-700"
                />

                <div className="space-y-3 text-center sm:text-left">
                  <h3 className="font-serif text-2xl font-bold text-cream-100">
                    {featuredMatch.name}
                  </h3>

                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap text-xs">
                    <span className="bg-espresso-800 text-cream-200 px-3 py-1 rounded-full border border-espresso-700">
                      {featuredMatch.roastLevel}
                    </span>
                    {featuredMatch.flavorNotes.map((note, i) => (
                      <span key={i} className="text-amberGold-400 font-medium">
                        {note} {i < featuredMatch.flavorNotes.length - 1 ? '•' : ''}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-cream-200/70 font-sans leading-relaxed">
                    Light, tea-like elegance with sparkling floral aromatics and sweet peach finish.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-espresso-700">
                <button
                  onClick={() => setSelectedProductDetail(featuredMatch)}
                  className="w-full bg-forest-700 hover:bg-forest-800 text-cream-100 font-semibold text-xs py-3 rounded-xl transition-all border border-forest-600"
                >
                  Shop This Coffee
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
