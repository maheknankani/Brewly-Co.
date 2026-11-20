import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Plus, Minus, ArrowRight, Sparkles } from 'lucide-react';

export const HeroSection = () => {
  const { products, addToCart, setCurrentPage } = useStore();

  const calmProduct = products.find(p => p.roastCategory === 'Calm') || products[0];
  const dailyProduct = products.find(p => p.roastCategory === 'Daily') || products[1];
  const boldProduct = products.find(p => p.roastCategory === 'Bold') || products[2];

  const [selectedRoast, setSelectedRoast] = useState('Daily'); // 'Calm', 'Daily', 'Bold'
  const [selectedWeight, setSelectedWeight] = useState('250g');
  const [selectedGrind, setSelectedGrind] = useState('Whole Bean');
  const [quantity, setQuantity] = useState(1);

  const activeProduct = selectedRoast === 'Calm'
    ? calmProduct
    : selectedRoast === 'Bold'
      ? boldProduct
      : dailyProduct;

  if (!activeProduct) return null;

  const basePrice = activeProduct.price || 24.00;
  const totalPrice = basePrice * quantity;

  const handleAddToCart = () => {
    addToCart(activeProduct, {
      weight: selectedWeight,
      grind: selectedGrind,
      quantity
    });
  };

  const scrollToFinder = () => {
    const el = document.getElementById('coffee-finder');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-10 lg:py-16 bg-cream-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 bg-cream-200 border border-cream-300 px-3.5 py-1.5 rounded-full text-xs font-semibold text-forest-700">
              <Sparkles size={14} className="text-amberGold-500" />
              <span>Artisan Roastery & Direct Trade</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-espresso-900 tracking-tight leading-[1.08]">
              Coffee Worth <br />
              <span className="italic text-forest-700">Waking Up For.</span>
            </h1>

            <p className="text-base sm:text-lg text-espresso-900/80 font-sans leading-relaxed max-w-xl">
              Discover thoughtfully sourced specialty coffee, roasted in small batches and crafted for your perfect brewing ritual.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => setCurrentPage('shop')}
                className="bg-forest-700 hover:bg-forest-800 text-cream-100 font-semibold text-sm px-8 py-4 rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <span>Shop Coffee</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={scrollToFinder}
                className="bg-cream-200/80 hover:bg-cream-300 text-espresso-900 font-semibold text-sm px-8 py-4 rounded-full transition-all border border-cream-300 text-center"
              >
                Find Your Coffee
              </button>
            </div>

            {/* Small Trust Text */}
            <div className="pt-4 border-t border-cream-300/80 text-xs font-mono font-medium text-espresso-900/60 flex items-center gap-2 sm:gap-3 flex-wrap">
              <span>Small-Batch Roasted</span>
              <span>·</span>
              <span>Specialty Grade</span>
              <span>·</span>
              <span>Freshly Shipped</span>
            </div>

          </div>

          {/* Right Column: Interactive Coffee Customizer */}
          <div className="lg:col-span-6 bg-cream-200/70 border border-cream-300 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            
            <div className="text-center sm:text-left border-b border-cream-300 pb-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-forest-700">
                  INTERACTIVE RITUAL BUILDER
                </span>
                <h3 className="text-2xl font-serif font-bold text-espresso-900">
                  {activeProduct.name}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-espresso-900/60 bg-cream-100 px-3 py-1 rounded-full border border-cream-300">
                {activeProduct.origin}
              </span>
            </div>

            {/* Coffee Bag & Cup Display with Dynamic Image Swap */}
            <div className="relative bg-cream-100 rounded-2xl p-6 border border-cream-300 flex items-center justify-center min-h-[200px] sm:min-h-[260px] overflow-hidden group shadow-inner">
              <img
                key={activeProduct.id}
                src={activeProduct.bagImage}
                alt={activeProduct.name}
                className="w-48 h-60 object-cover rounded-xl shadow-2xl transition-all duration-500 transform group-hover:scale-105 animate-float cursor-pointer"
              />

              {/* Flavor Tag Overlay */}
              <div className="absolute bottom-3 left-3 bg-espresso-900/90 text-cream-100 text-[11px] font-mono px-3 py-1 rounded-full backdrop-blur-sm border border-amberGold-500/40">
                {activeProduct.flavorNotes.join(' • ')}
              </div>
            </div>

            {/* Choose Your Roast Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-espresso-900">
                Choose Your Roast
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedRoast('Calm')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                    selectedRoast === 'Calm'
                      ? 'bg-forest-700 text-cream-100 border-forest-700 shadow-sm'
                      : 'bg-cream-100 hover:bg-cream-200 text-espresso-900 border-cream-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${selectedRoast === 'Calm' ? 'bg-amberGold-400' : 'bg-forest-700'}`}></span>
                  <span>Calm Light</span>
                </button>

                <button
                  onClick={() => setSelectedRoast('Daily')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                    selectedRoast === 'Daily'
                      ? 'bg-forest-700 text-cream-100 border-forest-700 shadow-sm'
                      : 'bg-cream-100 hover:bg-cream-200 text-espresso-900 border-cream-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${selectedRoast === 'Daily' ? 'bg-amberGold-400' : 'bg-forest-700'}`}></span>
                  <span>Daily Medium</span>
                </button>

                <button
                  onClick={() => setSelectedRoast('Bold')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                    selectedRoast === 'Bold'
                      ? 'bg-forest-700 text-cream-100 border-forest-700 shadow-sm'
                      : 'bg-cream-100 hover:bg-cream-200 text-espresso-900 border-cream-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${selectedRoast === 'Bold' ? 'bg-amberGold-400' : 'bg-forest-700'}`}></span>
                  <span>Bold Dark</span>
                </button>
              </div>
            </div>

            {/* Weight Options */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-espresso-900">
                Bag Weight
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['250g', '500g', '1kg'].map(w => (
                  <button
                    key={w}
                    onClick={() => setSelectedWeight(w)}
                    className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                      selectedWeight === w
                        ? 'bg-espresso-900 text-cream-100 border-espresso-900 shadow-sm'
                        : 'bg-cream-100 hover:bg-cream-200 text-espresso-900 border-cream-300'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Grind Options */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-espresso-900">
                Grind Preference
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
                {['Whole Bean', 'Espresso', 'Filter', 'French Press', 'Pour Over'].map(g => (
                  <button
                    key={g}
                    onClick={() => setSelectedGrind(g)}
                    className={`py-2 px-1 rounded-xl border text-[11px] font-semibold transition-all ${
                      selectedGrind === g
                        ? 'bg-espresso-900 text-cream-100 border-espresso-900 shadow-sm'
                        : 'bg-cream-100 hover:bg-cream-200 text-espresso-900 border-cream-300'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart Footer */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-cream-300">
              <div className="flex items-center justify-between sm:block">
                <span className="text-[10px] text-espresso-900/60 uppercase font-mono block">Total Price</span>
                <span className="text-2xl font-serif font-bold text-forest-700">${totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex items-center gap-3 justify-between sm:justify-end">
                {/* Quantity Controls */}
                <div className="flex items-center border border-cream-300 rounded-xl bg-cream-100 px-2 py-1.5 text-xs font-semibold">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 hover:text-forest-700 text-espresso-900"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center font-mono font-bold text-espresso-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 hover:text-forest-700 text-espresso-900"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="bg-forest-700 hover:bg-forest-800 text-cream-100 font-semibold text-xs py-3 px-6 rounded-xl transition-all shadow-md flex-1 sm:flex-initial text-center"
                >
                  Add to Cart
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
