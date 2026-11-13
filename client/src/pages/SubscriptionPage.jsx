import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../utils/api';
import { Sparkles, Truck, RefreshCw, Gift, ArrowRight } from 'lucide-react';

export const SubscriptionPage = () => {
  const { products, addToCart, showToast, setCurrentPage, setSubscriberCode, fetchDiscounts } = useStore();
  
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || 'prod-1');
  const [frequency, setFrequency] = useState('Every 2 Weeks');
  const [weight, setWeight] = useState('250g');
  const [grind, setGrind] = useState('Whole Bean');
  const [customerName, setCustomerName] = useState('Alex Mercer');
  const [customerEmail, setCustomerEmail] = useState('alex.mercer@example.com');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const product = products.find(p => p.id === selectedProduct) || products[0];

  const handleStartSubscription = async (e) => {
    e.preventDefault();
    if (!product) return;

    setIsSubmitting(true);
    try {
      const res = await api.createSubscription({
        customerName,
        customerEmail,
        planName: `${product.name} Subscription`,
        frequency,
        items: [`${product.name} (${weight}, ${grind})`],
        amount: product.subscriptionPrice,
        nextDelivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        assignedPromoCode: 'BREWLY5'
      });

      if (res.success) {
        const promoCode = res.promoDiscount?.code || res.subscription?.assignedPromoCode || 'BREWLY5';
        setSubscriberCode(promoCode);
        localStorage.setItem('brewly_subscriber_code', promoCode);
        if (fetchDiscounts) fetchDiscounts();

        showToast(`Subscription activated! Your exclusive 5% subscriber code is ${promoCode} ☕`);
        addToCart(product, {
          weight,
          grind,
          isSubscription: true,
          frequency
        });
        setCurrentPage('checkout');
      }
    } catch (err) {
      console.error('Error starting subscription:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-cream-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 bg-amberGold-500/15 text-amberGold-600 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border border-amberGold-500/30">
            <Sparkles size={14} />
            <span>NEVER RUN OUT OF COFFEE</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-espresso-900">
            Custom Coffee Roasting Subscriptions
          </h1>
          <p className="text-sm text-espresso-900/70 mt-2">
            Tailor your recurring fresh coffee bean roast delivery schedule to your doorstep.
          </p>
        </div>

        {/* Subscription Customizer Box */}
        <div className="bg-cream-200/60 border border-cream-300 rounded-3xl p-6 sm:p-10 shadow-sm">
          <form onSubmit={handleStartSubscription} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Product Choice */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-espresso-900 mb-3">
                  Step 1: Choose Your Micro-Roasted Coffee Bean
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map(p => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProduct(p.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex gap-3 items-center ${
                        selectedProduct === p.id
                          ? 'border-forest-700 bg-cream-100 shadow-md ring-2 ring-forest-700/30'
                          : 'border-cream-300 bg-cream-50 hover:bg-cream-100'
                      }`}
                    >
                      <img src={p.bagImage} alt={p.name} className="w-14 h-18 object-cover rounded-lg shadow-sm" />
                      <div>
                        <div className="font-serif font-bold text-base text-espresso-900">{p.name}</div>
                        <div className="text-[10px] text-forest-700 font-semibold">{p.roastLevel}</div>
                        <div className="text-xs font-bold text-espresso-900 mt-1">
                          ${p.subscriptionPrice.toFixed(2)} <span className="text-[10px] text-espresso-900/50 line-through">${p.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Weight & Grind */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-espresso-900 mb-2">
                    Step 2: Bag Weight
                  </label>
                  <select
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-cream-100 border border-cream-300 rounded-xl p-3 text-xs font-semibold text-espresso-900 focus:outline-none focus:border-forest-700"
                  >
                    <option value="250g">250g (Standard Ritual Bag)</option>
                    <option value="500g">500g (Double Bag - 15% off)</option>
                    <option value="1kg">1kg Bulk Roaster Pack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-espresso-900 mb-2">
                    Step 3: Grind Preference
                  </label>
                  <select
                    value={grind}
                    onChange={(e) => setGrind(e.target.value)}
                    className="w-full bg-cream-100 border border-cream-300 rounded-xl p-3 text-xs font-semibold text-espresso-900 focus:outline-none focus:border-forest-700"
                  >
                    <option value="Whole Bean">Whole Bean (Fresh Grinding)</option>
                    <option value="Fine Espresso">Fine Espresso</option>
                    <option value="Filter / Drip">Medium Filter / Drip</option>
                    <option value="French Press">Coarse French Press</option>
                    <option value="Pour Over">Pour Over (V60 / Chemex)</option>
                  </select>
                </div>
              </div>

              {/* Step 4: Frequency */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-espresso-900 mb-2">
                  Step 4: Delivery Frequency
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Every 1 Week', 'Every 2 Weeks', 'Every 4 Weeks'].map(freq => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setFrequency(freq)}
                      className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                        frequency === freq
                          ? 'border-forest-700 bg-forest-700 text-cream-100 shadow'
                          : 'border-cream-300 bg-cream-100 text-espresso-900 hover:bg-cream-200'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Summary Card */}
            <div className="lg:col-span-5 bg-cream-100 border border-cream-300 rounded-2xl p-6 space-y-6 shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-espresso-900 border-b border-cream-300 pb-3">
                Subscription Summary
              </h3>

              {product && (
                <div className="flex gap-4 items-center">
                  <img src={product.bagImage} alt={product.name} className="w-20 h-24 object-cover rounded-xl shadow border border-cream-300" />
                  <div>
                    <span className="text-[10px] text-amberGold-600 font-bold uppercase tracking-wider">Recurring Plan</span>
                    <h4 className="font-serif font-bold text-xl text-espresso-900">{product.name}</h4>
                    <div className="text-xs text-forest-700 font-semibold mt-0.5">{weight} • {grind}</div>
                    <div className="text-xs font-bold text-espresso-900 mt-1">Delivery: {frequency}</div>
                  </div>
                </div>
              )}

              <div className="space-y-2 text-xs text-espresso-900 pt-2 border-t border-cream-300">
                <div className="flex justify-between">
                  <span>Regular Price</span>
                  <span className="line-through">${product?.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-forest-700 font-bold">
                  <span>Subscriber Price (Save 15%)</span>
                  <span>${product?.subscriptionPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-forest-700">FREE</span>
                </div>
                <div className="flex justify-between font-bold font-serif text-lg pt-2 border-t border-cream-300">
                  <span>First Shipment Total</span>
                  <span>${product?.subscriptionPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2 text-[11px] text-espresso-900/70 pt-2">
                <div className="flex items-center gap-1.5">
                  <Truck size={14} className="text-forest-700" />
                  <span>Free carbon-neutral doorstep shipping</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RefreshCw size={14} className="text-forest-700" />
                  <span>Pause, skip or adjust frequency anytime</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Gift size={14} className="text-forest-700" />
                  <span>Includes free welcome gift sample bag</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-forest-700 hover:bg-forest-800 text-cream-100 font-bold text-sm py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Activating...' : 'Activate Coffee Subscription'}</span>
                <ArrowRight size={16} />
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
