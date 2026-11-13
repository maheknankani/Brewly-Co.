import React from 'react';
import { Star, Flame, Compass, Truck } from 'lucide-react';

export const ValueProps = () => {
  return (
    <section className="bg-cream-200/80 border-y border-cream-300 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          {/* Rating Badge */}
          <div className="flex items-center gap-3">
            <div className="flex text-amberGold-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-amberGold-500" />
              ))}
            </div>
            <span className="text-sm font-serif font-bold text-espresso-900">
              4.8/5 from 1,200+ coffee lovers
            </span>
          </div>

          {/* Core Trust Pillars */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 text-xs font-mono uppercase tracking-wider font-semibold text-espresso-900/80 flex-wrap">
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-forest-700" />
              <span>Small-Batch Roasted</span>
            </div>

            <span className="text-cream-400">•</span>

            <div className="flex items-center gap-2">
              <Compass size={16} className="text-forest-700" />
              <span>Direct Trade</span>
            </div>

            <span className="text-cream-400">•</span>

            <div className="flex items-center gap-2">
              <Truck size={16} className="text-forest-700" />
              <span>Freshly Shipped</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
