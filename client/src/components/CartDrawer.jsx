import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../utils/api';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, Truck } from 'lucide-react';

export const CartDrawer = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    subtotal,
    discountAmount,
    shipping,
    grandTotal,
    appliedDiscount,
    setAppliedDiscount,
    isCartOpen,
    setIsCartOpen,
    setCurrentPage,
    showToast
  } = useStore();

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;

    try {
      const res = await api.validateDiscount(code);
      if (res.success) {
        setAppliedDiscount(res.discount);
        showToast(`Promo code ${res.discount.code} applied! Saved ${res.discount.discountPercent}%`);
        setPromoCodeInput('');
        return;
      } else if (res.message) {
        setPromoError(res.message);
        return;
      }
    } catch (err) {
      console.warn('API discount validation fallback:', err);
    }

    // Client fallback for standard promo codes
    const knownCodes = {
      'SLOWMORNINGS': { code: 'SLOWMORNINGS', discountPercent: 10 },
      'SLOWMORNING': { code: 'SLOWMORNINGS', discountPercent: 10 },
      'BREW15': { code: 'BREW15', discountPercent: 15 },
      'WELCOME10': { code: 'WELCOME10', discountPercent: 10 },
      'ROAST20': { code: 'ROAST20', discountPercent: 20 }
    };

    if (knownCodes[code]) {
      setAppliedDiscount(knownCodes[code]);
      showToast(`Promo code ${knownCodes[code].code} applied! Saved ${knownCodes[code].discountPercent}%`);
      setPromoCodeInput('');
    } else {
      setPromoError('Invalid or expired promo code');
    }
  };

  const freeShippingThreshold = 40.00;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-espresso-900/60 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen sm:max-w-md bg-cream-100 shadow-2xl flex flex-col justify-between border-l border-cream-300">
          
          {/* Header */}
          <div className="p-6 border-b border-cream-300 flex items-center justify-between bg-cream-200/50">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-forest-700" />
              <h2 className="font-serif text-2xl font-bold text-espresso-900">Your Coffee Ritual Cart</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-espresso-900/70 hover:text-espresso-900 rounded-full hover:bg-cream-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Standard Delivery Status Banner */}
          <div className="px-6 py-3 bg-cream-200/80 border-b border-cream-300 text-xs">
            <div className="flex items-center justify-between text-espresso-900">
              <div className="flex items-center gap-1.5 font-medium">
                <Truck size={15} className="text-espresso-900/60" />
                <span>Standard Doorstep Delivery: Rs. 150</span>
              </div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 bg-cream-200 text-espresso-900/40 rounded-full flex items-center justify-center mx-auto text-2xl font-serif">
                  ☕
                </div>
                <p className="font-serif text-xl font-bold text-espresso-900">Your cart is currently empty</p>
                <p className="text-xs text-espresso-900/60 max-w-xs mx-auto">
                  Explore our signature roasts and build your daily coffee ritual.
                </p>
                <button
                  onClick={() => { setIsCartOpen(false); setCurrentPage('shop'); }}
                  className="bg-forest-700 hover:bg-forest-800 text-cream-100 text-xs font-semibold px-5 py-2.5 rounded-xl shadow transition-all inline-block mt-2"
                >
                  Explore Signature Roasts
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.cartItemId}
                  className="bg-cream-50 border border-cream-300 rounded-xl p-4 flex gap-4 items-center justify-between"
                >
                  <img src={item.bagImage} alt={item.name} className="w-16 h-20 object-cover rounded-lg shadow-sm border border-cream-300" />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-base text-espresso-900 truncate">{item.name}</h3>
                    <div className="flex flex-wrap gap-1 text-[10px] text-forest-700 font-semibold mt-0.5">
                      <span>{item.weight}</span>
                      <span>•</span>
                      <span>{item.grind}</span>
                      {item.isSubscription && (
                        <span className="bg-amberGold-500/20 text-amberGold-600 px-1.5 py-0.2 rounded">
                          {item.frequency}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-espresso-900 mt-1">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-red-600 hover:text-red-800 p-1 text-xs"
                      title="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="flex items-center border border-cream-300 rounded-lg bg-cream-100 text-xs">
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, -1)}
                        className="px-2 py-1 text-espresso-900 hover:text-forest-700"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-2 font-mono font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, 1)}
                        className="px-2 py-1 text-espresso-900 hover:text-forest-700"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-cream-300 bg-cream-200/50 space-y-4">
              
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. SLOWMORNINGS)"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      className="w-full bg-cream-100 border border-cream-300 rounded-xl pl-8 pr-3 py-2 text-xs text-espresso-900 uppercase focus:outline-none focus:border-forest-700"
                    />
                    <Tag size={14} className="absolute left-2.5 top-2.5 text-espresso-900/50" />
                  </div>
                  <button
                    type="submit"
                    className="bg-espresso-900 text-cream-100 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-espresso-800 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-[10px] text-red-600">{promoError}</p>}
                {appliedDiscount && (
                  <div className="flex items-center justify-between text-xs text-forest-700 font-semibold bg-forest-100/40 p-2 rounded-lg">
                    <span className="flex items-center gap-1">
                      <Check size={14} />
                      <span>Code <strong>{appliedDiscount.code}</strong> Applied ({appliedDiscount.discountPercent}% Off)</span>
                    </span>
                    <button onClick={() => setAppliedDiscount(null)} className="text-red-600 hover:underline text-[10px]">Remove</button>
                  </div>
                )}
              </form>

              {/* Subtotal & Totals Breakdown */}
              <div className="space-y-1.5 text-xs text-espresso-900">
                <div className="flex justify-between">
                  <span className="text-espresso-900/70">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-amberGold-600 font-semibold">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-espresso-900/70">Delivery Fee</span>
                  <span className={shipping === 0 ? "font-bold text-emerald-700" : "font-semibold"}>
                    {shipping === 0 ? 'FREE (Rs. 0)' : `Rs. ${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold font-serif pt-2 border-t border-cream-300 text-espresso-900">
                  <span>Grand Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCurrentPage('checkout');
                }}
                className="w-full bg-forest-700 hover:bg-forest-800 text-cream-100 font-semibold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
