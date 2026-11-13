import React from 'react';
import { useStore } from '../context/StoreContext';
import { Check, Sparkles, ArrowRight, Gift, Calendar, ShieldCheck } from 'lucide-react';

export const SubscriptionSection = () => {
  const { setCurrentPage } = useStore();

  return (
    <section className="py-14 bg-forest-700 text-cream-100 relative overflow-hidden">
      
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amberGold-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text & CTA Column */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 bg-amberGold-500/20 text-amberGold-400 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-amberGold-500/30">
              <Sparkles size={14} />
              <span>SUBSCRIPTION CLUB</span>
            </span>

            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-cream-100 leading-tight">
              Fresh Coffee. Delivered Automatically.
            </h2>

            <p className="text-base text-cream-200/90 leading-relaxed font-sans max-w-xl">
              Never wake up to an empty coffee tin again. Enjoy freshly roasted micro-batch coffee on your schedule, save 15% on every shipment, and unlock complimentary coffee gear.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-cream-100 font-medium pt-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-amberGold-500 text-espresso-900 flex items-center justify-center font-bold text-xs">✓</div>
                <span>Save 15% on Every Order</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-amberGold-500 text-espresso-900 flex items-center justify-center font-bold text-xs">✓</div>
                <span>Free Carbon-Neutral Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-amberGold-500 text-espresso-900 flex items-center justify-center font-bold text-xs">✓</div>
                <span>Flexible 1, 2, or 4 Week Schedule</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-amberGold-500 text-espresso-900 flex items-center justify-center font-bold text-xs">✓</div>
                <span>Pause, Skip or Cancel Anytime</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button
                onClick={() => setCurrentPage('subscriptions')}
                className="bg-amberGold-500 hover:bg-amberGold-600 text-espresso-900 font-bold text-sm px-8 py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2"
              >
                <span>Start Subscription</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Image Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="bg-forest-800/80 border border-forest-600 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="relative rounded-2xl overflow-hidden h-64 border border-forest-600">
                <img
                  src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
                  alt="Subscription Pour Over Gear"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/80 via-transparent to-transparent flex items-end p-4">
                  <div>
                    <span className="text-amberGold-400 text-xs font-bold uppercase tracking-wider block">Bonus Member Perk</span>
                    <span className="text-cream-100 text-sm font-serif font-bold">Free Artisan Pour-Over Glass Dripper on Annual Plans</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div className="bg-forest-900/60 p-3 rounded-xl border border-forest-600">
                  <Calendar size={18} className="mx-auto text-amberGold-400 mb-1" />
                  <div className="font-bold text-cream-100">Set Frequency</div>
                  <div className="text-[10px] text-cream-200/70">Weekly or Monthly</div>
                </div>
                <div className="bg-forest-900/60 p-3 rounded-xl border border-forest-600">
                  <Gift size={18} className="mx-auto text-amberGold-400 mb-1" />
                  <div className="font-bold text-cream-100">Surprise Samples</div>
                  <div className="text-[10px] text-cream-200/70">Free micro-lot gifts</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
