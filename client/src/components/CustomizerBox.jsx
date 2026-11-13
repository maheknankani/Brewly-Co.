import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, CheckCircle2, Plus, Trash2, ShoppingBag, ArrowRight, Gift } from 'lucide-react';

export const CustomizerBox = () => {
  const { products, addToCart, showToast } = useStore();
  const [selectedBags, setSelectedBags] = useState([]);
  const [grind, setGrind] = useState('Whole Bean');

  const handleToggleProduct = (product) => {
    if (selectedBags.find(b => b.id === product.id)) {
      setSelectedBags(selectedBags.filter(b => b.id !== product.id));
    } else {
      if (selectedBags.length >= 3) {
        showToast('Your custom box is full (3 bags maximum).');
        return;
      }
      setSelectedBags([...selectedBags, product]);
    }
  };

  const rawTotal = selectedBags.reduce((acc, item) => acc + item.price, 0);
  const bundleDiscount = rawTotal * 0.15; // 15% bundle discount
  const finalBundlePrice = Math.max(0, rawTotal - bundleDiscount);

  const handleAddBundleToCart = () => {
    if (selectedBags.length < 3) {
      showToast('Please select 3 coffees to complete your custom sampler box!');
      return;
    }

    selectedBags.forEach(prod => {
      addToCart(prod, {
        weight: '250g',
        grind,
        quantity: 1
      });
    });

    showToast('🎉 Custom 3-Bag Sampler Box added to cart with 15% bundle discount!');
    setSelectedBags([]);
  };

  return (
    <section className="py-14 bg-cream-200/40 border-y border-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-cream-100 border border-cream-300 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 bg-amberGold-500/15 text-amberGold-600 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border border-amberGold-500/30">
              <Sparkles size={14} />
              <span>CUSTOM SAMPLER BUILDER</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-espresso-900">
              Build Your Custom 3-Bag Coffee Box
            </h2>
            <p className="text-sm text-espresso-900/70 mt-1">
              Select 3 single-origins or signature roasts from around the globe and automatically unlock <strong>15% bundle savings</strong>.
            </p>
          </div>

          {/* Progress Slots Indicator */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[0, 1, 2].map(slotIdx => {
              const bag = selectedBags[slotIdx];

              return (
                <div
                  key={slotIdx}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    bag
                      ? 'bg-forest-700/10 border-forest-700 shadow-sm'
                      : 'bg-cream-200/50 border-dashed border-cream-300 text-espresso-900/40'
                  }`}
                >
                  {bag ? (
                    <div className="flex items-center gap-3 w-full justify-between">
                      <div className="flex items-center gap-3">
                        <img src={bag.bagImage} alt={bag.name} className="w-10 h-12 object-cover rounded shadow-sm" />
                        <div>
                          <div className="font-serif font-bold text-sm text-espresso-900">{bag.name}</div>
                          <div className="text-[10px] text-forest-700 font-semibold">{bag.roastLevel}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedBags(selectedBags.filter((_, i) => i !== slotIdx))}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 w-full py-2 text-xs font-semibold">
                      <Gift size={16} />
                      <span>Select Bag #{slotIdx + 1}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Product Grid Selection */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-2">
            {products.slice(0, 12).map(product => {
              const isSelected = !!selectedBags.find(b => b.id === product.id);

              return (
                <div
                  key={product.id}
                  onClick={() => handleToggleProduct(product)}
                  className={`p-3 rounded-2xl border cursor-pointer text-center transition-all flex flex-col justify-between hover:shadow-md ${
                    isSelected
                      ? 'border-forest-700 bg-forest-700/15 ring-2 ring-forest-700'
                      : 'border-cream-300 bg-cream-50 hover:bg-cream-200'
                  }`}
                >
                  <div className="relative mb-2">
                    <img src={product.bagImage} alt={product.name} className="w-16 h-20 object-cover rounded-lg mx-auto shadow-sm" />
                    {isSelected && (
                      <div className="absolute top-0 right-0 bg-forest-700 text-white rounded-full p-0.5">
                        <CheckCircle2 size={16} />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="font-serif font-bold text-xs text-espresso-900 truncate">{product.name}</div>
                    <div className="text-[10px] text-forest-700 font-semibold">{product.roastLevel}</div>
                    <div className="text-xs font-bold text-espresso-900 mt-1">${product.price.toFixed(2)}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grind Selector & Bundle Action Footer */}
          <div className="bg-cream-200/80 border border-cream-300 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-bold uppercase tracking-wider text-espresso-900 mb-1">
                Box Grind Preference
              </label>
              <select
                value={grind}
                onChange={(e) => setGrind(e.target.value)}
                className="bg-cream-100 border border-cream-300 rounded-xl px-4 py-2 text-xs font-semibold text-espresso-900 focus:outline-none focus:border-forest-700"
              >
                <option value="Whole Bean">Whole Bean (Fresh Grinding)</option>
                <option value="Fine Espresso">Fine Espresso</option>
                <option value="Filter / Drip">Medium Filter / Drip</option>
                <option value="French Press">Coarse French Press</option>
                <option value="Pour Over">Pour Over (V60 / Chemex)</option>
              </select>
            </div>

            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right">
                <div className="text-xs text-espresso-900/60 line-through">${rawTotal.toFixed(2)}</div>
                <div className="text-2xl font-serif font-bold text-forest-700">
                  ${finalBundlePrice.toFixed(2)}
                  <span className="text-[10px] bg-amberGold-500/20 text-amberGold-600 font-bold px-2 py-0.5 rounded ml-2">Save 15%</span>
                </div>
              </div>

              <button
                onClick={handleAddBundleToCart}
                disabled={selectedBags.length < 3}
                className={`px-6 py-3.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center gap-2 ${
                  selectedBags.length === 3
                    ? 'bg-forest-700 hover:bg-forest-800 text-cream-100'
                    : 'bg-cream-300 text-espresso-900/50 cursor-not-allowed'
                }`}
              >
                <ShoppingBag size={16} />
                <span>Add Box to Cart</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
