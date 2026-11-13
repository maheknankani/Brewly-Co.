import React from 'react';
import { useStore } from '../context/StoreContext';
import { Leaf, Award, Heart, ShieldCheck, Sparkles, Droplets, ArrowRight } from 'lucide-react';

export const AboutPage = () => {
  const { setCurrentPage } = useStore();

  const values = [
    {
      icon: <Leaf className="w-7 h-7 text-forest-700" />,
      title: "100% Organic & Fair Trade",
      description: "We work directly with small family farms in high-altitude regions. Every bean is ethically sourced, ensuring farmers are paid fair, living wages."
    },
    {
      icon: <Award className="w-7 h-7 text-amberGold-600" />,
      title: "Small-Batch Roasting",
      description: "We roast our coffee beans every week in small batches. This preserves the delicate natural tasting notes of fruit, chocolate, and caramel."
    },
    {
      icon: <Heart className="w-7 h-7 text-rose-600" />,
      title: "Sustainable & Eco-Friendly",
      description: "Our packaging is 100% compostable and recyclable. We care about protecting our planet as much as we care about crafting delicious coffee."
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-forest-700" />,
      title: "Freshness Guaranteed",
      description: "We pack and ship your coffee within 24 hours of roasting. If you're not completely satisfied with your brew, we will replace it free of charge."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Sourcing Beans",
      desc: "Hand-picked green coffee cherries harvested at peak ripeness from high-altitude volcanic soils."
    },
    {
      number: "02",
      title: "Artisan Roasting",
      desc: "Slow-roasted weekly in custom drum roasters to unlock deep aromas and rich natural sweetness."
    },
    {
      number: "03",
      title: "Quality Tasting",
      desc: "Cupped and tested by certified coffee experts before sealing in nitrogen-flushed valve bags."
    },
    {
      number: "04",
      title: "Delivered Fresh",
      desc: "Shipped straight from our roastery to your door so you can start every morning with intention."
    }
  ];

  return (
    <div className="bg-cream-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Hero Header Section */}
      <section className="max-w-5xl mx-auto text-center space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 bg-cream-200 border border-cream-300 text-forest-700 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase">
          <Sparkles size={14} className="text-amberGold-500" />
          <span>Our Story & Craft</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-espresso-900 tracking-tight leading-tight">
          Crafting Coffee For <br className="hidden sm:inline" />
          <span className="text-forest-700 italic">Calm & Mindful Mornings</span>
        </h1>

        <p className="text-base sm:text-lg text-espresso-900/80 max-w-3xl mx-auto leading-relaxed font-sans">
          At Brewly & Co., we believe your morning coffee should be more than just a quick caffeine fix. 
          It should be a peaceful ritual—a warm moment of calm before the busy day begins.
        </p>

        {/* Feature Image Frame */}
        <div className="pt-6">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-cream-300 max-w-4xl mx-auto group">
            <img
              src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80"
              alt="Fresh Roasted Coffee Beans"
              className="w-full h-80 sm:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/80 via-espresso-900/20 to-transparent flex flex-col justify-end p-6 sm:p-10 text-left">
              <span className="text-amberGold-400 font-mono text-xs uppercase tracking-widest font-bold">ETHICALLY SOURCED • SINGLE ORIGIN</span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-cream-100 mt-1">
                From High-Altitude Farms Direct to Your Cup
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-espresso-900/60">WHAT WE STAND FOR</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-espresso-900">Why Coffee Lovers Choose Brewly</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, idx) => (
            <div
              key={idx}
              className="bg-cream-200/60 border border-cream-300 rounded-2xl p-6 space-y-4 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="p-3 bg-cream-100 rounded-xl inline-block border border-cream-300 shadow-sm">
                {v.icon}
              </div>
              <h3 className="text-xl font-serif font-bold text-espresso-900">{v.title}</h3>
              <p className="text-xs text-espresso-900/80 leading-relaxed font-sans">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The 4-Step Journey */}
      <section className="max-w-5xl mx-auto bg-cream-200/80 border border-cream-300 rounded-3xl p-8 sm:p-12 space-y-8 shadow-sm">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-forest-700">OUR PROCESS</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-espresso-900">How We Prepare Your Coffee</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-cream-100 p-6 rounded-2xl border border-cream-300 space-y-3 relative">
              <span className="text-3xl font-serif font-bold text-amberGold-500 opacity-80">{step.number}</span>
              <h4 className="text-lg font-serif font-bold text-espresso-900">{step.title}</h4>
              <p className="text-xs text-espresso-900/70 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roaster Passion Quote & CTA */}
      <section className="max-w-4xl mx-auto bg-forest-700 text-cream-100 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 text-cream-100/10 pointer-events-none">
          <Droplets size={240} />
        </div>

        <span className="text-xs uppercase tracking-widest font-mono text-amberGold-400 font-bold">OUR COMMITMENT</span>
        
        <blockquote className="text-xl sm:text-2xl font-serif italic text-cream-100 max-w-2xl mx-auto leading-relaxed">
          "We craft every roast with love, precision, and respect for the dedicated farmers who nurture these beans."
        </blockquote>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setCurrentPage('shop')}
            className="bg-amberGold-500 hover:bg-amberGold-600 text-espresso-900 font-bold text-sm px-8 py-3.5 rounded-full transition-all shadow-lg flex items-center gap-2"
          >
            <span>Explore Specialty Coffees</span>
            <ArrowRight size={16} />
          </button>
          
          <button
            onClick={() => setCurrentPage('faq')}
            className="bg-forest-800 hover:bg-forest-900 text-cream-100 font-semibold text-sm px-6 py-3.5 rounded-full transition-all border border-forest-600"
          >
            Have Questions? Read FAQs
          </button>
        </div>
      </section>

    </div>
  );
};
