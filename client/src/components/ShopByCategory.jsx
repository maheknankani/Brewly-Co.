import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight } from 'lucide-react';

export const ShopByCategory = () => {
  const { setCurrentPage } = useStore();

  const categories = [
    {
      name: "Single Origin",
      description: "Distinct flavor profiles from Ethiopia, Colombia & Kenya",
      image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Signature Blends",
      description: "Harmonious flavor pairings crafted by master roasters",
      image: "https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Light Roast",
      description: "Tea-like elegance with floral jasmine & citrus sparkle",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Medium Roast",
      description: "Perfectly balanced caramel, red apple & milk chocolate",
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Dark Roast",
      description: "Intense dark cocoa, molasses & smoky toasted almonds",
      image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Decaf",
      description: "100% natural chemical-free mountain spring process",
      image: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <section className="py-16 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-forest-700">
            EXPLORE THE COLLECTION
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-espresso-900">
            Find Your Kind of Coffee
          </h2>
          <p className="text-sm sm:text-base text-espresso-900/80 font-sans">
            From bright and floral to deep and chocolatey, there's a roast for every ritual.
          </p>
        </div>

        {/* 6 Elegant Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentPage('shop')}
              className="group relative bg-cream-200/60 border border-cream-300 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between h-72"
            >
              {/* Background Cover Image with Hover Zoom */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-40 group-hover:opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/90 via-espresso-900/40 to-transparent"></div>
              </div>

              {/* Content Card Body */}
              <div className="relative p-6 z-10 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amberGold-400 font-bold">
                  CATEGORY {idx + 1}
                </span>
                <h3 className="text-2xl font-serif font-bold text-cream-100">
                  {cat.name}
                </h3>
                <p className="text-xs text-cream-200/80 font-sans leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {/* Explore Link CTA */}
              <div className="relative p-6 z-10 border-t border-cream-100/10 flex items-center justify-between text-xs font-bold text-amberGold-400">
                <span>Explore Collection</span>
                <div className="flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                  <span>Explore</span>
                  <ArrowRight size={14} />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
