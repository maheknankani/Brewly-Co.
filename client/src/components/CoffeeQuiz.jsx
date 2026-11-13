import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight, RotateCcw, CheckCircle2, Coffee } from 'lucide-react';

export const CoffeeQuiz = () => {
  const { products, addToCart } = useStore();

  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('');
  const [flavor, setFlavor] = useState('');
  const [roastPreference, setRoastPreference] = useState('');
  const [recommendedProduct, setRecommendedProduct] = useState(null);

  const methods = [
    { id: 'pourover', title: 'Pour Over / V60', icon: '☕' },
    { id: 'espresso', title: 'Espresso Machine', icon: '⚡' },
    { id: 'frenchpress', title: 'French Press', icon: '🫖' },
    { id: 'drip', title: 'Automatic Drip Machine', icon: '💧' }
  ];

  const flavors = [
    { id: 'citrus', title: 'Bright, Floral & Citrusy', notes: 'Jasmine, Bergamot, Lemon' },
    { id: 'chocolate', title: 'Smooth & Chocolatey', notes: 'Milk Chocolate, Honey, Caramel' },
    { id: 'dark', title: 'Deep, Smoky & Bold', notes: 'Dark Cocoa, Walnut, Molasses' }
  ];

  const roasts = [
    { id: 'Light', title: 'Light Roast', desc: 'High acidity, vibrant floral and fruity notes' },
    { id: 'Medium', title: 'Medium Roast', desc: 'Balanced body, caramel & chocolate sweetness' },
    { id: 'Dark', title: 'Dark Roast', desc: 'Full body, low acidity, rich deep cocoa finish' }
  ];

  const handleCalculateRecommendation = (selectedRoast) => {
    // Find best match in products based on roast & flavor
    let match = products.find(p => p.roastLevel.includes(selectedRoast));
    if (!match) match = products[0];
    setRecommendedProduct(match);
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setMethod('');
    setFlavor('');
    setRoastPreference('');
    setRecommendedProduct(null);
  };

  return (
    <section className="py-12 bg-cream-200/50 border-y border-cream-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-cream-100 border border-cream-300 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="inline-flex items-center gap-1.5 bg-amberGold-500/15 text-amberGold-600 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border border-amberGold-500/30">
              <Sparkles size={14} />
              <span>Interactive Coffee Finder</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-espresso-900">
              Find Your Perfect Coffee Ritual
            </h2>
            <p className="text-xs sm:text-sm text-espresso-900/70 mt-1">
              Answer 3 quick questions and let our master roaster algorithms curate your ideal bean.
            </p>
          </div>

          {/* Progress Bar */}
          {step <= 3 && (
            <div className="w-full bg-cream-200 rounded-full h-2 mb-8 overflow-hidden">
              <div
                className="bg-forest-700 h-2 transition-all duration-500 rounded-full"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          )}

          {/* Step 1: Brew Method */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-serif font-bold text-espresso-900 text-center">
                Step 1: How do you usually brew your coffee?
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {methods.map(m => (
                  <button
                    key={m.id}
                    onClick={() => { setMethod(m.id); setStep(2); }}
                    className={`p-5 rounded-2xl border text-center transition-all ${
                      method === m.id
                        ? 'border-forest-700 bg-forest-700/10 font-bold'
                        : 'border-cream-300 bg-cream-50 hover:border-forest-700/50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{m.icon}</div>
                    <div className="text-sm font-serif font-bold text-espresso-900">{m.title}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Flavor Profile */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-serif font-bold text-espresso-900 text-center">
                Step 2: What flavor notes excite your palate?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {flavors.map(f => (
                  <button
                    key={f.id}
                    onClick={() => { setFlavor(f.id); setStep(3); }}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      flavor === f.id
                        ? 'border-forest-700 bg-forest-700/10 font-bold'
                        : 'border-cream-300 bg-cream-50 hover:border-forest-700/50'
                    }`}
                  >
                    <div className="text-base font-serif font-bold text-espresso-900">{f.title}</div>
                    <div className="text-xs text-espresso-900/60 mt-1">{f.notes}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Roast Level */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-serif font-bold text-espresso-900 text-center">
                Step 3: What roast intensity do you prefer?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {roasts.map(r => (
                  <button
                    key={r.id}
                    onClick={() => { setRoastPreference(r.id); handleCalculateRecommendation(r.id); }}
                    className="p-5 rounded-2xl border border-cream-300 bg-cream-50 hover:border-forest-700/50 text-left transition-all"
                  >
                    <div className="text-base font-serif font-bold text-espresso-900">{r.title}</div>
                    <div className="text-xs text-espresso-900/60 mt-1">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Recommendation Result */}
          {step === 4 && recommendedProduct && (
            <div className="bg-cream-200/80 border border-forest-700/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8">
              <img
                src={recommendedProduct.bagImage}
                alt={recommendedProduct.name}
                className="w-36 h-44 object-cover rounded-xl shadow-lg border border-cream-300"
              />
              <div className="flex-1 space-y-3 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-700 uppercase tracking-wider">
                  <CheckCircle2 size={16} />
                  <span>100% Match For Your Preferences</span>
                </div>
                <h3 className="text-3xl font-serif font-bold text-espresso-900">
                  {recommendedProduct.name}
                </h3>
                <p className="text-xs text-espresso-900/70">
                  {recommendedProduct.description}
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                  {recommendedProduct.flavorNotes.map(n => (
                    <span key={n} className="bg-cream-100 text-espresso-900 text-xs px-2.5 py-1 rounded-full font-medium border border-cream-300">
                      {n}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
                  <button
                    onClick={() => addToCart(recommendedProduct)}
                    className="bg-forest-700 hover:bg-forest-800 text-cream-100 px-6 py-2.5 rounded-xl text-xs font-semibold shadow transition-all flex items-center gap-2"
                  >
                    <span>Add to Cart — ${recommendedProduct.price.toFixed(2)}</span>
                    <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={handleReset}
                    className="text-xs font-semibold text-espresso-900/70 hover:text-espresso-900 flex items-center gap-1"
                  >
                    <RotateCcw size={14} />
                    <span>Retake Quiz</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
