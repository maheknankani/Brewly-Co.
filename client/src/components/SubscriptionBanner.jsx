import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Truck, Check, RefreshCw } from 'lucide-react';

export const SubscriptionBanner = () => {
  const { setCurrentPage } = useStore();

  return (
    <section className="py-16 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-forest-800 text-cream-100 border border-forest-700 rounded-3xl p-8 sm:p-12 lg:p-14 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Heading, Text & Badges */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 bg-amberGold-500/20 text-amberGold-400 border border-amberGold-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                <RefreshCw size={14} className="animate-spin" style={{ animationDuration: '8s' }} />
                <span>RECURRING FRESHNESS CLUB</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-cream-100 tracking-tight leading-tight">
                Never Run Out of Great Coffee.
              </h2>

              <p className="text-base sm:text-lg text-cream-200/80 font-sans leading-relaxed max-w-xl">
                Get your favorite coffee delivered on your schedule and save with every subscription. Cancel or pause anytime with zero hassle.
              </p>

              {/* Offer Badges */}
              <div className="flex items-center gap-4 text-xs font-mono font-bold">
                <div className="bg-amberGold-500 text-espresso-900 px-4 py-2 rounded-xl flex items-center gap-1.5 shadow">
                  <Check size={16} />
                  <span>15% OFF ALWAYS</span>
                </div>

                <div className="bg-forest-700 text-cream-100 border border-forest-600 px-4 py-2 rounded-xl flex items-center gap-1.5">
                  <Truck size={16} className="text-amberGold-400" />
                  <span>FREE SHIPPING</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setCurrentPage('subscriptions')}
                  className="bg-amberGold-500 hover:bg-amberGold-600 text-espresso-900 font-bold text-sm px-8 py-4 rounded-full transition-all shadow-lg flex items-center gap-2"
                >
                  <span>Build My Subscription</span>
                  <ArrowRight size={16} />
                </button>
              </div>

            </div>

            {/* Right Column: Visual Bag & Delivery Box Graphic */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <div className="relative rounded-2xl overflow-hidden border border-forest-700 shadow-2xl group w-full max-w-sm">
                <img
                  src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80"
                  alt="Subscription Coffee Box"
                  className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/90 via-forest-900/30 to-transparent flex flex-col justify-end p-6">
                  <span className="text-amberGold-400 font-mono text-xs uppercase font-bold tracking-widest">
                    DELIVERED FRESH EVERY 2 WEEKS
                  </span>
                  <h4 className="text-xl font-serif font-bold text-cream-100 mt-1">
                    Custom Roaster's Choice Sampler
                  </h4>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
