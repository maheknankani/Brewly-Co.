import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight } from 'lucide-react';

export const BrewingExperience = () => {
  const { setCurrentPage } = useStore();

  const methods = [
    {
      name: "Espresso",
      description: "Perfect for bold, concentrated coffee with rich crema.",
      image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Pour Over",
      description: "Clean and expressive, highlighting floral and citrus notes.",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "French Press",
      description: "Rich and full-bodied with heavy chocolate truffle mouthfeel.",
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Cold Brew",
      description: "Smooth and refreshing with naturally low acidity.",
      image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <section className="py-16 bg-cream-200/50 border-t border-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-forest-700">
            BREW GUIDES & ARTISAN TECHNIQUES
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-espresso-900">
            Brew It Your Way
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {methods.map((method, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentPage('shop')}
              className="group bg-cream-100 border border-cream-300 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={method.image}
                  alt={method.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/60 to-transparent"></div>
                <span className="absolute bottom-3 left-4 text-cream-100 font-serif font-bold text-xl">
                  {method.name}
                </span>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-espresso-900/80 font-sans leading-relaxed">
                  {method.description}
                </p>

                <div className="pt-2 border-t border-cream-200 flex items-center justify-between text-xs font-bold text-forest-700 group-hover:text-forest-800">
                  <span>Explore Guide</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
