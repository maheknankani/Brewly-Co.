import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Compass } from 'lucide-react';

export const BrandStorySection = () => {
  const { setCurrentPage } = useStore();

  return (
    <section className="py-16 bg-cream-200/50 border-t border-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-cream-100 border border-cream-300 rounded-3xl p-8 sm:p-12 lg:p-14 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Image */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-cream-300 group h-80 sm:h-96">
                <img
                  src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80"
                  alt="Coffee Origin Farm & Harvest"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/60 via-transparent to-transparent flex items-end p-6">
                  <span className="text-cream-100 font-serif italic text-sm">
                    Ethically Harvested at 1,950m MASL Altitude
                  </span>
                </div>
              </div>
            </div>

            {/* Right Editorial Copy */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-cream-200 border border-cream-300 px-3.5 py-1.5 rounded-full text-xs font-semibold text-forest-700 uppercase tracking-wider">
                <Compass size={14} />
                <span>EDITORIAL BRAND STORY</span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-espresso-900 tracking-tight leading-tight">
                From Origin to Your Morning
              </h2>

              <p className="text-base sm:text-lg text-espresso-900/80 font-sans leading-relaxed">
                We believe great coffee begins long before the first sip. Brewly brings together distinctive beans, careful roasting, and the rituals that make coffee worth slowing down for.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => setCurrentPage('about')}
                  className="bg-forest-700 hover:bg-forest-800 text-cream-100 font-semibold text-sm px-8 py-3.5 rounded-full transition-all shadow flex items-center gap-2"
                >
                  <span>Our Story</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
