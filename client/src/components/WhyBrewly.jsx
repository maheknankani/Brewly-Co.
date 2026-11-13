import React from 'react';

export const WhyBrewly = () => {
  const pillars = [
    {
      number: "01",
      title: "Small-Batch Roasted",
      desc: "Every batch is carefully roasted in small quantities to bring out the authentic character and sweetness of the bean."
    },
    {
      number: "02",
      title: "Thoughtfully Sourced",
      desc: "We focus on distinctive single-origin regions, direct-trade family estates, and quality-focused sourcing."
    },
    {
      number: "03",
      title: "Specialty Quality",
      desc: "Carefully selected coffees offering vibrant tasting notes without bitter dark over-roasting."
    },
    {
      number: "04",
      title: "Freshly Delivered",
      desc: "Roasted weekly and shipped directly from our roastery to your doorstep in nitrogen-sealed compostable bags."
    }
  ];

  return (
    <section className="py-16 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-forest-700">
            OUR COMMITMENT TO QUALITY
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-espresso-900">
            Why Coffee Lovers Choose Brewly
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className="bg-cream-200/60 border border-cream-300 rounded-3xl p-6 sm:p-8 space-y-4 hover:shadow-lg transition-all hover:-translate-y-1 relative"
            >
              <span className="text-4xl font-serif font-bold text-amberGold-500 block">
                {item.number}
              </span>
              <h3 className="text-xl font-serif font-bold text-espresso-900">
                {item.title}
              </h3>
              <p className="text-xs text-espresso-900/80 font-sans leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
